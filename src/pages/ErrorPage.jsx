import "../css/ErrorPage.css";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 5000);
  }, []);

  return (
    <div id="ErrorPage" className="anti-footer">
      <p>
        <strong>Oops, nothing to see here!</strong>
      </p>
      <p>
        Click <Link to="/">here</Link> to return to the homepage.
      </p>
      <p>You&apos;ll be redirected there in 5 seconds anyway.</p>
    </div>
  );
}
