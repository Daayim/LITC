const fs = require('fs');

const inputFileName = 'snapshot_new.json';
const outputFileName = 'output.json';

const transformData = (inputData) => {
    let outputData = [];
    inputData.IAS.System.networks.forEach((network, i) => {
        if ('IMT' in network.network) {
            const bsData = network.network.IMT.deployment.BS;
            const ueData = network.network.IMT.UE;

            bsData.forEach((bs, i) => {
                const baseStationId = `BS_${i}`;
                const bsLat = bs.location.latitude;
                const bsLong = bs.location.longitude;

                const ueList = ueData.filter(ue => ue.base_station_id === i);
                const ueOutput = [];

                ueList.forEach((ue, j) => {
                    ueOutput.push({
                        "UE_ID": `UE_${i}_${j}`,
                        "Latitude": ue.location.latitude,
                        "Longitude": ue.location.longitude
                    });
                });

                outputData.push({
                    "Base_Station_ID": baseStationId,
                    "Latitude": bsLat,
                    "Longitude": bsLong,
                    "UEs": ueOutput
                });
            });
        }
    });
    return outputData;
};

fs.readFile(inputFileName, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const inputJson = JSON.parse(data);
    const transformedData = transformData(inputJson);

    fs.writeFile(outputFileName, JSON.stringify(transformedData, null, 4), (err) => {
        if (err) {
            console.error('Error writing the file:', err);
            return;
        }
        console.log(`Data transformed and saved to ${outputFileName}`);
    });
});
