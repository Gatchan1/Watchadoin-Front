import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";

export default function EditProfilePage() {
  const { isLoggedIn, currentUser, loading, baseUrl, getUserInfo } = useContext(authContext);
  const { username } = useParams();

  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [loadingPic, setLoadingPic] = useState(false)

  useEffect(() => {
    if (username !== currentUser.username) {
      navigate(`/${username}`);
    }
  }, []);

  const uploadImage = (e) => {
    e.preventDefault();
    let imageUrl
    setLoadingPic(true)
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "watchadoin")
    data.append("cloud_name","dqzjo5wsl")
    fetch("https://api.cloudinary.com/v1_1/dqzjo5wsl/image/upload",{
    method:"post",
    body: data
    })
    .then(resp => resp.json())
    .then(data => {
      console.log("image should be uploaded: ", data.url)
      imageUrl = data.url
    })
    .then(() => {
      console.log("imageUrl:", imageUrl)
      return axios.post(baseUrl + "/users/" + currentUser._id + "/edit", {imageUrl: imageUrl}, {new: true})
    })
    .then(( resp ) => {
      console.log("imagen actualizada:", resp);
      getUserInfo();
      setLoadingPic(false)
    })
    .catch(err => console.log(err))
    }


/*   const handleFileUpload = (e) => {
    e.preventDefault();

    const uploadData = new FormData(); 
    uploadData.append("picture", file);
    
    //service //call to axios
    axios
      .post(baseUrl + "/users/upload", uploadData)
      .then((response) => {
        console.log("response is: ", response);
        // response carries "fileUrl" which we can use to update the state
        setFile(response.data.fileUrl);
        setLoadingPic(false);
      })
      .catch((err) => console.log("Error while uploading the file: ", err));    
  }; */


  return (
    !loading &&
    username === currentUser.username && (
      <div>
        <Navbar />
        <div>
          <form className="container">
            <div className="mb-3 col-6">
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" className="form-control" />
            </div>
            {loadingPic && <p>Image is loading.....</p>}
            <button onClick={uploadImage} type="submit" className="btn btn-primary">
              Upload image
            </button>
            <button
              onClick={() => {
                navigate(`/${currentUser.username}`);
              }}
              type="submit"
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
