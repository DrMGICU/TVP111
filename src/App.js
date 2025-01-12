/**
 * Author: Dr. Mohammed Al Ghazal
 * Description: Transvenous Pacing Simulator
 * Date: [13/01/2025]
 * 
 * This file is part of a custom-built simulation for cardiac pacing,
 * designed and developed to illustrate the functionality of both
 * pacemaker-generated and intrinsic cardiac rhythms.
 */
import React, { useState } from 'react';
import PacerControls from './components/PacerControls/PacerControls';
import usePacemakerSim from './hooks/usePacemakerSim';
import ECGCanvas from './components/ECGCanvas';

function App() {
  const [pacemakerRate, setPacemakerRate] = useState(80);
  const [outputMA, setOutputMA] = useState(2);
  const [intrinsicRate, setIntrinsicRate] = useState(60);
  const [intrinsicAmplitude, setIntrinsicAmplitude] = useState(1.5);
  const [mode, setMode] = useState('onDemand');

  const events = usePacemakerSim({
    pacemakerRate,
    outputMA,
    intrinsicRate,
    intrinsicAmplitude,
    mode,
  });
  console.log('Events being passed to ECGCanvas:', events);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>Transvenous Pacing Simulator</h1>
      <PacerControls
        rate={pacemakerRate}
        setRate={setPacemakerRate}
        outputMA={outputMA}
        setOutputMA={setOutputMA}
        sensitivity={intrinsicAmplitude}
        setSensitivity={setIntrinsicAmplitude}
      />
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <label style={{ marginRight: '1rem' }}>Mode: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="onDemand">On-Demand (VVI)</option>
          <option value="asynchronous">Asynchronous (VVO)</option>
        </select>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3>Intrinsic Controls</h3>
        <label style={{ marginRight: '1rem' }}>Intrinsic Rate (bpm): </label>
        <input
          type="number"
          value={intrinsicRate}
          onChange={(e) => setIntrinsicRate(Number(e.target.value))}
          min={0}
          max={200}
        />
      </div>
      <ECGCanvas
        events={events}
        intrinsicAmplitude={intrinsicAmplitude}
        pacemakerRate={pacemakerRate}
        intrinsicRate={intrinsicRate}
        mode={mode}
      />
    </div>
  );
}

export default App;
