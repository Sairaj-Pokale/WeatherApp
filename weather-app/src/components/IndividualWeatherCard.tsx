import { FC } from "react"
import MapSection from "./MapSection";


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
    sunriseTime: string | undefined;
    sunsetTime: string | undefined;
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


const convertToLATime = (timestamp?: string): string =>
    timestamp ? new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles'
    }) : "Invalid Date";
;

const convertDate = (val?: string): string =>
    val ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'America/Los_Angeles',
    }).format(new Date(val)) : "Invalid Date";

interface IndivWeatherProp {
    idata: WholeWeatherData | undefined
    index: number
    onReturn: () => void
}



const IndividualWeatherCard: FC<IndivWeatherProp> = ({ idata, index, onReturn }) => {
    // console.log("In indiv", Number(idata?.Latitude), Number(idata?.Longitude))
    // console.log("In indiv", idata?.formalizedAddress)
    console.log("INDIV WEATHER", index)
    const interval = idata?.data?.timelines[0]?.intervals[index];
    const text = `The Temperature in ${idata?.formalizedAddress} on ${convertDate(interval?.startTime)} is ${interval?.values?.temperature}°F and the conditions are #CSCI571WeatherForecast`;
    const handleReturnClick = () => {
        console.log("in handleReturnClick")
        onReturn()
    }

    const handleClick = () => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
        )}`;

        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className="col-sm-9 col-12 w-100">

            <div className="d-flex justify-content-between">
                <div><button type="button" className="btn-light rounded-lg border border-2 border-secondary" onClick={handleReturnClick}>
                    <i className="bi bi-chevron-left"></i> List
                </button> </div>
                <div className="fs-3">{convertDate(interval?.startTime)}</div>
                <div><button type="button" className="btn" onClick={handleClick}>
                    <i className="bi bi-twitter-x"></i>
                </button></div>
            </div>
            <table className="table table-striped" >
                <tbody>
                    <tr>
                        <th scope="row">Status</th>
                        <td>{interval?.values?.weatherUtils.status}</td>
                    </tr>
                    <tr>
                        <th scope="row">Max Temperature</th>
                        <td>{interval?.values?.temperatureMax}</td>
                    </tr>
                    <tr>
                        <th scope="row">Min Temperature</th>
                        <td>{interval?.values?.temperatureMin}</td>
                    </tr>
                    <tr>
                        <th scope="row">Apparent Temperature</th>
                        <td>{interval?.values?.temperatureApparent}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="w-50">Sun Rise Time</th>
                        <td>{convertToLATime(interval?.values?.sunriseTime)}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="w-50">Sun Set Time</th>
                        <td>{convertToLATime(interval?.values?.sunsetTime)}</td>
                    </tr>
                    <tr>
                        <th scope="row">Humidity</th>
                        <td>{interval?.values?.humidity}</td>
                    </tr>
                    <tr>
                        <th scope="row">Wind Speed</th>
                        <td>{interval?.values?.windSpeed}</td>
                    </tr>
                    <tr>
                        <th scope="row">Visibility</th>
                        <td>{interval?.values?.visibility}</td>
                    </tr>
                    <tr>
                        <th scope="row">Cloud Cover</th>
                        <td>{interval?.values?.cloudCover}</td>
                    </tr>
                </tbody>
            </table>

            <MapSection latitude={Number(idata?.Latitude)}
                longitude={Number(idata?.Longitude)} />
        </div>

    );
}

export default IndividualWeatherCard




