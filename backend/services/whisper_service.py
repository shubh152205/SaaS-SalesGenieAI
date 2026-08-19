import os
import subprocess
import tempfile
import threading
from typing import Optional, Dict, Any, List

# Global singleton for Whisper model
_whisper_model = None
_model_lock = threading.Lock()
_model_name = os.getenv("WHISPER_MODEL_NAME", "base")


def get_whisper_model():
    """
    Initializes and returns a cached Faster-Whisper model singleton.
    Uses 'base' model with INT8 quantization on CPU for high accuracy and sub-2s latency.
    """
    global _whisper_model
    if _whisper_model is not None:
        return _whisper_model

    with _model_lock:
        if _whisper_model is None:
            try:
                from faster_whisper import WhisperModel
                # Try loading configured model (default: base) with int8 quantization
                print(f"[Whisper Service] Loading Faster-Whisper model '{_model_name}' on CPU (int8)...")
                _whisper_model = WhisperModel(_model_name, device="cpu", compute_type="int8")
                print(f"[Whisper Service] Faster-Whisper '{_model_name}' model loaded successfully!")
            except Exception as primary_err:
                print(f"[Whisper Service] Failed to load '{_model_name}' model: {primary_err}")
                try:
                    from faster_whisper import WhisperModel
                    print("[Whisper Service] Falling back to lightweight 'tiny' model...")
                    _whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
                    print("[Whisper Service] Faster-Whisper 'tiny' model loaded as fallback!")
                except Exception as fallback_err:
                    print(f"[Whisper Service] Critical error loading WhisperModel: {fallback_err}")
                    _whisper_model = None

    return _whisper_model


def convert_audio_to_wav(input_path: str, output_path: Optional[str] = None) -> Optional[str]:
    """
    Converts any audio file (.webm, .mp3, .m4a, .ogg, .wav, .flac) to standard 16kHz mono PCM WAV
    which is the optimal format for Whisper speech recognition.
    """
    if not os.path.exists(input_path):
        return None

    if output_path is None:
        fd, output_path = tempfile.mkstemp(suffix="_whisper_16k.wav")
        os.close(fd)

    try:
        # Run ffmpeg with overwrite (-y), 16kHz sample rate (-ar 16000), mono channel (-ac 1), 16-bit PCM
        cmd = [
            "ffmpeg",
            "-i", input_path,
            "-vn",                  # Ignore video stream if any
            "-ar", "16000",         # 16 kHz sample rate
            "-ac", "1",             # Mono audio
            "-c:a", "pcm_s16le",    # 16-bit signed PCM
            output_path,
            "-y"
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=45)
        if res.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            return output_path
        else:
            print(f"[Whisper Audio Convert Error] ffmpeg exit {res.returncode}: {res.stderr.decode('utf-8', errors='ignore')[:200]}")
    except Exception as e:
        print(f"[Whisper Audio Convert Exception] {e}")

    return None


def transcribe_audio_with_whisper(
    filepath: str,
    beam_size: int = 3,
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Transcribes any input audio file using OpenAI Faster-Whisper engine.
    
    Returns a structured dictionary:
    {
        "success": True/False,
        "text": "Full transcribed speech string...",
        "language": "en",
        "duration": 45.2,
        "segments": [{"start": 0.0, "end": 4.5, "text": "..."}],
        "model": "faster-whisper-base"
    }
    """
    if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
        return {
            "success": False,
            "text": "",
            "language": "en",
            "duration": 0.0,
            "segments": [],
            "error": f"Audio file not found or empty: {filepath}"
        }

    # Step 1: Convert to 16kHz Mono WAV
    converted_wav = convert_audio_to_wav(filepath)
    audio_source = converted_wav if converted_wav else filepath

    try:
        model = get_whisper_model()
        if model is None:
            # Fallback to SpeechRecognition if faster_whisper failed
            return _fallback_speech_recognition(audio_source)

        segments_iter, info = model.transcribe(
            audio_source,
            beam_size=beam_size,
            language=language,
            task="transcribe",
            vad_filter=True, # Voice Activity Detection to filter out silence/noise
            vad_parameters=dict(min_silence_duration_ms=500)
        )

        segments_list = []
        transcript_parts = []
        for segment in segments_iter:
            clean_text = segment.text.strip()
            if clean_text:
                transcript_parts.append(clean_text)
                segments_list.append({
                    "start": round(segment.start, 2),
                    "end": round(segment.end, 2),
                    "text": clean_text
                })

        full_text = " ".join(transcript_parts).strip()

        return {
            "success": True,
            "text": full_text,
            "language": getattr(info, "language", "en"),
            "language_probability": getattr(info, "language_probability", 1.0),
            "duration": getattr(info, "duration", 0.0),
            "segments": segments_list,
            "model": f"faster-whisper-{_model_name}"
        }

    except Exception as exc:
        print(f"[Whisper Transcription Error] {exc}")
        return _fallback_speech_recognition(audio_source)

    finally:
        # Clean up temporary converted wav if created
        if converted_wav and os.path.exists(converted_wav):
            try:
                os.remove(converted_wav)
            except Exception:
                pass


def _fallback_speech_recognition(wav_path: str) -> Dict[str, Any]:
    """
    Fallback transcription using Google Speech Recognition when Whisper is unavailable.
    """
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data)
            return {
                "success": bool(text and text.strip()),
                "text": text.strip() if text else "",
                "language": "en",
                "duration": 0.0,
                "segments": [],
                "model": "speech_recognition-fallback"
            }
    except Exception as e:
        print(f"[Fallback SpeechRecognition Error] {e}")
        return {
            "success": False,
            "text": "",
            "language": "en",
            "duration": 0.0,
            "segments": [],
            "error": str(e)
        }
