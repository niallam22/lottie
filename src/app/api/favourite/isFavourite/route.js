import { connectMongoDB } from '@/lib/mongodb';
import Favourite from '@/models/favourite';
import { NextResponse } from 'next/server';

//check if carehome is favourited by user

export async function POST(request) {
  //note: post method used bc request.url not throwing error at build time. solutiion - send data as formdata rather than querystring
    try {
      const formData = await request.formData()
      const reqObject = Object.fromEntries(formData)
      const { careHomeId, userId } = reqObject
      // const { searchParams } = new URL(request.url);
      // const userId = searchParams.get('userId');
      // const careHomeId = searchParams.get('careHomeId');

      console.log('api/favourite/isFavourite careHomeId: ', careHomeId);
    // to return all search parameter entries not just explicitly specified ones
    // const obj = Object.fromEntries(searchParams.entries())
    // const {userId, ...rest} = obj

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