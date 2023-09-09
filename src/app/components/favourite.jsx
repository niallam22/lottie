'use client'

import { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function FavouriteCareHome({ careHomeId }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const { data: session, status } = useSession();

  const userId = session?.user.id

  useEffect(() => {}, [session]); //rerender once session has been fetched

  useEffect(() => {
    // Fetch favorite status from the API route when the component mounts
    if(session){
      fetch(`/api/favourite/isFavourite?userId=${session.user.id}&careHomeId=${careHomeId}`)
      .then((response) => response.json())
      .then((data) => {
        setIsFavourite(data.isFavourite);
      })
      .catch((error) => {
        console.error('Error fetching favourite status:', error);
      });
    }
  }, [session, careHomeId]);

  const handleToggleFavourite = () => {
    // Toggle the isFavourite state
    if (!session){
        redirect('/login')
    }else{
        const newIsFavourite = !isFavourite;
        
        fetch('/api/favourite', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId, 
            careHomeId, 
            newIsFavourite
          })
        })        
          .then((isFavouriteResponse) => {
            console.log('component/favourite isFavouriteResponse and newIsfavourite', isFavouriteResponse, newIsFavourite)
            setIsFavourite(newIsFavourite);
          })
          .catch((error) => {
            console.error('Error updating favorite status:', error);
          });
    }
  };

  return (
    <div >
      {session? 
        isFavourite ? (
          <AiFillStar onClick={handleToggleFavourite} style={{ fontSize: '30px', color: 'pink' }} />
        ) : (
          <AiOutlineStar onClick={handleToggleFavourite} style={{ fontSize: '30px', color: 'pink' }} />
        ) :
        <Link href='/login'>
            <AiOutlineStar style={{ fontSize: '30px', color: 'pink' }} />
        </Link>
      }
    </div>
  );
}
