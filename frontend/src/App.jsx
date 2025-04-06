import React, { useState } from "react";
import "./App.css";

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
    try {
      const response = await 
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2 className="title">Rainfall Prediction</h2>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="input"
            required
          />
        ))}
        <button type="submit" className="button">Predict</button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {prediction !== null && <p className="prediction">Prediction: {prediction}</p>}
    </div>
  );
};

export default RainfallPrediction;