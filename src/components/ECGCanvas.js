/**
 * Author: Dr. Mohammed Al Ghazal
 * Description: Transvenous Pacing Simulator
 * Date: [13/01/2025]
 * 
 * This file is part of a custom-built simulation for cardiac pacing,
 * designed and developed to illustrate the functionality of both
 * pacemaker-generated and intrinsic cardiac rhythms.
 */
import React, { useRef, useEffect } from 'react';

export default function ECGCanvas({ events = [], intrinsicAmplitude, pacemakerRate, intrinsicRate, mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const midY = canvas.height / 2;

      // Render artifacts for low sensitivity
      if (intrinsicAmplitude < 2) {
        renderArtifacts(ctx, canvas.width, midY);
        animationId = requestAnimationFrame(render);
        return;
      }

      // Skip rendering if sensitivity is too high
      if (intrinsicAmplitude >= 6) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Draw baseline
      drawBaseline(ctx, canvas.width, midY);

      const now = performance.now();

      // Render events
      events.forEach((evt) => {
        const elapsed = now - evt.time;
        const speed = 0.04; // Speed of wave movement
        const x = canvas.width - elapsed * speed;

        if (x < 0) return; // Skip events outside the canvas

        if (evt.type === 'spike') {
          drawSpike(ctx, x, midY, 'black');
        }

        if (evt.type === 'paced') {
          if (mode === 'asynchronous' || (mode === 'onDemand' && intrinsicRate < pacemakerRate)) {
            drawPQRST(ctx, x, midY, 'green', true); // Paced QRS
          }
        }

        if (evt.type === 'native' && mode === 'onDemand' && intrinsicRate >= pacemakerRate) {
          drawPQRST(ctx, x, midY, 'red', false); // Intrinsic QRS
        }
      });

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [events, intrinsicAmplitude, pacemakerRate, intrinsicRate, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={500}
      style={{ border: '1px solid #ccc' }}
    />
  );
}

// Helper functions
function renderArtifacts(ctx, width, midY) {
  ctx.fillStyle = 'rgba(200, 50, 50, 0.4)';
  for (let i = 0; i < width; i += 10) {
    const yOffset = Math.sin((i + performance.now() * 0.005) % Math.PI) * 10;
    ctx.fillRect(i, midY + yOffset, 5, 5);
  }
}

function drawBaseline(ctx, width, midY) {
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(width, midY);
  ctx.strokeStyle = '#888';
  ctx.stroke();
}

function drawPQRST(ctx, baseX, baseline, color, isWide = false) {
  const amplitudeScale = 2;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // P wave
  ctx.moveTo(baseX - 40, baseline);
  ctx.bezierCurveTo(
    baseX - 36, baseline - 2 * amplitudeScale,
    baseX - 30, baseline - 2 * amplitudeScale,
    baseX - 24, baseline
  );

  // Q wave
  ctx.lineTo(baseX - 20, baseline - 1 * amplitudeScale);

  // R wave
  const rWaveHeight = isWide ? 20 * amplitudeScale : 10 * amplitudeScale;
  ctx.lineTo(baseX - 16, baseline - rWaveHeight);

  // S wave
  ctx.lineTo(baseX - 12, baseline + 5 * amplitudeScale);

  // T wave
  ctx.bezierCurveTo(
    baseX - 4, baseline + 5 * amplitudeScale,
    baseX, baseline + 5 * amplitudeScale,
    baseX + 8, baseline
  );

  ctx.stroke();
}

function drawSpike(ctx, x, baseline, color) {
  ctx.beginPath();
  ctx.moveTo(x, baseline - 30);
  ctx.lineTo(x, baseline + 30);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}
