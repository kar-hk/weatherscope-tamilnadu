// Weather Application JavaScript
class WeatherApp {
    constructor() {
        this.weatherData = {
            currentWeather: {
                location: "Thoothukudi",
                temperature: 31,
                feelsLike: 38,
                condition: "Partly Cloudy",
                humidity: 67,
                windSpeed: 12,
                windDirection: "SW",
                pressure: 1003,
                uvIndex: 8,
                sunrise: "06:07",
                sunset: "06:20",
                rainProbability: 20
            },
            locations: [
                {name: "Thoothukudi", tamil: "தூத்துக்குடி", current: {temp: 31, condition: "Partly Cloudy", rain: 20}},
                {name: "Chennai", tamil: "சென்னை", current: {temp: 33, condition: "Thunderstorms", rain: 70}},
                {name: "Tirunelveli", tamil: "திருநெல்வேலி", current: {temp: 29, condition: "Light Rain", rain: 60}},
                {name: "Madurai", tamil: "மதுரை", current: {temp: 30, condition: "Cloudy", rain: 30}},
                {name: "Kanyakumari", tamil: "கன்னியாகுமரி", current: {temp: 28, condition: "Rainy", rain: 80}},
                {name: "Rameswaram", tamil: "இராமேசுவரம்", current: {temp: 32, condition: "Sunny", rain: 10}}
            ],
            forecast: [
                {day: "Today", date: "Sep 11", high: 34, low: 27, condition: "Partly Cloudy", rain: 20, icon: "partly-cloudy"},
                {day: "Tomorrow", date: "Sep 12", high: 33, low: 26, condition: "Light Rain", rain: 60, icon: "light-rain"},
                {day: "Fri", date: "Sep 13", high: 32, low: 27, condition: "Thunderstorms", rain: 70, icon: "thunderstorm"},
                {day: "Sat", date: "Sep 14", high: 31, low: 26, condition: "Heavy Rain", rain: 85, icon: "heavy-rain"},
                {day: "Sun", date: "Sep 15", high: 30, low: 25, condition: "Rainy", rain: 75, icon: "rain"},
                {day: "Mon", date: "Sep 16", high: 32, low: 27, condition: "Partly Cloudy", rain: 40, icon: "partly-cloudy"},
                {day: "Tue", date: "Sep 17", high: 33, low: 28, condition: "Sunny", rain: 15, icon: "sunny"}
            ],
            hourlyForecast: [
                {time: "14:00", temp: 31, condition: "Partly Cloudy", rain: 20},
                {time: "15:00", temp: 32, condition: "Partly Cloudy", rain: 25},
                {time: "16:00", temp: 33, condition: "Cloudy", rain: 30},
                {time: "17:00", temp: 32, condition: "Cloudy", rain: 35},
                {time: "18:00", temp: 31, condition: "Light Rain", rain: 60},
                {time: "19:00", temp: 30, condition: "Light Rain", rain: 55},
                {time: "20:00", temp: 29, condition: "Cloudy", rain: 40},
                {time: "21:00", temp: 28, condition: "Partly Cloudy", rain: 25}
            ],
            alerts: [
                {
                    type: "warning",
                    level: "yellow",
                    title: "Heavy Rainfall Warning",
                    description: "Heavy rain is likely at isolated places over Thoothukudi district on Sep 11-12",
                    language: {english: "Heavy Rainfall Warning", tamil: "கனமழை எச்சரிக்கை"}
                },
                {
                    type: "marine",
                    level: "orange",
                    title: "Strong Wind Warning",
                    description: "Fishermen advised not to venture into sea. Wind speeds 45-55 kmph expected",
                    language: {english: "Marine Warning", tamil: "மீன்பிடி எச்சரிக்கை"}
                }
            ],
            marineWeather: {
                seaCondition: "Rough",
                waveHeight: "2-3 meters",
                windSpeed: "45-55 kmph",
                visibility: "Moderate",
                advice: "Fishermen advised not to venture into sea"
            },
            airQuality: {
                aqi: 78,
                category: "Moderate",
                pm25: 45,
                pm10: 68,
                advice: "Air quality is acceptable for most people"
            }
        };

        this.currentLocation = 'thoothukudi';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentWeather();
        this.renderAlerts();
        this.renderHourlyForecast();
        this.renderWeeklyForecast();
        this.updateMarineWeather();
        this.updateAirQuality();
        this.setupMapToggle();
    }

    setupEventListeners() {
        // Location selector
        const locationSelect = document.getElementById('locationSelect');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.currentLocation = e.target.value;
                this.updateLocationWeather();
            });
        }

        // Map toggle buttons
        document.querySelectorAll('.map-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                this.toggleMap(e.target.dataset.map);
            });
        });

        // Alert cards click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.alert-card')) {
                const alertCard = e.target.closest('.alert-card');
                this.showAlertDetails(alertCard);
            }
        });
    }

    getWeatherIcon(condition) {
        const iconMap = {
            'Sunny': '☀️',
            'Partly Cloudy': '⛅',
            'Cloudy': '☁️',
            'Light Rain': '🌦️',
            'Rainy': '🌧️',
            'Heavy Rain': '⛈️',
            'Thunderstorms': '⛈️',
            'partly-cloudy': '⛅',
            'light-rain': '🌦️',
            'rain': '🌧️',
            'heavy-rain': '⛈️',
            'thunderstorm': '⛈️',
            'sunny': '☀️'
        };
        return iconMap[condition] || '🌤️';
    }

    updateCurrentWeather() {
        const current = this.weatherData.currentWeather;
        
        // Update temperature display
        document.getElementById('currentTemp').textContent = current.temperature;
        document.getElementById('feelsLike').textContent = current.feelsLike;
        
        // Update condition
        document.getElementById('conditionIcon').textContent = this.getWeatherIcon(current.condition);
        document.getElementById('conditionMain').textContent = current.condition;
        
        // Update weather details
        document.getElementById('humidity').textContent = `${current.humidity}%`;
        document.getElementById('wind').textContent = `${current.windSpeed} km/h ${current.windDirection}`;
        document.getElementById('pressure').textContent = `${current.pressure} mb`;
        document.getElementById('uvIndex').textContent = `${current.uvIndex} (${this.getUVLevel(current.uvIndex)})`;
        document.getElementById('sunrise').textContent = current.sunrise;
        document.getElementById('sunset').textContent = current.sunset;
    }

    updateLocationWeather() {
        const location = this.weatherData.locations.find(loc => 
            loc.name.toLowerCase() === this.currentLocation.toLowerCase() ||
            this.currentLocation === 'thoothukudi'
        );
        
        if (location && location.current) {
            // Update main temperature and condition for the selected location
            document.getElementById('currentTemp').textContent = location.current.temp;
            document.getElementById('conditionIcon').textContent = this.getWeatherIcon(location.current.condition);
            document.getElementById('conditionMain').textContent = location.current.condition;
            
            // Update feels like (simulate based on actual temperature)
            const feelsLike = location.current.temp + Math.round(Math.random() * 8 - 2);
            document.getElementById('feelsLike').textContent = feelsLike;
        }
    }

    getUVLevel(uvIndex) {
        if (uvIndex <= 2) return 'Low';
        if (uvIndex <= 5) return 'Moderate';
        if (uvIndex <= 7) return 'High';
        if (uvIndex <= 10) return 'Very High';
        return 'Extreme';
    }

    renderAlerts() {
        const alertsContainer = document.getElementById('alertsContainer');
        if (!alertsContainer) return;

        alertsContainer.innerHTML = this.weatherData.alerts.map(alert => `
            <div class="alert-card ${alert.type}" data-alert-type="${alert.type}">
                <div class="alert-icon">
                    ${alert.type === 'warning' ? '⚠️' : '🌊'}
                </div>
                <div class="alert-content">
                    <div class="alert-title">
                        ${alert.language.tamil} | ${alert.language.english}
                    </div>
                    <div class="alert-description">
                        ${alert.description}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderHourlyForecast() {
        const container = document.getElementById('hourlyForecastContainer');
        if (!container) return;

        container.innerHTML = this.weatherData.hourlyForecast.map(hour => `
            <div class="hourly-item">
                <div class="hourly-time">${hour.time}</div>
                <div class="hourly-icon">${this.getWeatherIcon(hour.condition)}</div>
                <div class="hourly-temp">${hour.temp}°C</div>
                <div class="hourly-rain">${hour.rain}%</div>
            </div>
        `).join('');
    }

    renderWeeklyForecast() {
        const container = document.getElementById('weeklyForecastContainer');
        if (!container) return;

        container.innerHTML = this.weatherData.forecast.map(day => `
            <div class="forecast-day">
                <div class="forecast-day-info">
                    <div>
                        <div class="forecast-day-name">${day.day}</div>
                        <div class="forecast-date">${day.date}</div>
                    </div>
                    <div class="forecast-icon">${this.getWeatherIcon(day.icon)}</div>
                    <div class="forecast-condition">${day.condition}</div>
                </div>
                <div class="forecast-temps">
                    <div class="forecast-high">${day.high}°</div>
                    <div class="forecast-low">${day.low}°</div>
                    <div class="forecast-rain">${day.rain}%</div>
                </div>
            </div>
        `).join('');
    }

    updateMarineWeather() {
        const marine = this.weatherData.marineWeather;
        
        document.getElementById('seaCondition').textContent = marine.seaCondition;
        document.getElementById('waveHeight').textContent = marine.waveHeight;
        document.getElementById('marineWindSpeed').textContent = marine.windSpeed;
        document.getElementById('visibility').textContent = marine.visibility;
        document.getElementById('marineAdvice').textContent = marine.advice;
    }

    updateAirQuality() {
        const airQuality = this.weatherData.airQuality;
        
        document.getElementById('aqiValue').textContent = airQuality.aqi;
        document.getElementById('aqiCategory').textContent = airQuality.category;
        document.getElementById('pm25').textContent = `${airQuality.pm25} μg/m³`;
        document.getElementById('pm10').textContent = `${airQuality.pm10} μg/m³`;
        document.getElementById('airQualityAdvice').textContent = airQuality.advice;
        
        // Update AQI color based on value
        const aqiValueElement = document.getElementById('aqiValue');
        const aqiValue = airQuality.aqi;
        
        if (aqiValue <= 50) {
            aqiValueElement.style.color = 'var(--color-success)';
        } else if (aqiValue <= 100) {
            aqiValueElement.style.color = 'var(--color-warning)';
        } else {
            aqiValueElement.style.color = 'var(--color-error)';
        }
    }

    setupMapToggle() {
        // Initialize with rainfall map active
        this.updateMapDisplay('rainfall');
    }

    toggleMap(mapType) {
        // Update active button
        document.querySelectorAll('.map-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-map="${mapType}"]`).classList.add('active');
        
        // Update map display
        this.updateMapDisplay(mapType);
    }

    updateMapDisplay(mapType) {
        const mapTitle = document.getElementById('mapTitle');
        const mapPlaceholder = document.getElementById('weatherMapPlaceholder');
        
        if (mapType === 'rainfall') {
            mapTitle.textContent = 'Rainfall Radar | மழை முன்கணிப்பு';
            mapPlaceholder.querySelector('.map-description').textContent = 'Live rainfall data for Tamil Nadu region';
            mapPlaceholder.style.background = 'linear-gradient(135deg, var(--color-bg-8), var(--color-bg-1))';
        } else {
            mapTitle.textContent = 'Temperature Map | வெப்பநிலை வரைபடம்';
            mapPlaceholder.querySelector('.map-description').textContent = 'Temperature distribution across Tamil Nadu';
            mapPlaceholder.style.background = 'linear-gradient(135deg, var(--color-bg-2), var(--color-bg-6))';
        }
    }

    showAlertDetails(alertCard) {
        // Add visual feedback for alert interaction
        alertCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            alertCard.style.transform = 'translateY(-2px)';
        }, 150);

        // In a real application, this might open a modal with more details
        const alertType = alertCard.dataset.alertType;
        const alertData = this.weatherData.alerts.find(alert => alert.type === alertType);
        
        if (alertData) {
            // Create a simple notification or could expand the card
            this.showNotification(`Alert Details: ${alertData.description}`);
        }
    }

    showNotification(message) {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--color-border);
            max-width: 300px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Utility method to update last updated time
    updateLastUpdated() {
        const now = new Date();
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            const formatter = new Intl.DateTimeFormat('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata',
                timeZoneName: 'short'
            });
            lastUpdatedElement.textContent = formatter.format(now);
        }
    }

    // Method to simulate data refresh
    refreshData() {
        // In a real application, this would fetch new data from an API
        this.updateLastUpdated();
        this.showNotification('Weather data refreshed');
        
        // Simulate small changes in current conditions
        this.weatherData.currentWeather.temperature += Math.round(Math.random() * 2 - 1);
        this.weatherData.currentWeather.humidity += Math.round(Math.random() * 4 - 2);
        this.updateCurrentWeather();
    }
}

// Initialize the weather app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
    
    // Set up automatic data refresh every 10 minutes
    setInterval(() => {
        app.refreshData();
    }, 600000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    app.refreshData();
                    break;
                case 'l':
                    e.preventDefault();
                    document.getElementById('locationSelect').focus();
                    break;
            }
        }
    });
    
    // Add swipe gesture support for mobile hourly forecast
    const hourlyContainer = document.getElementById('hourlyForecastContainer');
    if (hourlyContainer) {
        let startX = null;
        
        hourlyContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        hourlyContainer.addEventListener('touchmove', (e) => {
            if (startX === null) return;
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 5) {
                hourlyContainer.scrollLeft += diffX * 0.5;
            }
        });
        
        hourlyContainer.addEventListener('touchend', () => {
            startX = null;
        });
    }
    
    // Update initial timestamp
    app.updateLastUpdated();
});

// Export for potential testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherApp;
}