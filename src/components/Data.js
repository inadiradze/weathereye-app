export default function Data({weather}){
    return (

   <div className="data-div">
      <div className="location-box">
        <div className="location-div">
          <div className="location">{weather.location.name} <span >{weather.location.country}</span> </div><br></br><br></br>
        </div>
        <div className="date-div">
          <div className="date">{weather.location.localtime.split(' ')[1]}</div>
        </div>
        <div className="weather-box">
          <div className="temp">{Math.round(weather.current.temp_c)}°</div>
          <div className="weather-div">
            <div className="weather">{weather.current.condition.text}</div>
            </div>
          </div>
        </div>
    </div>
  )};