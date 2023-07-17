import { authContext } from "../contexts/auth.context";
import { useState, useContext} from "react";
import Navbar from "../components/Navbar"

export default function EditProfilePage() {
  const { isLoggedIn, currentUser, loading, baseUrl } = useContext(authContext);

  const [username, setUsername] = useState(currentUser.username);
  const [description, setDescription] = useState(currentUser.description);

  const submitUsername = (e) => {
    e.preventDefault();
const userData = {}


  } 

  return (
  !loading && <div>
    <Navbar/>
    <div><form className="container">
  <div className="mb-3 col-6">
    <label htmlFor="usernameField" className="form-label">Username</label>
    <input type="text" className="form-control" id="usernameField" />
  </div>
  <button onSubmit={submitUsername} type="submit" className="btn btn-primary">Submit</button>
</form></div>
    </div>
  )
}
