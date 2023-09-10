export async function fetchCareHomes(userId) {
    try {
      const response = await fetch('api/careHome');
      if (!response.ok) {
        throw new Error('Failed to fetch care homes');
      }
      const data = await response.json();
    
      // // if user session - find and append favourited homes
      //note: not tested. use this to fetch the favourited care homes and append to the list of all careHomes to then render the marker in careHome map as favourite or not. need to apply incrementle static regeneration any time the favourited icon is used
      // if (userId){
      //   const favouritedHomesResponse = await fetch(`api/favourite?userId=${userId}`);
      //   if (!favouritedHomesResponse.ok) {
      //     throw new Error('Failed to fetch favorited homes');
      //   }
      //   const favouritedHomes = await favouritedHomesResponse.json();
    
      //   // Iterate over the data array and mark homes as favorites
      //   for (const home of data.careHomes) {
      //     if (favouritedHomes.some((favHome) => favHome._id === home._id)) {
      //       home.isFavourite = true;
      //     }
      //   }
      // }
      return data.careHomes;
      } catch (error) {
      console.error('Error:', error);
    }
  }
  