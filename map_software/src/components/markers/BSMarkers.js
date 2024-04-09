// BSMarkers.jsx

import React from 'react';
import { Marker } from 'react-leaflet';

const BaseStationMarkers = ({ baseStations, selectedBaseStation, baseStationIcon, baseStationClickedIcon, handleBaseStationClick, toggleIconSize }) => {
  return baseStations.map((station, index) => (
    <Marker
      key={index}
      position={[station.Latitude, station.Longitude]}
      icon={selectedBaseStation && selectedBaseStation.Base_Station_ID === station.Base_Station_ID ? baseStationClickedIcon : baseStationIcon}
      eventHandlers={{
        click: () => handleBaseStationClick(station),
        mouseover: (e) => toggleIconSize(e.target, true, true, selectedBaseStation && selectedBaseStation.Base_Station_ID === station.Base_Station_ID),
        mouseout: (e) => toggleIconSize(e.target, false, true, selectedBaseStation && selectedBaseStation.Base_Station_ID === station.Base_Station_ID),
      }}
    />
  ));
};

export default BaseStationMarkers;
