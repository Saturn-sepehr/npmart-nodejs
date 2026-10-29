
import React from 'react'
import Main from './shared/layout/Main'
import TopProds from './features/landing/components/TopProds'

export default function Home() {
  return (
     
      <Main title="MAIN-MENU">
        <h1 className='w-full text-center font-bold text-2xl'>Welcome to npmart<strong>...</strong></h1>
        <h2 className='w-full text-center font-bold text-xl'>The marketplace for all of your buying and selling needs</h2>
          <TopProds></TopProds>
      </Main>
  )
}
