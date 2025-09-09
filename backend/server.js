const express = require('express');
const morgan = require('morgan')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require('mongoose');
const table = require('./model');
const cors = require('cors');
// const connectDB = require('./connection')
const app = express();

app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))



dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080
const weatherapikey = process.env.WEATHER_API
const mapsapi = process.env.MAPS_API
const uri = process.env.MONGO_URL

const weatherCodeDict = {
    4201: {
        "status": "Heavy Rain",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/rain_heavy.svg",
    },
    4001: {
        "status": "Rain",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/rain.svg",
    },
    4200: {
        "status": "Light Rain",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/rain_light.svg",
    },
    6201: {
        "status": "Heavy Freezing Rain",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/freezing_rain_heavy.svg",
    },
    6001: {
        "status": "Freezing Rain",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/freezing_rain.svg",
    },
    6200: {
        "status": "Light Freezing Rain",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/freezing_rain_light.svg",
    },
    6000: {
        "status": "Freezing Drizzle",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/freezing_drizzle.svg",
    },
    4000: {
        "status": "Drizzle",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/drizzle.svg",
    },
    7101: {
        "status": "Heavy Ice Pellets",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/ice_pellets_heavy.svg",
    },
    7000: {
        "status": "Ice Pellets",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/ice_pellets.svg",
    },
    7102: {
        "status": "Light Ice Pellets",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/ice_pellets_light.svg",
    },
    5101: {
        "status": "Heavy Snow",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/snow_heavy.svg",
    },
    5000: {
        "status": "Snow",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/snow.svg",
    },
    5100: {
        "status": "Light Snow",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/snow_light.svg",
    },
    5001: {
        "status": "Flurries",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/flurries.svg",
    },
    8000: {
        "status": "Thunderstorm",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/tstorm.svg",
    },
    2100: {
        "status": "Light Fog",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/fog_light.svg",
    },
    2000: {
        "status": "Fog",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/fog.svg",
    },
    1001: {
        "status": "Cloudy",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/cloudy.svg",
    },
    1102: {
        "status": "Mostly Cloudy",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/mostly_cloudy.svg",
    },
    1101: {
        "status": "Partly Cloudy",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/partly_cloudy_day.svg",
    },
    1100: {
        "status": "Mostly Clear",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/mostly_clear_day.svg",
    },
    1000: {
        "status": "Clear, Sunny",
        "iconpath": "/assets/images/Weather Symbols for Weather Codes/clear_day.svg",
    },
}

// console.log('URI', process.env.MONGO_URL)

app.use(morgan('tiny'));

// connectDB();
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// }
// );

const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

connect().catch(console.dir);

const getLatLong = async (addressstring) => {
    requesturl = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressstring}&key=${mapsapi}`
    try {
        const justresponse = await fetch(requesturl, {
            method: 'GET',
        });
        if (!justresponse.ok) {
            throw new Error(`Error: ${justresponse.status} - ${justresponse.statusText}`);
        }
        const data = await justresponse.json()
        // console.log(data);
        const location = data.results[0]?.geometry?.location
        location.formatted_address = data.results[0]?.formatted_address
        // console.log(location)
        if (location) {
            return location
        } else {
            return "NO DATA FOUND"
        }
    }
    catch (err) {
        console.log(`Error in geocoding api call{LATLONG} : ${err}`)
        return null;
    }

    // console.log(justresponse.json());
}

const getWeatherData = async (latlong) => {
    // console.log(latlong)
    requesturl = `https://api.tomorrow.io/v4/timelines?location=${latlong[`lat`]},${latlong[`lng`]}&fields=temperature&fields=temperatureApparent&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=windDirection&fields=humidity&fields=pressureSeaLevel&fields=uvIndex&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&fields=sunriseTime&fields=sunsetTime&fields=visibility&fields=moonPhase&fields=cloudCover&timesteps=1d,1h&units=imperial&timezone=America/Los_Angeles&apikey=${weatherapikey}`
    try {
        const response = await fetch(requesturl, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json()
        data.data.timelines[0].intervals.forEach(val => {
            val.values.weatherUtils = weatherCodeDict[val.values.weatherCode];
        });

        return data

    }
    catch (err) {
        console.log(`Error in tomorrowio api call: ${err}`)
        return null
    }
}


app.get('/', (req, res) => {
    res.send("Weather APP");
})

app.post('/get_hourly', async (req, res) => {
    console.log(req.body)
    const body = req.body
    let weatherdata;
    let latlongdict;
    let formalizedAddress;
    let cityID;
    let isFavorite = false;
    let city_main;
    let state_main;
    const records = await table.find();
    try {
        if (body.autodetectLocation) {
            console.log("in ipconfig")
            latlongdict = {
                'lat': body.lat,
                'lng': body.long
            }
            formalizedAddress = body.city + ", " + body.region
            city_main = body.city
            state_main = body.region
            weatherdata = await getWeatherData(latlongdict)
            records.map((record, index) => {
                const normalizedRecordCity = record.city.trim().toLowerCase();
                const normalizedRecordState = record.state.trim().toLowerCase();
                const normalizedBodyCity = body.city.trim().toLowerCase();
                const normalizedBodyRegion = body.region.trim().toLowerCase();
                if (normalizedBodyCity === normalizedRecordCity && normalizedBodyRegion === normalizedRecordState) {
                    isFavorite = true;
                    cityID = record._id
                }
            })
            // console.log(cityID)
            // console.log(typeof cityID)

        } else {
            var street = body.street
            street = street.trim();
            street = street.replaceAll(" ", "+")
            var city = body.city
            var state = body.state
            var addressstring = street + "+" + city + "+" + state
            console.log(addressstring)
            city_main = body.city
            state_main = body.state
            latlongdict = await getLatLong(addressstring)
            if (latlongdict) {
                weatherdata = await getWeatherData(latlongdict)
                formalizedAddress = latlongdict.formatted_address
            }
            records.map((record, index) => {
                const normalizedRecordCity = record.city.trim().toLowerCase();
                const normalizedRecordState = record.state.trim().toLowerCase();
                const normalizedBodyCity = city.trim().toLowerCase();
                const normalizedBodyRegion = state.trim().toLowerCase();
                if (normalizedBodyCity === normalizedRecordCity && normalizedBodyRegion === normalizedRecordState) {
                    isFavorite = true;
                    cityID = record._id
                }
            })
            // console.log(isFavorite)
            // console.log(resjson)
        }
        if (!weatherdata || weatherdata === "NO DATA FOUND") {
            console.log('IN IF')
            return res.status(200).json({ errmsg: "No Records Found" });
        }
        weatherdata.Latitude = latlongdict['lat'];
        weatherdata.Longitude = latlongdict['lng'];
        weatherdata.formalizedAddress = formalizedAddress;
        weatherdata.isFavorite = isFavorite;
        weatherdata.cityID = cityID;
        weatherdata.city_main = city_main;
        weatherdata.state_main = state_main;
        res.send(weatherdata);
    }
    catch (error) {
        console.log('IN HERE')
        console.error("Error retrieving weather data:", error);
        res.status(500).send({ error: "Failed to retrieve weather data" });
    }

})

app.post('/add_favourite', async (req, res) => {
    const { city: cityValue, state, latitude, longitude } = req.body;
    const city = cityValue || "NO CITY";
    try {
        const newEntry = new table({
            city,
            state,
            latitude,
            longitude
        });

        await newEntry.save();

        res.status(201).json({ message: 'Added successfully!', entry: newEntry });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to add city', error: err.message });
    }
})

app.delete('/delete_favorite/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRecord = await table.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ message: "Record deleted successfully", record: deletedRecord });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete record", error: error.message });
    }
});

app.get('/get_favorites', async (req, res) => {
    try {
        const records = await table.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve records", error: error.message });
    }
});

app.get('/getWeather', async (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.long;

    const latlong = {
        lat: lat,
        lng: lng
    };

    const weatherdata = await getWeatherData(latlong);

    if (!weatherdata || weatherdata === "NO DATA FOUND") {
        // console.log('IN IF')
        return res.status(200).json({ errmsg: "No Records Found" });
    } else {
        weatherdata.Latitude = latlong['lat'];
        weatherdata.Longitude = latlong['lng'];
        res.json({
            message: "Form submitted successfully!",
            body: weatherdata
        });
    }
});

app.get('/autocomplete', async (req, res) => {
    try {
        console.log(req.query.input)
        // const params = new URLSearchParams({
        //     input: req.query.input,
        //     types: '(cities)',
        //     key: process.env.MAPS_API,
        // });
        const requrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&types=%28cities%29&key=${process.env.MAPS_API}`
        const response = await fetch(requrl, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching autocomplete data' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})