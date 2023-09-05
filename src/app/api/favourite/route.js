import { connectMongoDB } from '@/lib/mongodb';
import Favourite from '@/models/favourite';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

//check if carehome is favourited by user
export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      const careHomeId = searchParams.get('careHomeId');
    // to return all search parameter entries not just explicitly specified ones
    // const obj = Object.fromEntries(searchParams.entries())
      let isFavourite;
  
      await connectMongoDB();
  
      const data = await Favourite.findOne({ user: userId, careHome: careHomeId });
  
      // If document exists, use the value; otherwise, set the default to false
      isFavourite = data ? data.isFavourite : false;
  
      const responseBody = { isFavourite };

      return NextResponse.json(responseBody);

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.error({ message: 'Error occurred' });
    }
  }
   
      export async function PUT(request) {
        try {
          const data = await request.json();
          const { userId, careHomeId, newIsFavourite } = data;
      
          await connectMongoDB();
      
          const updatedDocument = await Favourite.findOneAndUpdate(
            { user: userId, careHome: careHomeId },
            { isFavourite: newIsFavourite },
            { upsert: true, new: true }
          );
      
          if (updatedDocument) {
            // Document found or created successfully
            console.log('api/favourite/route PUT updatedDocument', updatedDocument);
            const message = { message: 'Update successful' };
            return NextResponse.json(message);
          } else {
            // Handle the case where the document was not updated
            return NextResponse.error({ message: 'Update failed' });
          }
        } catch (error) {
          // Handle any errors that occur during the entire endpoint execution
          console.error('Error:', error);
          return NextResponse.error({ message: 'Update failed' });
        }
      }
      