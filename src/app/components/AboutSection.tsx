import React from 'react'
import Image from 'next/image'
function AboutSection() {
  return (
    <div className='w-full p-10 xl:px-20' id='about'>
      {/* Mobile: Title first */}
      <h2 className='text-[#e39fac] text-4xl lg:text-5xl font-bold mb-6 lg:hidden flex flex-col gap-2'>Our Story
        <span className='border-b-4 border-[#47302e] p-1 w-14 h-4 '></span>
      </h2>
      
      <div className='grid grid-cols-1 lg:grid-cols-2  items-center gap-10'>
        {/* Content Section */}
        <div className='order-3 lg:order-1'>
          {/* Desktop: Title here */}
          <h2 className='text-[#e39fac] text-4xl md:text-5xl font-bold mb-6 hidden  lg:flex flex-col gap-2'>
            Our Story
            <span className='border-b-4 border-[#47302e] p-1 w-14 h-4 '></span>
            </h2>
          <div className='space-y-4 text-gray-800'>
            <p className='text-2xl leading-relaxed'>
            From the idea to the shop itself, everything has been created by just the two of us. Every cookie is unique carefully weighed, rolled, and decorated by hand using only quality ingredients like specialty coffee, French free-range eggs, and local butter. It’s simply us, with lots of love and passion.
            <br />
            <span className='font-medium bg-pink-100/35 p-1 px-2 rounded-xl'>
            Thank you for being part of this sweet adventure.
            </span>
            </p>
          </div>
        </div>
        
        {/* Image Section */}
        <div className='order-2 lg:order-2 lg:place-self-end  '>
          <Image
            src="/About.png"
            alt="Picture of us"
            width={418}
            height={314}
            className='  object-cover rounded-lg aspect-square w-90 h-70 shadow-lg'
          />
        </div>
      </div>
    </div>
  )
}

export default AboutSection