'use client'
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export default function Marker({ map, position, children, onClick }) {
    const rootRef = useRef();
    const markerRef = useRef();

    // html rendering inside advanced marker through 'creating mini react apps' so that when the children change they re-render into the div created and that is being shown as an advanced marker
    useEffect(() => {
      if (!rootRef.current) {
        const container = document.createElement("div");
        rootRef.current = createRoot(container);
  
        markerRef.current = new google.maps.marker.AdvancedMarkerView({
          position,
          content: container,
        });
      }
  
      return () => (markerRef.current.map = null);
    }, []);
  
    useEffect(() => {
      rootRef.current.render(children);
      markerRef.current.position = position;
      markerRef.current.map = map;
      const listener = markerRef.current.addListener("click", onClick);
      return () => listener.remove();//clean up function runs whenever a second useEffect is called 'invalidating the first'
    }, [map, position, children, onClick]);
  }

