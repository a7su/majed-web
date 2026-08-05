import React, { useEffect, useRef } from 'react';

export default function AmbientAudio({ isMuted }) {
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (!isMuted) {
      try {
        if (!audioCtxRef.current) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          // Create subtle low drone oscillator
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(55, ctx.currentTime); // A1 note 55Hz warm hum

          // Lowpass filter to keep it extremely deep and subtle
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(120, ctx.currentTime);

          gain.gain.setValueAtTime(0.015, ctx.currentTime); // extremely soft volume

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          gainNodeRef.current = gain;
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        if (gainNodeRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.015, audioCtxRef.current.currentTime, 0.5);
        }
      } catch (e) {
        console.warn("Web Audio initialization skipped:", e);
      }
    } else {
      if (audioCtxRef.current && gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3);
      }
    }
  }, [isMuted]);

  return null;
}
