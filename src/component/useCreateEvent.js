import React, { useState } from 'react'
import axios from 'axios'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/fontawesome-free-solid';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
    innerContainer: {
      width: '800px',
      margin: '90px auto',
      textAlign: 'center',
      padding: '20px 10px',
      borderRadius: '10px',
    },
    title: {
      position: 'relative',
    },
    description: {
      position: 'relative',
    },
  }));

export const CreateEvent = ({ session }) => {
    const classes = useStyles();
    const [eventData, setEventData] = useState({
        start: null,
        end: null,
        eventName: "",
        eventDescription: "",
        anchorEl: null,
    });
    const { start, end, eventName, eventDescription, anchorEl } = eventData;

    // popup start

  const handleClick = (event) => {
    setEventData({ ...eventData, anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setEventData({ ...eventData, anchorEl: null });
  };

  const open = Boolean(anchorEl);

  // popup close

  const handleCalendarEvent = async () => {
    const event = {
      'summary': eventData.eventName,
      'description': eventData.eventDescription,
      'start': {
        'dateTime': eventData.start?.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': eventData.end?.toISOString(),
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

  return (
    <>
        {/* <div className={classes.innerContainer}> */}
            <Button variant="outlined" size="medium" onClick={handleClick}>
                <span className="plus-icon"><FontAwesomeIcon icon={faPlus} /></span> Create
            </Button>
         
            <Popover id={open ? 'simple-popover' : undefined} open={open} anchorEl={anchorEl} onClose={handleClose} anchorReference="anchorPosition" anchorPosition={{ top: 150, left: 250 }} anchorOrigin={{ vertical: 'center', horizontal: 'right', }} transformOrigin={{ vertical: 'top', horizontal: 'left',}}>
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
                    <Button variant="contained" size="medium" onClick={() => handleCalendarEvent()}> Create Calendar Event </Button>
                  </div>
            </Popover>
        {/* </div> */}
    </>
  )
}
