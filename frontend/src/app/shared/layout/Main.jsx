import React from 'react'

export default function Main({ children, title }) {
  return (
    // 1. Set a fixed height (h-[calc(100vh-1rem)] accounts for the m-2 margin)
    // 2. Make it a flex column so the header, main, and footer stack properly
    <div className='beveled-left bg-teal-300 expand-vertical ease-expo p-px m-2 h-[98%] flex flex-col'>
      
      {/* Title (Stationary) */}
      <p className='ml-5 text-slate-800 shrink-0'>{title}</p>
      
      {/* Scrollable Main Area */}
      {/* flex-1 makes it fill the available space. overflow-y-auto makes it scroll */}
      <main className='beveled-left w-full text-teal-200 bg-gray-800 p-10 outline-none flex-1 overflow-y-auto'>
        {children}
      </main>
      
      {/* Footer (Stationary) */}
      <div className='flex w-full justify-between'>     
         <h5 className='ml-5 text-slate-800 shrink-0'>[ SYS.OK ] node.js v53.12.0-ent // next.js v51.4.2-LTS</h5>
         <h5 className='text-slate-800 shrink-0 mr-5'>© 2077 NPMART SYSTEMS // ALL RIGHTS RESERVED</h5>
      </div>

    </div>
  )
}