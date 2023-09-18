import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/OwnProfile.css"; // I still don't quite understand why if I don't import this css here it's still applied...
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

export default function EventDetailPage() {
  const { loading, baseUrl, getHeaders } = useContext(authContext);
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    axios
      .get(baseUrl + "/events/" + eventId, getHeaders())
      .then(({ data }) => {
        console.log("response: ", data);
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
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;
    if (lat && lng) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });

      new mapboxgl.Marker().setLngLat({ lng, lat }).addTo(map.current);
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }
  }, [loadingEvent])

  return (
    <>
      {!loading && !loadingEvent && (
        <div>
          <Navbar />
          <hr></hr>
          <div>
            <div className="event-main">
              <div className="event-creator">
                <p>Organized by</p>
                <img className="medium-size-avatar" src={event.creator.picture} alt={event.creator.username} />
                <p className="event-creator-name">{event.creator.username}</p>
              </div>
              <div className="event-body">
                <p className="event-title">{event.title}</p>
                <p className="event-description">{event.description}</p>
                <p className="event-description">{new Date(event.dateTime).toLocaleString()}</p>
              </div>
            </div>
            <hr className="invitees"></hr>
            <div className="row-of-friends">
              <p>Check out who will be there: </p>
              {event.confirmedJoiners.map((joiner) => {
                return (
                  <div className="friend-icon-container" key={joiner._id}>
                    <img className="friend-icon" src={joiner.picture} alt={joiner.username} />
                    <a href={`/${joiner.username}`}> {joiner.username} </a>
                  </div>
                );
              })}
            </div>
            <hr className="invitees"></hr>

            {lat && <div ref={mapContainer} className="map-container" />}
          </div>
        </div>
      )}
    </>
  );
}
