import { FC } from "react"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


interface WeatherData {
    wdata: WholeWeatherData | undefined
    onTableClick: (index: any) => void
}

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
  
const WeatherTable: FC<WeatherData> = ({ wdata, onTableClick }) => {
    // console.log("IN WEATHER TABLE", wdata);

    const formatDate = (date: string | Date): string => {
        const fdate = new Date(typeof date === 'string' ? Date.parse(date) : date);

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };

        const parts: string[] = fdate.toLocaleDateString(undefined, options).split(', ');
        const [weekday, monthDay, year] = parts;
        const [month, day] = monthDay.split(' ');

        return `${weekday}, ${day} ${month}, ${year}`;
    }
    // console.log(wdata?.data.timelines[0].intervals)
    const handleDateClick = (index: number) => {
        // console.log("IN handleDateClick");
        onTableClick(index)
    }
    const intervals = wdata?.data.timelines[0].intervals;
    return (
        <div className="col-sm-9 col-12 w-100 ">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col" className="col-1">#</th>
                        <th scope="col" className="col-2">Date</th>
                        <th scope="col" className="col-4">Status</th>
                        <th scope="col" className="col-1">Temp. High (&deg;F)</th>
                        <th scope="col" className="col-1">Temp. Low (&deg;F)</th>
                        <th scope="col" className="col-1">Wind Speed (mph)</th>
                    </tr>
                </thead>
                <tbody>
                    {intervals?.map((interval, index) => (
                        <tr key={index} className="small" onClick={() => handleDateClick(index)}>
                            <th scope="row">{index + 1}</th>
                            <td>{formatDate(new Date(interval.startTime))}</td>
                            <td>
                                <div className="d-flex gap-1 align-items-center ">
                                    <img src={interval.values.weatherUtils.iconpath} className="img-fluid" style={{ maxWidth: '2rem', maxHeight: '2rem' }} alt="Status Image" />
                                    <div>{interval.values.weatherUtils.status}</div>
                                </div>
                            </td>
                            <td>{interval.values.temperatureMax}</td>
                            <td>{interval.values.temperatureMin}</td>
                            <td>{interval.values.windSpeed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WeatherTable


// Types
// interface WeatherInterval {
//     startTime: string;
//     values: {
//         temperatureMax: number;
//         temperatureMin: number;
//         windSpeed: number;
//         weatherUtils: {
//             iconpath: string;
//             status: string;
//         };
//     };
// }

// interface WeatherData {
//     body: {
//         data: {
//             timelines: [{
//                 intervals: WeatherInterval[];
//             }];
//         };
//     };
// }

// interface WeatherTableProps {
//     weatherdata: WeatherData;
// }

// // Component
// const WeatherTable: React.FC<WeatherTableProps> = ({ weatherdata }) => {
//     // Early return if no data
//     if (!weatherdata?.body?.data?.timelines?.[0]?.intervals) {
//         return <div>No weather data available</div>;
//     }

//     const intervals = weatherdata.body.data.timelines[0].intervals;

//     return (
//         <div className="formWidth">
//             <table className="table">
//                 <thead>
//                     <tr>
//                         <th scope="col" className="col-1">#</th>
//                         <th scope="col" className="col-3">Date</th>
//                         <th scope="col" className="col-4">Status</th>
//                         <th scope="col" className="col-2">Temp. High (&deg;F)</th>
//                         <th scope="col" className="col-1">Temp. Low (&deg;F)</th>
//                         <th scope="col" className="col-1">Wind Speed (mph)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {intervals.map((interval, index) => (
//                         <tr key={index} className="small">
//                             <th scope="row">{index + 1}</th>
//                             <td>{formatDate(new Date(interval.startTime))}</td>
//                             <td>
//                                 <div className="d-flex gap-1 align-items-center">
//                                     <img
//                                         src={interval.values.weatherUtils.iconpath}
//                                         className="img-fluid"
//                                         style={{ maxWidth: '2rem', maxHeight: '2rem' }}
//                                         alt="Status Image"
//                                     />
//                                     <div>{interval.values.weatherUtils.status}</div>
//                                 </div>
//                             </td>
//                             <td>{interval.values.temperatureMax}</td>
//                             <td>{interval.values.temperatureMin}</td>
//                             <td>{interval.values.windSpeed}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default WeatherTable;