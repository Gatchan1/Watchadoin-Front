import { authContext } from "../../contexts/auth.context";
import { Navigate, useParams} from "react-router-dom";
import { useContext, useEffect } from "react";

export default function TempProfilePage() {
  const { username } = useParams();
  const { loading, } = useContext(authContext);

  // Retrieve current user data at mounting phase.
  useEffect(() => {
  return <Navigate to={`/${username}`}/>
  }, [loading]);

  return (
    <div>
    </div>
  );
}
