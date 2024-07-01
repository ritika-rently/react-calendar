// OAuth.js
import React from 'react';
import GapiClient from './useGapiClient';
//import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/fontawesome-free-solid';
import { makeStyles } from '@mui/styles';
import EventDisplay from './EventDisplay';
import { CreateEvent } from './useCreateEvent';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    padding: '10px 50px',
    backgroundColor: '#00000057',
    color: '#fff',
  },
  headerH2: {
    fontSize: '20px',
    fontFamily: 'Montserrat, Sans-Serif',
    fontStyle: 'italic',
  },
  container: {
    marginTop: '70px',
    textAlign: 'center',
  },
  userIcon: {
    marginLeft: 'auto',
    verticalAlign: 'middle',
    alignItems: 'center',
    marginTop: '15px',
    fontSize: '25px',
  },
  signOutButton: {
    textAlign: 'center',
    margin: '50px 150px',
  }
}));

export const Application = () => {
  const classes = useStyles();

  // const session = useSession(); //tokens have user when session exist
  // const supabase = useSupabaseClient(); //connect to supabase
  // const { isLoading } = useSessionContext();

  // if(isLoading){
  //   <Box sx={{ display: 'flex' }}>
  //     <CircularProgress />
  //   </Box>
  // }

  // const googleSignIn = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       scopes: 'https://www.googleapis.com/auth/calendar'
  //     }
  //   });
  //   if(error){
  //     console.log('Error logging in to google provider', error);
  //   }
  // }

  // const signOut = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.log('Error signing out', error);
  //   }
  // }

  
  return (
    <GapiClient render={({ isSignedIn, user, googleSignIn, googleSignOut }) => (
      <div className='wrapper'>
        <header className={classes.header}>
          {isSignedIn && user && <h2 className={classes.headerH2}>Hey {user.getName()}</h2>}
            <div className={classes.userIcon}><FontAwesomeIcon icon={faUser} /></div>
          </header>
          
          { isSignedIn ? (
            <div className={classes.container}>
              <CreateEvent user={user} />
              <Button className={classes.signOutButton} variant="contained" size="medium" onClick={googleSignOut}> Sign Out </Button>
              <EventDisplay />
            </div>
          ) : (
            <>
              <Button variant="contained" size="medium" onClick={googleSignIn}> Sign In With Google </Button>
            </>
          )}
      </div>
    )} /> 
  )
}
