import React from 'react';
import Logo from './images/PalmtreeLeftLogo.webp';
import {Link} from 'react-router-dom';


const Header = () => {
  return (
    <header className="bg-gray-900 text-gray-300 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 text-left mb-4 md:mb-0">
        <Link to="/" className="hover:cursor-pointer ">
        <h1 className="text-3xl font-bold text-cyan-500 hover:text-cyan-900">Product Listing Optimizer</h1>          </Link>
          <p className="text-sm text-gray-400">by Shoreline Consulting</p>
        </div>
        <div className="flex flex-col items-center md:justify-end">
          <a href="https://creativecoloring.io/" target="_blank" rel="noopener noreferrer">
            <img
              src={Logo}
              alt="Akira Web Solutions Logo"
              className="h-8 rounded-xl"
            />
          </a>
          <a href="https://akirawebsolutions.com" target="_blank" rel="noopener noreferrer" className="mt-2 text-white hover:text-cyan-300">
            Visit Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
