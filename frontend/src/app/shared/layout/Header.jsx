import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from "../../../../public/logo2.svg"
import divider from "../../../../public/divider.svg"
import dividerm from "../../../../public/dividermobile.svg"

import { Menu, Search } from 'lucide-react'
export default function Header() {
  const navButtons = [
    {title:"profile" , link:"/placeholder"},
  {title:"listings" , link:"/placeholder"},
    {title:"browse" , link:"/placeholder"},
  ]
  return (
    <div>
      {/* desktop */}
      <nav className=' justify-between lg:flex hidden mx-5 my-2 preserve'>
        <div className='px-20 flex justify-between w-full items-center'>
          {navButtons.map((button) => (
            <a className="group flex order spawn-down ease-expo click-hover amount-2 items-center gap-3 font-mono text-slate-700 tracking-wide transition-colors hover:text-teal-700" href={button.link} key={button.title}>
              <span className="h-6 w-1.5 shrink-0 bg-gradient-to-b bg-teal-300 [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_6px),calc(100%_-_6px)_100%,0_100%)]"></span>
              {button.title}
            </a>
          ))}
        </div>
        <div className='flex items-baseline shrink-0 spawn-down ease-expo'>
          <Image alt='logo' width={86} height={86} src={logo}></Image>
        </div>
        <div className='px-20 flex gap-2 justify-between spawn-down ease-expo w-full items-center'>
          <div className='beveled-left w-full bg-teal-300 p-px'>
            <input className='beveled-left w-full text-teal-500 bg-emerald-50 p-2 outline-none'></input>
           
          </div>
          <div className='beveled-right bg-teal-300 p-px click-hover amount-5 ease-expo'>
            <button className='beveled-right w-full bg-emerald-50 hover:bg-emerald-100 transition-colors p-2 text-teal-400 outline-none px-10'><Search></Search></button>
           
          </div>
        </div>
        
      </nav>
      {/* mobile */}
      <nav className='lg:hidden mx-4 mt-1 mb-3 preserve'>
        <div className='relative flex h-14 items-center justify-center'>
          <button
            type='button'
            aria-label='Open menu'
            className='group beveled-left click-hover amount-2 ease-expo absolute left-0 top-1/2 -translate-y-1/2 bg-teal-300 p-px'
          >
            <span className='beveled-left flex items-center justify-center bg-emerald-50 p-2.5 text-teal-500 transition-colors group-hover:bg-emerald-100'>
              <Menu size={20} strokeWidth={2.5} />
            </span>
          </button>

          <Link href='/' aria-label='Home' className='spawn-down ease-expo flex items-center justify-center'>
            <Image alt='logo' width={64} height={64} src={logo} priority />
          </Link>
        </div>

    
      </nav>
      <div className='w-full hidden md:block curtain-horizontal'>
          <Image alt="divider" className='w-screen' src={divider}></Image>
          </div>
      <div className='w-full block md:hidden curtain-horizontal'>
          <Image alt="divider" className='w-screen' src={dividerm}></Image>
          </div>
      
    </div>
  )
}
