import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function EditProfilePage() {
  const { currentUser, loading, isLoggedIn, baseUrl, getUserInfo, getHeaders } = useContext(authContext);
  const { username } = useParams();

  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [loadingPic, setLoadingPic] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (username !== currentUser.username) {
      navigate(`/${username}`);
    }
  }, []);

  const uploadImage = (e) => {
    setMessage("");
    e.preventDefault();
    let imageUrl;
    setLoadingPic(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "watchadoin");
    data.append("cloud_name", "dqzjo5wsl");
    fetch("https://api.cloudinary.com/v1_1/dqzjo5wsl/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => (imageUrl = data.url))
      .then(() => {
        return axios.post(baseUrl + "/users/" + currentUser._id + "/edit", { imageUrl: imageUrl }, getHeaders(), { new: true });
      })
      .then((resp) => {
        console.log("picture updated:", resp.data);
        getUserInfo();
        setLoadingPic(false);
        setMessage("Your profile image has been changed ✔️");
      })
      .catch((err) => console.log(err));
  };

  if (!loading && !isLoggedIn) return <Navigate to="/signup" />;

  return (
    !loading &&
    username === currentUser.username && (
      <div id="EditProfilePage" className="anti-footer">
        <Navbar />
        <div>
          <form className="container">
            <div className="mb-3 update-picture">
              <input onChange={(e) => setImage(e.target.files[0])} type="file" className="form-control" />
            </div>
            {message && <p className="goodMessage">{message}</p>}
            {loadingPic && <p>Image is loading.....</p>}
            <button onClick={uploadImage} type="submit" className="btn btn-primary">
              Upload image
            </button>
            <button
              onClick={() => {
                navigate(`/${currentUser.username}`);
              }}
              type="button"
              className="btn btn-secondary"
            >
              Go back
            </button>
          </form>
        </div>
      </div>
    )
  );
}
