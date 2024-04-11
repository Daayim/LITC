// Sidebar.jsx

import React from 'react';
import './Sidebar.css';

function Sidebar({ baseStation, userEquipment, setShowModel, setViewMode, fetchBaseStations, clearMarkers, generatePolarPlot, generateHeatMap, Data3DVisualization }) {
  return (
    <div className="sidebar" style={{ border: '2px solid black' }}>
      <h2>LITC MAP Software</h2>
      <p>Frontend visualization tool for LITC Project.</p>
      <button onClick={fetchBaseStations}>Fetch Base Stations</button>
      <button onClick={clearMarkers}>Clear Markers</button>
      <hr></hr>
      <h3>Data visualization</h3>
      <p>Display selected UE data and generate plots.</p>
      <p>
        <button onClick={generatePolarPlot} disabled={!userEquipment}>
          Generate Polar Plot
        </button>
        <button onClick={generateHeatMap} disabled={!userEquipment}>
          Generate Heat Map
        </button>
        <button onClick={Data3DVisualization} disabled={!userEquipment}>
          Generate 3D Map
        </button>
        <br></br>
        <hr></hr>
      </p>
      <div>
        <h3>Selected Base Station</h3>
        <p>{baseStation ? baseStation.Base_Station_ID : "None"}</p>
        <button onClick={() => {setShowModel(true); setViewMode("BS");}} disabled={!baseStation}>
                BS Details
        </button>
        <h3>Selected UE</h3>
        <p>{userEquipment ? userEquipment.UE_ID : "None"}</p>
        <button onClick={() => {setShowModel(true); setViewMode("UE");}} disabled={!userEquipment}>
                UE Details
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
