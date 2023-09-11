export async function fetchCareHomes() {
    try {
      const response = await fetch('api/careHome',
      {next:{revalidate: 10}},
      // {cache: 'no-store'}
      );
      if (!response.ok) {
        throw new Error('Failed to fetch care homes');
      }
      const data = await response.json();
    
      return data.careHomes;
      } catch (error) {
      console.error('Error:', error);
    }
  }
  