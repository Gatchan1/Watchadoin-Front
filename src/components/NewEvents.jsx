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
    <div className="NewEvents">
    
    {/* We don't need to use a loading state here because these components only render after loading. (See DashboardPage) */}
    {currentUser.eventsPending.length == 0 && <p>No new events</p>}

    {currentUser.eventsPending.length !== 0 && currentUser.eventsPending.map((event) => <div className='new-event' key={event._id}>
        <h4>{event.title}</h4>
        <p>{event.description}</p>
        <p>{event.location}</p>
        <p>{ new Date(event.dateTime).toLocaleString()}</p>

        <button type="button" className="join" onClick={ () => joinEvent(event._id)}>Join</button>
        <button type="button" className="reject" onClick={() => rejectEvent(event._id)}>Reject</button>

        <div className="moreinfo">
        <Link to={`/events/${event._id}`}>More details</Link>
        </div>
        <hr className="newevents" />
                
      </div>)}

    </div> 
  )
}
