// src/components/ECGDisplay.js
import React, { useEffect, useRef } from 'react';

function ECGDisplay({ rate, outputMA, sensitivity, capture }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const waveWidth = canvas.width;
    const waveHeight = canvas.height / 2;
    let xOffset = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw baseline
      ctx.beginPath();
      ctx.moveTo(0, waveHeight);
      ctx.lineTo(waveWidth, waveHeight);
      ctx.strokeStyle = '#888';
      ctx.stroke();

      // Simulate a wave form that changes based on "capture" vs. "no capture"
      const amplitude = capture ? 20 : 10;
      const frequency = rate / 60; // simplistic approach (beats per second)
      const speed = 2; // wave speed

      ctx.beginPath();
      for (let x = 0; x < waveWidth; x++) {
        // A simple sinus wave formula
        const y = waveHeight + Math.sin((x + xOffset) * 0.02 * frequency) * amplitude;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = capture ? '#00cc00' : '#ff0000';
      ctx.stroke();

      xOffset += speed;
      animationFrameId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animationFrameId);
  }, [rate, outputMA, sensitivity, capture]);

  return (
    <div style={styles.container}>
      <h2>ECG Display</h2>
      <canvas ref={canvasRef} width={600} height={200} style={styles.canvas} />
      <div>
        <strong>Status:</strong> {capture ? 'Capture Achieved' : 'No Capture'}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  canvas: {
    border: '1px solid #ccc',
  }
};

export default ECGDisplay;
