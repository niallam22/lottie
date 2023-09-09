export async function favouritedCareHomes() {
    try {
      const response = await fetch('http://localhost:3000/api/careHome') // /api/careHomes'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch care homes');
      }
      
      const data = await response.json();
      return data.careHomes;
    } catch (error) {
      console.error('Error:', error);
    }
  }