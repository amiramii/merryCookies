import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
function HeroSection() {
  return (
    <section className="flex-1 relative  py-40 md:min-h-[500px] z-0 bg-[#e3a0aa]  rounded-3xl" id="home">
        
        <Image 
        src="/betterQuality.png" 
        alt="Merry Cookies" 
        fill
        className="object-cover  rounded-3xl object-center w-full "
        priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/78 rounded-3xl"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10   xl:bg-white/0 backdrop-blur-[1px] bg-white/10">
        

         {/* Title */}
         <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 drop-shadow-xl/50 text-[#4E3734] mt-10 " style={{fontFamily: 'Junge, serif'}}>
           Merry Cookies
         </h1>

        {/* Subtitle */}
        <section className=" max-w-4xl flex flex-col gap-5 justify-center items-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#983040] to-transparent" />
          <p className="text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-xl/50 text-white mb-10" style={{fontFamily: 'Junge, serif'}}>
          Homemade cookies. Specialty milkshakes. Pure joy in every bite.
          </p>
        </section>
        <Link target="_blank" href="https://www.instagram.com/merrycookiestarbes/" className="  py-1 px-3 bg-[#ffdeda] text-[#47302e] font-bold rounded-xl  border-3 border-[#47302e00] hover:border-[#47302e]  h-max text-xl text-center  w-max text-nowrap absolute bottom-10 xl:bottom-5 left-1/2 -translate-x-1/2 ">Order Now</Link>
        
      </div>
      </section>
  )
}

export default HeroSection