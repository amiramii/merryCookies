import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <div className="w-full  border-b-2 border-[#e3a0aa]   md:px-20 px-4 relative flex items-center rounded-b-xl py-7 ">
     <nav className="flex justify-between items-center w-full ">
        <div className="flex flex-col gap-2 md:flex-row md:gap-10">
        <Link href="/#about" className="text-[#47302e] font-bold text-xl py-1 px-4 border-[#47302e] border-2 rounded-xl hover:text-[#ffdeda] transition-colors duration-300">About</Link>
        <Link href="/#menu" className="text-[#47302e] py-1 px-4 font-bold text-xl hover:text-[#ffdeda] transition-colors duration-300 border-[#47302e] border-2 rounded-xl">Menu</Link>
        </div>
        <Link target="_blank" href="https://www.instagram.com/merrycookiestarbes/" className="  py-1 px-3 bg-[#ffdeda] text-[#47302e] font-bold rounded-xl  border-3 border-[#47302e00] hover:border-[#47302e]  h-max text-xl text-center max-w-min md:w-max md:text-nowrap">Order Now</Link>
     </nav>
     <Image 
          src="/classicCookie.png"
          alt="Merry Cookies"
          width={160}
          height={160}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 lg:top-1/4 z-10"
        />
      <div className="absolute left-1/2  top-2/3 -translate-x-1/2 lg:top-5/12 z-10 w-28 h-28 rounded-full p-1 bg-[#e3a0aada] flex items-center justify-center">
      <Image
          src="/cookiesLogo.png"
          alt="Merry Cookies"
          width={300}
          height={300}
          className="w-full "
        />
      </div>
    </div>
  );
}