import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/Weathercontext';

const SearchBar = () => {
    const { fetchWeatherData } = useWeather();
    const [searchTerm, setSearchTerm] = useState('Chennai, India');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const debounceWithRateLimit = (func, delay) => {
        let timeoutId;
        let retryCount = 0;

        return async function (...args) {
            clearTimeout(timeoutId);

            try {
                await func.apply(this, args);
            } catch (error) {
                if (error.response && error.response.status === 429 && retryCount < 3) {
                    retryCount++;
                    console.log('Rate limit exceeded. Retrying after 5 seconds...');
                    timeoutId = setTimeout(() => {
                        retryCount = 0;
                        func.apply(this, args);
                    }, 5000); // Wait for 5 seconds before retrying
                } else {
                    console.error('Error:', error);
                }
            }
        };
    };

    const delayedFetchSuggestions = debounceWithRateLimit(async (term) => {
        try {
            setLoading(true);

            if (term.length) {
                const response = await fetch(
                    `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${term}`,
                    {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': '3854070174msh2ca9f5e7b068eb8p1646acjsna55fa8b8a21e',
                            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                        }
                    }
                );

                const data = await response.json();
                setSuggestions(data.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, 100);

    useEffect(() => {
        if (!searchTerm) {
            setSuggestions([]);
        }
    }, [searchTerm]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        delayedFetchSuggestions(value);
    };

    const handleSelectSuggestion = (city) => {
        setSelectedCity(city);
        setSearchTerm(`${city.name}, ${city.country}`);
        setSuggestions([]);
    };

    const handleSearch = () => {
        debugger
        fetchWeatherData(selectedCity.latitude, selectedCity.longitude);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentActive = document.activeElement;
            const suggestionsList = document.getElementById('suggestions-list');

            if (suggestionsList && suggestionsList.childNodes.length > 0) {
                const suggestionsArray = Array.from(suggestionsList.childNodes);
                const currentIndex = suggestionsArray.findIndex(
                    (element) => element === currentActive
                );

                let nextIndex = 0;

                if (e.key === 'ArrowDown') {
                    nextIndex =
                        currentIndex === suggestionsArray.length - 1 ? 0 : currentIndex + 1;
                } else {
                    nextIndex =
                        currentIndex === 0 ? suggestionsArray.length - 1 : currentIndex - 1;
                }

                suggestionsArray[nextIndex].focus();
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 relative">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for a city..."
                className="w-full border text-black border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                ref={inputRef}
            />
            {/* {loading && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md mt-1 py-1 px-3 z-10">
                    <span className="text-black">   ...</span>
                </div>
            )} */}

            {suggestions.length > 0 && (
                <ul
                    id="suggestions-list"
                    className=" text-left absolute left-0 w-full bg-white border border-gray-300 rounded-b-md mt-1 py-1 px-3 z-10"
                >
                    {suggestions.map((city, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectSuggestion(city)}
                            className="text-black cursor-pointer hover:bg-gray-100 py-1"
                            tabIndex="0"
                        >
                            {city.name}, {city.country}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={handleSearch}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
            >
                Get Forecast
            </button>
        </div>
    );
};

export default SearchBar;
