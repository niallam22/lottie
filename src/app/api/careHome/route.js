import { connectMongoDB } from '@/lib/mongodb';
import CareHome from '@/models/careHome';
import Favourite from '@/models/favourite';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// get all care homes
export async function GET() {
  try {
    await connectMongoDB();
    const careHomes = await CareHome.find();
    console.log('api/carehome careHomes: ',careHomes);
    // Return the list of care homes in the response
    return NextResponse.json({ careHomes });
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error:', error);
    
    // Return an error response
    return NextResponse.error({ message: 'Error fetching care homes' });
  }
}

