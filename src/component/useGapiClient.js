import React, { Component } from 'react';

class GapiClient extends Component {
  constructor(props) {
    super(props);

    this.API_KEY = "AIzaSyC8cePcxxA7ptrOYKD20vA7IJe5S4D6gfY";
    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    /* global gapi */
    this.gapi = window.gapi;
  }

  componentDidMount() {
    const initializeGapiClient = () => {
      this.gapi.client.init({
        apiKey: this.API_KEY,
        discoveryDocs: this.DISCOVERY_DOCS,
      }).then(() => {
        console.log('GAPI client initialized');
      }).catch((error) => {
        console.error('Error initializing gapi client:', error);
      });
    };

    this.gapi.load('client', initializeGapiClient);
  }

  render() {
    return null; // This component doesn't render anything
  }
}

export default GapiClient;
