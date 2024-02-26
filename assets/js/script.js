
const WEATHER_API_BASE_URL = "https://api.openweathermap.org";
const WEATHER_API_KEY = "105998a52b86441612d8bdd2a88fbd96";
const MAX_DAIRY_FORECAST_DAYS = 5;

var locationEl = document.getElementById ('location');
var searchButtonEl = document.getElementById ('search');

function onClickSearch(){

    console.log ("search button clicked");
    
    var locationName = locationEl.value;
    if (locationName) {

        lookUpLocation(locationName); 
    } else {
        console.log ("Please enter a location");
    }
}

function lookUpLocation(locationName){
    
    // query API to get location data

    // extract the lat and long from the response

    // update the UI with location name

    // query API to get weather data passing lat and long of location

    // display current weather data

    displayCurrentWeather (weatherData);


    // display 5 day weather forecast

    displayWeatherForecast (weatherData.forecast);

    // save to local storage 

    console.log ('lookUpLocation');
}


function displayCurrentWeather(weatherData){
    const currentWeather = weatherData.current;

    document.getElementById('temp_value').textContent = '${currentWeather.temp}°C';

    document.getElementById('wind_value').textContent = '${currentWeather.wind_speed}mph';
    
    document.getElementById('humidity_value').textContent = '${currentWeather.humidity}%';

    document.getElementById('uv_value').textContent = '${currentWeather.uvi}';

}

function displayWeatherForecast(weatherData){

    for (let i = 0; i < MAX_DAIRY_FORECAST_DAYS; i++) {
        const dailyForecast = dailyData[i];
        console.log(dailyForecast);


        const listItem = document.createElement('li');
        listItem.classList.add('forecast-item');
        listItem.innerHTML = `

            <div class='forecast-day'>$(day)</div>
            <div class="forecast-temp">$(temp)</div>
            <div class="forecast-humidity">$(humidity)</div>
            <div class="forecast-wind">$(wind)</div>
        `;

            forecastList.appendChild(listItem);

    }

}

function loadFromLocalStorage(){




    
}











searchButtonEl.addEventListener ('click', onClickSearch);

