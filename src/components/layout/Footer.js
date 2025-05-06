import React from "react";

import { Link } from "react-router-dom";
import FacebookIcon from "../../assets/icons/facebook.svg";
import InstagramIcon from "../../assets/icons/instagram.svg";
import TwitterIcon from "../../assets/icons/twitter.svg";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-socials">
        <div className="social-icon-container">
          <Link to="#">
            <img src={FacebookIcon} alt="Twitter" />
          </Link>
        </div>
        <div className="social-icon-container">
          <Link to="#">
            <img src={InstagramIcon} alt="Instagram" />
          </Link>
        </div>
        <div className="social-icon-container">
          <Link to="#">
            <img src={TwitterIcon} alt="Twitter" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
