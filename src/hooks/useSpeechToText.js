// src/hooks/useSpeechToText.js
import { useEffect, useRef, useState } from 'react';

export function useSpeechToText() {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // default – App will choose ja-JP or en-US when calling start()
    recognition.lang = 'ja-JP';

    const clearSilenceTimer = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      clearSilenceTimer();
    };

    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
    };

    recognition.onerror = (event) => {
      console.error(event);
      if (event.error === 'network') {
        setError('Speech service error – try again or check network.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
      } else {
        setError(event.error || 'Speech recognition error');
      }
      setIsListening(false);
      clearSilenceTimer();
    };

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ');
      setTranscript(text.trim());

      // 🔹 reset 2.5s silence timer on every new result
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
      }, 1500); // ≈ 1.5 seconds after last word
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      clearSilenceTimer();
      recognition.stop();
    };
  }, []);

  const start = (langCode = 'ja-JP') => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
    }
  };

  const stop = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const reset = () => setTranscript('');

  return { isSupported, isListening, transcript, error, start, stop, reset };
}
