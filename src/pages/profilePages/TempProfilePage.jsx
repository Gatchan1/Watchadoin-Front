import { Navigate, useParams} from "react-router-dom";

export default function TempProfilePage() {
  const { username } = useParams();

  //This page function is unmount current profile page, so that the new mount will go through "profilepage" from scratch.
  //(Otherwise it just didn't work, bc once it was set as "own profile" or "external profile" it just stayed that way)
  return (
    <Navigate to={`/${username}`}/>
  );
}
