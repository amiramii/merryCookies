import React from 'react';
import { cookiesData } from '../data/cookiesData';
import CookieCard from './CookieCard';

function MenuSection() {
  return (
    <div className="w-full p-10 xl:px-20" id="menu">
      <div className="text-center mb-12">
        <h2 className="text-[#e39fac] text-4xl md:text-5xl font-bold mb-6 flex flex-col items-center gap-2">
          Our Cookies
          <span className="border-b-4 border-[#47302e] p-1 w-14 h-4"></span>
        </h2>
        <p className="text-gray-800 text-2xl max-w-2xl mx-auto">
          Discover our collection of handcrafted cookies, each one unique and made with love
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {cookiesData.map((cookie) => (
          <CookieCard key={cookie.id} cookie={cookie} />
        ))}
      </div>
    </div>
  );
}

export default MenuSection;
