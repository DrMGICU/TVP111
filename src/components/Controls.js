// src/components/Controls.js
import React from 'react';

const Controls = ({
  pacemakerRate,
  setPacemakerRate,
  outputMA,
  setOutputMA,
  intrinsicRate,
  setIntrinsicRate,
  intrinsicAmplitude,
  setIntrinsicAmplitude,
  mode,
  setMode,
}) => {
  return (
    <div>
      <h2>Controls</h2>
      <div>
        <label>Pacemaker Rate: </label>
        <input
          type="number"
          value={pacemakerRate}
          onChange={(e) => setPacemakerRate(Number(e.target.value))}
        />
      </div>
      {/* Add other controls as needed */}
    </div>
  );
};

export default Controls;
