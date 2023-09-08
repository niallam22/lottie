'use server'

import { connectMongoDB } from '@/lib/mongodb'
import { v2 as cloudinary } from 'cloudinary'
import CareHome from '@/models/careHome';
import { getServerSession } from "next-auth/next"
import { options } from './api/auth/[...nextauth]/options';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function getSignature() {
  const session = await getServerSession(options)

  if(session.user.role === 'admin' || session.user.role === 'manager'){
    const timestamp = Math.round(new Date().getTime() / 1000)

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'care_homes' },
      cloudinaryConfig.api_secret
    )
    return { timestamp, signature }

  }else{
    return {
      status: 'error',
      message: 'User is not authorised',
    };
  }
}

export async function saveToDatabase({ 
  imageVersion,
  clientSignature,
  imagePublicId,
  imageSecureUrl,    
  name,
  lat,
  lng,
  description,
  rating,
  cost, }) {

  const session = await getServerSession(options)

  if(session.user.role === 'admin' || session.user.role === 'manager'){
  // verify signature from client before save
  //param names need to be exact for signing
  const public_id = imagePublicId 
  const version = imageVersion

  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id, version },
    cloudinaryConfig.api_secret
  )

  if (expectedSignature === clientSignature) {
    // safe to write to database
    try {
      await connectMongoDB()
      
      // Check if CareHome document with same name and position (latitude,longitude) already exists
      const existingCareHome = await CareHome.findOne({ name, lat, lng });

      if (existingCareHome) {
        throw new Error('CareHome with the same name and location already exists')
      }

      // Create a new CareHome document
      await CareHome.create({
        name,
        lat,
        lng,
        description,
        rating,
        cost,
        imageVersion,
        imagePublicId,
        imageSecureUrl
        });

        return {
          status: 'success',
          message: 'CareHome created successfully',
        };

    } catch (error) {
      console.log(error);

      return {
        status: 'error',
        message: 'An error occurred while saving to the database',
      };
    }
  }
  }else {
    return {
      status: 'error',
      message: 'User is not authorised',
    };
  } 
}
