import "./styles.css";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Data from './components/Data';
import sound from './assets/nature.mp3';
const audio = new Audio(sound);

var i = 0;

export default function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  function fetchWeather(loc){

     const api = {
      key: "cb1b38509e15412da61133917222005",
      base: "https://api.weatherapi.com/v1/current.json?key"
    };

    let fetchData = `${api.base}=${api.key}&q=${loc || query}&aqi=no`;

    // Adjusting API so it will first display Georgian town Rustavi rather than Azerbaijanian village Miskinli, which was known as Rüstəm Əliyev or Rustavi until 2011 // 

    if(query == "Rustavi") {
      fetchData = `${api.base}=${api.key}&q=Rustavi Georgia&aqi=no`;
    };

    fetch(fetchData).then(res => res.json()).then(result => {

      // Fixing API error, sometimes displaying Georgia as Géorgie //

      result.location.country =
      result.location.country.replace('Géorgie', 'Georgia');

      setWeather(result);
      setLoading(false);
      setError(false);
      console.log(result);

    }).catch((error) => {
      setError(true);
      setLoading(false);
      setWeather({});
    });
  }

  const search = evt => {
    audio.play();
    audio.loop=true;
    if(evt.key === 'Enter') {
      fetchWeather();
      setQuery('');
      i++;
      if(i==1){
        setLoading(true); // For spinner
      }
    }
  }

  // Fetching the data of weather every 10 seconds to keep everything up to date. Also a fix for Kutaisi being displayed as Géorgie instead of Georgia //

  useEffect( () => {
    const interval = setInterval( () => {
      if(weather.location != undefined){
        if(weather.location.name !== "Kutaisi"){
          const fullLoc = `${weather.location.name} ${weather.location.country}`;
          fetchWeather(fullLoc);
        }else{
          fetchWeather(weather.location.name);
        }
      }
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, [weather]);


  return (
    <div className="bg">
      <div className='app blur'>
        <main>
          <div className="search-box">
            <input
              type="text"
              className="search-bar"
              onChange={e => setQuery(e.target.value)}
              onKeyPress={search}
              value={query}
              placeholder="Search..."
            ></input>
          </div>

          {(weather.location && <Data weather={weather} />)}

          {(loading && <Spinner className="spinner" animation="border" role="status" variant="light"><span className="visually-hidden">Loading...</span>
          </Spinner>)}

          {(error && <div className="error"><p>This location was not found, sorry.</p></div>)}

        </main>
      </div>
    </div>
)}
