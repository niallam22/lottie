import { connectMongoDB } from '@/lib/mongodb';
import CareHome from '@/models/careHome';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// get all care homes
export async function GET() {
  try {
    await connectMongoDB();
    const careHomes = await CareHome.find();
    // Return the list of care homes in the response
    return NextResponse.json({ careHomes });
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error:', error);
    
    // Return an error response
    return NextResponse.error({ message: 'Error fetching care homes' });
  }
}

export async function POST(req) {
    try {
      // Extract data from the request body
      const { name, position, description, rating, cost, cloudinaryImgId, cloudinaryImgUrl } = await req.json();

      await connectMongoDB();
      // Check if a CareHome document with the same name and position already exists
      const {lat, lng } = position
      const existingCareHome = await CareHome.findOne({ name, lat, lng });

      if (existingCareHome) {
        // If a document with the same name and position exists, return an error
        return NetResponse.json({ message: 'CareHome with the same name and location already exists' }, { status: 400 });
      }

    // Create a new CareHome document
    const result = await CareHome.create({
    name,
    lat,
    lng,
    description,
    rating,
    cost,
    cloudinaryImgId,
    cloudinaryImgUrl
    });

      // Return a success response
      return NextResponse.json({ message: 'CareHome created successfully' }, { status: 201 });
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);

      // Return an error response
      return NextResponse.json({ message: 'Error creating CareHome' }, { status: 500 });
    }
}
