import Appbar from '@/components/Appbar'
import Footer from '@/components/Footer'
import LoginPage from '@/components/login'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col">
      <Appbar />
      <div className="flex-1">
        <LoginPage />
      </div>
      <Footer />
    </div>
  )
}

export default Page
