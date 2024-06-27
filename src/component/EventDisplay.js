// EventDisplay.js
import React from 'react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faTrash} from '@fortawesome/fontawesome-free-solid';
import  useGapiClient  from './useGapiClient';
import { useCalendarEvents } from './useCalendarEvents';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
 content: {
  width: '800px',
  textAlign: 'center',
  marginLeft: '310px',
 },
}));

function EventDisplay() {
  const classes = useStyles();
  const { events, fetchEvents, deleteEvent } = useCalendarEvents();
  
  return (

    <>
      <Button variant="outlined" size="medium" onClick={fetchEvents}>
        <span className="plus-icon"><FontAwesomeIcon icon={faListUl} /></span> Display Event List
      </Button>
      <div className={classes.content}>
        {events.length === 0 ? (
            <p className="no-event">No events found.</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="events table">
              <TableHead>
              <TableRow>
                <TableCell>Event Summary</TableCell>
                <TableCell>Event Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => {
                let date = event.start.dateTime || event.start.date;
                let datee = new Date(date);
                return (
                  <TableRow key={event.id}>
                    <TableCell>{event.summary}</TableCell>
                    <TableCell>{datee.toLocaleString('en-US')}</TableCell>
                    <TableCell>
                      <Button className="delete-button" variant="outlined" color="secondary" onClick={() => deleteEvent(event.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  );
}

export default EventDisplay
