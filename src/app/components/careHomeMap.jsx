'use client'

import { useEffect, useState } from "react";
import Editing from "./Editing";
import Marker from "./marker";
import fetchDirections from "@/lib/fetchDirection";
import { fetchCareHomes } from "@/lib/fetchCareHomes";
import { useSession } from "next-auth/react";
import { AiFillStar, AiOutlineStar  } from 'react-icons/ai';
import { FaMapMarker } from "react-icons/fa";


export default function CareHomeMap({ map, home }) {
  const [careHomeData, setCareHomeData] = useState();
  const [highlight, setHighlight] = useState();
  const [editing, setEditing] = useState();
  const [polyline, setPolyline] = useState(null);
  const [durationMins, setDurationMins] = useState(null);
  const [directions, setDirections] = useState();
  const { data: session, status } = useSession();

  const userId = session?.user.id

  useEffect(() => {}, [session]); //rerender once session has been fetched


  useEffect(()=>{
    try {
      if(userId){
        fetchCareHomes(userId).then(data =>{
          setCareHomeData(data)
        })
      } else { 
        fetchCareHomes().then(data =>{
          setCareHomeData(data)
        })
      }
    } catch (error) {
      console.log(error)
    }
  },[])

  // Call fetchDirections when home or careHomeData changes
  useEffect(() => {
    if (home) {
      // find carehome that is being edited
      const careHome = careHomeData.find(item => item._id === editing);
      if (careHome) {
        fetchDirections({lat: careHome.lat, lng: careHome.lng}, home).then(result => {
          setDirections(result);
        });
      }
    }
  }, [home, editing, careHomeData]);

  //render directions and duration
  useEffect(() => {
    if (directions) {
      const pathCoordinates = directions.routes[0].overview_path;
      const polyLine = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: "black",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });

      // Remove the previous polyline if it exists
      if(polyline){
        polyline.setMap(null);
      }

      polyLine.setMap(map);
      setPolyline(polyLine);
      setDurationMins(Math.round(directions.routes[0].legs[0].duration.value/60))
    }
  }, [directions, map, polyline]);
return (
  <>
    {editing && (
      <Editing
        careHome={careHomeData.find(item => item._id === editing)}
        update={(newCareHomeData) => {
          
          setCareHomeData((existing) => { 
            return existing.map(item => {
              if (item._id === editing) {
                return { ...item, ...newCareHomeData };
              }
              return item;
            });
          });
        }}
          // update={(newCareHomeData) => {
          //   setData((existing) => {// passing callback function to setData gives the existing data
          //     return { ...existing, [editing]: { ...newCareHomeData } };
          //   });
          // }}
        close={() => setEditing(null)}
      />
    )}

    {careHomeData && careHomeData.map((careHome) => (
      <Marker
        key={careHome._id}
        map={map}
        position={{lat: careHome.lat, lng: careHome.lng}}
        onClick={() => {
          setEditing(careHome._id);
          fetchDirections({lat: careHome.lat, lng: careHome.lng}, home);
        }}
      >
        <div
          className={`marker ${careHome.description.toLowerCase()} ${
            highlight === careHome._id || editing === careHome._id ? "highlight" : ""
          }`} //conditional classes
          onMouseEnter={() => setHighlight(careHome._id)} // Use _id as the unique identifier
          onMouseLeave={() => setHighlight(null)}
        >
            {/* <AiFillStar style={{ fontSize: '20px', color: 'yellow' }} /> */}
            <FaMapMarker className="iconNotFavourite" style={{ fontSize: '30px' }} />

          {highlight === careHome._id || editing === careHome._id ? (     
            <div className="careHomeInfo">
              <h2>{careHome.name}</h2>
              <div>{'Cost: £ ' + careHome.cost + '/wk'}</div>
              <div className="duration">
                <p>Duration: {durationMins && editing === careHome._id ? durationMins + 'mins' : 'select location'}</p>
              </div>
              <div className="absolute top-4 right-1">
                <div className="flex">
                  <span className="text-base px-1">{careHome.rating + '/5'}</span>
                  <AiFillStar style={{ fontSize: '30px', color: 'pink' }}/>
                </div>

              </div>
            </div>
          ) : null}
        </div>
      </Marker>
    ))}
  </>
);
}