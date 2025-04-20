import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Home from '@/components/landing/Home';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
   <Outlet />
    </main>
    <footer>
    <Footer />
    </footer>
   
  </div>
  );
};

export default MainLayout;