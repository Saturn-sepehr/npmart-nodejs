import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from "../../../../public/headerlogo.svg"
import divider from "../../../../public/divider.svg"

import { Search } from 'lucide-react'
import MobileMenu from './MobileMenu'

export default function Header() {
  const navButtons = [
    { title: "profile", link: "/placeholder" },
    { title: "listings", link: "/placeholder" },
    { title: "browse", link: "/placeholder" },
  ]

  return (
    <div>
      {/* Desktop */}
      <nav className='hidden lg:grid grid-cols-5 items-center mx-5 my-2 preserve'>
        
        {/* Left: Nav Buttons */}
        <div className='flex justify-between gap-10 col-span-2 pl-20'>
          {navButtons.map((button) => (
            <Link 
              className="group flex order spawn-down ease-expo click-hover amount-2 items-center gap-3 font-mono text-teal-500 tracking-wide transition-colors hover:text-teal-700" 
              href={button.link} 
              key={button.title}
            >
              <span className="h-6 w-1.5 shrink-0 bg-gradient-to-b bg-teal-300 [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_6px),calc(100%_-_6px)_100%,0_100%)]"></span>
              {button.title}
            </Link>
          ))}
        </div>

        {/* Center: Logo */}
        <div className='flex justify-center items-baseline shrink-0 spawn-down ease-expo'>
          <Link href="/" aria-label="Home">
            <Image alt='logo' width={86} height={86} src={logo} priority />
          </Link>
        </div>

        {/* Right: Search Bar */}
        <div className='flex justify-between items-center gap-2 col-span-2 pr-20 spawn-down ease-expo'>
          <div className='beveled-left w-full bg-teal-300 p-px'>
            <input 
              className='beveled-left w-full text-teal-200 bg-gray-800 p-2 pl-5 outline-none' 
              placeholder="Search for products ..." 
              aria-label="Search"
            />
          </div>
          <div className='beveled-right bg-teal-300 p-px click-hover amount-5 ease-expo shrink-0'>
            <button aria-label="Submit Search" className='beveled-right w-full bg-gray-800 hover:bg-slate-700 transition-colors p-2 text-teal-400 outline-none px-10'>
              <Search size={20} />
            </button>
          </div>
        </div>
        
      </nav>

      {/* Mobile */}
      <nav className='lg:hidden mx-4 mt-1 mb-3 preserve'>
        <div className='relative flex h-14 items-center justify-center'>
          <MobileMenu items={navButtons} />
          <Link href='/' aria-label='Home' className='spawn-down ease-expo flex items-center justify-center'>
            <Image alt='logo' width={64} height={64} src={logo} priority />
          </Link>
        </div>
      </nav>

      {/* Divider */}
      <div className='w-full h-min curtain-horizontal'>
          <Image alt="divider" className='w-screen' src={divider} priority />
      </div>
    </div>
  )
}