import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ConfirmedEvents() {
  const { currentUser, getUserInfo, baseUrl, getHeaders } = useContext(authContext);

  const [confirmedEvents, setConfirmedEvents] = useState([]);

  // So that the list of confirmed events is displayed in order of date and title:
  function compareEvents(a, b) {
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
  }

  useEffect(() => {
    const events = [...currentUser.eventsCreated, ...currentUser.eventsJoined];
    events.sort(compareEvents);
    setConfirmedEvents(events);
    console.log("eventos ordenados: ", events);
  }, [currentUser]);

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
    <div className="upcomingEvents red-border">
    <h2>Upcoming events</h2>
      {/* We don't need to use a loading state here because these components only render after loading. (See DashboardPage) */}
      {!confirmedEvents[0] && <p>You haven`t confirmed assistance to any event</p>}
      {confirmedEvents[0] &&
        confirmedEvents.map((event) => {
          return (
            <div className="upcoming" key={event._id}>
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p>{event.location}</p>
              <p>{new Date(event.dateTime).toLocaleString()}</p>

              {event.creator !== currentUser._id && (
                <button type="button" className="join" onClick={() => unjoinEvent(event._id)}>
                  Unjoin
                </button>
              )}

              <div className="moreinfo">
                <Link to={`/events/${event._id}`}>More details</Link>
              </div>
              <hr className="newevents" />
            </div>
          );
        })
        
        }
    </div>
  );
}
