// src/components/ECGCanvas.js
import React, { useRef, useEffect } from 'react';

export default function ECGCanvas({ events = [], intrinsicAmplitude }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const midY = canvas.height / 2;

      // Determine behavior based on intrinsicAmplitude
      if (intrinsicAmplitude < 2) {
        // Draw artifacts
        ctx.fillStyle = 'rgba(200, 50, 50, 0.4)';
        for (let i = 0; i < canvas.width; i += 10) {
          const yOffset = Math.sin((i + performance.now() * 0.005) % Math.PI) * 10;
          ctx.fillRect(i, midY + yOffset, 5, 5);
        }
      } else if (intrinsicAmplitude >= 6) {
        // No ECG visible, just clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationId = requestAnimationFrame(render);
        return;
      } else {
        // Normal ECG rendering logic
        // baseline
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(canvas.width, midY);
        ctx.strokeStyle = '#888';
        ctx.stroke();

        const now = performance.now();
        // Shift events left over time
        events.forEach((evt) => {
          const elapsed = now - evt.time;
          const speed = 0.04; // px/ms
          const x = canvas.width - elapsed * speed;
          if (x < 0) return;

          switch (evt.type) {
            case 'native':
              drawPQRST(ctx, x, midY, 'green');
              break;
            case 'spike':
              drawSpike(ctx, x, midY, 'orange');
              break;
            case 'paced':
              drawPQRST(ctx, x, midY, 'red');
              break;
            default:
              break;
          }
        });
      }

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [events, intrinsicAmplitude]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      style={{ border: '1px solid #ccc' }}
    />
  );
}

function drawPQRST(ctx, baseX, baseline, color) {
  const pqrst = [
    // P wave
    [-24, 0],
    [-22, -2],
    [-20, 0],
    // QRS
    [-16, -1],
    [-14, 15],
    [-12, -8],
    [-10, 0],
    // T wave
    [-6, 5],
    [-4, 2],
    [-2, 0],
    [0, 0],
  ];

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const [startX, startY] = pqrst[0];
  ctx.moveTo(baseX + startX, baseline + startY);

  for (let i = 1; i < pqrst.length; i++) {
    const [relX, relY] = pqrst[i];
    ctx.lineTo(baseX + relX, baseline + relY);
  }
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
