import "../css/CalendarPage.css";
import "../../src/index.css";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import ConfirmedEvents from "../components/ConfirmedEvents";
import AvailableEvents from "../components/AvailableEvents";

export default function CalendarPage() {
  const { loading, isLoggedIn, user, getUserInfo, loadingPopulated } = useContext(authContext);
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  useEffect(() => {
    getUserInfo();
    if (!loading)
      setTimeout(() => {
        setLoadingSpinner(false);
      }, 500);
  }, [loading]);

  // takes a Date object as parameter.
  // returns a string in this format "2023-11-26".
  function simpleDate(date) {
    const fixedDate = new Date(date - date.getTimezoneOffset() * 60000);
    const stringDate = fixedDate.toISOString().slice(0, 10);
    return stringDate;
  }

  if (!loading && !isLoggedIn) return <Navigate to="/signup" />;

  return (
    <div id="CalendarPage" className="anti-footer">
      {loadingSpinner ? (
        <div className="spinnerContainer">
          <span className="spinner" role="status"></span>
        </div>
      ) : (
        <>
          {!loading && isLoggedIn && (
            <div>
              <Navbar />
              <header className="tabs">
                <div></div>
                <Link className="tab active">Calendar</Link>
                <div></div>
                <Link to={user.username} className="tab inactive">
                  Main Hub
                </Link>
                <div></div>
              </header>
              {!loadingPopulated && <Calendar simpleDate={simpleDate}/>}
              <div className="calendarComponents">
                <div className="row1">{!loadingPopulated && <ConfirmedEvents simpleDate={simpleDate}/>}</div>
                <div className="row2">{!loadingPopulated && <AvailableEvents simpleDate={simpleDate}/>}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
