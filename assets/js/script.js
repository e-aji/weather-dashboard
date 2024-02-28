const apiKey = "105998a52b86441612d8bdd2a88fbd96";

var locationEl = document.querySelector("#location");
var searchEl = document.querySelector("#search");
var forecastDaysDivEl = document.querySelector("#forecast-days");
var forecastDayDivEl = document.querySelector("#forecast-day");

function saveSearchedLocation(location) {

    const location = JSON.parse(localStorage.getItem("location")) || [];
    location.push(location);
    localStorage.setItem("location", JSON.stringify(locations));
}

function loadSearchedLocations() {
    
    const location = JSON.parse(localStorage.getItem("location")) || [];

    location.forEach((location) => {
      getCurrentWeather(location);
    });
}

function onClickSearch() {

    const locationName = locationEl.value.trim();

  if (!locationName) return;

  const apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`;

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length)
        return alert(`There are no coordinates for ${locationName}`);
      const { name, lat, lon } = data[0];
      getCurrentWeather(name, lat, lon);
      saveSearchedLocation(locationName);
    })
    .catch((error) => {
      console.log("There has been an error!");
    });
}

function getCurrentWeather(locationName, lat, lon) {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      var dailyForecastDays = [];

      // Set to give one forecast per day
      var fiveDayForecast = data.list.filter((forecast) => {
        var forecastDays = new Date(forecast.dt_txt).getDay();
        if (!dailyForecastDays.includes(forecastDays)) {
          return dailyForecastDays.push(forecastDays);
        }
      });

      locationEl.value = "";
      forecastDaysDivEl.innerHTML = "";
      forecastDayDivEl.innerHTML = "";

      fiveDayForecast.forEach((weatherData, index) => {
        if (index === 0) {
          forecastDaysDivEl.insertAdjacentHTML(
            "beforeend",
            displayWeatherForecast(locationName, weatherData, index)
          );
        } else {
          forecastDayDivEl.insertAdjacentHTML(
            "beforeend",
            displayWeatherForecast(locationName, weatherData, index)
          );
        }
      });
    })
    .catch((error) => {
      console.log("There has been an error!");
    });
}

function displayWeatherForecast(location, weatherData, index) {
  if (index === 0) {
    return `<div id="weather">
    <div class="weather-location" id="location-name"> ${location} (${weatherData.dt_txt.split(
      " "
    )[0]}) </div>
    <div class="weather-icon">
    <img src="https://openweathermap.org/img/wn/${
      weatherData.weather[0].icon
    }@2x.png" alt="weather icon">
    </div>
        <div class="weather-info">
            <div class="temperature">
                <span> Temperature: </span>
                <span class="temp_value"> ${
                  (weatherData.main.temp - 273.15).toFixed(2)
                }°C </span>
            </div>
            <div class="wind">
                <span> Wind: </span>
                <span class="wind_value"> ${weatherData.wind.speed} MPH </span>
            </div>
            <div class="humidity">
                <span> Humidity: </span>
                <span class="humidity_value"> ${
                  weatherData.main.humidity
                } % </span>
            </div>
        </div>
    </div>`;
  } else {
    return `<li class="forecast-value">
    <h3>(${weatherData.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${
      weatherData.weather[0].icon
    }@2x.png" alt="weather icon">
    <h4>Temp: ${(weatherData.main.temp - 273.15).toFixed(2)} °C</h4>
    <h4>Wind: ${weatherData.wind.speed} MPH</h4>
    <h4>Humidity: ${weatherData.main.humidity} %</h4>
    </li>`;
  }
}

loadSearchedLocations();

searchEl.addEventListener("click", onClickSearch);

