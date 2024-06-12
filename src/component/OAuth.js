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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser} from '@fortawesome/fontawesome-free-solid';
import EventDisplay from './EventDisplay';

export const OAuth = () => {

  const session = useSession(); //tokens have user when session exist
  const supabase = useSupabaseClient(); //connect to supabase
  const { isLoading } = useSessionContext();
  const [start, setStart] = useState(null);
  const [ end, setEnd ] = useState(null);
  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  // const initialState = {
  //   eventName: eventName,
  //   eventDescription: eventDescription,
  //   responseView: '',
  //   scheduled_unit_id: [],
  //   accessDetails: {},
  // };
//   state.eventDescription
// setState(...state, {eventName: e.target.value})
  // const [state, setState] = useState(initialState);

  if(isLoading){
    return <></>
  }

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error){
      // snagbar use here to display message
      alert("error logging in to google provider");
      console.log(error);
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut();
  }

  // popup start

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;

  // popup close

  const createCalendarEvent = async () => {
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
    };
  
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error('Failed to create event: ' + response.status);
      }
  
      const responseData = await response.json();
      console.log('Your event is created successfully:', responseData);
  
      // Reset form fields after successful event creation
      setEventName("");
      setEventDescription("");
      setStart(null);
      setEnd(null);
  
    } catch (error) {
      console.error('Error creating event:', error.message);
    }
  };
  

  return (
    <div className='wrapper'>
       <header>
        {session && <h2>Hey {session.user.user_metadata.full_name}</h2>}
          <div className='user-icon'><FontAwesomeIcon icon={faUser} /></div>
        </header>
       <div className="container">
        { session ? (
        <>
            <div className='inner-container'>
              <Button variant="outlined" size="medium" onClick={handleClick}>
                <span className="plus-icon"><FontAwesomeIcon icon={faPlus} /></span> Create
              </Button>
         
              <Popover id={open && 'simple-popover'} open={open} anchorEl={anchorEl} onClose={handleClose} anchorReference="anchorPosition" anchorPosition={{ top: 150, left: 250 }} anchorOrigin={{ vertical: 'center', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'left',}}>
                  <Typography variant="h5" gutterBottom><span class="event-heading">Add an Event</span></Typography>

                  <div className="title">
                    <input type="text" id="eventTitle" onChange={(e) => {setEventName(e.target.value)}} autoComplete='off' />
                    <lable>Add Title</lable>
                  </div>
                  <div className="date-time">
                    <div className="start-date-time">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker label="START DATE & TIME"  value={start}  onChange={(newValue) => setStart(newValue)} />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div className="end-date-time">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker label="END DATE & TIME" value={end}  onChange={(newValue) => setEnd(newValue)} />
                        </DemoContainer> 
                    </LocalizationProvider>
                    </div>
                  </div>
                  <div className='description'>
                    <input type="text" onChange={(e) => {setEventDescription(e.target.value)}} autoComplete='off' />
                    <lable>Add Description</lable>
                  </div>
                  <div className='buttons'>
                    <Button variant="contained" size="medium" onClick={() => createCalendarEvent()}> Create Calendar Event </Button>
                  </div>
              </Popover>
              <Button variant="contained" size="medium" onClick={() => signOut()}> Sign Out </Button>
              <EventDisplay />
            </div>
        </>
         ) : (
        <>
          <button className="sign-in-button" onClick={() => googleSignIn()}>Sign In With Google</button>
        </>
        )}
      </div>
    </div>
  )
}
