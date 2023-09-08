'use client'
import { FaMapMarker } from 'react-icons/fa';
import { useEffect, useMemo, useState } from "react";
import Marker from "./marker";
import CareHomeMap from "./careHomeMap";

export default function MyMap({mapOptions, home}) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    setMap(new window.google.maps.Map(document.getElementById("map"), mapOptions));
  }, [mapOptions]);

  return (
    <>
      <div id="map" >
      {map && home && <Marker map={map} position={home} >
        <div>
          <FaMapMarker style={{ fontSize: '38px', color: 'red' }} />
        </div>
      </Marker> }
        {map && <CareHomeMap map={map} home={home}/>}
      </div>

    </>
  );
}