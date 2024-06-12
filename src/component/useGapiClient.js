// useGapiClient.js
import { useEffect } from 'react'


export const useGapiClient = () => {

    const API_KEY = "AIzaSyC8cePcxxA7ptrOYKD20vA7IJe5S4D6gfY"
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    /* global gapi */
    let gapi = window.gapi;

    useEffect(() => {
      const initializeGapiClient = () => {
        gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        }).then(() => {
          console.log('GAPI client initialized');
        }).catch((error) => {
          console.error('Error initializing gapi client:', error);
        });
      };
  
      gapi.load('client', initializeGapiClient);
    }, []);
};
