import React from 'react';
import Image from 'next/image';
import { Cookie } from '../data/cookiesData';

interface CookieCardProps {
  cookie: Cookie;
}

const CookieCard: React.FC<CookieCardProps> = ({ cookie }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-b-2 border-[#e39fac] h-80">
      <div className="relative h-48 w-full flex items-center justify-center text-center">
        <Image
          src={cookie.image}
          alt={cookie.name}
          width={150}
          height={150}
          className="object-cover object-center"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-[#47302e] mb-2">
          {cookie.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {cookie.description}
        </p>
      </div>
    </div>
  );
};

export default CookieCard;
