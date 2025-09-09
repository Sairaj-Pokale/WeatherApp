import { FC, useState, useEffect, useRef } from "react"
import WeatherTable from "./WeatherTable"
import Toast from "./Toast"
import TemperatureGraph from "./TemperatureGraph"
import Metro from "./metro"
import axios from "axios"
import { Carousel } from 'bootstrap';
import IndividualWeatherCard from "./IndividualWeatherCard"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// interface ResultsDataProp {
//   data: data | undefined
//   location: string | undefined
// }

interface ResultsDataProp {
  data: WholeWeatherData | undefined
  location: string | undefined
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


const Results: FC<ResultsDataProp> = ({ data, location }) => {
  const [activeTab, setActiveTab] = useState('day');
  const [fav, setFav] = useState(false);
  // const [isSlideVisible, setIsSlideVisible] = useState(false);
  const [individulaPageIndex, setindividulaPageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  // const DayView = () => (
  //   <div>Day View Content</div>
  // );

  // const DailyTempChart = () => (
  //   <div>Temperature Chart Content</div>
  // );
  // data?.isFavorite ? setFav(true): setFav(false)
  useEffect(() => {
    if (data?.isFavorite !== undefined) {
      setFav(data.isFavorite);
    }
  }, [data?.isFavorite]);
  // console.log(fav)
  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, tabId: string) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleUnFavoriteClick = async (data: WholeWeatherData | undefined) => {
    console.log(data?.cityID)
    // setIsLoading(true);
    try {
      await axios.delete(`https://webtechassign3-441822.uw.r.appspot.com/delete_favorite/${data?.cityID}`);
      setFav(false);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  const handleFavoriteClick = async (data: WholeWeatherData | undefined) => {
    try {
      await axios.post(`https://webtechassign3-441822.uw.r.appspot.com/add_favourite`, {
        "city": data?.city_main, "state": data?.state_main, "latitude": data?.Latitude,
        "longitude": data?.Longitude
      });
      setFav(true);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  }

  // const toggleSlide = () => {
  //   setIsSlideVisible(!isSlideVisible);
  // };
  // console.log("IN Results", data)
  const handleAnimation = () => {
    // console.log("IN HANDLE ANIMATION")
    try {
      // console.log("IN HANDLE ANIMATION");
      if (carouselRef.current) {
        const carousel = Carousel.getOrCreateInstance(carouselRef.current);
        carousel.next();
      }
    } catch (error) {
      console.error("Carousel Animation Error:", error);
    }
  };
  const handleClose = () => {
    console.log("on handleClose")
    if (carouselRef.current) {
      const carousel = Carousel.getOrCreateInstance(carouselRef.current);
      carousel.prev();
    }
  };

  const indexFromTable = (index: number) => {
    setindividulaPageIndex(index);
    handleAnimation()
  }

  return (
    <div className="container w-100 col-12 col-sm-9 p-0">
      <div
        className="carousel slide"
        data-bs-interval="false"
        ref={carouselRef}
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="content">
              <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                <div className="fs-4">Forecast at {location ? location : data?.formalizedAddress}</div>
                <div className="w-100 d-flex justify-content-end align-items-center">

                  {
                    fav ? (
                      <button type="button" className="btn-light rounded-lg border border-2 border-secondary" onClick={() => handleUnFavoriteClick(data)}>
                        <i className="bi bi-star-fill" style={{ color: 'yellow' }} > </i>
                      </button>
                    ) : (
                      <button type="button" className="btn-light rounded-lg border border-2 border-secondary" onClick={() => handleFavoriteClick(data)}>
                        <i className="bi bi-star"></i>
                      </button>
                    )}

                  {/* <button type="button" className="btn-light rounded-lg border border-2 border-secondary">
        <i className="bi bi-star"></i>
      </button> */}
                  {/* <button type="button" className="btn-light rounded-lg border border-2 border-secondary">
        <i className="bi bi-star-fill" style={{ color: 'yellow' }}></i>
      </button> */}
                  <div onClick={handleAnimation}>Details</div>

                </div>
                <div className="w-100 d-flex justify-content-end align-items-center">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'day' ? 'active' : ''}`}
                        onClick={(e) => handleTabClick(e, 'day')}
                        aria-current={activeTab === 'day' ? 'page' : undefined}
                      >
                        Day view
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'temp' ? 'active' : ''}`}
                        href="#"
                        onClick={(e) => handleTabClick(e, 'temp')}
                        aria-current={activeTab === 'temp' ? 'page' : undefined}
                      >Daily Temp Chart</a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'meteogram' ? 'active' : ''}`}
                        href="#"
                        onClick={(e) => handleTabClick(e, 'meteogram')}
                        aria-current={activeTab === 'meteogram' ? 'page' : undefined}
                      >Meteogram</a>
                    </li>
                  </ul></div>
                <div className="tab-content w-100">
                  {activeTab === 'day' && (
                    data && 'errmsg' in data ?
                      <Toast color="red" desc="Sorry!! No Records Found" /> :
                      <WeatherTable wdata={(data)} onTableClick={indexFromTable} />
                  )}
                  {activeTab === 'temp' && (
                    data && 'errmsg' in data ? <Toast color="red" desc="Sorry!! No Records Found" />
                      : <TemperatureGraph data={(data)}></TemperatureGraph>

                  )}
                  {activeTab === 'meteogram' && (
                    data && 'errmsg' in data ? <Toast color="red" desc="Sorry!! No Records Found" />
                      : <Metro mdata={(data)} />

                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="content">
              <div className="w-100 d-flex justify-content-center align-items-center mt-3">
                <IndividualWeatherCard idata={data} index={individulaPageIndex} onReturn={handleClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="container">
    //   <div
    //     className="carousel slide"
    //     data-bs-interval="false"
    //     ref={carouselRef}
    //   >
    //     <div className="carousel-inner">
    //       {/* First Slide */}
    //       <div className="carousel-item active">
    //         <div className="content">
    //           <h3>Forecast Details</h3>
    //           <button className="btn btn-primary" onClick={handleAnimation}>
    //             Next Slide
    //           </button>
    //         </div>
    //       </div>

    //       {/* Second Slide */}
    //       <div className="carousel-item">
    //         <div className="content">
    //           <h3>Sliding Content</h3>
    //           <button className="btn btn-secondary" onClick={handleClose}>
    //             Previous Slide
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //   </div>
    // </div>


    // <div className="position-relative">
    //   <div
    //     className="cursor-pointer"

    //     tabIndex={0}
    //   >

    //   </div>
    //   <div
    //     className={`
    //       position-absolute
    //       top-0 
    //       left-0 
    //       translate-50%
    //       h-100 
    //       w-100 
    //       bg-white 
    //       transition-transform 
    //       duration-300
    //       ${isSlideVisible ? 'start-0' : 'start-100'}
    //     `}
    //     style={{
    //       transition: 'transform 0.3s ease-in-out',
    //       transform: isSlideVisible ? 'translateX(0)' : 'translateX(100%)'
    //     }}
    //   >
    //     <IndividualWeatherCard idata={data} index={individulaPageIndex} />
    //   </div>
    // </div>

  )
}

export default Results