import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authContext } from "../contexts/auth.context";

export default function CreateEvent() {
  
  const {username} = useParams;
  const navigate = useNavigate();
  const baseUrl = useContext(authContext);
  
  //State variables 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [dropdownData, setDropdownData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemSelected = (item) => {
    setSelectedItems([...selectedItems, item._id]);
  };

  //calls the backend route to create the event
  const submitHandler = (e) => {
    e.preventDefault();
    let newEvent = { title, description, date, time, location, selectedItems };
    axios.post(baseUrl + "/events/create", newEvent)
    .then((res) => {
      console.log("event created", res)
    })
    .catch((err) => {
      console.log(err);
      navigate("/404");
    });
  };

  //Fetching user friends + invitelists to populate the dropdown and allow to select friends to invite
  useEffect(() => {
    axios.get(baseUrl + `/users/${username}`)
    .then((user) => {
      let friendsAndLists = [...user.friendsConfirmed, ...user.inviteLists]
      setDropdownData(friendsAndLists)
    })
    .catch((err) => {
      console.log(err);
      navigate("/404");
    });
  }, [])


  return (
    <>
      <h1>Create new event</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">What will you be doing?</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Add a few more details, eg. what to bring, if tickets need to be bought, ...</label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">When?</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">What time?</label>
          <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Where?</label>
          <input type="" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}/>
        </div>
        {/* <div className="mb-3">
          <label htmlFor="icon" className="form-label">Select icon</label>
          <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)}/>
        </div> */}

        {/* Dropdown to select friends & lists to invite */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >Invite friends</button>
        <select className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          {dropdownData.map((item) => (
        <option className="dropdown-item" key={item.id} onClick={() => handleItemSelected(item)}>
          {item.username}
        </option>
      ))}
        </select>

      {/* checkbox to allow invited to invite their friends */}
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Allow your friends to share this event
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </>
  );
} 