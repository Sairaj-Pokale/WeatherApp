import { FC, useEffect } from "react"
import { Loader } from "@googlemaps/js-api-loader";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


declare global {
    interface Window {
        initMap: () => void;
    }
}

interface MapSectionProps {
    latitude: number;
    longitude: number;
}


const MapSection: FC<MapSectionProps> = ({ latitude, longitude }) => {
    useEffect(() => {

        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["maps", "marker"]
        });

        const initializeMap = async () => {
            try {
                await loader.load();
                const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                const map = new Map(document.getElementById('map') as HTMLElement, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 17,
                    mapId: '4504f8b37365c3d0',
                });
                // add the latitude and longitude
                const marker01 = new AdvancedMarkerElement({
                    map,
                    position: { lat: latitude, lng: longitude },
                    title: 'This marker is visible at zoom level 15 and higher.'
                });
            } catch (error) {
                console.error("Error loading Google Maps:", error);
            }
        };

        initializeMap();
        return () => { };
    }, [latitude, longitude]);


    return (
        <div className="w-100">
            <div id="map" style={{height:"400px"}}></div>
        </div>


    );
}

export default MapSection


// <div className="col-sm-9 col-12">

//     <div className="ratio ratio-16x9">

//     </div>
// </div>
// async function initMap() {
//     // Request needed libraries.
//     const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
//     const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

//     const map = new Map(document.getElementById('map') as HTMLElement, {
//         center: { lat: 37.424563902650114, lng: -122.09512859577026 },
//         zoom: 17,
//         mapId: '4504f8b37365c3d0',
//     });

//     const marker01 = new AdvancedMarkerElement({
//         map,
//         position: { lat: 37.4239163, lng: -122.094 },
//         title: 'This marker is visible at zoom level 15 and higher.'
//     });
// }