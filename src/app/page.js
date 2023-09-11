import Image from 'next/image'

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "./api/auth/[...nextauth]/options"
import Link from 'next/link';



export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className='hero h-screen flex items-center flex-col sm:flex-row'>
      <div className='sm:w-1/2 w-3/4 flex justify-center flex-col p-4 sm:px-10 items-start '>
      <h1 className='lg:text-6xl md:text-4xl text-2xl font-bold'>Find a care home<br/>that cares</h1>
      <div>
      <Link href="/search">
          <button className='bg-slate-900 text-white p-2 rounded-lg hover:text-pink-300'>Search homes</button>
      </Link>
      </div>
      </div>

      <div className='sm:w-1/2 w-7/8 flex items-center'>
        <Image 
        className='px-4'
        src='/home.svg' 
        alt="Home drawing"
        width={450}
        height={24}
        />
      </div>
    </div>
  )
}
