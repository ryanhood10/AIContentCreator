import React from "react";
import EmailIcon from "./images/Icons/Icon_Email.webp";
import FacebookIcon from "./images/Icons/Icons_facebook2.webp";
import LinkedInIcon from "./images/Icons/Icons_LinkedIn2.webp";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold mb-4">Created by developer 
           <a className="text-blue-600 hover:text-blue-400 active:text-blue-500" href="https://www.linkedin.com/in/ryan-hood-11aa2b239/"> Ryan Hood </a>
            </p>
          </div>

          {/* Column 2 */}
          <div className="text-center md:text-left">
            <p className="text-md font-serif p-2 mb-4">
              At Akira Web Solutions, our mission is to help businesses grow and
              automate their business by finding custom-tailored solutions to
              fit their needs.
            </p>
          </div>

          {/* Column 3 */}
          <div className="text-center md:text-right">
            <div className="mb-4">
              <p className="flex items-center text-lg font-semibold">
                <img src={EmailIcon} alt="Email Icon" className="w-6 rounded-lg h-6 mr-2" />
                Email Us: <a href="mailto:connect@akirawebsolutions.com" className="text-blue-500 pl-2 hover:underline"> connect@akirawebsolutions.com</a>
              </p>
            </div>
            <div className="mb-4">
              <p className="flex items-center text-lg font-semibold">
                <img src={FacebookIcon} alt="Facebook Icon" className="w-6 rounded-lg h-6 mr-2" />
                Follow us on:    
                <a href="https://www.facebook.com/profile.php?id=61550844571239" className="text-blue-500 pl-2 hover:underline">
                   Facebook
                </a>
              </p>
            </div>
            <div>
              <p className="flex items-center text-lg font-semibold">
                <img src={LinkedInIcon} alt="LinkedIn Icon" className="w-6  rounded-lg h-6 mr-2" />
                Connect with us on:  <a href="https://www.linkedin.com/company/akira-web-solutions/?viewAsMember=true" className="text-blue-500 pl-2 hover:underline">
                   LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
