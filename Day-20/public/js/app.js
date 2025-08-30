let weatherApi = "/weather"
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const weatherIcon = document.querySelector('.weatherIcon i')
const tempElement = document.querySelector('.temperature span')
const weatherCondition = document.querySelector('.weatherCondition')

const locationElement = document.querySelector('.place')
const dateElement = document.querySelector('.date')

const coordinatesElement = document.querySelector('.coordinates')
const feelsTemperatureElement = document.querySelector('.feels-temperature')
const humidityElement = document.querySelector('.humidity')
const pressureElement = document.querySelector('.pressure')
const windSpeedElement = document.querySelector('.wind-speed')
const countryCodeElement = document.querySelector('.country-code')

const mapElement = document.querySelector('#map')

function updateDate() {
    const currentDate = new Date();
    const options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
    const formattedDate = currentDate.toLocaleString("en-US", options);
    dateElement.textContent = formattedDate;
}

// Initial call to update date
updateDate();

// Update the date every second
setInterval(updateDate, 1000);

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault()
    // console.log(search.value)
    locationElement.textContent = "Loading.."
    weatherIcon.className = ""
    tempElement.textContent = ""
    weatherCondition.textContent = ""

    mapElement.textContent = ""

    coordinatesElement.textContent = ""
    feelsTemperatureElement.textContent = ""
    humidityElement.textContent = ""
    pressureElement.textContent = ""
    windSpeedElement.textContent = ""
    countryCodeElement.textContent = ""

    aqiValueElement.textContent = "";

    showData(search.value)
})

function showData(city) {
    getWeatherData(city, (result) => {
        // console.log(result)
        if (result.cod == 200) {
            console.log(result)
            fetchAQIData(result.coord.lat, result.coord.lon);
            if (result.weather[0].description == "rain" || result.weather[0].description == "fog") {
                weatherIcon.className = "wi wi-day-" + result.weather[0].description
            }
            else {
                weatherIcon.className = "wi wi-day-cloudy"
            }

            locationElement.textContent = result?.name
            tempElement.textContent = (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176)
            weatherCondition.textContent = result?.weather[0]?.description?.toUpperCase()

            //other detail
            coordinatesElement.textContent = `Lat: ${result?.coord?.lat} Lon: ${result?.coord?.lon}`
            feelsTemperatureElement.textContent = `Feels like: ${(result?.main?.feels_like - 273.5).toFixed(2)}`
            humidityElement.textContent = `Humidity: ${result?.main?.humidity}`
            pressureElement.textContent = `Pressure: ${result?.main?.pressure}`
            windSpeedElement.textContent = `Wind Speed: ${result?.wind?.speed}`
            countryCodeElement.textContent = `Country Code: ${result?.sys?.country}`;


            updateMap(result.coord.lat, result.coord.lon);
            fetchNewsDataFromServer(city);
            fetchAQIData(result.coord.lat, result.coord.lon);
            // fetchAQIDataFromServer(result.coord.lat, result.coord.lon);
        }
        else {
            locationElement.textContent = "City not founded"
        }
    })
}

function getWeatherData(city, callback) {
    const locationApi = weatherApi + "?address=" + city
    fetch(locationApi).then((response) => {
        response.json().then((response) => {
            callback(response)
        })
    })
}


let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.5085, lng: -0.1257 }, // Default coordinates
        zoom: 8
    });
}

function updateMap(lat, lng) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng }, // Default coordinates
        zoom: 8
    });
}



// AQI - Air pollution data
const aqiApiToken = 'bfb7763c4f933375bf1088f0a3d53c2f';

// Assuming you have an element with the class 'aqi-value' in your HTML
const aqiValueElement = document.querySelector('.aqi-value');

function fetchAQIData(lat, lon) {
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=bfb7763c4f933375bf1088f0a3d53c2f`;

    fetch(aqiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data?.list && data.list.length > 0) {
                const aqi = data.list[0].main.aqi;
                aqiValueElement.textContent = `AQI: ${aqi} - ${determineAirQuality(aqi)}`;
            } else {
                aqiValueElement.textContent = 'AQI data not available';
            }
        })
        .catch((error) => {
            console.error('Error fetching AQI data:', error);
            aqiValueElement.textContent = 'Error fetching AQI data';
        });
}

function determineAirQuality(aqi) {
    if (aqi == 1) return 'Good';
    if (aqi == 2) return 'Fair';
    if (aqi == 3) return 'Moderate';
    if (aqi == 4) return 'Unhealthy';
    if (aqi == 5) return 'Very Unhealthy';
    return 'Hazardous';
}



// news
const fetchNews = async () => {
    console.log("Fetching news...");

    // Assuming sources.json is in the same directory as your HTML file
    const response = await fetch('/js/sources.json');
    const data = await response.json();

    let str = "";
    for (let i = 0; i < data.articles.length; i++) {
        const item = data.articles[i];
        str += `<div class="news-card">
                    <div class="card my-4 mx-2" style="width: 18rem;">
                        <img src="${item.urlToImage}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <a href="${item.url}" target="_blank" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                </div>`;
    }

    // Wrap the news cards in a container with horizontal scroll
    const newsContainer = document.querySelector("#news-container");
    newsContainer.innerHTML = `<div class="news-scroll-container">${str}</div>`;
}

// Call the fetchNews function
fetchNews();



// quotes
async function fetchRandomQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const quote = await response.json();

        // Output the quote and author name
        const quoteContainer = document.getElementById('quote-container');
        quoteContainer.innerHTML = `<p>${quote.content}</p><p>- ${quote.author}</p>`;
    } catch (error) {
        console.error('Error fetching random quote:', error);
    }
}

// an event listener to the button or section you added in the HTML
document.querySelector('button').addEventListener('click', fetchRandomQuote);

document.querySelector('.quote-button').addEventListener('click', function () {
    fetchRandomQuote();
    toggleQuoteContainer();
});

// this function to toggle the visibility of the quote container
function toggleQuoteContainer() {
    const quoteContainer = document.getElementById('quote-container');
    if (quoteContainer.style.display === 'block') {
        quoteContainer.style.display = 'none';
    } else {
        quoteContainer.style.display = 'block';
    }
}