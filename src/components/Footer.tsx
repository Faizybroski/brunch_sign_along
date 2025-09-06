
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Brunch Singalong</h3>
            <p className="text-gray-600">
              Bringing together delicious food, fantastic drinks, and the joy of music for an unforgettable brunch experience.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-gray-600 hover:text-brunch-purple transition-colors">Events</Link></li>
              <li><Link to="/merchandise" className="text-gray-600 hover:text-brunch-purple transition-colors">Merchandise</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brunch-purple transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brunch-purple transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="text-gray-600 hover:text-brunch-purple transition-colors">Refund Policy</Link></li>
              <li><Link to="/manage-brunch-system" className="text-gray-600 hover:text-brunch-purple transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <p className="text-gray-600 mb-2">Follow us on social media for updates on our latest events</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brunch-purple transition-colors">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brunch-purple transition-colors">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brunch-purple transition-colors">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Brunch Singalong. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
