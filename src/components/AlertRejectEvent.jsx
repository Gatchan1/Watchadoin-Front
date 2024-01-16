import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext } from "react";

export default function AlertRejectEvent({eventId, setEventToReject}) {
    const { baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  const rejectHandler = (e) => {
    e.preventDefault();
    axios
    .post(baseUrl + "/events/" + eventId + "/reject", {}, getHeaders())
    .then((resp) => {
        console.log("The requested event has been rejected:", resp.data);
        getUserInfo();
      })
      .catch((err) => console.log(err) /* setError("Could not finish the process, try again", err) */);
  }

  const dismissHandler = () => {
    setEventToReject("");
  };

  return <div id="AlertRejectEvent">
  <form onSubmit={rejectHandler}>
    <p>Are you sure?</p>
    <button type="submit" className="btn btn-outline-danger yesDelete">
      Yes, reject
    </button>
    <button type="button" className="btn btn-outline-dark" onClick={dismissHandler}>
      Cancel
    </button>
  </form>
</div>;
}
