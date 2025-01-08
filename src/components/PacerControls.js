// src/components/PacerControls.js
import React from 'react';

function PacerControls({ rate, setRate, outputMA, setOutputMA, sensitivity, setSensitivity }) {
  return (
    <div style={styles.container}>
      <h2>Pacemaker Controls</h2>

      <div style={styles.controlRow}>
        <label>Rate (ppm): </label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          min={30}
          max={180}
        />
      </div>

      <div style={styles.controlRow}>
        <label>Output (mA): </label>
        <input
          type="number"
          value={outputMA}
          onChange={(e) => setOutputMA(Number(e.target.value))}
          min={0}
          max={25}
          step={0.1}
        />
      </div>

      <div style={styles.controlRow}>
        <label>Sensitivity (mV): </label>
        <input
          type="number"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          min={0.5}
          max={20}
          step={0.5}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  controlRow: {
    marginBottom: '0.5rem'
  }
};

export default PacerControls;
