import axios from "axios";
import "../css/CalendarPage.css";
import { authContext } from "../contexts/auth.context";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AlertRejectEvent from "./AlertRejectEvent";

export default function AvailableEvents() {
  const { currentUser, getUserInfo, baseUrl, getHeaders } = useContext(authContext);
  const [eventToReject, setEventToReject] = useState();

  //------------- FUNCTIONS FOR BUTTONS --------------------
  const joinEvent = (eventId) => {
    axios
      .post(baseUrl + "/events/" + eventId + "/accept", {}, getHeaders())
      .then(() => {
        getUserInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //-------------------------- RETURN ------------------------------
  return (
    <div className="newEvents red-border">
      <h2>Possible plans</h2>
      {/* We don't need to use a loading state here because these components only render after loading. (See CalendarPage) */}
      {currentUser.eventsPending.length == 0 && <p className="noEvents">No new events</p>}

      {currentUser.eventsPending.length !== 0 &&
        currentUser.eventsPending.map((event) => (
          <div className="newEv" key={event._id}>
            <h4 className="event-title">{event.title}</h4>
            <div className="event-body">
              <p className="description">{event.description}</p>
              <p>Location: {event.location}</p>
              <p>{new Date(event.dateTime).toLocaleString()}</p>

              <div className="btn-group">
                <button type="button" className="join btn btn-success" onClick={() => joinEvent(event._id)}>
                  Join
                </button>
                <button type="button" className="reject btn btn-danger" onClick={() => setEventToReject(event._id)}>
                  Reject
                </button>
                {event._id === eventToReject && <AlertRejectEvent eventId={event._id} setEventToReject={setEventToReject} />}
              </div>

              <div className="moreinfo">
                <Link to={`/events/${event._id}`}>More details</Link>
              </div>
              <hr className="newevents" />
            </div>
          </div>
        ))}
    </div>
  );
}
