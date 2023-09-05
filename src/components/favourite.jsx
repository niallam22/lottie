'use client'

import { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export default function FavouriteCareHome({ careHomeId, userId }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch favorite status from the API route when the component mounts
    const res = await fetch(`/api/favourite?userId=${userId}&careHomeId=${careHomeId}`)
    .then((response) => response.json())
    .then((data) => {
      setIsFavourite(data.isFavourite);
    })
    .catch((error) => {
      console.error('Error fetching favourite status:', error);
    });

  //   fetch('/api/favourite', {
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //         userId, careHomeId
  //     })
  // }).then((response) => response.json())
  //     .then((data) => {
  //     setIsFavourite(data.isFavourite);
  //     })
  //     .catch((error) => {
  //     console.error('Error fetching favourite status:', error);
  //     })
  }, []);

  const handleToggleFavourite = () => {
    // Toggle the isFavourite state
    if (!session){
        redirect('/api/auth/signin?callbackUrl=/search')
    }else{
        const newIsFavourite = !isFavourite;

        // Update the favorite status via the API
        fetch(`/api/favorites?userId=${userId}&careHomeId=${careHomeId}&isFavourite=${newIsFavourite}`, {
          method: 'PUT',
          body: JSON.stringify({ isFavourite: newIsFavourite }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => {
            setIsFavourite(newIsFavourite);
          })
          .catch((error) => {
            console.error('Error updating favorite status:', error);
          });
    }

  };

  return (
    <div onClick={handleToggleFavourite}>
      {isFavourite ? (
        <AiFillStar style={{ fontSize: '30px', color: 'pink' }} />
      ) : (
        <AiOutlineStar style={{ fontSize: '30px', color: 'pink' }} />
      )}
    </div>
  );
}
