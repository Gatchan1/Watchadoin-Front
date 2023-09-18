import axios from "axios";
import "../css/DashboardPage.css";
import { authContext } from "../contexts/auth.context";
import { useContext } from "react";
import { Link } from "react-router-dom";


export default function NewEvents() {
  const { currentUser, getUserInfo, baseUrl, getHeaders } = useContext(authContext);
  
//------------- FUNCTIONS FOR BUTTONS --------------------
  const joinEvent = (eventId)=>{
    axios.post(baseUrl + "/events/" + eventId + "/accept", {}, getHeaders())
    .then(() => {
      getUserInfo()
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const rejectEvent = (eventId)=>{
    axios.post(baseUrl + "/events/" + eventId + "/reject", {}, getHeaders())
    .then(() => {
      getUserInfo()
    })
    .catch((err) => {
      console.log(err);
    });
  }

//-------------------------- RETURN ------------------------------
  return (
    <div className="newEvents red-border">
    <h2>Possible plans</h2>
    {/* We don't need to use a loading state here because these components only render after loading. (See DashboardPage) */}
    {currentUser.eventsPending.length == 0 && <p className="noEvents">No new events</p>}

    {currentUser.eventsPending.length !== 0 && currentUser.eventsPending.map((event) => <div className='newEv' key={event._id}>
        <h4>{event.title}</h4>
        <p className="description">{event.description}</p>
        <p>Location: {event.location}</p>
        <p>{ new Date(event.dateTime).toLocaleString()}</p>

        <div className="btn-group">
        <button type="button" className="join btn btn-primary" onClick={ () => joinEvent(event._id)}>Join</button>
        <button type="button" className="reject btn btn-danger" onClick={() => rejectEvent(event._id)}>Reject</button>
        </div>

        <div className="moreinfo">
        <Link to={`/events/${event._id}`}>More details</Link>
        </div>
        <hr className="newevents" />
                
      </div>)}

    </div> 
  )
}
