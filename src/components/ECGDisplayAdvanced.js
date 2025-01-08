// src/components/ECGDisplayAdvanced.js
import React, { useEffect, useRef } from 'react';

function ECGDisplayAdvanced({ rate = 60, capture = true }) {
  const canvasRef = useRef(null);

  // A single heartbeat cycle (rough shape) as an array of points
  // near a baseline of 0. You can tweak these values.
  const heartbeatPattern = [
    // P wave (small upward deflection)
    { x: 0, y: 0 },
    { x: 5, y: -2 },
    { x: 10, y: 0 },
    // Q dip
    { x: 15, y: -5 },
    // R spike
    { x: 18, y: 15 },
    // S dip
    { x: 20, y: -5 },
    // Back to baseline
    { x: 25, y: 0 },
    // T wave
    { x: 35, y: 5 },
    { x: 45, y: 0 },
    // End of cycle
    { x: 50, y: 0 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // The length of one heartbeat wave in "pixels"
    const heartbeatWidth = 100;

    // speed factor – how many pixels the wave scrolls per frame
    const scrollSpeed = 2;

    // Convert BPM (beats per minute) to how many frames we shift the pattern
    // We'll shift the wave in such a way that 1 beat (one cycle) moves across the screen.
    // rate = BPM => 60 BPM = 1 beat/s => if heartbeatWidth = 100 px, we want to move 100 px in 1 second
    // So each frame (assuming ~60 FPS) we move about 100/60 px ~ 1.67 px for 60 BPM
    // We'll just keep it simpler with a base scroll + factor.
    const speedFactor = (rate / 60) * scrollSpeed;

    let offset = 0;

    // Animate function
    function render() {
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Draw baseline
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.strokeStyle = '#888';
      ctx.stroke();

      // Draw the wave from left to right
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        // figure out how far along the wave we are
        // We'll map x to the heartbeatPattern array
        // 1 cycle is heartbeatWidth in pixel length
        // We'll shift by offset to animate the wave moving left
        const virtualX = (x + offset) % heartbeatWidth;
        
        // find which two points in heartbeatPattern we are between
        // the entire pattern covers 50 "virtual" x units in the example array
        // so we scale them to heartbeatWidth (which is 100 by default)
        const scaledX = (virtualX / heartbeatWidth) * 50;
        
        // find the nearest points in heartbeatPattern
        let i;
        for (i = 0; i < heartbeatPattern.length - 1; i++) {
          if (
            scaledX >= heartbeatPattern[i].x &&
            scaledX <= heartbeatPattern[i + 1].x
          ) {
            break;
          }
        }

        const segmentStart = heartbeatPattern[i];
        const segmentEnd = heartbeatPattern[i + 1];
        const segmentLength = segmentEnd.x - segmentStart.x;
        const progress = (scaledX - segmentStart.x) / segmentLength;

        // linear interpolation
        const yValue =
          segmentStart.y + (segmentEnd.y - segmentStart.y) * progress;

        // if capture is false, lower amplitude
        const amplitude = capture ? 2.5 : 1;
        const y = midY + yValue * amplitude;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // set color based on capture
      ctx.strokeStyle = capture ? '#00cc00' : '#ff0000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Move the offset to animate scrolling
      offset += speedFactor;
      // request next frame
      animationFrameId = requestAnimationFrame(render);
    }

    // Start animation
    render();

    // Cleanup on unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [rate, capture]);

  return (
    <div style={styles.container}>
      <h2>ECG Display (Advanced)</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={styles.canvas}
      />
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
  },
};

export default ECGDisplayAdvanced;
