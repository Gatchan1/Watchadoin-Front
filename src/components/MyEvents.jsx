import { useState, useContext } from "react";
import CreateEvent from "./CreateEvent";
// import EventDetail from "./EventDetail";
import EventUpdate from "./EventUpdate";
import AlertDeleteEvent from "./AlertDeleteEvent";
import { authContext } from "../contexts/auth.context";
// import { useParams } from "react-router-dom";

export default function MyEvents() {
  const { currentUser } = useContext(authContext);

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [modalEvent, setModalEvent] = useState("");

  function toggleCreateEvent() {
    showCreateEvent ? setShowCreateEvent(false) : setShowCreateEvent(true);
  }

  return (
    <div id="MyEvents">
      <div className="create-event">
        <h3>Events created by you:</h3>

        <button className="btn btn-outline-primary" onClick={() => toggleCreateEvent()}>
          {!showCreateEvent ? <img style={{ width: "20px" }} src="plus.png" alt="create event" /> : <img style={{ width: "20px" }} src="minus.png" alt="roll up create event" />}
        </button>
      </div>
      {showCreateEvent && <CreateEvent toggleCreateEvent={toggleCreateEvent} />}
      <div className="event-cards-container">
        <div className="event-cards row">
          <EventUpdate eventInfo={modalEvent} />

          {currentUser.eventsCreated[0] &&
            currentUser.eventsCreated.map((event) => {
              return (
                <div key={event._id} className="card" style={{ width: "25rem", breakInside: "avoid-column" }}>
                  <div className="card-body my-event">
                    <div className="title">
                    <div className="flex">
                      <h5>{event.title}</h5>
                      <button type="button" className="edit-button btn btn-light" data-bs-toggle="modal" data-bs-target="#EventUpdate" onClick={() => setModalEvent(event)}>
                        <img className="smallIcon" src="/edit.png" />
                      </button>
                    </div>
                      <button className="delete btn btn-outline-danger" onClick={() => setIdToDelete(event._id)}>
                      ❌
                    </button>
                    </div>
                    {/* <img className="card-text" src={event.icon} alt="event icon"/> */}
                    <p className="card-text description">{event.description}</p>
                    <p className="card-text">Location: {event.location}</p>
                    <p className="card-text">{new Date(event.dateTime).toLocaleString()}</p>
                    <p className="card-text">Confirmed atendees: {event.confirmedJoiners.length}</p>

                    {idToDelete === event._id && <AlertDeleteEvent event={event} setIdToDelete={setIdToDelete} />}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
