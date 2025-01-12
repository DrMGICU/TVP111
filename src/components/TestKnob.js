import React, { useState } from 'react';
import { Knob } from 'react-rotary-knob'; // Remove `skins`

function TestKnob() {
  const [value, setValue] = useState(50);

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: '2rem' }}>
      <h1>Test Knob</h1>
      <Knob
        min={0}
        max={100}
        value={value}
        onChange={(v) => setValue(Math.round(v))} // Update state
      />
      <p>Knob Value: {value}</p>
    </div>
  );
}

export default TestKnob;
