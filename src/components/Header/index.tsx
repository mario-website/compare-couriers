import React from "react";
import "./style.scss";

const Header = () => {
  return (
    <header className="Header">
      <p className="Header-Logo">
        <span>ship</span>
        <span>it</span>
        <span>now</span>
      </p>
      <div className="Header-Slogan">
        <h1>Deals from your favourite courier website</h1>
        <p>Try searching for best parcel deal</p>
      </div>
    </header>
  );
};

export default Header;
