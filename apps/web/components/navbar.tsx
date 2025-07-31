import React from 'react'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'

const navbar = () => {
  return (
    <Link href="/" className='flex items-center justify-center mt-14 mb-6'>
        <Image
          src={logo}
          alt="ScanMyMole"
          width={80}
          height={80}
          priority
        />
    </Link>
  )
}

export default navbar
