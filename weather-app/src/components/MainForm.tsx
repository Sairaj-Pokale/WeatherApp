import axios from 'axios';
import { useState, FC, MouseEvent, useRef, useEffect } from 'react'
import Results from './Results'
import Favorites from './Favorites'
import 'bootstrap-icons/font/bootstrap-icons.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const stateMap: { [key: string]: string } = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

interface CitySuggestion {
    city: string
    state: string
};

interface dataT {
    city: string
    state: string
    street: string
};

interface WholeWeatherData {
    isFavorite: boolean;
    data: {
        timelines: Timeline[];
    };
    cityID: string;
    formalizedAddress: string;
    city_main: string;
    state_main: string;
    Latitude: number;
    Longitude: number;
}

interface Timeline {
    timestep: string;
    endTime: string;
    startTime: string;
    intervals: Interval[];
}

interface Interval {
    startTime: string;
    values: IntervalValues;
}

interface IntervalValues {
    cloudCover: number;
    humidity: number;
    moonPhase: number;
    precipitationProbability: number;
    precipitationType: number;
    pressureSeaLevel: number;
    sunriseTime: string;
    sunsetTime: string;
    temperature: number;
    temperatureApparent: number;
    temperatureMax: number;
    temperatureMin: number;
    uvIndex: number;
    visibility: number;
    weatherCode: number;
    windDirection: number;
    windSpeed: number;
    weatherUtils: WeatherUtils;
}

interface WeatherUtils {
    status: string;
    iconpath: string;
}

const MainForm: FC = () => {
    const [clearResults, setClearResults] = useState<Boolean>()
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [activeTab, setActiveTab] = useState<string>('results')
    const [weatherData, setWeatherData] = useState<WholeWeatherData | null>(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [autodetectLocation, setAutodetectLocation] = useState(false);
    const [lat, setLat] = useState('')
    const [long, setLong] = useState('')
    const [region, setRegion] = useState('')
    const [validated, setValidated] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {
        const checkFormValidity = () => {
            if (autodetectLocation) {
                setIsFormValid(true);
                return;
            }

            const isValid = street.trim() !== '' &&
                city.trim() !== '' &&
                state !== '';

            setIsFormValid(isValid);
        };

        checkFormValidity();
    }, [street, city, state, autodetectLocation]);



    const handleClear = () => {
        setInputValue('')
        setSuggestions([])
        setActiveTab('results')
        setStreet('')
        setCity('')
        setState('')
        setAutodetectLocation(false)
        setLat('')
        setLong('')
        setRegion('')
        setIsLoading(false)
        setClearResults(true)
    }

    // const handleFormaDataChange = (event, attr: string) => {
    //     event.preventDefault()
    //     console.log(attr)
    //     if (!autodetectLocation) {
    //         const form = formRef.current;
    //         if (form) {
    //             if (!form.checkValidity()) {
    //                 setValidated(true);
    //                 return;
    //             }
    //         }
    //     }
    //     setFormData(prevData => ({
    //         ...prevData,
    //         attr: event.target.value
    //     }));
    // }
    // console.log(formData)
    const handleSearchClick = async () => {
        setIsLoading(true);
        if (!autodetectLocation) {
            const form = formRef.current;
            if (form) {
                if (!form.checkValidity()) {
                    setValidated(true);
                    return;
                }
            }
        }
        const formData = {
            street,
            city,
            state,
            autodetectLocation,
            lat,
            long,
            region
        };
        try {
            const response = await axios.post(
                'https://webtechassign3-441822.uw.r.appspot.com/get_hourly', formData
            );
            const data: WholeWeatherData = await response.data;
            setWeatherData(data);
            setActiveTab("results")
            setClearResults(false)
            // console.log('Hourly Weather Data:', data);
            // console.log('AUTOCOMPLETE',response.data)
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCheckBoxClick = async () => {
        try {
            const TOKEN = `ipinfo.io`
            const response = await axios.get(
                `https://ipinfo.io/json?token=${TOKEN}`,
            );
            const data = response.data;
            const [lat, long] = (data.loc).split(',')
            setLat(lat);
            setLong(long);
            setCity(data.city);
            setRegion(data.region);
            console.log('UserIP', data);
            // console.log('AUTOCOMPLETE',response.data)
        } catch (error) {
            console.error('Error fetching USER IP: ', error);
        }
        setValidated(false);
    }

    const handleResultClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setActiveTab('results')
    }

    const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setActiveTab('favorites')
    }

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.length > 2) {
            try {
                const response = await axios.get(
                    'https://webtechassign3-441822.uw.r.appspot.com/autocomplete',
                    {
                        params: {
                            input: value,
                        },
                    }
                );
                // console.log('AUTOCOMPLETE',response.data);
                const citySuggestions = response.data.predictions.map(
                    (prediction: { terms: { value: string }[] }) => ({
                        city: prediction.terms[0].value,
                        state: prediction.terms[1] ? prediction.terms[1].value : '',
                    })
                );

                setSuggestions(citySuggestions);
            } catch (error) {
                console.error('Error fetching city suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };
    const handleSuggestionClick = (suggestion: CitySuggestion) => {
        setInputValue(suggestion.city);
        setCity(suggestion.city);
        setState(stateMap[suggestion.state]);
        setSuggestions([]);
    };

    const sentFromFav = async (dt: dataT) => {
        // console.log("Reaching from Favorites")
        // console.log(dt)
        setIsLoading(true);
        setActiveTab("results")
        try {
            const response = await axios.post(
                'https://webtechassign3-441822.uw.r.appspot.com/get_hourly', { city: dt.city, state: dt.state, street: dt.street }
            );
            const data = response.data;
            setWeatherData(data);
            setCity(dt.city)
            setState(dt.state)
            setClearResults(false)
            // console.log('Hourly Weather Data:', data);
            // console.log('AUTOCOMPLETE',response.data)
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setIsLoading(false);
        }
    }
    const addr = city + ", " + state;
    // console.log(typeof weatherData)
    // console.log("DATA VAR", weatherData);


    return (

        <div className='col-sm-9 col-12'>
            <div className="bg-light ">
                <div className="text-center mb-3 fs-2 w-100">Weather Search <span role="img" aria-label="sun behind cloud">🌥️</span></div>
                <div className="d-flex justify-content-sm-center align-items-center">
                    <form ref={formRef} className={`col-12 col-sm-10 ps-sm-5 pe-sm-5 p-3 mb-3 ${validated ? 'was-validated' : ''}`} noValidate>
                        <div className="form-group row">
                            <label htmlFor="inputStreet" className="col-sm-2 col-form-label">Street<span className="text-danger">*</span></label>
                            <div className="col-sm-10">
                                <input className="form-control" id="streetInput" value={street}
                                    onChange={(e) => setStreet(e.target.value)} disabled={autodetectLocation} required={!autodetectLocation} />
                                {/* <input className="form-control" id="streetInput" name="street" value={formData.street}
                                    onChange={(e) => handleStreetChange(e)} disabled={autodetectLocation} required={!autodetectLocation} /> */}
                                {/* <input className="form-control" id="streetInput" value={street}
                                    onChange={(e) => setStreet(e.target.value)} disabled={autodetectLocation} required /> */}
                                {/* <input className="form-control" id="streetInput" value={formData.street}
                                    onChange={(e) => handleFormaDataChange(e, "street")}
                                    disabled={autodetectLocation} required={!autodetectLocation} /> */}

                                <div className="invalid-feedback">
                                    Please enter a valid street
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputCity" className="col-sm-2 col-form-label">City<span className="text-danger">*</span></label>
                            <div className="col-sm-10">
                                <input className="form-control" id="cityInput" value={inputValue}
                                    onChange={(e) => { handleInputChange(e), setCity(e.target.value); }}
                                    disabled={autodetectLocation} required={!autodetectLocation} />
                                {/* <input className="form-control" id="cityInput" value={inputValue}
                                    onChange={(e) => { handleInputChange(e), handleFormaDataChange(e, city) }}
                                    disabled={autodetectLocation} required={!autodetectLocation} /> */}
                                <div className="invalid-feedback">
                                    Please enter a valid city
                                </div>
                                {suggestions.length > 0 && (
                                    <ul className="list-group position-absolute col-10 col-sm-5" style={{ zIndex: 1 }}>
                                        {suggestions.map((suggestion: CitySuggestion, index) => (
                                            <li
                                                key={index}
                                                className="list-group-item list-group-item-action col-2"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {suggestion.city}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="selectState" className="col-sm-2 col-form-label">State<span className="text-danger">*</span></label>
                            <div className="col-sm-5">
                                <select id="stateSelect" className="form-control" value={state}
                                    onChange={(e) => setState(e.target.value)} disabled={autodetectLocation} required={!autodetectLocation}>
                                    {/* <select id="stateSelect" className="form-control" value={state}
                                    onChange={(e) => handleFormaDataChange(e, state)} disabled={autodetectLocation} required={!autodetectLocation}> */}
                                    <option value="" selected>Select your state</option>
                                    <option value="Alabama">Alabama</option>
                                    <option value="Alaska">Alaska</option>
                                    <option value="Arizona">Arizona</option>
                                    <option value="Arkansas">Arkansas</option>
                                    <option value="California">California</option>
                                    <option value="Colorado">Colorado</option>
                                    <option value="Connecticut">Connecticut</option>
                                    <option value="Delaware">Delaware</option>
                                    <option value="Florida">Florida</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Hawaii">Hawaii</option>
                                    <option value="Idaho">Idaho</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Indiana">Indiana</option>
                                    <option value="Iowa">Iowa</option>
                                    <option value="Kansas">Kansas</option>
                                    <option value="Kentucky">Kentucky</option>
                                    <option value="Louisiana">Louisiana</option>
                                    <option value="Maine">Maine</option>
                                    <option value="Maryland">Maryland</option>
                                    <option value="Massachusetts">Massachusetts</option>
                                    <option value="Michigan">Michigan</option>
                                    <option value="Minnesota">Minnesota</option>
                                    <option value="Mississippi">Mississippi</option>
                                    <option value="Missouri">Missouri</option>
                                    <option value="Montana">Montana</option>
                                    <option value="Nebraska">Nebraska</option>
                                    <option value="Nevada">Nevada</option>
                                    <option value="New Hampshire">New Hampshire</option>
                                    <option value="New Jersey">New Jersey</option>
                                    <option value="New Mexico">New Mexico</option>
                                    <option value="New York">New York</option>
                                    <option value="North Carolina">North Carolina</option>
                                    <option value="North Dakota">North Dakota</option>
                                    <option value="Ohio">Ohio</option>
                                    <option value="Oklahoma">Oklahoma</option>
                                    <option value="Oregon">Oregon</option>
                                    <option value="Pennsylvania">Pennsylvania</option>
                                    <option value="Rhode Island">Rhode Island</option>
                                    <option value="South Carolina">South Carolina</option>
                                    <option value="South Dakota">South Dakota</option>
                                    <option value="Tennessee">Tennessee</option>
                                    <option value="Texas">Texas</option>
                                    <option value="Utah">Utah</option>
                                    <option value="Vermont">Vermont</option>
                                    <option value="Virginia">Virginia</option>
                                    <option value="Washington">Washington</option>
                                    <option value="West Virginia">West Virginia</option>
                                    <option value="Wisconsin">Wisconsin</option>
                                    <option value="Wyoming">Wyoming</option>
                                </select>
                                <div className="invalid-feedback">
                                    Please enter a valid state
                                </div>
                            </div>
                        </div>
                        <div className="border-bottom border-dark mt-3 "></div>
                        <div className="form-group row fs-6">
                            <div className="d-flex justify-content-center align-items-center gap-2 mt-1">
                                <div className="col-auto">Autodetect Location<span className="text-danger">*</span></div>
                                <div className="col-auto">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="gridCheck1" checked={autodetectLocation}
                                            onChange={(e) => { setAutodetectLocation(e.target.checked); if (e.target.checked) handleCheckBoxClick(); }} />
                                        <label className="form-check-label" htmlFor="gridCheck1">
                                            Current Location
                                        </label>
                                        {/* becomes green whene other ar einvalidated */}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="form-group row">
                            <div className="d-flex justify-content-center align-items-center gap-2 mt-1">
                                <div className="col-auto">
                                    <button type="button" className="btn btn-primary" onClick={handleSearchClick} disabled={!isFormValid}><i className="bi bi-search"></i>Search</button>
                                    {/* <button type="button" className="btn btn-primary" onClick={handleSearchClick} ><i className="bi bi-search"></i>Search</button> */}
                                </div>
                                <div className="col-auto">
                                    <button type="button" className="btn btn-secondary" onClick={handleClear}><i className="bi bi-list-nested"></i>Clear</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div >
            <div className='col-sm-9 col-12 w-100' >
                <div className="btnsWrapper d-flex justify-content-center align-items-center">
                    <div className="d-flex gap-2">
                        <button type="button" data-bs-toggle="button" className={`btn ${activeTab === "results" ? 'btn-primary' : 'btn'}`} onClick={handleResultClick}>Results</button>
                        <button type="button" data-bs-toggle="button" className={`btn ${activeTab === "favorites" ? 'btn-primary' : 'btn'}`} onClick={handleFavoriteClick}>Favorites</button>
                    </div>
                </div>
                {isLoading && (
                    <div className="progress w-100 mt-5" >
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: "50%" }}
                            aria-valuenow={50}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        ></div>
                    </div>
                )}
                <div className="activeTabSection w-100">
                    {weatherData && activeTab == "results" && !clearResults ? <Results data={weatherData}
                        location={autodetectLocation ? "" : addr} /> : null}
                    {activeTab == "results" ?
                        null
                        :
                        <Favorites onFavClick={sentFromFav} />
                    }
                </div>
            </div>
        </div >
    );
}

export default MainForm

