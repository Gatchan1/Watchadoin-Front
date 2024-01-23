import "../css/ErrorPage.css";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => { // Return callback to run on unmount.
      window.clearInterval(timeoutId);
    };
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
