const mongoose = require('mongoose');
const Favourite = require('./models/');
const { NextResponse } = require("next/server");
 
 export async function GET(request) {
    const {searchParams} = new URL(request.url) //request has search params (not json)
    const userId =  searchParams.get('userId')
    const careHomeId = searchParams.get('careHomeId')
    
    Favourite.findOne({ user: userId, careHome: careHomeId })
  .exec()
  .then((data) => {
    const isFavourite = data ? data.isFavourite : false
  })
  .catch((error) => {
    // Handle any errors that occur during the query
    console.error('Error:', error);
  });

    return NextResponse.json({isFavourite})
 }


    // to return all search parameter entries not just specified ones
    // const obj = Object.fromEntries(searchParams.entries())
    // return NextResponse.json({obj})
    
    //const data = await = request.json() //request has json not search parameters 
    //const {name, email, message} = data
    // return NextResponse.json({name, email, message})


    export async function PUT(request) {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const careHomeId = searchParams.get('careHomeId');
        const isFavourite = searchParams.get('isFavourite');
      
        // Use findOneAndUpdate to find or create a document
        Favourite.findOneAndUpdate(
          { user: userId, careHome: careHomeId },
          { isFavourite: isFavourite },
          { upsert: true, new: true }
        )
          .exec()
          .then((updatedDocument) => {
            if (updatedDocument) {
              // Document found or created successfully
              return NextResponse.json({ message: 'Update successful' });
            } else {
              // Handle any unexpected errors here
              return NextResponse.error({ message: 'Update failed' });
            }
          })
          .catch((error) => {
            // Handle any errors that occur during the query
            console.error('Error:', error);
            return NextResponse.error({ message: 'Update failed' });
          });
      }
      