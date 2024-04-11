// fetchData.js

import AWS from 'aws-sdk';

// Configure the AWS SDK
// Note: Make sure your AWS credentials are configured in your environment or through the AWS config file. Discuss with Jannah.
// Look here for documentation https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html
AWS.config.update({
    region: 'ca-central-1',
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY: 'cSsQAKFUCB3/jEC48uiv/b7NJ3RZabb5SDSn0lHQ'
});

const s3 = new AWS.S3();

const BUCKET_NAME = 'int-tol-modules-daayim-asim';
const FILE_NAME = 'snapshot_new.json';

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

export async function fetchBSData(setBaseStations, setIsLoading) {
    setIsLoading(true);

    const params = {
        Bucket: BUCKET_NAME,
        Key: FILE_NAME
    };

    try {
        const data = await s3.getObject(params).promise();
        const objectData = JSON.parse(data.Body.toString());
        const transformedData = transformData(objectData);
        setBaseStations(transformedData);
    } catch (error) {
        console.error('Error fetching or transforming data from S3:', error);
    }

    setIsLoading(false);
}
