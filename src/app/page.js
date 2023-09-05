import Image from 'next/image'

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "./api/auth/[...nextauth]/options"
import Link from 'next/link';



export default async function Home() {
  const session = await getServerSession(options);
  console.log('page.js session: ', session)

  // if (session) redirect("/search");
  return (
    <div className='hero h-screen flex items-center flex-col sm:flex-row'>
      <div className='w-1/2 flex justify-center flex-col p-4 md:px-10 items-center sm:items-start'>
      <h1 className='lg:text-6xl md:text-4xl sm:text-xl font-bold'>Find a care home<br/>that cares</h1>
      <div>
      <Link href="/search">
          <button className='bg-slate-900 text-white p-2 rounded-lg hover:text-pink-300'>Search homes</button>
      </Link>
      </div>
      </div>

      <div className='w-1/2 flex items-center'>
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
