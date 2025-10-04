'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { FormEvent, ChangeEvent } from 'react';

function ContactForm() {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? `${name === 'firstName' ? 'First' : 'Last'} name is required` : '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        return !validateEmail(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        if (value.trim() === '') return 'Phone number is required';
        return !validatePhone(value) ? 'Please enter a valid phone number' : '';
      case 'subject':
        return value.trim() === '' ? 'Subject is required' : '';
      case 'message':
        return value.trim() === '' ? 'Message is required' : '';
      default:
        return '';
    }
  };

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field in real-time
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '' 
      });
      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-max mb-10 relative">
      <h3 className="text-[#e39fac] text-4xl md:text-5xl font-bold mb-2">Still have  questions?</h3>
        <Image 
          src="/image3.png" 
          alt="Contact illustration" 
          width={320}
          height={320}
          className="absolute right-0 hidden xl:block"
        />
        <Image 
          src="/image4.png" 
          alt="Contact decoration" 
          width={320}
          height={320}
          className="absolute -left-8 hidden xl:block"
        />
      <motion.span 
            initial={{ width: 0 }}
            whileInView={{ width: "3.5rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-b-4 border-[#47302e] p-1 h-4 mb-7"
          ></motion.span>

      <form
        onSubmit={handleSubmit}
        className="lg:w-1/2 w-4/5 shadow-lg rounded-xl p-4 py-10 flex flex-col items-center justify-center gap-7"
        style={{ boxShadow: '0 10px 25px rgba(227, 159, 172, 0.3)' }}
      >
         
        <div className="w-full flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.firstName}
              className={`w-full p-2 rounded border ${
                errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                errors.firstName ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.lastName}
              className={`w-full p-2 rounded border ${
                errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                errors.lastName ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

       
        <div className="w-full flex gap-4">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              className={`w-full p-2 rounded border ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex-1">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              value={formData.phone}
              className={`w-full p-2 rounded border ${
                errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                errors.phone ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        
        <div className="w-full">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            onChange={handleChange}
            value={formData.subject}
            className={`w-full p-2 rounded border ${
              errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              errors.subject ? 'focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        
        <div className="w-full">
          <textarea
            name="message"
            placeholder="Message"
            onChange={handleChange}
            value={formData.message}
            rows={4}
            className={`w-full p-2 rounded border ${
              errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              errors.message ? 'focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || Object.values(errors).some(error => error !== '')}
          className={`py-1 px-3 font-bold rounded-xl cursor-pointer text-xl ${
            status === 'loading' || Object.values(errors).some(error => error !== '')
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#ffdeda] text-[#47302e] hover:bg-[#f9dcd7f3]'
          }`}
        >
          {status === 'loading' ? 'Sending...' : 'Submit'}
        </button>
        
       
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Message sent successfully! We&apos;ll get back to you soon.
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Failed to send message. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}

export default ContactForm;
