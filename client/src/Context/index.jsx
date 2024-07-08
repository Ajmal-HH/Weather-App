/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setValues] = useState([])
    const [historicalValues, setHistoricalValues] = useState([])
    const [place, setPlace] = useState('Kochi')
    const [thisLocation, setLocation] = useState('')

    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        }

        const historicalOptions = {
            ...options,
            url: 'https://visual-crossing-weather.p.rapidapi.com/history',
            params: {
                ...options.params,
                startDateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDateTime: new Date().toISOString().split('T')[0],
            }
        }

        try {
            const [forecastResponse, historicalResponse] = await Promise.all([
                axios.request(options),
                axios.request(historicalOptions)
            ]);

            console.log(forecastResponse.data);
            const forecastData = Object.values(forecastResponse.data.locations)[0];
            setLocation(forecastData.address);
            setValues(forecastData.values);
            setWeather(forecastData.values[0]);

            console.log(historicalResponse.data);
            const historicalData = Object.values(historicalResponse.data.locations)[0];
            setHistoricalValues(historicalData.values);
        } catch (e) {
            console.error(e);
            toast.error('This place does not exist');
        }
    }

    useEffect(() => {
        fetchWeather();
    }, [place]);

    useEffect(() => {
        console.log(values);
    }, [values]);

    useEffect(() => {
        console.log(historicalValues);
    }, [historicalValues]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            historicalValues,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
