import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // You can keep this for extra custom styles if needed

const RainfallPrediction = () => {
  const [formData, setFormData] = useState({
    cloud: "",
    humidity: "",
    windspeed: "",
    dewpoint: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch(
        "https://rainfall-prediction-hrd3.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setPrediction(data.prediction || "No prediction available.");
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction.");
    }
    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: 500, backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderRadius: "15px" }}>
        <h2 className="text-center mb-4">🌦️ Rainfall Prediction</h2>

        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="form-control"
                placeholder={`Eg.Enter 55`}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Predict
          </button>
        </form>

        {loading && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {prediction && (
          <div className={`alert mt-3 ${prediction.includes("Error") ? "alert-danger" : "alert-success"}`} role="alert">
            {prediction}
          </div>
        )}
      </div>
    </div>
  );
};

export default RainfallPrediction;
