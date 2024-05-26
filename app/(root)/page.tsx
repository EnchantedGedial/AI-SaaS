import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
  return<>
  <h1>Home Page</h1>
  <UserButton afterSignOutUrl='/'/>
  </>
}

export default Home
