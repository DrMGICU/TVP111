/**
 * Author: Dr. Mohammed Al Ghazal
 * Description: Transvenous Pacing Simulator
 * Date: [13/01/2025]
 * 
 * This file is part of a custom-built simulation for cardiac pacing,
 * designed and developed to illustrate the functionality of both
 * pacemaker-generated and intrinsic cardiac rhythms.
 */

import { useState, useRef, useEffect } from 'react';

export default function usePacemakerSim({
  pacemakerRate = 80,
  outputMA = 2,
  intrinsicRate = 60,
  intrinsicAmplitude = 1.5,
  mode = 'onDemand',
}) {
  const [events, setEvents] = useState([]);
  const lastIntrinsicRef = useRef(performance.now());
  const lastPacerRef = useRef(performance.now());
  const requestRef = useRef(null);

  const PACING_THRESHOLD = 2; // mA threshold for pacer to function

  function spawnEvent(type, time) {
    setEvents((prev) => [...prev, { time, type }]);
  }

  useEffect(() => {
    function update() {
      const now = performance.now();

      // Generate intrinsic events in on-demand mode
      const intrinsicInterval = 60000 / intrinsicRate;
      if (mode === 'onDemand' && now - lastIntrinsicRef.current >= intrinsicInterval) {
        spawnEvent('native', now);
        lastIntrinsicRef.current = now;
      }

      // Generate pacemaker events
      const pacemakerInterval = 60000 / pacemakerRate;
      if (
        (mode === 'asynchronous' || (mode === 'onDemand' && intrinsicRate < pacemakerRate)) &&
        now - lastPacerRef.current >= pacemakerInterval
      ) {
        firePacer(now, outputMA);
      }

      requestRef.current = requestAnimationFrame(update);
    }

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [pacemakerRate, outputMA, intrinsicRate, intrinsicAmplitude, mode]);

  function firePacer(now, output) {
    if (output < PACING_THRESHOLD) return; // Skip if below threshold
    spawnEvent('spike', now);
    spawnEvent('paced', now);
    lastPacerRef.current = now;
    console.log('Paced event generated at:', now);
  }

  return events;
}
