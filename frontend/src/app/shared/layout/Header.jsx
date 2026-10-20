import Image from 'next/image'
import React from 'react'
import logo from "../../../../public/logo2.svg"
import divider from "../../../../public/divider.svg"
export default function Header() {
  const navButtons = [
    {title:"profile" , link:"/placeholder"},
  {title:"listings" , link:"/placeholder"},
    {title:"browse" , link:"/placeholder"},
  ]
  return (
    <div>
      <nav className='flex justify-between mx-10 my-2 preserve'>
        <div className='px-20 flex justify-between w-full items-center'>
          {navButtons.map((button) => (
            <a className="group flex order spawn-down ease-expo click-hover amount-2 items-center gap-3 font-mono text-slate-700 tracking-wide transition-colors hover:text-teal-700" href={button.link} key={button.title}>
              <span className="h-6 w-1.5 shrink-0 bg-gradient-to-b from-teal-300 to-teal-600 [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_6px),calc(100%_-_6px)_100%,0_100%)]"></span>
              {button.title}
            </a>
          ))}
        </div>
        <div className='flex items-baseline shrink-0 spawn-down ease-expo'>
          <Image alt='logo' width={86} height={86} src={logo}></Image>
        </div>
        <div className='px-20 flex justify-between spawn-down ease-expo w-full items-center'>
          <div className='beveled w-full bg-teal-300 p-px'>
            <input className='beveled w-full bg-emerald-50 p-2 outline-none'></input>
          </div>
        </div>
      </nav>
      <div className='w-full curtain-horizontal'>
          <Image alt="divider" className='w-screen' src={divider}></Image>
          </div>
      
    </div>
  )
}
