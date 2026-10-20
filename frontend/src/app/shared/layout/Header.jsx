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
      <nav className='flex justify-between mx-10 my-2'>
        <div className='px-20 flex justify-between w-full items-center'>
          {navButtons.map((button) => (
            <a className="p-2 shadow-teal-300 shadow-sm rounded-tl-xl " href={button.link} key={button.title}>{button.title}</a>
          ))}
        </div>
        <div className='flex items-baseline shrink-0'>
          <Image alt='logo' width={86} height={86} src={logo}></Image>
        </div>
        <div className='px-20 flex justify-between w-full items-center'>
          <input className='shadow-sm shadow-teal-300 rounded-tr-xl p-2 w-full'></input>
        </div>
      </nav>
      <div className='w-full'>
          <Image alt="divider" className='w-screen' src={divider}></Image>
          </div>
      
    </div>
  )
}
