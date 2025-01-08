import { useState, useRef, useEffect } from 'react';

/**
 * Transvenous pacing logic:
 * - Pacer fires if intrinsicRate < pacemakerRate in onDemand mode.
 * - Pacer does not fire if intrinsicRate >= pacemakerRate in onDemand mode.
 * - Handles 'asynchronous' and 'onDemand' pacing modes.
 * - Includes sensing logic based on intrinsicAmplitude.
 */
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

  const PACING_THRESHOLD = 2; // Need >= 2 mA for a visible spike/capture

  function spawnEvent(type, time) {
    setEvents((prev) => [...prev, { time, type }]);
  }

  useEffect(() => {
    function update() {
      const now = performance.now();

      // 1) Handle intrinsic beats
      const intrinsicInterval = 60000 / intrinsicRate;
      if (mode !== 'asynchronous') {
        if (now - lastIntrinsicRef.current >= intrinsicInterval) {
          spawnEvent('native', now);
          lastIntrinsicRef.current = now;
        }
      }

      // 2) Handle pacer behavior
      switch (mode) {
        case 'asynchronous': {
          // Always fire at the pacemakerRate
          if (timeToPace(now, lastPacerRef.current, pacemakerRate)) {
            firePacer(now, outputMA);
          }
          break;
        }

        case 'onDemand':
        default: {
          const intrinsicIntervalMet = now - lastIntrinsicRef.current < intrinsicInterval;

          if (intrinsicRate >= pacemakerRate && intrinsicIntervalMet) {
            // Intrinsic rate is adequate, do not fire pacer
            break;
          }

          // Intrinsic rate is inadequate or interval not met, fire pacer
          if (timeToPace(now, lastPacerRef.current, pacemakerRate)) {
            firePacer(now, outputMA);
          }
          break;
        }
      }

      requestRef.current = requestAnimationFrame(update);
    }

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [pacemakerRate, outputMA, intrinsicRate, intrinsicAmplitude, mode]);

  function timeToPace(now, lastTime, rate) {
    const interval = 60000 / rate;
    return now - lastTime >= interval;
  }

  function firePacer(now, output) {
    if (output < PACING_THRESHOLD) {
      return; // No spike or paced event if below threshold
    }
    spawnEvent('spike', now); // Fire spike
    lastPacerRef.current = now;
    spawnEvent('paced', now); // Fire paced event
  }

  return events;
}
