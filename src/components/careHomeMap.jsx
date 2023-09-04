'use client'

import { useEffect, useState } from "react";
import Editing from "./Editing";
import Marker from "./marker";
import { AiFillStar  } from 'react-icons/ai';

const careHomeData = {
    A: {
      name: "Bath",
      position: { lat: 51.3781018, lng: -2.3596827 },
      climate: "Raining",
      rating: 4.5,
      cost: '1500',
    },
    B: {
      name: "Guelph",
      position: { lat: 52.3781018, lng: -0.3596827 },
      climate: "Cloudy",
      rating: 4.5,
      cost: '1500',
    },
    C: {
      name: "Orangeville",
      position: { lat: 51.8781018, lng: -1.3596827 },
      climate: "Sunny",
      rating: 4.5,
      cost: '1500',
    },
  };
  
  export default function CareHomeMap({ map, home }) {
    const [data, setData] = useState(careHomeData);
    const [highlight, setHighlight] = useState();
    const [editing, setEditing] = useState();
    const [polyline, setPolyline] = useState(null);
    const [durationMins, setDurationMins] = useState(null);
    const [directions, setDirections] = useState();
    
    const fetchDirections = (careHome, home) => {
        if (!home) return;
        const service = new google.maps.DirectionsService();
        service.route(
          {
            origin: home,
            destination: careHome,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirections(result);
            }
          }
        );
      };

    //render directions and duration
    useEffect(() => {
      if (directions) {
        const pathCoordinates = directions.routes[0].overview_path;
        const polyLine = new google.maps.Polyline({
          path: pathCoordinates,
          geodesic: true,
          strokeColor: "black", // Set the color of the line (blue in this case)
          strokeOpacity: 1.0,
          strokeWeight: 3, // Set the thickness of the line
        });

          // Remove the previous polyline if it exists
          if(polyline){
              polyline.setMap(null);
          }
            
        polyLine.setMap(map);
        setPolyline(polyLine);
        setDurationMins(Math.round(directions.routes[0].legs[0].duration.value/60))
      }
    }, [directions]);

    return (
      <>
        {editing && (
          <Editing
            weather={data[editing]}
            update={(newWeather) => {
              setData((existing) => {
                return { ...existing, [editing]: { ...newWeather } };
              });
            }}
            close={() => setEditing(null)}
          />
        )}
        {Object.entries(data).map(([key, weather]) => (
          <Marker
            key={key}
            map={map}
            position={weather.position}
            onClick={() => {
                setEditing(key)
                fetchDirections( weather.position, home)
            }}
          >
            <div
              className={`marker ${weather.climate.toLowerCase()} ${
                highlight === key || editing === key ? "highlight" : ""
              }`}
              onMouseEnter={() => setHighlight(key)}
              onMouseLeave={() => setHighlight(null)}
            >
              <h2>{weather.climate}</h2>
              <div>{'£' + weather.cost + '/wk'}</div>
              {highlight === key || editing === key ? (
                <div className="careHomeInfo">
                <div className="duration">
                <p>Duration: {durationMins? durationMins +'mins': 'enter location'}</p>
                </div>
                <div className="five-day">
                  <p>{weather.rating}
                  <AiFillStar  style={{ fontSize: '30px', color: 'pink' }}/>
                  </p>
                </div>
                </div>
              ) : null}
            </div>
          </Marker>
        ))}
      </>
    );
  }