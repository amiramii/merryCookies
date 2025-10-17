import React from 'react';
import Image from 'next/image';

// flexible cookie shape to support both local Cookie and Sanity-fetched cookie
export interface CookieCardData {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
}

interface CookieCardProps {
  cookie: CookieCardData;
}

const CookieCard: React.FC<CookieCardProps> = ({ cookie }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-b-2 border-[#e39fac] h-80">
      <div className="relative h-48 w-full flex items-center justify-center text-center">
        <Image
          src={cookie.image ?? '/placeholder.png'}
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
          {cookie.description ?? ''}
        </p>
      </div>
    </div>
  );
};

export default CookieCard;
