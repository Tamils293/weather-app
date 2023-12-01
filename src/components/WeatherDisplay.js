import React from 'react';
import { useWeather } from '../context/Weathercontext';

const WeatherDisplay = () => {
    const { weatherData } = useWeather();

    return (
        <div className="bg-white text-black shadow-md rounded-lg p-6">
            {weatherData && (
                <div className=''>
                    <h2 className="text-xl font-semibold mb-2">{weatherData.city}</h2>
                    <p className="text-lg">Temperature: {weatherData.temperature} °C</p>
                    <p className="text-lg">Description: {weatherData.description}</p>
                    {/* Display other weather information */}
                    <div className='flex justify-center'><img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`}
                        alt="wthr img" /></div>
                </div>
            )}
        </div>
    );
};

export default WeatherDisplay;
