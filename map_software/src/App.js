import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

import baseStationData from './output_test.json';
import DetailModal from './components/DetailModel';
import LoadingWindow from './components/LoadingWindow';
import Sidebar from './components/Sidebar';

const defaultCenter = [45.4200, -75.6900];
const defaultZoom = 8;

function App() {
  const mapRef = useRef();
  const [baseStations, setBaseStations] = useState([]);
  const [selectedBaseStation, setSelectedBaseStation] = useState(null);
  const [selectedUE, setSelectedUE] = useState(null);
  const [showPolarPlot, setShowPolarPlot] = useState(false);
  const [selectedPolyline, setSelectedPolyline] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize base stations on component mount
    // setBaseStations(baseStationData);
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
      setShowPolarPlot(false);
    } else {
      setSelectedUE(ue); // Select the UE
      setShowPolarPlot(false);
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
                <button onClick={() => setShowModal(true)}>
                  View Details
                </button>
              </div>
            </Popup>
          )}
        </Polyline>
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
    }, 5000);
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
        {renderBaseStationMarkers()}
        {renderUEMarkers()}
        {renderConnectionLine()}
        {isLoading && <LoadingWindow />}
      </MapContainer>
      
      {showModal && <DetailModal ue={selectedPolyline?.ue} baseStation={selectedPolyline?.baseStation} onClose={() => setShowModal(false)} />}
      <Sidebar
        baseStation={selectedBaseStation}
        userEquipment={selectedUE}
        fetchBaseStations={fetchBSData}
        clearMarkers={clearMarkers}
        generatePolarPlot={generatePolarPlot}
        generateHeatMap={generateHeatMap}
        Data3DVisualization={Data3DVisualization}
      />
</div>
  );
}

export default App;
