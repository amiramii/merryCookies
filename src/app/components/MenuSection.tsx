"use client"
import React from 'react';
import { cookiesData } from '../data/cookiesData';
import CookieCard from './CookieCard';
import { motion } from 'framer-motion';

function MenuSection() {
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
          Our Cookies
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
        {cookiesData.map((cookie, index) => (
          <motion.div
            key={cookie.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CookieCard cookie={cookie} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default MenuSection;
