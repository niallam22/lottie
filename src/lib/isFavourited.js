export async function isFavourited(userId, careHomeId) {
//check if carehome is favourited by user
    try {
      // Create a new FormData object
      const formData = new FormData();

      formData.append('userId', userId);
      formData.append('careHomeId', careHomeId);
  
      // Define the API endpoint URL
      const apiUrl = '/api/favourite/isFavourite';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Failed to fetch care homes');
      }

      const data = await response.json();

    } catch (error) {
        console.error('Error fetching favourite status:', error);
    }
    }
  