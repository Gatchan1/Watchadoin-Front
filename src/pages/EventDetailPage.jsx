import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import GoogleMapReact from "google-map-react";
import "../css/OwnProfile.css"; // I still don't understand why if I don't import this css here it's still applied...

export default function EventDetailPage() {
  const { loading, baseUrl, getHeaders } = useContext(authContext);
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  const AnyReactComponent = () => (
    <div>
      <img style={{ height: "25px" }} src="/marker.png" alt="marker" />
    </div>
  );

  function GoogleMap(coordinates) {
    const defaultProps = {
      center: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      zoom: 14,
    };

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "300px", width: "100%" }}>
        <GoogleMapReact bootstrapURLKeys={{ key: "" }} defaultCenter={defaultProps.center} defaultZoom={defaultProps.zoom}>
          <AnyReactComponent lat={coordinates.lat} lng={coordinates.lng} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }

  useEffect(() => {
    axios
      .get(baseUrl + "/events/" + eventId, getHeaders())
      .then(({ data }) => {
        console.log("response: ", data);
        setEvent(data);
        setLoadingEvent(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);

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
            <div className="invite-users">
            <p>Check out who will be there </p>
              {event.confirmedJoiners.map((joiner) => {
                return (
                  <div className="invite-user" key={joiner._id}>
                    <img className="friend-icon" src={joiner.picture} alt={joiner.username} />
                    <a href={`/${joiner.username}`}> {joiner.username} </a>
                  </div>
                );
              })}

            </div>
            <hr className="invitees"></hr>

            {GoogleMap(event.coordinates)}
          </div>
        </div>
      )}
    </>
  );
}
