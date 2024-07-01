import { Component } from 'react';
import { gapi } from 'gapi-script';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

class GapiClient extends Component {
  constructor(props) {
    super(props);

    this.API_KEY = process.env.REACT_APP_API_KEY;
    this.DISCOVERY_DOCS = [process.env.REACT_APP_DISCOVERY_DOCS];
    this.CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    this.SCOPES = process.env.REACT_APP_SCOPES;
    /* global gapi */
    this.google = window.google;
    this.state = {
      isSignedIn: false,
      user: null, 
      loading: true,
    };
  }

  componentDidMount() {
    const initializeGapiClient = () => {
      gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES,
        plugin_name: 'calendar',
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        this.setIsSignedIn(authInstance.isSignedIn.get());
        this.setUser(authInstance.currentUser.get().getBasicProfile());
        authInstance.isSignedIn.listen(this.setIsSignedIn);
        this.setState({ loading: false });
      }).catch((error) => {
        console.error('Error initializing gapi client:', error);
        this.setState({ loading: false });
      });
    };

    gapi.load('client:auth2', initializeGapiClient);
  }

  setIsSignedIn = (isSignedIn) => {
    this.setState({ isSignedIn });
  };
  setUser = (user) => {
    this.setState({ user });
  };

  signIn = () => {
    gapi.auth2.getAuthInstance().signIn({prompt: 'consent'}).then(user => {
      this.setUser(user.getBasicProfile());
      this.setIsSignedIn(true);
    }).catch(error => {
      console.error('Error signing in with Google:', error);
    });
  };

  signOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      this.setUser(null);
      this.setIsSignedIn(false);
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };

  render() {
    const { isSignedIn, user, loading } = this.state;
  
    if (loading) {
      return <Box sx={{ display: 'flex' }} className='loading'><CircularProgress /></Box>
    }
    return (
      <div>
        {this.props.render({
          isSignedIn,
          user,
          googleSignIn: this.signIn,
          googleSignOut: this.signOut,
        })}
      </div>
    );
  }
}

export default GapiClient;
