import PropTypes from 'prop-types';  
import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext } from "react";

export default function AlertDeleteEvent({eventId, setIdToDelete}) {
    const { baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  const deleteHandler = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + `/events/${eventId}/delete`, {}, getHeaders())
      .then((resp) => {
        console.log("The requested event has been deleted:", resp.data);
        getUserInfo();
      })
      .catch((err) => console.log(err) /* setError("Could not finish the process, try again", err) */);
  }

  const dismissHandler = () => {
    setIdToDelete("");
  };

  return <div id="AlertDeleteEvent">
  <form onSubmit={deleteHandler}>
    <p>Are you sure?</p>
    <button type="submit" className="btn btn-outline-danger yesDelete">
      Yes, delete
    </button>
    <button type="button" className="btn btn-outline-dark" onClick={dismissHandler}>
      Cancel
    </button>
  </form>
</div>;
}

AlertDeleteEvent.propTypes = {
  eventId: PropTypes.string,
  setIdToDelete: PropTypes.func
}