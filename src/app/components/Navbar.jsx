'use client'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBars,FaTimes } from 'react-icons/fa';
import { signOut } from "next-auth/react";

function Navbar() {
  const [navbar, setNavbar] = useState(false);
  const { data: session, status } = useSession();

  const user = session?.user
  console.log(user)

  useEffect(() => {}, [session]); //rerender once session has been fetched
  return (
    <div id='navbar' className='h-20 bg-slate-900'>
      <nav  className="w-full bg-slate-900 fixed top-0 left-0 right-0 z-10 h-20">
        <div className="w-full justify-between l md:items-center md:flex">
          <div>
            <div className="flex items-center justify-between pt-5 md:block px-8">
              {/* LOGO */}
              <Link href="/">
                <h2 className="text-2xl text-pink-300 font-bold ">Lottie</h2>
              </Link>
              {/* HAMBURGER BUTTON FOR MOBILE */}
              <div className="md:hidden">
                <button
                  className="text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <FaTimes className="text-pink-300" style={{ fontSize: '30px' }}/>
                  ) : (
                    <FaBars className="text-pink-300" style={{ fontSize: '30px' }}/>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className='bg-slate-900 md: bg-none'>
            <div
              className={`flex-1 justify-self-center pb-3 md:block md:pb-0 md:mt-0 ${
                navbar ? 'p-12 md:p-0 block' : 'hidden'
              }`}
            >
              <ul className="h-screen md:h-auto items-center justify-center md:flex ">
              <li className="text-xl text-white py-5 md:px-6 text-center  hover:text-pink-300">
                  <Link href="/" onClick={() => setNavbar(!navbar)}>
                    Home
                  </Link>
                </li>
                <li className="text-xl text-white py-5 md:px-6 text-center  hover:text-pink-300">
                  <Link href="/search" onClick={() => setNavbar(!navbar)}>
                    Search
                  </Link>
                </li>
                {!session && <li className="text-xl text-white py-5 px-6 text-center  hover:text-pink-300">
                   <Link href="/login" onClick={() => setNavbar(!navbar)}>
                    Login
                  </Link>
                </li>}
                {!session &&<li className="text-xl text-white py-5 px-6 text-center  hover:text-pink-300">
                   <Link href="/register" onClick={() => setNavbar(!navbar)}>
                    Register
                  </Link>
                </li>}
                {(user?.role === 'admin'|| user?.role === 'manager') && (<li className="text-xl text-white py-5 px-6 text-center  hover:text-pink-300">
                   <Link href="/homeManager" onClick={() => setNavbar(!navbar)}>
                    Add home
                  </Link>
                </li>)}
                {session && <li className="text-xl text-white py-5 px-6 text-center  hover:text-pink-300">
                  <Link href="#" onClick={() => {
                    setNavbar(!navbar)
                    signOut()
                    }}>
                    Logout
                  </Link>
                </li>}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;