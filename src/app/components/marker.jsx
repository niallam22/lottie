'use client'
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export default function Marker({ map, position, children, onClick }) {
    const rootRef = useRef();
    const markerRef = useRef();

    // care home data rendering inside advanced marker through 'creating mini react apps' so that when the children change they re-render in the div container created
    useEffect(() => {
      if (!rootRef.current) { //only intialise once (in dev mode components are mounted twice)
        
        //creates a react root for the virtual dom to render data to the browser DOM
        
        const container = document.createElement("div"); //browser DOM node
        rootRef.current = createRoot(container);
  
        markerRef.current = new google.maps.marker.AdvancedMarkerView({ //single instance of class AdvancedMarkerView
          position,
          content: container, //class accepts DOM node container then react DOM renders react code to node
          zIndex: 100
        });
      }
  
      return () => (markerRef.current.map = null);
    },[]);
  
    useEffect(() => {
      //children (care home data) is rendered to the root node container 
      rootRef.current.render(children);
      markerRef.current.position = position;
      markerRef.current.map = map;
      const listener = markerRef.current.addListener("click", onClick);
      return () => listener.remove();//clean up function runs whenever a second useEffect is called 'invalidating the first'
    }, [map, position, children, onClick]);
  }

