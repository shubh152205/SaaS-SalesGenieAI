/**
 * SalesGenie AI - Advanced Text-to-Speech (TTS) Engine
 * Powered by Web Speech Synthesis API with cross-browser resilience,
 * sentence chunking (prevents Chrome/Safari 15s timeout), and voice profiling.
 */

class TextToSpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.sentenceQueue = [];
    this.currentSentenceIndex = 0;
    this.listeners = new Set();
    this.keepAliveTimer = null;
    this.options = {
      voice: null,
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    };

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && 'onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    const allVoices = this.synth.getVoices();
    if (allVoices && allVoices.length > 0) {
      this.voices = allVoices;
      this.notifyListeners({ type: 'voices_loaded', voices: this.voices });
    }
    return this.voices;
  }

  getVoices() {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  getRecommendedVoices() {
    const all = this.getVoices();
    if (!all || all.length === 0) return [];

    // Filter and score best natural English voices for SaaS / B2B sales
    const englishVoices = all.filter((v) => v.lang.startsWith('en'));
    
    // Sort to prioritize natural/Google/Microsoft/Apple voices
    return (englishVoices.length > 0 ? englishVoices : all).sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aScore = (aName.includes('natural') ? 10 : 0) +
                     (aName.includes('google') ? 8 : 0) +
                     (aName.includes('premium') ? 7 : 0) +
                     (aName.includes('samantha') ? 6 : 0) +
                     (aName.includes('daniel') ? 5 : 0) +
                     (aName.includes('jenny') ? 5 : 0) +
                     (aName.includes('guy') ? 5 : 0);
      const bScore = (bName.includes('natural') ? 10 : 0) +
                     (bName.includes('google') ? 8 : 0) +
                     (bName.includes('premium') ? 7 : 0) +
                     (bName.includes('samantha') ? 6 : 0) +
                     (bName.includes('daniel') ? 5 : 0) +
                     (bName.includes('jenny') ? 5 : 0) +
                     (bName.includes('guy') ? 5 : 0);
      return bScore - aScore;
    });
  }

  addListener(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notifyListeners(event) {
    this.listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (err) {
        console.warn('TTS listener error:', err);
      }
    });
  }

  /**
   * Cleans text and splits into manageable sentences for smooth speech playback.
   */
  splitIntoSentences(text) {
    if (!text || typeof text !== 'string') return [];
    
    // Clean markdown, bullet points, headers, URLs, and extra whitespaces
    const clean = text
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*#_~`>]+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*•]\s+/g, '')
      .trim();

    if (!clean) return [];

    // Split on sentence-ending punctuation or double newlines
    const rawMatches = clean.match(/[^.!?\n]+[.!?\n]+/g) || [clean];
    const sentences = rawMatches
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !/^[\s.,!?-]+$/.test(s));

    return sentences.length > 0 ? sentences : [clean];
  }

  /**
   * Speaks given text with robust chunking and events.
   */
  speak(text, customOptions = {}) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      this.notifyListeners({ type: 'error', error: 'Speech synthesis not supported in this browser.' });
      return;
    }

    // Cancel any ongoing speech first
    this.stop();

    const sentences = this.splitIntoSentences(text);
    if (sentences.length === 0) {
      this.notifyListeners({ type: 'end' });
      return;
    }

    this.sentenceQueue = sentences;
    this.currentSentenceIndex = 0;
    this.isSpeaking = true;
    this.isPaused = false;
    this.options = { ...this.options, ...customOptions };

    this.notifyListeners({
      type: 'start',
      sentences: this.sentenceQueue,
      totalSentences: this.sentenceQueue.length,
      currentSentenceIndex: 0,
      currentSentence: this.sentenceQueue[0]
    });

    this._startKeepAlive();
    this._speakNextSentence();
  }

  _speakNextSentence() {
    if (!this.isSpeaking || this.currentSentenceIndex >= this.sentenceQueue.length) {
      this.stop();
      this.notifyListeners({ type: 'end' });
      return;
    }

    const sentence = this.sentenceQueue[this.currentSentenceIndex];
    const utterance = new SpeechSynthesisUtterance(sentence);
    this.currentUtterance = utterance;

    // Apply voice options
    if (this.options.voice) {
      utterance.voice = this.options.voice;
    } else {
      const rec = this.getRecommendedVoices();
      if (rec.length > 0) utterance.voice = rec[0];
    }

    utterance.rate = Math.max(0.5, Math.min(2.0, this.options.rate || 1.0));
    utterance.pitch = Math.max(0.5, Math.min(2.0, this.options.pitch || 1.0));
    utterance.volume = Math.max(0, Math.min(1.0, this.options.volume || 1.0));

    utterance.onstart = () => {
      this.notifyListeners({
        type: 'sentence_start',
        currentSentenceIndex: this.currentSentenceIndex,
        currentSentence: sentence,
        progress: ((this.currentSentenceIndex + 1) / this.sentenceQueue.length) * 100
      });
    };

    utterance.onend = () => {
      this.currentSentenceIndex++;
      if (this.isSpeaking) {
        this._speakNextSentence();
      }
    };

    utterance.onerror = (e) => {
      // If stopped intentionally, 'canceled' or 'interrupted' is normal
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e.error);
        this.notifyListeners({ type: 'error', error: e.error });
      }
      this.currentSentenceIndex++;
      if (this.isSpeaking && this.currentSentenceIndex < this.sentenceQueue.length) {
        this._speakNextSentence();
      } else {
        this.stop();
        this.notifyListeners({ type: 'end' });
      }
    };

    // Trigger synthesis
    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Failed to call synth.speak:', err);
      this.stop();
    }
  }

  pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyListeners({ type: 'pause' });
    }
  }

  resume() {
    if (this.synth && this.isSpeaking && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyListeners({ type: 'resume' });
    }
  }

  stop() {
    this._stopKeepAlive();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.sentenceQueue = [];
    this.currentSentenceIndex = 0;
    this.notifyListeners({ type: 'stop' });
  }

  /**
   * Chrome/Safari bug: speech synthesis can freeze after ~15s.
   * Periodically pausing and resuming keeps the internal audio pipeline active.
   */
  _startKeepAlive() {
    this._stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.isSpeaking && !this.isPaused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  }

  _stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }
}

// Global Singleton Instance
export const ttsEngine = new TextToSpeechEngine();
export default ttsEngine;
