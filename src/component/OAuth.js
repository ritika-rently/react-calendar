// OAuth.js
import React, { useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser} from '@fortawesome/fontawesome-free-solid';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import EventDisplay from './EventDisplay';
import axios from 'axios';


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
  userIcon: {
    marginLeft: 'auto',
    verticalAlign: 'middle',
    alignItems: 'center',
    marginTop: '15px',
    fontSize: '25px',
  },
  innerContainer: {
    width: '800px',
    margin: '90px auto',
    textAlign: 'center',
    padding: '20px 10px',
    borderRadius: '10px',
  },
  container: {
    display: 'flex',
    gap: '20px',
    minHeight: '100%',
  },
  signOutButton: {
    textAlign: 'center',
    margin: '50px 150px',
  },
  title: {
    position: 'relative',
  },
  description: {
    position: 'relative',
  },
}));

export const OAuth = () => {
  const classes = useStyles();

  const session = useSession(); //tokens have user when session exist
  const supabase = useSupabaseClient(); //connect to supabase
  const { isLoading } = useSessionContext();
  const [eventData, setEventData] = useState({
    start: null,
    end: null,
    eventName: "",
    eventDescription: "",
    anchorEl: null,
  });
  const { start, end, eventName, eventDescription, anchorEl } = eventData;

  if(isLoading){
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  }

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error){
      console.log('Error logging in to google provider', error);
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error signing out', error);
    }
  }

  // popup start

  const handleClick = (event) => {
    setEventData({ ...eventData, anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setEventData({ ...eventData, anchorEl: null });
  };

  const open = Boolean(anchorEl);

  // popup close

  const createCalendarEvent = async () => {
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start?.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end?.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
    };

    try {
      const response = await axios.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", event, {
        headers: {
          'Authorization': 'Bearer ' + session?.provider_token,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Your event is created successfully:', response.data);
  
      // Reset form fields after successful event creation
      setEventData({
        ...eventData,
        eventName: "",
        eventDescription: "",
        start: null,
        end: null,
        anchorEl: null, // Closing the popover
      });
  
    } catch (error) {
      console.error('Error creating event:', error.message);
    }
  };
  
  //   try {
  //     const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
  //       method: "POST",
  //       headers: {
  //         'Authorization': 'Bearer ' + session?.provider_token,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(event),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to create event: ' + response.status);
  //     }
  
  //     const responseData = await response.json();
  //     console.log('Your event is created successfully:', responseData);
  
  //     // Reset form fields after successful event creation
  //     setEventData({
  //       ...eventData,
  //       eventName: "",
  //       eventDescription: "",
  //       start: null,
  //       end: null,
  //       anchorEl: null, // Closing the popover
  //     });
  
  //   } catch (error) {
  //     console.error('Error creating event:', error.message);
  //   }
  // };
  

  return (
    <div className='wrapper'>
       <header className={classes.header}>
        {session && <h2 className={classes.headerH2}>Hey {session.user?.user_metadata?.full_name}</h2>}
          <div className={classes.userIcon}><FontAwesomeIcon icon={faUser} /></div>
        </header>
       <div className={classes.container}>
        { session ? (
        <>
            <div className={classes.innerContainer}>
              <Button variant="outlined" size="medium" onClick={handleClick}>
                <span className="plus-icon"><FontAwesomeIcon icon={faPlus} /></span> Create
              </Button>
         
              <Popover id={open && 'simple-popover'} open={open} anchorEl={anchorEl} onClose={handleClose} anchorReference="anchorPosition" anchorPosition={{ top: 150, left: 250 }} anchorOrigin={{ vertical: 'center', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'left',}}>
                  <Typography variant="h5" gutterBottom><span class="event-heading">Add an Event</span></Typography>

                  <div className="title">
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '55ch' },}} noValidate autoComplete="off">
                      <TextField id="standard-basic" label="Add Title" variant="standard" value={eventName} onChange={(e) => { setEventData({ ...eventData, eventName: e.target.value }) }} />
                    </Box>
                  </div>
                  <div className="date-time">
                    <div className="start-date-time">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker label="START DATE & TIME"  value={start}  onChange={(newValue) => setEventData({ ...eventData, start: newValue })} />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div className="end-date-time">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker label="END DATE & TIME" value={end}  onChange={(newValue) => setEventData({ ...eventData, end: newValue })} />
                        </DemoContainer> 
                    </LocalizationProvider>
                    </div>
                  </div>
                  <div className='description'>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '55ch' },}} noValidate autoComplete="off">
                      <TextField id="standard-basic" label="Add Description" variant="standard" value={eventDescription} onChange={(e) => { setEventData({ ...eventData, eventDescription: e.target.value }) }} />
                    </Box>
                  </div>
                  <div className='buttons'>
                    <Button variant="contained" size="medium" onClick={() => createCalendarEvent()}> Create Calendar Event </Button>
                  </div>
              </Popover>
              <Button className={classes.signOutButton} variant="contained" size="medium" onClick={() => signOut()}> Sign Out </Button>
              <EventDisplay />
            </div>
        </>
         ) : (
        <>
          <Button variant="contained" size="medium" onClick={() => googleSignIn()}> Sign In With Google </Button>
        </>
        )}
      </div>
    </div>
  )
}
