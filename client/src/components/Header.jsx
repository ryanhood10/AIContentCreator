import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import AkiraLogo from './images/AkiraLogoTransparent.webp'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="https://akirawebsolutions.com/">
          <div className="flex items-center">
            <img
              src={AkiraLogo}
              alt="Akira Logo"
              className=" mr-2"
            />
            <h1 className="text-red-500 font-sans font-bold text-4xl">
              Akira Web Solutions
            </h1>
            <h2 className="pl-16 font-sans font-semibold "> SEO | Custom Website Builds | AI Virtual Agents | Web Solutions</h2>
          </div>
        </Link>
        <div className="font-sans font-light hidden md:block">
          Based out of Nashville, TN
        </div>
      </div>
    </header>
  );
};

export default Header;
