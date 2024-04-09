// UEMarkers.jsx

import React from 'react';
import { Marker } from 'react-leaflet';

const UEMarkers = ({ selectedBaseStation, ueIcon, handleUEClick, toggleIconSize }) => {
  if (!selectedBaseStation) return null;

  return selectedBaseStation.UEs.map((ue, index) => (
    <Marker
      key={index}
      position={[ue.Latitude, ue.Longitude]}
      icon={ueIcon}
      eventHandlers={{
        mouseover: (e) => toggleIconSize(e.target, true, false, false),
        mouseout: (e) => toggleIconSize(e.target, false, false, false),
        click: () => handleUEClick(ue),
      }}
    />
  ));
};

export default UEMarkers;
