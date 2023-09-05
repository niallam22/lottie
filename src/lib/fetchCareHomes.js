export async function fetchCareHomes() {
    try {
      const response = await fetch('/api/careHomes'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch care homes');
      }
      const data = await response.json();
      return data.careHomes;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to handle it at a higher level
    }
  }
  