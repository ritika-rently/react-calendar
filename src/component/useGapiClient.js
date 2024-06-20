import React, { Component } from 'react';

class GapiClient extends Component {
  constructor(props) {
    super(props);

    this.API_KEY = process.env.REACT_APP_API_KEY;
    this.DISCOVERY_DOCS = [process.env.REACT_APP_DISCOVERY_DOCS];
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
