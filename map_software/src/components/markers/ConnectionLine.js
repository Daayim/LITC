// ConnectionLine.jsx

import React from 'react';
import { Polyline, Popup } from 'react-leaflet';

const ConnectionLines = ({ selectedBaseStation, selectedUE,  setShowModel, setSelectedPolyline, selectedPolyline }) => {
  if (!selectedBaseStation) return null;

  return selectedBaseStation.UEs.map((ue, index) => {
    const isSelectedUE = selectedUE && ue.UE_ID === selectedUE.UE_ID;
    const polylineColor = isSelectedUE ? "red" : "gray";
    const polylineWeight = isSelectedUE ? 6 : 4;

    return (
      <Polyline
        key={`${index}-${isSelectedUE ? 'selected' : 'not-selected'}`}
        positions={[
          [selectedBaseStation.Latitude, selectedBaseStation.Longitude],
          [ue.Latitude, ue.Longitude]
        ]}
        color={polylineColor}
        weight={polylineWeight}
        dashArray="10"
        eventHandlers={{
          click: () => {
            if (isSelectedUE) {
              setSelectedPolyline({ baseStation: selectedBaseStation, ue });
            }
          },
        }}
      >
        {selectedPolyline && selectedPolyline.ue.UE_ID === ue.UE_ID && (
          <Popup>
            <div>
              <h3>BS|UE Details</h3>
              <p>ID: {ue.UE_ID}</p>
              <p>Gain: {ue.Latitude}</p>
              <p>Antenna Loss: {ue.Longitude}</p>
              <button onClick={() => setShowModel(true)}>
                View Details
              </button>
            </div>
          </Popup>
        )}
      </Polyline>
    );
  });
};

export default ConnectionLines;
