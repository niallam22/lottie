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
      <Places
        setHome={(position) => {
          setHome(position);
          handleMapOptionsChange({
            ...mapOptions,
            center: position, // Update the center prop with the new position
          });
        }}
      />
      <MyMap mapOptions={mapOptions} home={home} />
    </Wrapper>
  );
}