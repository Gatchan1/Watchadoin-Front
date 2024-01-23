import PropTypes from 'prop-types';  
import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ConfirmedEvents( {simpleDate} ) {
  const { currentUser, getUserInfo, baseUrl, getHeaders } = useContext(authContext);

  const [confirmedEvents, setConfirmedEvents] = useState([]);

  useEffect(() => {
    eventsSetup();
  }, [currentUser]);

  // So that the list of confirmed events is displayed in order of date and title:
  const compareEvents = (a, b) => {
    if (a.dateTime < b.dateTime) return -1;
    if (a.dateTime > b.dateTime) return 1;
    if (a.dateTime === b.dateTime) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else return 0;
    }
  };

  const eventsSetup = () => {
    const events = [...currentUser.eventsCreated, ...currentUser.eventsJoined];
    events.sort(compareEvents);
    const todayDate = simpleDate(new Date());
    const filterPastDates = events.filter((event) => {
      const date = simpleDate(new Date(event.dateTime));
      return date >= todayDate;
    });
    setConfirmedEvents(filterPastDates);
  };

  const unjoinEvent = (eventId) => {
    axios
      .post(baseUrl + "/events/" + eventId + "/unjoin", {}, getHeaders())
      .then(() => {
        getUserInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="confirmedEvents red-border">
      <h2>Confirmed plans</h2>
      {/* We don't need to use a loading state here because these components only render after loading. (See CalendarPage) */}
      {!confirmedEvents[0] && <p className="noConfirmed">You haven`t confirmed assistance to any event</p>}
      {confirmedEvents[0] &&
        confirmedEvents.map((event) => {
          return (
            <div className="confirmedEv" key={event._id}>
              <h4 className="event-title">{event.title}</h4>
              <div className="event-body">
                <p className="description">{event.description}</p>
                <p>Location: {event.location ? event.location : "unknown"}</p>
                <p>{new Date(event.dateTime).toLocaleString()}</p>

                {event.creator !== currentUser._id && (
                  <button type="button" className="btn btn-outline-danger" onClick={() => unjoinEvent(event._id)}>
                    Unjoin
                  </button>
                )}

                <div className="moreinfo">
                  <Link to={`/events/${event._id}`}>More details</Link>
                </div>
                <hr className="newevents" />
              </div>
            </div>
          );
        })}
    </div>
  );
}

ConfirmedEvents.propTypes = {
  simpleDate: PropTypes.func
}