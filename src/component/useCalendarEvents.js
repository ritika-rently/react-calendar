// useCalendarEvents.js
import { useState } from 'react';


export const useCalendarEvents = () => {

    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const SCOPES = process.env.REACT_APP_SCOPES;

    const [events, setEvents] = useState([]);
   
    /* global gapi */
    let gapi = window.gapi;
    let google = window.google;

    const fetchEvents = () => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            gapi.client.setToken(tokenResponse);
            
              // Get events
              gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
              }).then((response) => {
                  const events = response.result.items;
                  // no events found code 
                  if (!events || events.length === 0) {
                    setEvents([]);
                  } else {
                     setEvents(events);
                  }   
              }).catch((error) => {
                console.error('Error fetching events:', error);
            });
          },
        });
    
        tokenClient.requestAccessToken();
    };

    const deleteEvent = (eventId) => {
        gapi.client.calendar.events.delete({
          calendarId: 'primary',
          eventId: eventId,
        }).then((response) => {
          if (response.error) {
            console.error('Error deleting event: ', response.error);
          } else {
            console.log('Event deleted successfully');
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
          }
        });
    };
    return { events, fetchEvents, deleteEvent };
}