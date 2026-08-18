import { useState, useEffect, useCallback } from 'react';
import ttsEngine from '../utils/textToSpeech';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [totalSentences, setTotalSentences] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const v = ttsEngine.getRecommendedVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        setSelectedVoice(v[0]);
      }
    };

    updateVoices();

    const unsubscribe = ttsEngine.addListener((event) => {
      switch (event.type) {
        case 'voices_loaded':
          updateVoices();
          break;
        case 'start':
          setIsPlaying(true);
          setIsPaused(false);
          setTotalSentences(event.totalSentences);
          setCurrentSentenceIndex(0);
          setCurrentSentence(event.currentSentence || '');
          setProgress(0);
          break;
        case 'sentence_start':
          setIsPlaying(true);
          setIsPaused(false);
          setCurrentSentenceIndex(event.currentSentenceIndex);
          setCurrentSentence(event.currentSentence);
          setProgress(event.progress);
          break;
        case 'pause':
          setIsPaused(true);
          break;
        case 'resume':
          setIsPaused(false);
          break;
        case 'end':
        case 'stop':
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentSentence('');
          setProgress(100);
          setTimeout(() => setProgress(0), 400);
          break;
        case 'error':
          setIsPlaying(false);
          setIsPaused(false);
          break;
        default:
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedVoice]);

  const speak = useCallback((text, options = {}) => {
    if (!text) return;
    ttsEngine.speak(text, {
      voice: selectedVoice,
      rate,
      pitch,
      volume,
      ...options
    });
  }, [selectedVoice, rate, pitch, volume]);

  const pause = useCallback(() => {
    ttsEngine.pause();
  }, []);

  const resume = useCallback(() => {
    ttsEngine.resume();
  }, []);

  const stop = useCallback(() => {
    ttsEngine.stop();
  }, []);

  const toggle = useCallback((text, options = {}) => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text, options);
    }
  }, [isPlaying, isPaused, speak, pause, resume]);

  return {
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    currentSentenceIndex,
    currentSentence,
    totalSentences,
    progress,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    toggle
  };
};

export default useTextToSpeech;
