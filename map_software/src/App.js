import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

import baseStationData from './Canadian_Cities_Base_Stations_and_UEs.json';

const defaultCenter = [45.4200, -75.6900];
const defaultZoom = 8;

function App() {
  const mapRef = useRef();
  const [baseStations, setBaseStations] = useState([]);
  const [selectedBaseStation, setSelectedBaseStation] = useState(null);
  const [selectedUE, setSelectedUE] = useState(null);
  const [showPolarPlot, setShowPolarPlot] = useState(false);

  useEffect(() => {
    // Initialize base stations on component mount
    setBaseStations(baseStationData);
  }, []);

  const baseStationIcon = L.icon({ iconUrl: '/base_station_unclicked.png', iconSize: [50, 50] });
  const baseStationIconLarge = L.icon({ iconUrl: '/base_station_unclicked.png', iconSize: [70, 70] });
  const baseStationClickedIcon = L.icon({ iconUrl: '/base_station_clicked.png', iconSize: [50, 50] });
  const baseStationClickedIconLarge = L.icon({ iconUrl: '/base_station_clicked.png', iconSize: [70, 70] });
  const ueIcon = L.icon({ iconUrl: '/user_equipment.png', iconSize: [35, 35] });
  const ueIconLarge = L.icon({ iconUrl: '/user_equipment.png', iconSize: [50, 50] });

  function toggleIconSize(marker, isHovering, isBaseStation, isSelected) {
    if (isBaseStation) {
      marker.setIcon(isHovering ? (isSelected ? baseStationClickedIconLarge : baseStationIconLarge) : (isSelected ? baseStationClickedIcon : baseStationIcon));
    } else {
      marker.setIcon(isHovering ? ueIconLarge : ueIcon);
    }
  }



  //////////////////////////////////
  /*        User Equipment        */
  //////////////////////////////////

  function handleUEClick(ue) {
    if (selectedUE && selectedUE.UE_ID === ue.UE_ID) {
      setSelectedUE(null); // Deselect if the same UE is clicked
    } else {
      setSelectedUE(ue); // Select the UE
    }
  }

  function renderUEMarkers() {
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
      >
      </Marker>
    ));
  }

  function renderConnectionLine() {
    if (!selectedBaseStation) return null;
    return selectedBaseStation.UEs.map((ue, index) => {
      const isSelectedUE = selectedUE && ue.UE_ID === selectedUE.UE_ID;
      const polylineColor = isSelectedUE ? "red" : "gray";
      const polylineWeight = isSelectedUE ? 4 : 4;

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
        />
      );
    });
  }



  //////////////////////////////////
  /*         Base Station         */
  //////////////////////////////////

  function renderBaseStationMarkers() {
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
      >
      </Marker>
    ));
  }

  function handleBaseStationClick(station) {
    if (selectedBaseStation && selectedBaseStation.Base_Station_ID === station.Base_Station_ID) {
      setSelectedBaseStation(null); // Deselect if the same station is clicked
      setSelectedUE(null); // Also deselect any selected UE
    } else {
      setSelectedBaseStation(station); // Select new station
      setSelectedUE(null); // Ensure no UE is selected when a new station is selected
    }
  }


  ///////////////////////////////////
  /* Fetching and Clearing Markers */
  ///////////////////////////////////

  async function fetchBSData() {
    // Directly set the imported data since you're not fetching from a remote source
    setBaseStations(baseStationData);
  }

  function clearMarkers() {
    setBaseStations([]);
    setSelectedBaseStation(null);
    setSelectedUE(null);
    setShowPolarPlot(null);
  }

  //////////////////////////////////
  /*      Data Visualization      */
  //////////////////////////////////


  // Define the bounds for the image overlay
  const deltaLat = 0.0125; // Arbitrary small latitude delta for the image size
  const deltaLng = 0.025; // Arbitrary small longitude delta for the image size
  const imageBounds = [
    [defaultCenter[0] - deltaLat, defaultCenter[1] - deltaLng],
    [defaultCenter[0] + deltaLat, defaultCenter[1] + deltaLng]
  ];

  function foo() {
    return;
  }

  function generatePolarPlot() {
    if (selectedUE != null) {
      setShowPolarPlot(!showPolarPlot); // Toggle the visibility of the polar plot
    }
  }

  const getImageBounds = () => {
    const center = selectedUE ? [selectedUE.Latitude, selectedUE.Longitude] : defaultCenter;
    return [
      [center[0] - deltaLat, center[1] - deltaLng],
      [center[0] + deltaLat, center[1] + deltaLng],
    ];
  };

  //////////////////////////////////
  /*        Map Rendering         */
  //////////////////////////////////

  return (
    <div className="App">
      <MapContainer ref={mapRef} center={defaultCenter} zoom={defaultZoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {selectedUE && showPolarPlot && <ImageOverlay url="/signal_power_distribution.png" bounds={getImageBounds()} />}
        {renderBaseStationMarkers()}
        {renderUEMarkers()}
        {renderConnectionLine()}
      </MapContainer>
      <div className="sidebar">
        <h2>LITC MAP Software</h2>
        <p>Frontend visualization tool for LITC Project.</p>
        <button onClick={fetchBSData}>Fetch Base Stations</button>
        <button onClick={clearMarkers}>Clear Markers</button>
        <hr></hr>
        <h3>Data visualization</h3>
        <p>Display selected UE data and generate plots.</p>
        <p>
          <button onClick={generatePolarPlot} disabled={!selectedUE}>
            Generate Polar Plot
          </button>
          <button onClick={foo} disabled={!selectedUE}>
            Generate Heat Map
          </button>
          <button onClick={foo} disabled={!selectedUE}>
            Generate 3D Map
          </button>
          <br></br>
          <hr></hr>
        </p>
        <div>
          <h3>Selected Base Station</h3>
          <p>{selectedBaseStation ? selectedBaseStation.Base_Station_ID : "None"}</p>
          <h3>Selected UE</h3>
          <p>{selectedUE ? selectedUE.UE_ID : "None"}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
