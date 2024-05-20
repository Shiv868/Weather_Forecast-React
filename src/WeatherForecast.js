import React, { useState } from 'react';
import axios from 'axios';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);

  const fetchForecast = async () => {
    const apiKey = '0b23aa8f5a953ca35026d4fa45aa270e';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      setForecast(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setForecast(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchForecast();
  };

  const getDailyForecast = (data) => {
    const dailyData = {};

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    return Object.keys(dailyData).map(date => {
      const dayData = dailyData[date];
      const avgTemp = (dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length).toFixed(2);
      const description = dayData[0].weather[0].description;
      const humidity = (dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length).toFixed(2);
      const windSpeed = (dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length).toFixed(2);

      return {
        date,
        avgTemp,
        description,
        humidity,
        windSpeed
      };
    });
  };

  return (
    <div className="weather-container">
      <h1 className="title">Weather Forecast</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {forecast && (
        <div className="forecast-container">
          <h2 className="city-name">Weekly Forecast for {forecast.city.name}</h2>
          <div className="forecast-list">
            {getDailyForecast(forecast).map((weather, index) => (
              <div key={index} className="forecast-item">
                <p className="forecast-date">{weather.date}</p>
                <p className="forecast-description">{weather.description}</p>
                <p className="forecast-temp">Avg Temp: {weather.avgTemp} °C</p>
                <p className="forecast-humidity">Avg Humidity: {weather.humidity} %</p>
                <p className="forecast-wind">Avg Wind Speed: {weather.windSpeed} m/s</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
