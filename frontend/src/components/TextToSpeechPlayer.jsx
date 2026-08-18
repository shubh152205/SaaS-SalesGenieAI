import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Sliders,
  Settings2,
  Check,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const SPEED_OPTIONS = [0.8, 1.0, 1.25, 1.5];

export const TextToSpeechPlayer = ({
  text = '',
  title = 'AI Voice Synthesizer',
  variant = 'full', // 'full' | 'compact' | 'badge' | 'inline'
  label = 'Listen with AI Voice',
  className = '',
  style = {}
}) => {
  const {
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    currentSentence,
    currentSentenceIndex,
    totalSentences,
    progress,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    toggle
  } = useTextToSpeech();

  const [showSettings, setShowSettings] = useState(false);

  const handlePlayClick = () => {
    if (!text || !text.trim()) return;
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  const handleStopClick = () => {
    stop();
  };

  if (!isSupported) {
    return (
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
        (Speech Synthesis not supported in this browser)
      </div>
    );
  }

  // 1. Compact Icon Button (for table cells, card headers, toolbars)
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handlePlayClick}
        disabled={!text || !text.trim()}
        title={isPlaying ? (isPaused ? 'Resume reading' : 'Pause reading') : (label || 'Read aloud')}
        className={`btn btn-secondary btn-sm ${isPlaying ? 'tts-active' : ''} ${className}`}
        style={{
          padding: '4px 8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          color: isPlaying ? 'var(--brand-500)' : 'var(--text-muted)',
          borderColor: isPlaying ? 'var(--brand-500)' : 'var(--border-subtle)',
          backgroundColor: isPlaying ? 'var(--brand-50)' : 'transparent',
          cursor: !text ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          ...style
        }}
      >
        {isPlaying ? (
          <>
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            <div className="tts-wave-mini">
              <span className={`bar ${!isPaused ? 'animating' : ''}`} />
              <span className={`bar ${!isPaused ? 'animating' : ''}`} />
              <span className={`bar ${!isPaused ? 'animating' : ''}`} />
            </div>
          </>
        ) : (
          <>
            <Volume2 size={13} />
            <span>{label ? label.replace('Listen to ', '') : 'Read'}</span>
          </>
        )}
      </button>
    );
  }

  // 2. Badge / Button Variant
  if (variant === 'badge' || variant === 'inline') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', ...style }}>
        <button
          type="button"
          onClick={handlePlayClick}
          disabled={!text || !text.trim()}
          className={`btn btn-secondary btn-sm ${className}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: isPlaying ? 'var(--brand-500)' : 'var(--text-main)',
            borderColor: isPlaying ? 'var(--brand-500)' : 'var(--border-medium)',
            background: isPlaying ? 'var(--brand-50)' : 'var(--bg-card)',
            cursor: !text ? 'not-allowed' : 'pointer'
          }}
        >
          {isPlaying ? (
            isPaused ? <Play size={13} /> : <Pause size={13} />
          ) : (
            <Volume2 size={14} style={{ color: 'var(--brand-500)' }} />
          )}
          <span>{isPlaying ? (isPaused ? 'Resume Voice' : 'Pause Voice') : label}</span>
          {isPlaying && (
            <div className="tts-wave-mini">
              <span className={`bar ${!isPaused ? 'animating' : ''}`} />
              <span className={`bar ${!isPaused ? 'animating' : ''}`} />
              <span className={`bar ${!isPaused ? 'animating' : ''}`} />
            </div>
          )}
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStopClick}
            className="btn btn-secondary btn-sm"
            title="Stop Text-to-Speech"
            style={{ padding: '4px 6px', color: 'var(--error-500)' }}
          >
            <Square size={12} />
          </button>
        )}
      </div>
    );
  }

  // 3. Full Integrated Player Panel (for AI Outreach & Deep Intelligence)
  return (
    <div
      className={`tail-card tail-card-tts ${className}`}
      style={{
        padding: '14px 16px',
        borderRadius: '10px',
        background: isPlaying ? 'rgba(70, 95, 255, 0.05)' : 'var(--bg-card-subtle)',
        border: `1px solid ${isPlaying ? 'rgba(70, 95, 255, 0.35)' : 'var(--border-subtle)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {/* Top Header: Title, Equalizer, Voice Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '7px',
              borderRadius: '8px',
              background: isPlaying ? 'var(--brand-500)' : 'var(--brand-50)',
              color: isPlaying ? '#ffffff' : 'var(--brand-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <Volume2 size={16} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</span>
              {isPlaying && (
                <span className="badge badge-brand" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  {isPaused ? 'PAUSED' : 'READING ALOUD'}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {selectedVoice ? selectedVoice.name : 'Web Speech Synthesizer'}
            </div>
          </div>
        </div>

        {/* Animated Equalizer Waveform */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="tts-equalizer-bars">
            <span className={`eq-bar eq-1 ${isPlaying && !isPaused ? 'active' : ''}`} />
            <span className={`eq-bar eq-2 ${isPlaying && !isPaused ? 'active' : ''}`} />
            <span className={`eq-bar eq-3 ${isPlaying && !isPaused ? 'active' : ''}`} />
            <span className={`eq-bar eq-4 ${isPlaying && !isPaused ? 'active' : ''}`} />
            <span className={`eq-bar eq-5 ${isPlaying && !isPaused ? 'active' : ''}`} />
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Configure voice & speed"
          >
            <Settings2 size={12} />
            <span>{rate}x</span>
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      {/* Expanded Voice & Speed Settings Tray */}
      {showSettings && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {/* Voice Dropdown */}
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                AI Voice Persona
              </label>
              <select
                value={selectedVoice ? selectedVoice.name : ''}
                onChange={(e) => {
                  const found = voices.find((v) => v.name === e.target.value);
                  if (found) setSelectedVoice(found);
                }}
                className="select-field"
                style={{ padding: '6px 8px', fontSize: '0.75rem', height: '32px' }}
              >
                {voices.map((v, i) => (
                  <option key={`${v.name}-${i}`} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Multipliers */}
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Playback Speed
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setRate(speed)}
                    className={`btn btn-sm ${rate === speed ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '3px 8px', fontSize: '0.72rem', flex: 1 }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Sentence Highlight / Subtitle Display */}
      {isPlaying && currentSentence && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-main)',
            fontStyle: 'italic',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{currentSentence}"
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-dim)', flexShrink: 0 }}>
            {currentSentenceIndex + 1}/{totalSentences}
          </span>
        </div>
      )}

      {/* Progress Bar & Primary Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handlePlayClick}
          disabled={!text || !text.trim()}
          className="btn btn-primary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: !text ? 'not-allowed' : 'pointer'
          }}
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <Play size={14} />
                <span>Resume Voice</span>
              </>
            ) : (
              <>
                <Pause size={14} />
                <span>Pause Voice</span>
              </>
            )
          ) : (
            <>
              <Play size={14} />
              <span>{label || 'Listen to AI Pitch'}</span>
            </>
          )}
        </button>

        {/* Stop Button */}
        {isPlaying && (
          <button
            type="button"
            onClick={handleStopClick}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 10px',
              fontSize: '0.75rem',
              color: 'var(--error-500)'
            }}
          >
            <Square size={13} />
            <span>Stop</span>
          </button>
        )}

        {/* Scrubber / Progress Bar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              width: '100%',
              height: '5px',
              borderRadius: '3px',
              background: 'var(--border-subtle)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${isPlaying ? Math.max(5, progress) : 0}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--brand-500), var(--info-500))',
                borderRadius: '3px',
                transition: 'width 0.25s ease'
              }}
            />
          </div>
        </div>

        {/* Word / Sentence Counter */}
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
          {text ? `${text.trim().split(/\s+/).length} words` : 'Empty text'}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechPlayer;
