import React, { createContext, useState, useContext, useEffect } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
    return useContext(WeatherContext);
};

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState(null);

    const fetchWeatherData = async (lat, lon) => {
        try {
            debugger
            const WEATHER_API_KEY = 'e8137bd04dcab19b5128e9c35106db9e';


            const response = await fetch(


                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error('Weather details not found');
            }

            const data = await response.json();

            // Structure the received data according to your needs
            const formattedWeatherData = {
                city: data.name,
                temperature: data.main.temp,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                // Add more properties as needed
            };

            setWeatherData(formattedWeatherData);
        } catch (error) {
            console.error('Error fetching weather details:', error);
            setWeatherData(null);
            // Optionally, you can throw the error to handle it in components
            // throw error;
        }
    };

    // You can add additional functions or context values here if needed

    useEffect(() => {
        // Fetch initial weather data for a default city on component mount
        fetchWeatherData(13.083888888, 80.27);
    }, []); // Empty dependency array ensures it runs once on mount

    const contextValue = {
        weatherData,
        fetchWeatherData,
        // Add more values or functions here if needed
    };

    return (
        <WeatherContext.Provider value={contextValue}>
            {children}
        </WeatherContext.Provider>
    );
};

export default WeatherProvider;
