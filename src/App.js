// src/App.js
import React, { useState } from 'react';
import usePacemakerSim from './hooks/usePacemakerSim';
import ECGCanvas from './components/ECGCanvas';

function App() {
  // State variables for pacemaker and intrinsic controls
  const [pacemakerRate, setPacemakerRate] = useState(80);
  const [outputMA, setOutputMA] = useState(2);
  const [intrinsicRate, setIntrinsicRate] = useState(60);
  const [intrinsicAmplitude, setIntrinsicAmplitude] = useState(1.5); // Default under-sensing
  const [mode, setMode] = useState('onDemand');

  // Get events from the pacemaker simulation logic
  const events = usePacemakerSim({
    pacemakerRate,
    outputMA,
    intrinsicRate,
    intrinsicAmplitude,
    mode,
  });

  return (
    <div style={{ fontFamily: 'Arial', margin: '1rem' }}>
      <h1>Transvenous Pacing Simulator</h1>

      <Controls
        pacemakerRate={pacemakerRate}
        setPacemakerRate={setPacemakerRate}
        outputMA={outputMA}
        setOutputMA={setOutputMA}
        intrinsicRate={intrinsicRate}
        setIntrinsicRate={setIntrinsicRate}
        intrinsicAmplitude={intrinsicAmplitude}
        setIntrinsicAmplitude={setIntrinsicAmplitude}
        mode={mode}
        setMode={setMode}
      />

      {/* Pass sensitivity to ECGCanvas */}
      <ECGCanvas events={events} intrinsicAmplitude={intrinsicAmplitude} />
    </div>
  );
}

function Controls({
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
}) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Pacer Controls</h2>

      <div>
        <label>Mode: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="onDemand">On-Demand</option>
          <option value="asynchronous">Asynchronous</option>
        </select>
      </div>

      <div>
        <label>Pacer Rate (bpm): </label>
        <input
          type="number"
          value={pacemakerRate}
          onChange={(e) => setPacemakerRate(Number(e.target.value))}
          min={30}
          max={200}
        />
      </div>

      <div>
        <label>Output (mA): </label>
        <input
          type="number"
          value={outputMA}
          onChange={(e) => setOutputMA(Number(e.target.value))}
          min={0}
          max={25}
          step={0.5}
        />
        <small>(&#62;=2 => spike visible, &#60;2 => no spike)</small>
      </div>

      <div>
        <label>Intrinsic Rate (bpm): </label>
        <input
          type="number"
          value={intrinsicRate}
          onChange={(e) => setIntrinsicRate(Number(e.target.value))}
          min={0}
          max={200}
        />
      </div>

      <div>
        <label>Intrinsic Amplitude (mV): </label>
        <input
          type="number"
          value={intrinsicAmplitude}
          onChange={(e) => setIntrinsicAmplitude(Number(e.target.value))}
          min={0}
          max={10}
          step={0.5}
        />
        <small> 
          &lt; 2 => under-sensing (artifacts), 
          ≥ 6 => over-sensing (no ECG) 
        </small>
      </div>
    </div>
  );
}

export default App;
