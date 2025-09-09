import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import windbarb from 'highcharts/modules/windbarb';
windbarb(Highcharts);
import HighchartsMore from 'highcharts/highcharts-more';



// Initialize modules
HighchartsMore(Highcharts);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// interface Window {
//     meteogram?: Meteogram;
// }

// Ensure TypeScript knows about the new window property
declare global {
    interface Window {
        meteogram?: Meteogram;
    }
}

interface MetroProps {
    mdata: WholeWeatherData | undefined
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

interface DataPoint {
    x: number;
    y: number;
}

interface Wind {
    [key: number]: {
        direction: number;
        value: number;
    };
}

const processTemp = (data: WholeWeatherData): DataPoint[] => {
    const processedT: { [key: number]: number } = {};

    data?.data.timelines[1].intervals.forEach(interval => {
        const date = new Date(interval.startTime);
        const day = date.getTime();
        if (!processedT[day]) {
            processedT[day] = interval.values.temperature;
        }
        console.log(typeof interval.values.temperature)
        console.log(typeof processedT[day])
    });


    return Object.keys(processedT).map(keyd => {
        return { x: parseInt(keyd, 10), y: processedT[parseInt(keyd, 10)] };
    });
};

const processAirPressure = (data: WholeWeatherData): DataPoint[] => {
    const processedP: { [key: number]: number } = {};

    data.data.timelines[1].intervals.forEach(interval => {
        const date = new Date(interval.startTime);
        const day = date.getTime();
        if (!processedP[day]) {
            processedP[day] = interval.values.pressureSeaLevel;
        }
    });

    return Object.keys(processedP).map(keyd => {
        return { x: parseInt(keyd, 10), y: processedP[parseInt(keyd, 10)] };
    });
};

const processHumidity = (data: WholeWeatherData): DataPoint[] => {
    const processedH: { [key: number]: number } = {};

    data.data.timelines[1].intervals.forEach(interval => {
        const date = new Date(interval.startTime);
        const day = date.getTime();
        if (!processedH[day]) {
            processedH[day] = Math.floor(interval.values.humidity);
        }
    });

    return Object.keys(processedH).map(keyd => {
        return { x: parseInt(keyd, 10), y: processedH[parseInt(keyd, 10)] };
    });
};

const processWind = (data: WholeWeatherData) => {
    const processedW: { [key: number]: { 'direction': number, 'value': number } } = {};

    data.data.timelines[1].intervals.forEach((interval, i) => {
        const date = new Date(interval.startTime);
        const day = date.getTime();

        if (i % 2 === 0) {
            if (!processedW[day]) {
                processedW[day] = {
                    'direction': interval.values.windDirection,
                    'value': interval.values.windSpeed
                };
            }
        }
    });

    return Object.keys(processedW).map(keyw => {
        return {
            x: parseInt(keyw, 10),
            value: processedW[parseInt(keyw, 10)].value,
            direction: processedW[parseInt(keyw, 10)].direction
        };
    });
};


// function Meteogram(json, container) {

//     this.precipitations = [];
//     this.precipitationsError = [];
//     this.winds = [];
//     this.temperatures = [];
//     this.pressures = [];


//     this.json = json;
//     this.container = container;

//     // Run
//     this.parseYrData();
// }

// Meteogram.prototype.parseYrData = function () {

//     if (!this.json) {
//         return this.error();
//     }

//     this.temperatures = processTemp(this.json);
//     this.precipitations = processHumidity(this.json);
//     this.pressures = processAirPressure(this.json);
//     this.winds = processWind(this.json);

//     this.createChart();
// };

class Meteogram {
    private precipitations: DataPoint[];
    // private precipitationsError: number[];
    private winds: Wind[];
    private temperatures: DataPoint[];
    private pressures: DataPoint[];
    private json: WholeWeatherData | undefined;
    private container: string | HTMLElement;
    private chart: Highcharts.Chart | null = null;
    constructor(json: WholeWeatherData | undefined, container: string | HTMLElement) {
        this.precipitations = [];
        // this.precipitationsError = [];
        this.winds = [];
        this.temperatures = [];
        this.pressures = [];
        this.chart;
        this.json = json;
        this.container = container;

        this.parseYrData();
    }

    private error(): void {
        console.error('Error parsing weather data');
    }

    //     private drawBlocksForWindArrows(chart): void {
    //         const xAxis = chart.xAxis[0];

    //         for (
    //             let pos = xAxis.min, max = xAxis.max, i = 0;
    //             pos <= max + 36e5; pos += 36e5, i += 1
    //         ) {
    //             // Get the X position
    //             const isLast = pos === max + 36e5,
    //                 x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

    //             // Draw the vertical dividers and ticks
    //             const isLong = this.resolution > 36e5
    //                 ? pos % this.resolution === 0
    //                 : i % 2 === 0;

    //             chart.renderer
    //                 .path([
    //                     'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
    //                     'L', x, chart.plotTop + chart.plotHeight + 32,
    //                     'Z'
    //                 ])
    //                 .attr({
    //                     stroke: chart.options.chart.plotBorderColor,
    //                     'stroke-width': 1
    //                 })
    //                 .add();
    //         }

    //         // Center items in block
    //         chart.get('windbarbs').markerGroup.attr({
    //             translateX: chart.get('windbarbs').markerGroup.translateX + 8
    //         });
    //     }
    // }

    private createChart(): void {
        Highcharts.setOptions({
            time: {
                timezone: 'America/Los_Angeles'
            }
        });

        this.chart = new Highcharts.Chart(
            this.getChartOptions(),

        );
        // (chart: Highcharts.Chart) => {
        //     this.onChartLoad(chart);
        // }
    }

    // private onChartLoad(chart) {
    //     this.drawBlocksForWindArrows(chart);
    // }

    private getChartOptions(): Highcharts.Options {
        return {
            chart: {
                renderTo: this.container,
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                height: 310,
                alignTicks: false,
                scrollablePlotArea: {
                    minWidth: 720
                }
            },
            title: {
                text: 'Hourly Weather (For Next 5 Days)',
                align: 'center',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }
            },

            credits: {
                text: 'Forecast from <a href="https://yr.no">yr.no</a>',
                href: 'https://yr.no',
                position: {
                    x: -40
                }
            },

            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat:
                    '<small>{point.x:%A, %b %e, %H:%M} - ' +
                    '{point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'
            },

            xAxis: [{ // Bottom X axis
                type: 'datetime',
                tickInterval: 2 * 36e5, // two hours
                minorTickInterval: 36e5, // one hour
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                },
                crosshair: true
            }, { // Top X axis
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                    align: 'left',
                    x: 3,
                    y: 8
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1
            }],

            yAxis: [{ // temperature axis
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°',
                    style: {
                        fontSize: '10px'
                    },
                    x: -3
                },
                plotLines: [{ // zero plane
                    value: 0,
                    color: '#BBBBBB',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'

            }, { // precipitation axis
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0

            }, { // Air pressure
                allowDecimals: false,
                title: {
                    text: 'inHg',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: '10px',
                        color: '#f79e05'
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: '8px',
                        color: '#f79e05'
                    },
                    y: 2,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false,
                lineColor: '#f79e05'
            }],

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    pointPlacement: 'between'
                }
            },

            series: [{
                name: 'Temperature',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}°F</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            }, {
                name: 'Humidity',
                data: this.precipitations,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    enabled: true,
                    inside: false,
                    style: {
                        fontSize: '5px',
                        fontWeight: 'bold',
                        color: '#000'
                    }
                },
                tooltip: {
                    valueSuffix: ' mm'
                }
            }, {
                name: 'Air Pressure',
                type: 'line',
                yAxis: 2,
                data: this.pressures,
                color: '#f79e05',
                tooltip: { valueSuffix: ' inHg' },
                dashStyle: "ShortDot",
                marker: {
                    enabled: false
                }
            },
            {
                name: 'Wind',
                type: 'windbarb',
                id: 'windbarbs',
                color: "#48AFE8",
                lineWidth: 1.5,
                data: this.winds,
                vectorLength: 18,
                yOffset: -15,
                tooltip: {
                    valueSuffix: ' m/s'
                }
            }]
        };
    }

    private parseYrData(): void {
        if (!this.json) {
            return this.error();
        }

        this.temperatures = processTemp(this.json);
        this.precipitations = processHumidity(this.json);
        this.pressures = processAirPressure(this.json);
        this.winds = processWind(this.json);

        this.createChart();
    }
}


const Metro: React.FC<MetroProps> = ({ mdata }) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    // console.log(processWind(wdata));
    // Dummy data to populate the arrays
    //   const dummySymbols = ['clearsky', 'rain', 'fog', 'partlycloudy', 'cloudy'];
    // const dummyTemperatures = processTemp(wdata);
    // const dummyPrecipitations = processHumidity(wdata);
    // const dummyPrecipitationsError = [0.1, 1.2, 0.1, 0.7, 0.5];
    // const dummyWinds = processWind(wdata);
    // const dummyPressures = processAirPressure(wdata);
    // const minY = Math.floor(dummyPressures.reduce((min, current) => Math.min(min, current.y), Infinity));
    // const maxY = Math.floor(dummyPressures.reduce((max, current) => Math.max(max, current.y), -Infinity));

    useEffect(() => {
        if (chartRef.current) {
            // Optional: Additional setup for drawing custom symbols or any post-processing
        }

        window.meteogram = new Meteogram(mdata, 'metrocontainer');
    }, [mdata]);

    return (
        <div className="w-100 col-12 col-sm-9" id="metrocontainer"></div>
    );
};

export default Metro;
