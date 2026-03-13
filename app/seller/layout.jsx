'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import Loading from '@/components/Loading'
import { useAppContext } from '@/context/AppContext'
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const Layout = ({ children }) => {
  const { router } = useAppContext()
  const { user, isLoaded, isSignedIn } = useUser()
  const isSeller = user?.publicMetadata?.role === 'seller'

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn || !isSeller) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, isSeller, router])

  if (!isLoaded || !isSignedIn || !isSeller) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout
