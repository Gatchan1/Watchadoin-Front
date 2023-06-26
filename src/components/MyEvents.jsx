import { useState, useContext } from "react";
import CreateEvent from "./CreateEvent";
// import EventDetail from "./EventDetail";
import EventUpdate from "./EventUpdate";
import axios from "axios";
import { authContext } from "../contexts/auth.context";
// import { useParams } from "react-router-dom";

export default function MyEvents({ events }) {
  const { baseUrl, getHeaders, getUserInfo } = useContext(authContext);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  // const { username } = useParams();
  // const [error, setError] = useState("");

  function toggleCreateEvent() {
    showCreateEvent ? setShowCreateEvent(false) : setShowCreateEvent(true);
  }

  function deleteHandler(eventInfo) {
    axios
      .post(baseUrl + `/events/${eventInfo._id}/delete`, {}, getHeaders())
      .then((resp) => {
        console.log("evento eliminado:", resp);
        getUserInfo();
      })
      .catch((err) => console.log(err) /* setError("Could not finish the process, try again", err) */);
  }

  return (
    <div id="MyEvents">
    <div className="create-event">
      <h4>Events created by you</h4>

      <button
        className="boton-create"
        onClick={(e) => {
          e.preventDefault();
          toggleCreateEvent();
        }}
      >
        {!showCreateEvent ? <img style={{ width: "20px" }} src="plus.png" alt="create event" /> : <img style={{ width: "20px" }} src="minus.png" alt="roll up create event" />}
      </button>
      </div>
      <hr className="events"></hr>

      {showCreateEvent && <CreateEvent toggleCreateEvent={toggleCreateEvent} />}
      {events &&
        events.map((event) => {
          return (
            <div key={event._id} className="card" style={{ width: "25rem" }}>
              <div className="card-body">
                <div className="event-buttons">
                <button type="button" className="event-title">
                  {event.title}
                </button>
                <button type="button" className="edit-button" data-bs-toggle="modal" data-bs-target="#eventUpdate">
                <img className="smallIcon" src="/edit.png"/>
                </button>
                </div>
                <EventUpdate eventInfo={event} />
                {/* <img className="card-text" src={event.icon} alt="event icon"/> */}
                <p className="card-text">{event.description}</p>
                <p className="card-text">{event.location}</p>
                <p className="card-text">{new Date(event.dateTime).toLocaleString()}</p>
                <p className="card-text">{event.confirmedJoiners}</p>
              </div>
              <div>
                <form>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("fjjjjjjj",event)
                      deleteHandler(event);
                    }}
                    className="delete"
                  >
                    Delete
                  </button>
                </form>
                <hr className="newevents"></hr>

              </div>
            </div>
          );
        })}
    </div>
  );
}
