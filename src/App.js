// App.js
import React from 'react';
import WeatherProvider from './context/Weathercontext';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';
import "./App.css"
function App() {
  return (
    <WeatherProvider>
      <div className="App bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen flex flex-col items-center justify-center text-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
          <h1 style={{ marginTop: 0 }} className="text-4xl font-extrabold mb-8 text-gray-800  text-center">Weather App</h1>
          <div className="w-full">
            <SearchBar />
          </div>
          <div className="mt-8 flex items-center justify-center">
            <p className="text-gray-700 text-sm">
              Enter a location to get the weather forecast
            </p>
          </div>
          <WeatherDisplay />
        </div>
        <footer className="mt-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Weather App. All Rights Reserved.
        </footer>
      </div>
    </WeatherProvider>


  );
}

export default App;
