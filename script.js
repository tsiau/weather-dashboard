document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "d628931054def83e2edcf24143664d6c"; // API key
    const cityForm = document.getElementById("city-form");
    const cityInput = document.getElementById("city-input");
    const weatherInfo = document.getElementById("weather-info");
    const searchHistory = document.getElementById("search-history");
    const searchHistoryKey = "searchHistory";

    async function getWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather data: ", error);
            return null;
        }
    }

    function displayWeather(data) {
        const cityName = data.name;
        const date = new Date(data.dt * 1000);
        const icon = data.weather[0].icon;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
    
        const weatherHTML = `
            <h2>${cityName}</h2>
            <p>Date: ${date.toDateString()}</p>
            <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${Math.round(temperature - 273.15)}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    
        weatherInfo.innerHTML = weatherHTML; // This line is causing the error
        updateBackgroundImage(data.weather[0].main.toLowerCase());
    }    

    cityForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            const weatherData = await getWeatherData(city);
            if (weatherData) {
                displayWeather(weatherData);
                let history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
                history.push(city);
                localStorage.setItem(searchHistoryKey, JSON.stringify(history));
                displaySearchHistory();
            }
        }
    });

    function displaySearchHistory() {
        const history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
        const historyListHTML = `
            <h3>Search History</h3>
            <ul>
                ${history.map(city => `<li><a href="#" class="search-history-item">${city}</a></li>`).join('')}
            </ul>
        `;

        searchHistory.innerHTML = historyListHTML;

        const searchHistoryItems = document.querySelectorAll(".search-history-item");
        searchHistoryItems.forEach(item => {
            item.addEventListener("click", async () => {
                const selectedCity = item.textContent;
                const weatherData = await getWeatherData(selectedCity);
                if (weatherData) {
                    displayWeather(weatherData);
                }
            });
        });
    }

    function updateBackgroundImage(weatherCondition) {
        const backgroundImageUrls = {
            clear: 'url("images/sunny.jpeg")',
            rain: 'url("images/raining.jpeg")',
            clouds: 'url("images/cloudy.jpeg")',
        };
    
        const backgroundImage = backgroundImageUrls[weatherCondition] || '';
    
        document.body.style.backgroundImage = backgroundImage;
    }    

    async function getForecastData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching forecast data: ", error);
            return null;
        }
    }
    
    function displayForecast(data) {
        const forecastList = data.list;
        const forecastContainer = document.querySelector(".forecast");
    
        // Clear the previous forecast data
        forecastContainer.innerHTML = '';
    
        for (let i = 0; i < forecastList.length; i += 8) {
            const forecastItem = forecastList[i];
            const date = new Date(forecastItem.dt * 1000);
            const icon = forecastItem.weather[0].icon;
            const temperature = Math.round(forecastItem.main.temp - 273.15); // Convert to Celsius
    
            const forecastDay = document.createElement("div");
            forecastDay.classList.add("forecast-day");
    
            const dateElement = document.createElement("p");
            dateElement.textContent = `Date: ${date.toDateString()}`;
    
            const iconElement = document.createElement("img");
            iconElement.src = `https://openweathermap.org/img/w/${icon}.png`;
            iconElement.alt = "Weather Icon";
    
            const temperatureElement = document.createElement("p");
            temperatureElement.textContent = `Temperature: ${temperature}°C`;
    
            forecastDay.appendChild(dateElement);
            forecastDay.appendChild(iconElement);
            forecastDay.appendChild(temperatureElement);
    
            forecastContainer.appendChild(forecastDay);
        }
    }
    
    cityForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            const weatherData = await getWeatherData(city);
            const forecastData = await getForecastData(city);
            if (weatherData && forecastData) {
                displayWeather(weatherData);
                displayForecast(forecastData); // Call the displayForecast function
                let history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
                history.push(city);
                localStorage.setItem(searchHistoryKey, JSON.stringify(history));
                displaySearchHistory();
            }
        }
    });
// Function to hide the search history dropdown
function hideSearchHistoryDropdown() {
    const searchHistoryDropdown = document.getElementById("search-history-dropdown");
    searchHistoryDropdown.style.display = "none";
}

// Event listener for scroll events on the window
window.addEventListener("scroll", function () {
    // Get the scroll position
    const scrollPosition = window.scrollY;

    // Define the threshold at which the dropdown should be hidden
    const threshold = 100; // Adjust this value as needed

    // Check if the scroll position is below the threshold
    if (scrollPosition > threshold) {
        hideSearchHistoryDropdown();
    }
});

// Function to display search history dropdown
function displaySearchHistoryDropdown(history) {
    const searchHistoryDropdown = document.getElementById("search-history-dropdown");
    searchHistoryDropdown.innerHTML = '';

    if (history.length > 0) {
        for (const city of history) {
            const searchHistoryItem = document.createElement("div");
            searchHistoryItem.classList.add("search-history-item");
            searchHistoryItem.textContent = city;
            searchHistoryDropdown.appendChild(searchHistoryItem);

            // Handle click on search history item
            searchHistoryItem.addEventListener("click", async () => {
                const weatherData = await getWeatherData(city);
                if (weatherData) {
                    displayWeather(weatherData);
                }
            });
        }
    }
}
// Event listener for form submission
cityForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        const weatherData = await getWeatherData(city);
        if (weatherData) {
            displayWeather(weatherData);
            let history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
            history.push(city);
            localStorage.setItem(searchHistoryKey, JSON.stringify(history));
            displaySearchHistoryDropdown(history); // Update the search history dropdown
        }
    }
});

// Event listener for input focus (show search history dropdown)
cityInput.addEventListener("focus", function () {
    const history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
    displaySearchHistoryDropdown(history);
});

// Event listener for input blur (hide search history dropdown)
cityInput.addEventListener("blur", function () {
    const searchHistoryDropdown = document.getElementById("search-history-dropdown");
    searchHistoryDropdown.style.display = "none";
});

// Initial display of search history dropdown
displaySearchHistoryDropdown([]);
});
