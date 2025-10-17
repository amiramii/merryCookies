"use client"
import React, { useEffect, useState } from 'react';
import { client } from '../../sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { cookiesData } from '../data/cookiesData';
import CookieCard from './CookieCard';
import { motion } from 'framer-motion';

const builder = imageUrlBuilder(client);

type SanityImage = { _type?: string; asset?: { _ref?: string } } | string | null | undefined

function urlFor(source: SanityImage) {
  // builder.image accepts various Sanity image shapes; typed as unknown here
  // we only call .url() on the result where necessary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.image(source as any)
}

function MenuSection() {
  type Cookie = {
    _id: string
    name: string
    description?: string
    price?: number
    image?: SanityImage
  }

  const [cookies, setCookies] = useState<Cookie[]>([]);

  useEffect(() => {
    async function fetchCookies() {
      try {
        const data = await client.fetch(`*[_type == "cookie"]{_id, name, description, price, image}`);
        if (!data || data.length === 0) {
          // fall back to local seeded data
          setCookies(cookiesData.map(c => ({
            _id: `local-${c.id}`,
            name: c.name,
            description: c.description,
            price: c.price,
            image: c.image, // local path string
          })));
        } else {
          setCookies(data);
        }
      } catch (err) {
        console.error('Failed to fetch cookies from Sanity, falling back to local data', err);
        setCookies(cookiesData.map(c => ({
          _id: `local-${c.id}`,
          name: c.name,
          description: c.description,
          price: c.price,
          image: c.image,
        })));
      }
    }
    fetchCookies();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="w-full p-10 xl:px-20" id="menu">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#e39fac] text-4xl md:text-5xl font-bold mb-6 flex flex-col items-center gap-2"
        >
          Cookies
          <motion.span 
            initial={{ width: 0 }}
            whileInView={{ width: "3.5rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-b-4 border-[#47302e] p-1 h-4"
          ></motion.span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-800 text-2xl max-w-2xl mx-auto"
        >
          Discover our collection of handcrafted cookies, each one unique and made with love
        </motion.p>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        {cookies.map((cookie) => (
          <motion.div
            key={cookie._id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CookieCard cookie={{
              id: cookie._id,
              name: cookie.name,
              description: cookie.description ?? '',
              price: cookie.price ?? 0,
              image: typeof cookie.image === 'string' ? cookie.image : (cookie.image ? urlFor(cookie.image).url() ?? '' : ''),
            }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default MenuSection;
