import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useRef, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/OwnProfile.css"; // I still don't quite understand why if I don't import this css here it's still applied...
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

export default function EventDetailPage() {
  const { loading, isLoggedIn, baseUrl, getHeaders } = useContext(authContext);
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    axios
      .get(baseUrl + "/events/" + eventId, getHeaders())
      .then(({ data }) => {
        setEvent(data);
        setLoadingEvent(false);
        setLat(data.coordinates.lat);
        setLng(data.coordinates.lng);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);

  useEffect(() => {
    if (!loadingEvent)
      setTimeout(() => {
        setLoadingSpinner(false);
      }, 500);
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;
    if (lat && lng && !loadingSpinner) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });

      new mapboxgl.Marker().setLngLat({ lng, lat }).addTo(map.current);
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }
  }, [loadingEvent, loadingSpinner]);

  if (!loading && !isLoggedIn) return <Navigate to="/signup" />;

  return (
    <div className="anti-footer">
      {!loading && <Navbar />}

      {loadingSpinner ? (
        <div className="spinnerContainer">
          <span className="spinner" role="status"></span>
        </div>
      ) : (
        <div id="EventDetailPage">
          <div>
            <div className="event-main">
              <div className="event-creator">
                <p className="organized">Organizer:</p>
                <img className="medium-size-avatar" src={event.creator.picture} alt={event.creator.username} />
                <p className="event-creator-name">{event.creator.username}</p>
              </div>
              <div className="event-body">
                <p className="event-title">{event.title}</p>
                <p className="event-description">{event.description}</p>
                <p className="event-description">{new Date(event.dateTime).toLocaleString()}</p>
              </div>
            </div>
            <div className="row-of-friends">
              <p>Check out who will be there: </p>
              <div className="row-no-outline">
                  <div className="friend-icon-container" key={event.creator._id}>
                    <img className="friend-icon" src={event.creator.picture} alt={event.creator.username} />
                    <Link className="link-styled" to={`/${event.creator.username}`}>
                      {event.creator.username}
                    </Link>
                  </div>
                {event.confirmedJoiners[0] &&
                  event.confirmedJoiners.map((joiner) => {
                    return (
                      <div className="friend-icon-container" key={joiner._id}>
                        <img className="friend-icon" src={joiner.picture} alt={joiner.username} />
                        <Link className="link-styled" to={`/${joiner.username}`}>
                          {joiner.username}
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>

            {lat && <div ref={mapContainer} className="map-container" />}
            <button className="return" onClick={() => history.back()}>
              ↩️ <span>Go back</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
