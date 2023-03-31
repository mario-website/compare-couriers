import React from "react";
import "./style.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer-Wrapper">
        <div className="Footer-Content">
          <div className="Footer-Content_column">
            <div className="Footer-About">
              <p>About</p>
              <p className="Footer-Logo">
                <span>ship</span>
                <span>it</span>
                <span>now</span>
              </p>
            </div>
            <p className="Footer-Description">
              We help you find the best parcel delivery deals from courier websites.
              Specify the weight and dimensions of your parcel to get accurate pricing and
              compare services.
            </p>
          </div>
          <div className="Footer-Content_column">
            <p>Popular Couriers</p>
            <p>
              <a href="https://www.dhl.com/">DHL</a>
            </p>
            <p>
              <a href="https://www.dpd.com/">DPD</a>
            </p>
            <p>
              <a href="https://www.ups.com/">UPS</a>
            </p>
            <p>
              <a href="https://www.parcelforce.com/">Parcelforce</a>
            </p>
          </div>
          <div className="Footer-Content_column">
            <p>Useful Links</p>
            <p>
              <a href="/faq">FAQ</a>
            </p>
            <p>
              <a href="/contact">Contact Us</a>
            </p>
            <p>
              <a href="/privacy-policy">Privacy Policy</a>
            </p>
            <p>
              <a href="/terms-of-service">Terms of Service</a>
            </p>
          </div>
        </div>
        <div className="Footer-Copyright">
          &copy; {new Date().getFullYear()} ShipItNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
