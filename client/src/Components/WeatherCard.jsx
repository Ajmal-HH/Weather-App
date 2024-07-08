/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDate } from '../Utils/useDate';
import sun from '../assets/icons/sun.png';
import cloud from '../assets/icons/cloud.png';
import fog from '../assets/icons/fog.png';
import rain from '../assets/icons/rain.png';
import snow from '../assets/icons/snow.png';
import storm from '../assets/icons/storm.png';
import wind from '../assets/icons/windy.png';
import '../index.css';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  conditions,
  onFavoriteAdded
}) => {
  const [icon, setIcon] = useState(sun);
  const { time } = useDate();
  const navigate = useNavigate();

  useEffect(() => {
    if (iconString) {
      if (iconString.toLowerCase().includes('cloud')) {
        setIcon(cloud);
      } else if (iconString.toLowerCase().includes('rain')) {
        setIcon(rain);
      } else if (iconString.toLowerCase().includes('clear')) {
        setIcon(sun);
      } else if (iconString.toLowerCase().includes('thunder')) {
        setIcon(storm);
      } else if (iconString.toLowerCase().includes('fog')) {
        setIcon(fog);
      } else if (iconString.toLowerCase().includes('snow')) {
        setIcon(snow);
      } else if (iconString.toLowerCase().includes('wind')) {
        setIcon(wind);
      }
    }
  }, [iconString]);

  const handleFav = () => {  
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error('User not authenticated');
      navigate('/login');
      return;
    }

    axios.post('http://localhost:5001/weather/addfavorites', { place }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      toast.success('City added to Favorite');
      onFavoriteAdded(); // Call the function to refresh favorite cities
    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    });
  };

  return (
    <div className="w-[22rem] min-w-[22rem] min-h-[24rem] glassCard p-4 flex flex-col justify-between">
      <div className="flex w-full justify-center items-center gap-4 ">
        <img src={icon} alt="weather-icon" className="w-16 h-16" />
        <p className="font-bold text-5xl">{temperature} &deg;C</p>
      </div>
      <div className="font-bold text-center text-xl mt-2">
        {place}
      </div>
      <div className="w-full flex justify-between items-center ">
        <p className="flex-1 text-center p-2">{time}</p>
      </div>
      <div className="w-full flex justify-between items-center  gap-4">
        <p className="flex-1 text-center p-2 font-bold bg-blue-600 shadow rounded-lg">Wind Speed <span className="font-normal">{windspeed} km/h</span></p>
        <p className="flex-1 text-center p-2 font-bold rounded-lg bg-green-600">Humidity <span className="font-normal">{humidity} gm/m&#179;</span></p>
      </div>
      <div className="w-full p-3  flex justify-between items-center">
        <p className="font-semibold text-lg">Heat Index</p>
        <p className="text-lg">{heatIndex ? heatIndex : 'N/A'}</p>
      </div>
      <hr className="bg-slate-600" />
      <div className="w-full p-4 flex flex-col justify-center items-center text-3xl font-semibold ">
        {conditions}
        <div onClick={handleFav} className="w-32 h-8 p-4 mt-1 flex justify-center items-center text-lg cursor-pointer font-semibold bg-green-600 rounded-lg">
          🤍 Favorite
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
