import React from 'react';

const DetailModal = ({ ue, baseStation, onClose }) => {
    const openDataFile = async () => {
        if (!ue) return;

        try {
            const response = await fetch(`/${ue.UE_ID}.csv`);
            if (!response.ok) throw new Error('Network response was not ok');
            const csvText = await response.text();

            // Initialize HTML table
            let table = "<table border='1'><tr><th>Azimuth / Elevation</th>";

            // Adding headers for azimuth degrees
            for (let azimuth = 1; azimuth <= 360; azimuth++) {
                table += `<th>${azimuth}°</th>`;
            }
            table += "</tr>";

            // Parsing each line for elevation and signal power data
            const lines = csvText.split('\n').slice(1); // Skipping assumed header
            lines.forEach((line, index) => {
                const dataPoints = line.split(',');
                if (dataPoints.length === 1 && dataPoints[0].trim() === '') return;  // Skip empty rows

                // Adding elevation degree as the first cell in each row
                table += `<tr><td>${index + 1}°</td>`;  // Index + 1 to start elevation degrees from 1
                dataPoints.forEach(dataPoint => {
                    table += `<td>${dataPoint.trim()}</td>`;
                });
                table += "</tr>";
            });

            table += "</table>";

            // Open a new window and write the content
            const dataWindow = window.open('');
            dataWindow.document.write(`
            <html>
                <head>
                    <title>${ue.UE_ID} Antenna Signal Power Data Table</title>
                </head>
                <body>
                    <div style="display: flex; align-items: center;">
                        <h1>${ue.UE_ID} Signal Antenna Data Table</h1>
                        <button onclick='window.close()' style="margin-left: 20px; font-size: 20px; padding: 10px 20px;">Close</button>
                    </div>
                    ${table}
                </body>
            </html>
        `);
        } catch (error) {
            console.error('Error fetching the CSV file:', error);
        }
    };

    return (
        <div className="modal show" onClick={onClose} style={{ border: '2px solid black' }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Detailed Information</h2>
                {ue && baseStation ? (
                    <div style={{ textAlign: 'left', marginLeft: '10px' }}>
                        <h3>Base Station Details</h3>
                        <p>ID: {baseStation.Base_Station_ID}</p>
                        <p>Latitude: {baseStation.Latitude}</p>
                        <p>Longitude: {baseStation.Longitude}</p>
                        <h3>UE Details</h3>
                        <p>ID: {ue.UE_ID}</p>
                        <p>Gain: {ue.Latitude} (Placeholder for Gain)</p>
                        <p>Antenna Loss: {ue.Longitude} (Placeholder for Antenna Loss)</p>

                    </div>
                ) : (
                    <p>No data available</p>
                )}
                <button onClick={openDataFile}>Open Data File</button>
                <br></br>
                <button onClick={onClose}>Close</button>
            </div>
        </div >
    );
};

export default DetailModal;