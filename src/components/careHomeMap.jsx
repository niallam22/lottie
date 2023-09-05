'use client'

import { useEffect, useState } from "react";
import Editing from "./Editing";
import Marker from "./marker";
import { AiFillStar  } from 'react-icons/ai';
import fetchDirections from "@/lib/fetchDirection";
import { fetchCareHomes } from "@/lib/fetchCareHomes";



const oldCareHomeData=[
  {
    _id: 'asfdas',
    name: "Bath",
    position: { lat: 51.3781018, lng: -2.3596827 },
    description: "Raining",
    rating: 4.5,
    cost: '1500',
  },
  {
    _id: 'asfddfsdfgsdfhgsds',
    name: "Guelph",
    position: { lat: 52.3781018, lng: -0.3596827 },
    description: "Cloudy",
    rating: 4.5,
    cost: '1500',
  },
  {
    _id: 'asfdaasdfasdfasdfasdfs',
    name: "Orangeville",
    position: { lat: 51.8781018, lng: -1.3596827 },
    description: "Sunny",
    rating: 4.5,
    cost: '1500',
  },
];

export default function CareHomeMap({ map, home }) {
  const [data, setData] = useState(careHomeData);
  const [highlight, setHighlight] = useState();
  const [editing, setEditing] = useState();
  const [polyline, setPolyline] = useState(null);
  const [durationMins, setDurationMins] = useState(null);
  const [directions, setDirections] = useState();

  const careHomeData = fetchCareHomes()

  // Call fetchDirections when home or careHomeData changes
  useEffect(() => {
    if (home) {
      // Pass care home's position, not the entire careHomeData object
      const careHome = data.find(item => item._id === editing);
      if (careHome) {
        fetchDirections(careHome.position, home).then(result => {
          setDirections(result);
        });
      }
    }
  }, [home, editing, data]);

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
  }, [directions]);
return (
  <>
    {editing && (
      <Editing
        careHome={data.find(item => item._id === editing)}
        update={(newCareHomeData) => {
          setData((existing) => {
            return existing.map(item => {
              if (item._id === editing) {
                return { ...item, ...newCareHomeData };
              }
              return item;
            });
          });
        }}
        close={() => setEditing(null)}
      />
    )}

    {data.map((careHome) => (
      <Marker
        key={careHome._id}
        map={map}
        position={careHome.position}
        onClick={() => {
          setEditing(careHome._id);
          fetchDirections(careHome.position, home);
        }}
      >
        <div
          className={`marker ${careHome.description.toLowerCase()} ${
            highlight === careHome._id || editing === careHome._id ? "highlight" : ""
          }`}
          onMouseEnter={() => setHighlight(careHome._id)} // Use _id as the unique identifier
          onMouseLeave={() => setHighlight(null)}
        >
          <h2>{careHome.description}</h2>
          <div>{'£' + careHome.cost + '/wk'}</div>
          {highlight === careHome._id || editing === careHome._id ? (
            <div className="careHomeInfo">
              <div className="duration">
                <p>Duration: {durationMins ? durationMins + 'mins' : 'enter location'}</p>
              </div>
              <div className="five-day">
                <p>{careHome.rating}
                  <AiFillStar style={{ fontSize: '30px', color: 'pink' }}/>
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





// import { useEffect, useState } from "react";
// import Editing from "./Editing";
// import Marker from "./marker";
// import { AiFillStar  } from 'react-icons/ai';
// import fetchDirections from "@/lib/fetchDirection";

// const careHomeData = {
//     A: {
//       _id: 'asfdas',
//       name: "Bath",
//       position: { lat: 51.3781018, lng: -2.3596827 },
//       description: "Raining",
//       rating: 4.5,
//       cost: '1500',
//     },
//     B: {
//       _id: 'asfdas',
//       name: "Guelph",
//       position: { lat: 52.3781018, lng: -0.3596827 },
//       description: "Cloudy",
//       rating: 4.5,
//       cost: '1500',
//     },
//     C: {
//       _id: 'asfdas',
//       name: "Orangeville",
//       position: { lat: 51.8781018, lng: -1.3596827 },
//       description: "Sunny",
//       rating: 4.5,
//       cost: '1500',
//     },
//   };
  
//   export default function CareHomeMap({ map, home }) {
//     const [data, setData] = useState(careHomeData);
//     const [highlight, setHighlight] = useState();
//     const [editing, setEditing] = useState();
//     const [polyline, setPolyline] = useState(null);
//     const [durationMins, setDurationMins] = useState(null);
//     const [directions, setDirections] = useState();
    
//       // Call fetchDirections when home or careHomeData changes
//   useEffect(() => {
//     if (home) {
//       // Pass care home's position, not the entire careHomeData object
//       const careHomePosition = data[editing]?.position;
//       if (careHomePosition) {
//         fetchDirections(careHomePosition, home).then(result => {
//           setDirections(result);
//         });
//       }
//     }
//   }, [home, editing, data]);
    
//     // const fetchDirections = (careHome, home) => {
//     //     if (!home) return;
//     //     const service = new google.maps.DirectionsService();
//     //     service.route(
//     //       {
//     //         origin: home,
//     //         destination: careHome,
//     //         travelMode: google.maps.TravelMode.DRIVING,
//     //       },
//     //       (result, status) => {
//     //         if (status === "OK" && result) {
//     //           setDirections(result);
//     //         }
//     //       }
//     //     );
//     //   };

//     //render directions and duration
//     useEffect(() => {
//       if (directions) {
//         const pathCoordinates = directions.routes[0].overview_path;
//         const polyLine = new google.maps.Polyline({
//           path: pathCoordinates,
//           geodesic: true,
//           strokeColor: "black", // Set the color of the line (blue in this case)
//           strokeOpacity: 1.0,
//           strokeWeight: 3, // Set the thickness of the line
//         });

//           // Remove the previous polyline if it exists
//           if(polyline){
//               polyline.setMap(null);
//           }
            
//         polyLine.setMap(map);
//         setPolyline(polyLine);
//         setDurationMins(Math.round(directions.routes[0].legs[0].duration.value/60))
//       }
//     }, [directions]);

//     return (
//       <>
//         {editing && (
//           <Editing
//             careHome={data[editing]}
//             update={(newCareHomeData) => {
//               setData((existing) => {
//                 return { ...existing, [editing]: { ...newCareHomeData } };
//               });
//             }}
//             close={() => setEditing(null)}
//           />
//         )}

//         {Object.entries(data).map(([key, careHome]) => (
//           <Marker
//             key={key}
//             map={map}
//             position={careHome.position}
//             onClick={() => {
//                 setEditing(key)
//                 fetchDirections( careHome.position, home)
//             }}
//           >
//             <div
//               className={`marker ${careHome.description.toLowerCase()} ${
//                 highlight === key || editing === key ? "highlight" : ""
//               }`}
//               onMouseEnter={() => setHighlight(key)}
//               onMouseLeave={() => setHighlight(null)}
//             >
//               <h2>{careHome.description}</h2>
//               <div>{'£' + careHome.cost + '/wk'}</div>
//               {highlight === key || editing === key ? (
//                 <div className="careHomeInfo">
//                 <div className="duration">
//                 <p>Duration: {durationMins? durationMins +'mins': 'enter location'}</p>
//                 </div>
//                 <div className="five-day">
//                   <p>{careHome.rating}
//                   <AiFillStar  style={{ fontSize: '30px', color: 'pink' }}/>
//                   </p>
//                 </div>
//                 </div>
//               ) : null}
//             </div>
//           </Marker>
//         ))}
//       </>
//     );
//   }