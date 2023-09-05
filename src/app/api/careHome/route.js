const mongoose = require('mongoose');
const CareHome = require('./models/careHome');
const { NextResponse } = require("next/server");

export async function GET() {
  try {
    // Use the Mongoose `find` method to fetch all care homes
    const careHomes = await CareHome.find().exec();
    
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
      const { name, position, description, rating, cost, cloudinaryId } = await req.json();

      // Check if a CareHome document with the same name and position already exists
      const existingCareHome = await CareHome.findOne({ name, position }).exec();

      if (existingCareHome) {
        // If a document with the same name and position exists, return an error
        return NetResponse.json({ message: 'CareHome with the same name and location already exists' }, { status: 400 });
      }

      // Create a new CareHome document
      const newCareHome = new CareHome({
        name,
        position,
        description,
        rating,
        cost,
        cloudinaryId,
      });

      // Save the new CareHome document to the database
      await newCareHome.save();

      // Return a success response
      return NextResponse.json({ message: 'CareHome created successfully' }, { status: 201 });
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);

      // Return an error response
      return NextResponse.json({ message: 'Error creating CareHome' }, { status: 500 });
    }
}
