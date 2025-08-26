import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const API_KEY = "421f2a40d91722a99ea946935931b30d"; 
function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    });
  }, []);

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError("");
      fetchForecast(city);
    } catch (err) {
      setError("City not found");
      setWeatherData(null);
      setForecast([]);
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setCity(response.data.name);
      setError("");
      fetchForecast(response.data.name);
    } catch (err) {
      setError("Unable to fetch location weather.");
      setWeatherData(null);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const dailyData = res.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);
    } catch (err) {
      console.error("Forecast fetch error", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") getWeather();
  };

  return (
    <div className="app">
      <h1>🌦️ Weather Dashboard</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}
      {weatherData && <WeatherCard data={weatherData} />}

      {forecast.length > 0 && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <h4>{new Date(day.dt_txt).toDateString()}</h4>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="icon"
                />
                <p>{day.weather[0].main}</p>
                <p>{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
