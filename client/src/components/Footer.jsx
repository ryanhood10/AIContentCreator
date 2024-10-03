import React from 'react';
import { FaLinkedin, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
        <br/>
          <h2 className="text-xl font-bold text-cyan-500">Shoreline Business Solutions</h2>
          <p>Find us on:</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-2">
            <a
              href="https://www.linkedin.com/in/ryan-hood-11aa2b239/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-cyan-500"
            >
              <FaLinkedin size={30} />
            </a>
            <a
              href="https://github.com/ryanhood10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-cyan-500"
            >
              <FaFacebook size={30} />
            </a>
          </div>
          <br/>

        </div>
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-400">© 2024 Shoreline Business Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
