import PropTypes from 'prop-types';  
import "../css/OwnProfile.css";

export default function AlertModal({ message, setError }) {
  const dismissErrorHandler = () => {
    setError("");
  };

  return (
    <div id="Alert">
      <p>{message}</p>
      <button type="button" className="btn btn-outline-dark" onClick={dismissErrorHandler}>
        Okay
      </button>
    </div>
  );
}

AlertModal.propTypes = {
  message: PropTypes.string,
  setError: PropTypes.func
}