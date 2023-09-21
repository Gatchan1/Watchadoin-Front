import { Navigate, useParams} from "react-router-dom";

export default function TempProfilePage() {
  const { username } = useParams();

  return (
    <Navigate to={`/${username}`}/>
  );
}
