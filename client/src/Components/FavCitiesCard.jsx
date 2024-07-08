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
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FavCitiesCard = ({
    temperature,
    windspeed,
    humidity,
    place,
    heatIndex,
    iconString,
    conditions,
    onRemoveFavorite
}) => {
    const [icon, setIcon] = useState(sun);
    const { time } = useDate();
    const token = localStorage.getItem("token");
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

    const handleRemove = () => {
        if (!token) {
            toast.error('User not authenticated');
            navigate('/login');
            return;
        }

        axios.post('http://localhost:5001/weather/removefavorites', { place }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success(`${place} deleted from favorites`);
                onRemoveFavorite(place); // Notify the parent component to update state
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <div className="w-[15rem] min-w-[15rem] min-h-[20rem] glassCard p-4">
            <div className="flex w-full justify-center items-center gap-2 mt-4 mb-2">
                <img src={icon} alt="weather-icon" className="w-12 h-12" />
                <p className="font-bold text-3xl flex justify-center items-center">{temperature} &deg;C</p>
            </div>
            <div className="font-bold text-center text-lg">
                {place}
            </div>
            <div className="w-full flex justify-between items-center mt-2">
                <p className="flex-1 text-center p-1">{time}</p>
            </div>
            <div className="w-full flex justify-between items-center mt-2 gap-2">
                <p className="flex-1 text-center p-1 font-bold bg-blue-600 shadow rounded-lg">Wind Speed <p className="font-normal">{windspeed} km/h</p></p>
                <p className="flex-1 text-center p-1 font-bold rounded-lg bg-green-600 ">Humidity <p className="font-normal">{humidity} gm/m&#179;</p></p>
            </div>
            <div className="w-full p-2 mt-2 flex justify-between items-center">
                <p className="font-semibold text-md">Heat Index</p>
                <p className="text-md">{heatIndex ? heatIndex : 'N/A'}</p>
            </div>
            <hr className="bg-slate-600" />
            <div className="w-full p-2 flex flex-col justify-center items-center text-xl font-semibold">
                {conditions}
                <div onClick={handleRemove} className="w-18 h-5 p-4 mt-1 flex justify-center items-center text-sm cursor-pointer font-semibold bg-red-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                        <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"
                            fill="#ffffff" />
                    </svg>&nbsp;REMOVE
                </div>
            </div>
        </div>
    );
};

export default FavCitiesCard;
