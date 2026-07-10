import { FaSpinner } from "react-icons/fa";

export default function Loader() {
  return (
    <div className="loading-wheel-wrapper fade-in">
      <FaSpinner className="loading-wheel" />
      <span className="loading-text">Loading...</span>
    </div>
  );
}
