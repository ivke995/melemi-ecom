import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import { useAppContext } from '@/context/AppContext'
import { useClerk } from '@clerk/nextjs'

const Navbar = () => {

  const { router } = useAppContext()
  const { signOut } = useClerk()
  const navLinks = [
    { label: 'Početna', href: '/' },
    { label: 'Prodavnica', href: '/prodavnica' },
    { label: 'Kontakt', href: '/kontakt' }
  ]

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <Image onClick={() => router.push('/')} className='w-28 lg:w-32 cursor-pointer' src={assets.logo} alt="" />
      <div className='hidden md:flex items-center gap-6 text-sm text-gray-600'>
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} className='hover:text-gray-900 transition'>
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={() => signOut({ redirectUrl: '/' })}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Odjavi se
      </button>
    </div>
  )
}

export default Navbar
