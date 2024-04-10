// App.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

// Window Componenets
import DetailModel from './components/views/DetailModel';
import LoadingWindow from './components/views/LoadingWindow';
import Sidebar from './components/views/Sidebar';

// Marker Componenets
import UEMarkers  from './components/markers/UEMarkers';
import BaseStationMarkers  from './components/markers/BSMarkers';
import ConnectionLines  from './components/markers/ConnectionLine';

// S3 Data storage location
import baseStationData from './storage/output_test.json';

const defaultCenter = [45.4200, -75.6900];
const defaultZoom = 8;

function App() {
  const mapRef = useRef();
  const [baseStations, setBaseStations] = useState([]);
  const [selectedBaseStation, setSelectedBaseStation] = useState(null);
  const [selectedUE, setSelectedUE] = useState(null);
  const [showPolarPlot, setShowPolarPlot] = useState(false);
  const [selectedPolyline, setSelectedPolyline] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize a component state on first render
    // setBaseStations(baseStationData);
  }, []);


  //////////////////////////////////
  /*            Icons             */
  //////////////////////////////////

  const baseStationIcon = L.icon({ iconUrl: '/markerIcons/base_station_unclicked.png', iconSize: [50, 50] });
  const baseStationIconLarge = L.icon({ iconUrl: '/markerIcons/base_station_unclicked.png', iconSize: [70, 70] });
  const baseStationClickedIcon = L.icon({ iconUrl: '/markerIcons/base_station_clicked.png', iconSize: [50, 50] });
  const baseStationClickedIconLarge = L.icon({ iconUrl: '/markerIcons/base_station_clicked.png', iconSize: [70, 70] });
  const ueIcon = L.icon({ iconUrl: '/markerIcons/user_equipment.png', iconSize: [35, 35] });
  const ueIconLarge = L.icon({ iconUrl: '/markerIcons/user_equipment.png', iconSize: [50, 50] });

  function toggleIconSize(marker, isHovering, isBaseStation, isSelected) {
    if (isBaseStation) {
      marker.setIcon(isHovering ? (isSelected ? baseStationClickedIconLarge : baseStationIconLarge) : (isSelected ? baseStationClickedIcon : baseStationIcon));
    } else {
      marker.setIcon(isHovering ? ueIconLarge : ueIcon);
    }
  }

  //////////////////////////////////
  /*         Marker Click         */
  //////////////////////////////////

  function handleUEClick(ue) {
    if (selectedUE && selectedUE.UE_ID === ue.UE_ID) {
      setSelectedUE(null); // Deselect if the same UE is clicked
      setShowPolarPlot(false);
      
    } else {
      setSelectedUE(ue); // Select the UE
      setShowPolarPlot(false);
    }
  }

  function handleBaseStationClick(station) {
    if (selectedBaseStation && selectedBaseStation.Base_Station_ID === station.Base_Station_ID) {
      setSelectedBaseStation(null); // Deselect if the same station is clicked
      setSelectedUE(null); // Also deselect any selected UE
      setShowPolarPlot(false);
      
    } else {
      setSelectedBaseStation(station); // Select new station
      setSelectedUE(null); // Ensure no UE is selected when a new station is selected
      setShowPolarPlot(false);
    }
  }


  ///////////////////////////////////
  /* Fetching and Clearing Markers */
  ///////////////////////////////////

  async function fetchBSData() {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      setBaseStations(baseStationData); // After 5 seconds, set the data
      setIsLoading(false); // End loading
    }, 0);
  }

  function clearMarkers() {
    setBaseStations([]);
    setSelectedBaseStation(null);
    setSelectedUE(null);
    setShowPolarPlot(null);
    setShowModel(null);
    setSelectedPolyline(null);
  }

  //////////////////////////////////
  /*      Data Visualization      */
  //////////////////////////////////


  // Define the bounds for the image overlay
  const deltaLat = 0.00625; // Arbitrary small latitude delta for the image size
  const deltaLng = 0.00825; // Arbitrary small longitude delta for the image size
  const imageBounds = [
    [defaultCenter[0] - deltaLat, defaultCenter[1] - deltaLng],
    [defaultCenter[0] + deltaLat, defaultCenter[1] + deltaLng]
  ];

  function generateHeatMap() {
    return;
  }

  const Data3DVisualization = () => {
    window.location.href = '/3D.html';
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
      <MapContainer ref={mapRef} center={defaultCenter} zoom={defaultZoom} doubleClickZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {selectedUE && showPolarPlot && <ImageOverlay url="/signal_power_distribution.png" bounds={getImageBounds()} />}
        <BaseStationMarkers
          baseStations={baseStations}
          selectedBaseStation={selectedBaseStation}
          baseStationIcon={baseStationIcon}
          baseStationClickedIcon={baseStationClickedIcon}
          handleBaseStationClick={handleBaseStationClick}
          toggleIconSize={toggleIconSize}
        />
        <UEMarkers
          selectedBaseStation={selectedBaseStation}
          ueIcon={ueIcon}
          handleUEClick={handleUEClick}
          toggleIconSize={toggleIconSize}
        />
        <ConnectionLines
        selectedBaseStation={selectedBaseStation}
        selectedUE={selectedUE}
        setSelectedPolyline={setSelectedPolyline}
        selectedPolyline={selectedPolyline}
        setShowModel={setShowModel}
        />
        {isLoading && <LoadingWindow />}
      </MapContainer>
      {showModel && <DetailModel ue={selectedUE} baseStation={selectedBaseStation} onClose={() => setShowModel(false)} />}
      <Sidebar
        baseStation={selectedBaseStation}
        userEquipment={selectedUE}
        fetchBaseStations={fetchBSData}
        clearMarkers={clearMarkers}
        generatePolarPlot={generatePolarPlot}
        generateHeatMap={generateHeatMap}
        Data3DVisualization={Data3DVisualization}
        setShowModel={setShowModel}
      />
</div>
  );
}

export default App;
