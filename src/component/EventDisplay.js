// EventDisplay.js
import React from 'react';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faTrash} from '@fortawesome/fontawesome-free-solid';
import { useGapiClient } from './useGapiClient';
import { useCalendarEvents } from './useCalendarEvents';

function EventDisplay() {
  useGapiClient();
  const { events, fetchEvents, deleteEvent } = useCalendarEvents();
  
  return (

    <>
      <Button variant="outlined" size="medium" onClick={fetchEvents}>
        <span className="plus-icon"><FontAwesomeIcon icon={faListUl} /></span> Display Event List
      </Button>
      <div id="content">
        {events.length === 0 ? (
            <p className="no-event">No events found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Event Summary</th>
                <th>Event Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                let date = event.start.dateTime || event.start.date;
                let datee = new Date(date);
                return (
                  <tr key={event.id}>
                    <td>{event.summary}</td>
                    <td>{datee.toLocaleString('en-US')}</td>
                    <td>
                      <button className="delete-button" onClick={() => deleteEvent(event.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default EventDisplay
