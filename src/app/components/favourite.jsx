'use client'

import { useEffect, useState } from 'react';
import { BsBookmark, BsFillBookmarkHeartFill } from 'react-icons/bs';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { isFavourited } from '@/lib/isFavourited';
import Link from 'next/link';

export default function FavouriteCareHome({ careHomeId, className}) {
  const [isFavourite, setIsFavourite] = useState(false);
  const { data: session, status } = useSession();

  const userId = session?.user.id

  useEffect(() => {}, [session]); //rerender once session has been fetched

  useEffect(() => {
    // Fetch favorite status from the API route when the component mounts
    if(session){
      const userId = session.user.id

      isFavourited(userId, careHomeId)
      .then(data => setIsFavourite(data))

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
            // console.log('component/favourite isFavouriteResponse and newIsfavourite', isFavouriteResponse, newIsFavourite)
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
          
          <BsFillBookmarkHeartFill onClick={handleToggleFavourite} className={`${className}`}/>
        ) : (
          <BsBookmark onClick={handleToggleFavourite} className={`${className}`}/>
        ) :
        <Link href='/login'>
            <BsBookmark className={`${className}`} />
        </Link>
      }
    </div>
  );
}
