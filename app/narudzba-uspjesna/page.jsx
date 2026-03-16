'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import { useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import { useEffect } from 'react'

const OrderPlaced = () => {

  const { router, user } = useAppContext()
  const { openSignIn } = useClerk()

  useEffect(() => {
    if (!user) return
    const timer = setTimeout(() => {
      router.push('/moje-narudzbe')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router, user])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <div className="rounded-full h-24 w-24 border-2 border-green-200 bg-green-50"></div>
        <Image className="absolute p-5" src={assets.checkmark} alt="" />
      </div>
      <div className="text-center text-2xl font-semibold">Narudžba je uspješno kreirana</div>
      {user ? (
        <div className="text-center text-sm text-gray-500">
          Preusmjeravamo vas na vaše narudžbe...
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500 flex flex-col items-center gap-3">
          <span>Prijavite se da biste vidjeli ubuduće svoje narudžbe.</span>
          <button
            type="button"
            onClick={openSignIn}
            className="text-sm border px-4 py-2 rounded-full hover:text-gray-900 transition"
          >
            Prijava
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderPlaced
