const apiKey = "105998a52b86441612d8bdd2a88fbd96";

var locationNameEl = document.querySelector("#location-name");
var searchEl = document.querySelector("#search");
var forecastDaysEl = document.querySelector("#forecast-days");
var forecastDayEl = document.querySelector(".forecast-day"); 
var weatherEl = document.querySelector("#weather"); 
var clearSearchEl = document.querySelector("#clear-search");

var recentLocationsDivEl = document.querySelector("#recent-locations"); 

const MAX_DAILY_FORECAST_DAYS = 5;

function onClickSearch(event){
  
  event.preventDefault();

  var locationName = locationNameEl.value.trim();
  if (locationName) {

      getCurrentWeather (locationName);
  } else {
      alert ("Please enter a location");
  }

  saveLocation(locationName);
  getCurrentWeather(locationName); 
};

function saveLocation (locationName){

  const recentLocations = JSON.parse(localStorage.getItem("location-name")) || [];
  recentLocations.push(locationName);
  localStorage.setItem("location-name", JSON.stringify(recentLocations));

};

function getCurrentWeather (locationName, lat, lon){
  
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiURL)
  .then((response) => response.json()) .then((data) => {
    if (!data.length)
      return alert(`There are no coordinates for ${locationName}`);
    const {main, wind } = data[0];
    displayCurrentWeather({temp: main.temp, wind_speed: wind.speed, humidity: main.humidity});

  });
}

function displayCurrentWeather () {

  const currentWeather = weatherData.current;

  weatherEl.textContent = "";

  document.getElementById('temp_value').textContent = `${weatherData.temp} °C`;
  document.getElementById('wind_value').textContent = `${weatherData.wind_speed} MPH`;
  document.getElementById('humidity_value').textContent = `${weatherData.humidity} %`;

}

function display5DayForecast (weatherData) {

  for (let i = 0; i < MAX_DAILY_FORECAST_DAYS; i++) {
      const dailyForecast = dailyData[i];
      console.log(dailyForecast);


      const listItem = document.createElement('li');
      listItem.classList.add('forecast-value');
      listItem.innerHTML = `

        <h3>${dailyForecast.day}</h3>
        <img src="${dailyForecast.weatherIcon}" alt="Weather icon">
        <h4>Temp: ${dailyForecast.temperature}°C</h4>
        <h4>Wind: ${dailyForecast.wind} MPH</h4>
        <h4>Humidity: ${dailyForecast.humidity}%</h4>

      `
      forecastDayEl.appendChild(listItem);
      
  }
}

function loadSearchedLocations() {
  const recentLocations = JSON.parse(localStorage.getItem("location-name")) || [];
  const recentLocationsDivEl = document.querySelector("#recent-locations");
  recentLocationsDivEl.innerHTML = ""; 

  recentLocations.forEach((item) => {
    var newLocation = document.createElement("button");
    newLocation.textContent = item;
    newLocation.classList.add("btn");
    newLocation.onclick = onClickRecentLocation;

    recentLocationsDivEl.appendChild(newLocation);
  });
}

function clearSearchList () {

  localStorage.removeItem("location-name");
  const recentLocationsDivEl = document.querySelector("#recent-locations"); 
  recentLocationsDivEl.innerHTML = ""; 
}

function onClickRecentLocation (event) {
  var locationName = event.target.textContent;
  getCurrentWeather (locationName);
}

loadSearchedLocations ();

searchEl.addEventListener("click", onClickSearch)

clearSearchEl.addEventListener("click", clearSearchList)
