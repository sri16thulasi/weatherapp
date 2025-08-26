import React from "react";
import "./WeatherCard.css";

const WeatherCard = ({ data, unit }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <div className="weather-card">
      <h2>
        {data.name}, {data.sys.country}
      </h2>
      <img src={iconUrl} alt="weather icon" />
      <h3>
        {data.weather[0].main} - {data.weather[0].description}
      </h3>
      <p>🌡 Temp: {data.main.temp}°{unit === "metric" ? "C" : "F"}</p>
      <p>💧 Humidity: {data.main.humidity}%</p>
      <p>🌬 Wind: {data.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
    </div>
  );
};

export default WeatherCard;
