import { FC, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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


interface ProcessedData {
    [key: string]: {
        min: number;
        max: number;
    };
}

interface WeatherDataProp {
    data: WholeWeatherData  | undefined
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

const processData = (data: WholeWeatherData | undefined): ProcessedData => {
    const processedData: ProcessedData = {};

    data?.data.timelines[1].intervals.forEach(interval => {
        const date = new Date(interval.startTime);
        const day = date.toISOString().split('T')[0];

        if (!processedData[day]) {
            processedData[day] = {
                min: Infinity,
                max: -Infinity
            };
        }

        processedData[day].min = Math.min(processedData[day].min, interval.values.temperature);
        processedData[day].max = Math.max(processedData[day].max, interval.values.temperature);
    });

    return processedData;
};



// const TemperatureGraph: React.FC<TemperatureGraphProps> = () => {
const TemperatureGraph: FC<WeatherDataProp> = ({ data }) => {
    // console.log("IN temperature Graph", ndata)

    useEffect(() => {
        const resdata = processData(data);
        const startDate = new Date();
        startDate.setDate(startDate.getDate());

        const config: Highcharts.Options = {
            chart: {
                type: 'arearange',
                zooming: {
                    type: 'x'
                },
                scrollablePlotArea: {
                    scrollPositionX: 1
                }
            },
            title: {
                text: 'Temperature Ranges (Min, Max)'
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                min: startDate.getTime()
            },
            yAxis: {
                title: {
                    text: null
                },
                tickInterval: 5,
            },
            tooltip: {
                shared: true,
                valueSuffix: '°F',
                xDateFormat: '%A, %b %e'
            },
            series: [{
                type: 'arearange',
                name: '',
                data: Object.entries(resdata).map(([date, values]) => [
                    new Date(date).getTime(),
                    values.min,
                    values.max
                ]),
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#f79e05'],
                        [1, '#66ccff']
                    ]
                },
                fillOpacity: 0.3,
                marker: {
                    enabled: true,
                    fillColor: '#66ccff',
                },
                lineWidth: 1,
                lineColor: '#f79e05',
                showInLegend: false,
            }]
        };

        Highcharts.setOptions({
            time: {
                timezone: 'America/Los_Angeles'
            }
        });

        Highcharts.chart('container', config);
    }, [data]); // Dependency array

    return <div className="w-100 col-12 col-sm-9" id="container"></div>;
};

export default TemperatureGraph

// function processData(data) {
//     const processedData = {};
//     // const today = new Date();
//     // const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     // console.log("START", startDate);
//     data.body.data.timelines[1].intervals.forEach(interval => {

//         const date = new Date(interval.startTime);
//         // console.log("DATE IN FN:", date.toUTCString())

//         const day = date.toISOString().split('T')[0];
//         // console.log("DAY IN FN:", day)
//         if (!processedData[day]) {
//             processedData[day] = {
//                 min: Infinity,
//                 max: -Infinity
//             };
//         }


//         processedData[day].min = Math.min(processedData[day].min, interval.values.temperature);
//         processedData[day].max = Math.max(processedData[day].max, interval.values.temperature);
//     });



// const getGraph = (weatherdata) => {
//     console.log('Hourly: ', processData(weatherdata));
//     data = processData(weatherdata);
//     console.log(data);
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate());
//     const config = {
//         chart: {
//             type: 'arearange',
//             zooming: {
//                 type: 'x'
//             },
//             scrollablePlotArea: {
//                 minWidth: 600,
//                 scrollPositionX: 1
//             }
//         },
//         title: {
//             text: 'Temperature Ranges (Min, Max)'
//         },
//         xAxis: {
//             type: 'datetime',
//             tickInterval: 24 * 3600 * 1000,
//             min: startDate.getTime()
//         },
//         yAxis: {
//             title: {
//                 text: null
//             },
//             tickInterval: 5,
//         },
//         tooltip: {
//             crosshairs: true,
//             shared: true,
//             valueSuffix: '°F',
//             xDateFormat: '%A, %b %e'
//         },
//         series: [{
//             name: '',
//             data: data,
//             color: {
//                 linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
//                 stops: [
//                     [0, '#f79e05'],
//                     [1, '#66ccff']
//                 ]
//             },
//             fillOpacity: 0.3,
//             marker: {
//                 enabled: true,
//                 fillColor: '#66ccff',
//             },
//             lineWidth: 1,
//             lineColor: '#f79e05',
//             showInLegend: false,
//         }]
//     };
//     Highcharts.setOptions({
//         time: {
//             timezone: 'America/Los_Angeles'
//         }
//     });
//     Highcharts.chart('container', config);
// }