import React, { useState } from 'react';
import './SettingsMenu.css';

const SettingsMenu = ({ settings, onClose, onSave }) => {
  const [color, setColor] = useState(settings.color);
  const [speed, setSpeed] = useState(settings.speed);
  const [fireRate, setFireRate] = useState(settings.fireRate);

  const handleSave = () => {
    onSave({ color, speed, fireRate });
  };

  return (
    <div className="settings-menu">
      <div className="settings-content">
        <h2>Settings</h2>
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Speed:
          <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
        </label>
        <label>
          Fire Rate:
          <input type="range" min="500" max="2000" step="100" value={fireRate} onChange={(e) => setFireRate(parseInt(e.target.value))} />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsMenu;