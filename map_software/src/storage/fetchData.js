// fetchData.js

import baseStationData from './output_test.json';

// Async function to fetch Base Station data
export async function fetchBSData(setBaseStations, setIsLoading) {
    setIsLoading(true); 
    setTimeout(() => {
      setBaseStations(baseStationData); 
      setIsLoading(false); 
    }, 1500);
}
