const fetchDirections = (careHome, home) => {
    return new Promise((resolve, reject) => {
      if (!home) {
        reject("Home is not defined");
        return;
      }
      
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: home,
          destination: careHome,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            resolve(result);
          } else {
            reject("Unable to fetch directions");
          }
        }
      );
    });
  };
  
  export default fetchDirections