
const apiURL = "https://api.openweathermap.org";
const apiKey = "105998a52b86441612d8bdd2a88fbd96";
const MAX_DAILY_FORECAST_DAYS = 5;

var locationEl = document.getElementById ('location');
var searchButtonEl = document.getElementById ('search');
var errorEl = document.getElementById ('error');
var forecastDays = document.getElementById ('forecast-days');
var currentWeather = document.getElementById ('weather');


