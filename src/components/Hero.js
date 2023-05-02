import React from "react";
import "./Hero.css";
import HeroSVG from '../assets/hero.svg'
const baseUrl = `https://w3s.link/ipfs/`;

const Hero = ({ video }) => {
  return (
    <header
      className="hero"
      style={{
        background: `url("${HeroSVG}")`,
        backgroundColor: '#141414',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      {
        video
        ? (
          <>
            <div className="hero_contents">
              <div className="hero_left">
                <h1 className="hero_title">
                  {video.title}
                </h1>
                <h1 className="hero_description">
                  {video.description}
                </h1>
              </div>
              <video id="current-video" src={baseUrl + video._hash} controls type="video/mp4" />
            </div>
          </>
        ) : ''
      }
    </header>
  );
};

export default Hero;
