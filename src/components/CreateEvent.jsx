import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { authContext } from "../contexts/auth.context";
import AutoComplete from "react-google-autocomplete";

export default function CreateEvent({ toggleCreateEvent }) {
  const { username } = useParams();
  const { baseUrl, user, getHeaders, getUserInfo } = useContext(authContext);

  //State variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [location, setLocation] = useState("");
  const [dropdownDataFriends, setDropdownDataFriends] = useState([]);
  const [initialDropdownDataLists, setInitialDropdownDataLists] = useState([]);
  const [dropdownDataLists, setDropdownDataLists] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [inviteAll, setInviteAll] = useState(false);

  const uniqueSelectedFriends = Array.from(new Set(selectedFriends.map((user) => user._id))).map((id) => selectedFriends.find((user) => user._id === id));

  const handleItemSelectedFriends = (clickedItem) => {
    let currentSelectedFriends = [...selectedFriends, clickedItem];
    setSelectedFriends(currentSelectedFriends);
    setDropdownDataFriends(dropdownDataFriends.filter((friend) => friend._id !== clickedItem._id));

    setDropdownDataLists(
      dropdownDataLists.filter((list) => {
        let listUserIds = list.users.map((user) => user._id);
        let selectedUserIds = currentSelectedFriends.map((user) => user._id);
        // If every user in an inviteList is already selected, let's not show that one inviteList:
        if (!listUserIds.every((id) => selectedUserIds.includes(id))) {
          return list;
        }
      })
    );
  };

  const handleItemSelectedLists = (clickedItem) => {
    setSelectedFriends([...selectedFriends, ...clickedItem.users]);
    setDropdownDataLists(dropdownDataLists.filter((list) => list._id !== clickedItem._id));

    // In the friends dropdown, show only the users that AREN'T included in the array of ids of the selected inviteList:
    let selectedUserIds = clickedItem.users.map((user) => user._id);
    setDropdownDataFriends(dropdownDataFriends.filter((friend) => !selectedUserIds.includes(friend._id)));
  };

  const removeUser = (clickedItem) => {
    let currentSelectedFriends = selectedFriends.filter((friend) => friend._id !== clickedItem._id);
    setSelectedFriends(currentSelectedFriends);
    setDropdownDataFriends([...dropdownDataFriends, clickedItem]);

    setDropdownDataLists(
      initialDropdownDataLists.filter((list) => {
        let listUserIds = list.users.map((user) => user._id);
        let selectedUserIds = currentSelectedFriends.map((user) => user._id);
        // If every user in an inviteList is already selected, let's not show that one inviteList:
        if (!listUserIds.every((id) => selectedUserIds.includes(id))) {
          return list;
        }
      })
    );
  };

  // So that the list of friends that we can invite is displayed in alphabetical order:
  function compareFriends (a, b) {
    if (a.username.toLowerCase() < b.username.toLowerCase()) {
      return -1;
    }
    if (a.username.toLowerCase() > b.username.toLowerCase()) {
      return 1;
    }
    return 0;
  }

  //------------ CREATING EVENT, USING BE /EVENT/CREATE ROUTE -------------
  const submitHandler = (e) => {
    e.preventDefault();
    let coordinates = { lat, lng };
    let newEvent = {
      title,
      creator: user.userId,
      description,
      dateTime,
      location,
      coordinates,
      pendingJoiners: uniqueSelectedFriends,
    };

    axios
      .post(baseUrl + "/events/create", newEvent)
      .then((res) => {
        console.log("event created", res);
        toggleCreateEvent();
        getUserInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //------------------ CREATE NOTIFICATION (maybe)---------------------

  //Fetching user friends + invitelists to populate the dropdown and allow to select friends to invite
  useEffect(() => {
    axios
      .get(baseUrl + `/users/${username}`)
      .then(({ data }) => {
        setDropdownDataFriends(data.friendsConfirmed);
        setInitialDropdownDataLists(data.inviteLists);
        setDropdownDataLists(data.inviteLists);
      })
      .catch((err) => {
        console.log(err);
      });

    // -------------- CONFIGURING GOOGLE MAPS API ---------------
    // const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    // const defaultBounds = {
    //   north: center.lat + 0.1,
    //   south: center.lat - 0.1,
    //   east: center.lng + 0.1,
    //   west: center.lng - 0.1};

    // const input = document.getElementById("location");
    // const autocomplete = new google.maps.places.Autocomplete(input, options);
  }, []);

  return (
    <div id="CreateEvent">
      <h2>Create new event</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input id="title" type="text" className="form-control" value={title} required onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea id="description" className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mb-3 dateTime">
          <label htmlFor="dateTime" className="form-label">
            When?
          </label>
          <input id="dateTime" type="datetime-local" className="form-control" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </div>
        {/* <div className="mb-3">
          <label htmlFor="date" className="form-label">What time?</label>
          <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)}/>
        </div> */}

        {/* Select location, using Google places API */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label location">
            Where?
          </label>
          <AutoComplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS}
            options={{
              componentRestrictions: { country: "es" },
              fields: ["address_components", "geometry", "icon", "name"],
              strictBounds: false,
              types: ["establishment", "geocode"],
            }}
            onPlaceSelected={(place) => {
              setLocation(place.name);
              setLat(place.geometry.location.lat());
              setLng(place.geometry.location.lng());
              console.log("address: ", place);
            }}
            id="location"
          />
        </div>

        {/* <div className="mb-3">
          <label htmlFor="icon" className="form-label">Select icon</label>
          <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)}/>
        </div> */}

        {/* Dropdown to select friends to invite */}

        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Invite friends
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            {dropdownDataFriends.sort(compareFriends).map((item) => (
              <button type="button" className="dropdown-item" key={item._id} onClick={() => handleItemSelectedFriends(item)}>
                {item.username}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown to select friends lists to invite */}
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Invite by circles
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            {dropdownDataLists.map((item) => (
              <button type="button" className="dropdown-item" key={item._id} onClick={() => handleItemSelectedLists(item)}>
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* -------------- display all selected users --------------- */}
        <div>
          <p>selected friends:</p>
          {uniqueSelectedFriends.map((user) => (
            <div key={user._id} style={{ paddingBottom: "5px" }}>
              <div className="btn-group" role="group">
                <button type="button" disabled className="btn btn-outline-dark">
                  {user.username}
                </button>
                <button onClick={() => removeUser(user)} type="button" className="btn btn-outline-danger">
                  x
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --------------- checkbox to invite to invite all friends ----------------- */}
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" onChange={() => setInviteAll(!inviteAll)} />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Invite all your friends
          </label>
        </div>

        {/*--------------- checkbox to allow invited to invite their friends ---------------*/}
        {/* <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Allow your friends to share this event
          </label>
        </div>*/}

        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}
