import { authContext } from "../contexts/auth.context";
import { useContext } from "react";
import axios from "axios";

export default function AlertDeleteList({ listId, setIdToDelete }) {
  const { baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  const deleteHandler = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + `/lists/${listId}/remove`, getHeaders())
      .then((resp) => {
        console.log("The requested list has been deleted: ", resp.data);
        getUserInfo();
      })
      .catch((err) => console.log(err));
  };

  const dismissHandler = () => {
    setIdToDelete("");
  };

  return (
    <div id="AlertDeleteList">
      <form onSubmit={deleteHandler}>
        <p>Are you sure?</p>
        <button type="submit" className="btn btn-outline-danger yesDelete">
          Yes, delete
        </button>
        <button type="button" className="btn btn-outline-dark" onClick={dismissHandler}>
          Cancel
        </button>
      </form>
    </div>
  );
}
