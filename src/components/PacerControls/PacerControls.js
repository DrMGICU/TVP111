import { Knob } from 'react-rotary-knob';
import styles from './PacerControls.module.css';

function PacerControls({ rate, setRate, outputMA, setOutputMA, sensitivity, setSensitivity }) {
  return (
    <div className={styles.container}>
      <h2>Pacemaker Controller</h2>

      {/* Rate Knob */}
      <div className={styles.controlGroup}>
        <label>Rate (ppm):</label>
        <Knob
          min={30}
          max={200}
          value={rate}
          onChange={(value) => setRate(Math.round(value))}
          unlockDistance={0}
          preciseMode
        />
        <div className={styles.readout}>{rate} ppm</div>
      </div>

      {/* Output Knob */}
      <div className={styles.controlGroup}>
        <label>Output (mA):</label>
        <Knob
          min={0}
          max={25}
          step={0.1}
          value={outputMA}
          onChange={(value) => setOutputMA(Number(value.toFixed(1)))}
          unlockDistance={0}
          preciseMode
        />
        <div className={styles.readout}>{outputMA.toFixed(1)} mA</div>
      </div>

      {/* Sensitivity Knob */}
      <div className={styles.controlGroup}>
        <label>Sensitivity (mV):</label>
        <Knob
          min={0.5}
          max={10}
          step={0.5}
          value={sensitivity}
          onChange={(value) => setSensitivity(Number(value.toFixed(1)))}
          unlockDistance={0}
          preciseMode
        />
        <div className={styles.readout}>{sensitivity.toFixed(1)} mV</div>
      </div>
    </div>
  );
}

export default PacerControls;
