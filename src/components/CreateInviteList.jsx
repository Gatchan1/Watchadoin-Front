import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import Alert from "../components/Alert";
import Select from "react-select";

export default function CreateInviteList() {
  const { currentUser, baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  const [title, setTitle] = useState("");
  const [users, setUsers] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [error, setError] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (title === "" || users === null || users.length === 0) {
      setError("Please fill in both fields");
      return;
    }
    const newList = {
      title,
      users,
    };

    axios
      .post(baseUrl + "/lists/create", newList, getHeaders())
      .then(() => {
        getUserInfo();
      })
      .then(() => {
        setSelectedOptions(null);
        setTitle("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (selectedOptions) {
      const newUsers = selectedOptions.map((friend) => {
        return friend.value;
      });
      setUsers(newUsers);
    }
  }, [selectedOptions]);

  const options = currentUser.friendsConfirmed.map((friend) => {
    return { value: friend._id, label: friend.username };
  });

  return (
    <div id="CreateInviteList" className="blue-bg">
      <form onSubmit={submitHandler} className="container">
        {error != "" && <Alert message={error} setError={setError} />}
        <div className="max-size">
          <label htmlFor="title" className="form-label">
            Title of the Friends Circle:
          </label>
          <input className="form-control" type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="max-size">
          <label className="form-label">Add Friends:</label>
          <Select value={selectedOptions} closeMenuOnSelect={false} onChange={setSelectedOptions} options={options} isMulti={true} />
        </div>
        <div className="btn-container">
          <button type="submit" className="btn btn-primary">
            Create new Friends Circle
          </button>
        </div>
      </form>
    </div>
  );
}
