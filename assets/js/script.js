// API key to access OpenWeather API

const apiKey = "105998a52b86441612d8bdd2a88fbd96";

// Base URL for OpenWeather API weather icon images 
const imgUrl = "http://openweathermap.org/img/wn/";

var locationNameEl = document.querySelector("#location-name");
var locationDisplayEl = document.querySelector("#location-display");

var searchEl = document.querySelector("#search");
var weatherEl = document.querySelector("#weather"); 
var clearSearchEl = document.querySelector("#clear-search");
var recentLocationsDivEl = document.querySelector("#recent-locations"); 
var forecastCardEl = document.querySelector('#forecast-card');

// Initially hide the forecast element

document.getElementById("forecast").style.display = "none";

// Function to handle search button click 
function onClickSearch(){
  
  var locationName = locationNameEl.value.trim();
  if (locationName) {
      getCurrentWeather (locationName);
  } else {
      alert ("Please enter a location");
  }

  saveLocation(locationName);
  displayWeather(locationName);
};

// Function to save searched locations in local storage
function saveLocation (locationName){

  const recentLocations = JSON.parse(localStorage.getItem("location-name")) || [];
  recentLocations.push(locationName);
  localStorage.setItem("location-name", JSON.stringify(recentLocations));

};

// Function to get current weather from API
function getCurrentWeather (locationName){

  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&units=imperial&appid=${apiKey}`;

      fetch(apiURL).then(function (response) {
      response.json().then(function (data) {

        displayWeather(data);
        const lon = data.coord.lon;
        const lat = data.coord.lat;

        getFiveDay(lat, lon);

      });
    });
};

// Function to display current weather data
function displayWeather (data) {
  
  var celsiusTemperature = (data.main.temp - 32) * 5/9; // convert temperature from fahrenheit to celsius
  var mphWindSpeed = data.wind.speed * 2.23694; // convert meters per second to miles per hour

  const timeStamp = data.dt * 1000; // convert unix timestamp to milliseconds

  const todaysDate = new Date(timeStamp).toLocaleDateString();

  document.getElementById("location-display").textContent = `${data.name} (${todaysDate})`;
  document.getElementById("weather-icon").src = `${data.image}`;
  document.getElementById("temp_value").textContent = `${celsiusTemperature.toFixed(2)} °C`; // convert temperature to Celsius and round to 2 decimal places
  document.getElementById("wind_value").textContent = `${mphWindSpeed.toFixed(2)} MPH`; // convert wind speed to mph and round to 2 decimal places
  document.getElementById("humidity_value").textContent = `${data.main.humidity} %`;
}
 
// Function to get 5-day forecast data and display it in forecast cards
function getFiveDay (lat, lon) {

  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {

        document.getElementById("forecast").style.display = "block"; // show the forecast element on webpage
      
        const fiveDayArray = data.list.filter(day => day.dt_txt.includes("12:00:00")); 
      
        let forecastCards = "" ;
      
          for (var i = 0; i < fiveDayArray.length; i++) {
      
            const timeStamp = fiveDayArray[i].dt * 1000;
            var weatherDetails = {
              date: new Date(timeStamp).toLocaleDateString(),
              temperature: data.list[i].main.temp,
              wind: data.list[i].wind.speed,
              humidity: data.list[i].main.humidity,
              image: imgUrl + data.list[i].weather[0].icon + ".png",
            };
      
            forecastCards += `
              <div class="forecast-value">
                <h3>${weatherDetails.date}</h3>
                <img src="${weatherDetails.image}" alt="Weather Icon">
                <h4>Temp: ${weatherDetails.temperature}°C</h4>
                <h4>Wind: ${weatherDetails.wind} MPH</h4>
                <h4>Humidity: ${weatherDetails.humidity}%</h4>
              </div>
            `;
      
            forecastCardEl.innerHTML = forecastCards;
          }; 
    });
};

// Function to load searched locations from local storage and display them on webpage
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
};


// Function to clear search list from local storage and webpage
function clearSearchList () {

  localStorage.removeItem("location-name");
  const recentLocationsDivEl = document.querySelector("#recent-locations"); 
  recentLocationsDivEl.innerHTML = ""; 
};

// Function to handle click on recent locations
function onClickRecentLocation (event) {
  var locationName = event.target.textContent;
  getCurrentWeather (locationName);
};

// Load searched locations from local storage when page refreshed
loadSearchedLocations ();

// Event listener for search button click

searchEl.addEventListener("click", onClickSearch)

// Event listener for clear search button click

clearSearchEl.addEventListener("click", clearSearchList)
