import { useState } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/currentWeather/currentWeather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(
    JSON.parse(localStorage.getItem("currentWeather")) || null
  );
  const [forecast, setForecast] = useState(
    JSON.parse(localStorage.getItem("forecast")) || null
  );

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        localStorage.setItem(
          "currentWeather",
          JSON.stringify({ city: searchData.label, ...weatherResponse })
        );

        localStorage.setItem(
          "forecast",
          JSON.stringify(forcastResponse["list"])
        );

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast(forcastResponse["list"]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
