/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import search from '../assets/icons/search.svg';
import { BackgroundLayout, MiniCard, WeatherCard } from '../Components';
import { useStateContext } from '../Context';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../index.css';
import FavCitiesCard from '../Components/FavCitiesCard';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const { weather, thisLocation, values, historicalValues, place, setPlace } = useStateContext();
  const [favCities, setFavCities] = useState([]);
  const [favCitiesWeather, setFavCitiesWeather] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const submitCity = () => {
    setPlace(input);
    setInput('');
  };

  const fetchFavoriteCities = () => {
    if (token) {
      axios
        .get('http://localhost:5001/weather/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          const cities = response.data;
          setFavCities(cities);

          const weatherPromises = cities.map((city) =>
            axios.get('https://visual-crossing-weather.p.rapidapi.com/forecast', {
              params: {
                aggregateHours: '24',
                location: city.city,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
              },
              headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com',
              },
            })
          );

          const weatherResponses = await Promise.all(weatherPromises);
          const weatherData = weatherResponses.map((res) => Object.values(res.data.locations)[0]);
          setFavCitiesWeather(weatherData);
        })
        .catch((err) => {
          console.error('Error in fetching Favorite Cities:', err);
          toast.error('Error in fetching Favorite Cities');
        });
    }
  };

  useEffect(() => {
    fetchFavoriteCities();
  }, [token]);

  const handleRemoveFavoriteCity = (place) => {
    setFavCitiesWeather(favCitiesWeather.filter(city => city.address !== place));
  };

  const handleLogout = () => {
    axios
      .get('http://localhost:5001/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.removeItem('token');
        toast.success('User Logout!');
        navigate('/');
      })
      .catch((error) => {
        toast.error('Logout failed!');
        console.error(error);
      });
  };

  return (
    <div className='w-full h-screen text-white px-8'>
      <nav className='w-full p-3 flex justify-between items-center'>
        <h1 className='font-bold tracking-wide text-3xl'>Weather App</h1>
        <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>
          <img src={search} alt="search" className='w-[1.5rem] h-[1.5rem]' />
          <input 
            className='focus:outline-none w-full text-[#212121] text-lg' 
            placeholder='Search city'
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                submitCity();
              }
            }}
          />
        </div>
        {token ? (
          <div onClick={handleLogout} className='glassCard font-semibold border  border-red-500 text-white w-32 p-2 flex items-center justify-center rounded hover:bg-red-500 hover:text-white cursor-pointer'>LOGOUT</div>
        ) : (
          <Link to={'/login'} className='glassCard font-semibold border border-green-500 text-white w-32 p-2 flex items-center justify-center rounded hover:bg-green-500 hover:text-white cursor-pointer'>LOGIN</Link>
        )}
      </nav>
      <BackgroundLayout />
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
        <WeatherCard 
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
          onFavoriteAdded={fetchFavoriteCities}
        />
        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {values?.slice(1, 7).map((curr) => (
            <MiniCard 
              key={curr.datetime}
              time={curr.datetime}
              temp={curr.temp}
              iconString={curr.conditions}
            />
          ))}
        </div>
        <div className='flex justify-center gap-8 flex-wrap '>
          {token && favCitiesWeather?.map((curr, index) => {
            const weather = curr.values[0];
            return (
              <FavCitiesCard
                key={index}
                place={curr.address}
                windspeed={weather.wspd}
                humidity={weather.humidity}
                temperature={weather.temp}
                heatIndex={weather.heatindex}
                iconString={weather.conditions}
                conditions={weather.conditions}
                onRemoveFavorite={handleRemoveFavoriteCity}
              />
            );
          })}
        </div>
        <div className='w-full h-10  glassCard  text-white flex justify-center items-center font-bold text-xl'>PREVIOUS 6 DAYS WEATHER</div>
        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {historicalValues?.slice(-6).map((curr) => (
            <MiniCard 
              key={curr.datetime}
              time={curr.datetime}
              temp={curr.temp}
              iconString={curr.conditions}
            />
          ))}
        </div>
        
      </main>
    </div>
  );
};

export default Dashboard;
