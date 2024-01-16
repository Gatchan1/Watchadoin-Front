import { useState, useContext, useEffect } from "react";
import CreateEvent from "./CreateEvent";
// import EventDetail from "./EventDetail";
import EventUpdate from "./EventUpdate";
import AlertDeleteEvent from "./AlertDeleteEvent";
import { authContext } from "../contexts/auth.context";
import { Link } from "react-router-dom";

export default function MyEvents() {
  const { currentUser } = useContext(authContext);

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [modalEvent, setModalEvent] = useState("");
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsOrder, setEventsOrder] = useState("creation-down");
  const [firstButtonState, setFirstButtonState] = useState("");
  const [secondButtonState, setSecondButtonState] = useState("");

  function getCookie(cname) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let carray = decodedCookie.split("; ");
    for (let i = 0; i < carray.length; i++) {
      let c = carray[i];
      if (c.indexOf(cname) == 0) {
        return c.substring(cname.length + 1, c.length);
      }
    }
    return "";
  }

  useEffect(() => {
    const orderCookie = getCookie("wd_eventorder");
    if (orderCookie) setEventsOrder(orderCookie);
  }, []);

  useEffect(() => {
    switch (eventsOrder) {
      case "creation-down":
        setEvents(currentUser.eventsCreated);
        setFirstButtonState("active");
        setSecondButtonState("inactive");
        break;
      case "creation-up": {
        const eventsReversed = [...currentUser.eventsCreated].reverse();
        setEvents(eventsReversed);
        setFirstButtonState("active");
        setSecondButtonState("inactive");
        break;
      }
      case "date-down": {
        const eventsDateDown = [...currentUser.eventsCreated].sort((a, b) => {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateA - dateB;
        });
        setEvents(eventsDateDown);
        setFirstButtonState("inactive");
        setSecondButtonState("active");
        break;
      }
      case "date-up": {
        const eventsDateUp = [...currentUser.eventsCreated].sort((a, b) => {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateB - dateA;
        });
        setEvents(eventsDateUp);
        setFirstButtonState("inactive");
        setSecondButtonState("active");
        break;
      }
    }
  }, [eventsOrder, currentUser]);

  function toggleCreateEvent() {
    showCreateEvent ? setShowCreateEvent(false) : setShowCreateEvent(true);
  }

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function toggleOrder(down, up) {
    let order;
    eventsOrder === down ? (order = up) : (order = down);
    setEventsOrder(order);
    setCookie("wd_eventorder", order, 30);
  }

  return (
    <div id="MyEvents">
      <header>
        <h3>Events created by you:</h3>

        <button className="btn btn-outline-primary" onClick={() => toggleCreateEvent()}>
          {!showCreateEvent ? <img style={{ width: "20px" }} src="plus.png" alt="create event" /> : <img style={{ width: "20px" }} src="minus.png" alt="roll up create event" />}
        </button>
        <div className="preference-container">
          <div className="preference">
            {showOrderOptions ? (
              <button className="show open" onClick={() => setShowOrderOptions(!showOrderOptions)}>
                <p>Order events by:</p> <img src="caret-up-solid.svg" alt="toggle up" />
              </button>
            ) : (
              <button className="show" onClick={() => setShowOrderOptions(!showOrderOptions)}>
                <p>Order events</p>
                <img src="caret-down-solid.svg" alt="toggle down" />
              </button>
            )}
            {showOrderOptions && (
              <div className="preference-btns">
                <button className={`left order ${firstButtonState}`} onClick={() => toggleOrder("creation-down", "creation-up")}>
                  Event creation
                  {eventsOrder === "creation-up" && <span>⬆️</span>}
                  {eventsOrder === "creation-down" && <span>⬇️</span>}
                </button>
                <button className={`order ${secondButtonState}`} onClick={() => toggleOrder("date-down", "date-up")}>
                  Event date
                  {eventsOrder === "date-up" && <span>⬆️</span>}
                  {eventsOrder === "date-down" && <span>⬇️</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {showCreateEvent && <CreateEvent toggleCreateEvent={toggleCreateEvent} />}
      <div className="event-cards-container">
        <div className="event-cards row">
          <EventUpdate eventInfo={modalEvent} />

          {events[0] &&
            events.map((event) => {
              return (
                <div key={event._id} className="card" style={{ width: "25rem", breakInside: "avoid-column" }}>
                  <div className="card-body my-event">
                    <div className="title">
                      <div className="flex">
                      <Link to={`/events/${event._id}`}><h5>{event.title}</h5></Link>
                        <button type="button" className="edit-button btn btn-light" data-bs-toggle="modal" data-bs-target="#EventUpdate" onClick={() => setModalEvent(event)}>
                          <img className="smallIcon" src="/edit.png" />
                        </button>
                      </div>
                      <button className="delete" onClick={() => setIdToDelete(event._id)}>
                        ❌
                      </button>
                    </div>
                    {/* <img className="card-text" src={event.icon} alt="event icon"/> */}
                    <p className="card-text description">{event.description}</p>
                    <p className="card-text">Location: {event.location}</p>
                    <p className="card-text">{new Date(event.dateTime).toLocaleString()}</p>
                    <p className="card-text">Confirmed atendees: {event.confirmedJoiners.length}</p>

                    {idToDelete === event._id && <AlertDeleteEvent eventId={event._id} setIdToDelete={setIdToDelete} />}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
