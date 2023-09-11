'use client'
import { useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import MyMap from "./MyMap";
import Places from "./Places";

export default function SearchMap() {
  const [home, setHome] = useState(null);
  const [mapOptions, setMapOptions] = useState({
    mapId: process.env.NEXT_PUBLIC_MAP_ID,
    center: { lat: 51.5072178,lng: -0.1275862 },
    zoom: 7,
    disableDefaultUI: true,
  });

  const handleMapOptionsChange = (newOptions) => {
    setMapOptions(newOptions);
  };

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
      version="beta"
      libraries={["marker", "places"]}
    >
      <div className="p-12 my-6 border-solid rounded-3xl border-slate-900 border-2 flex flex-col">
        <div>
          <h2 className=" md:text-4xl text-xl font-bold text-pink-300">Search care homes</h2>
        </div>
        <Places
          setHome={(position) => {
            setHome(position);
            handleMapOptionsChange({
              ...mapOptions,
              center: position, // Update the center prop with the new position
            });
          }}
        />
        <div className="font-bold py-2 text-lg">
          Tip: Enter a location and select a carehome on the map to view the journey and duration
        </div>
      </div>
      <MyMap mapOptions={mapOptions} home={home} />
    </Wrapper>
  );
}