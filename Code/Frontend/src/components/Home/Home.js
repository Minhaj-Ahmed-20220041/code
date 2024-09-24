import React, { useState, useEffect } from 'react';
import './Home.css';
import HeroSection from '../HeroSection/HeroSection';
import CustomerTestimonials from '../CustomerTestimonials/CustomerTestimonials';
import BlogSection from '../BlogSection/BlogSection';
import SpecialOffers from '../SpecialOffers/SpecialOffers';
import WhyBuyDirect from '../WhyBuyDirect/WhyBuyDirect';
import FeaturedProhducts from '../FeaturedProducts/FeaturedProducts';

import { useAuth } from '../../authContext';
import PopularProducts from '../PopularProducts/PopularProducts';
import RecommededProducts from '../Recommended/RecommededProducts'

const Home = () => {
  const { state: authState } = useAuth();
  
  return (
    <div className="home">
      {/* <HeroSection /> */}
      {/* <WhyBuyDirect />   */}
      {authState.isLoggedIn? <RecommededProducts /> : <PopularProducts />}
      <FeaturedProhducts />
      {/* <SpecialOffers /> */}
      {/* <CustomerTestimonials />
      <BlogSection /> */}
    </div>
  );
};

export default Home;
