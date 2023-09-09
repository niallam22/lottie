import { connectMongoDB } from '@/lib/mongodb';
import Favourite from '@/models/favourite';
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