import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Hero.css";

const baseUrl = `https://w3s.link/ipfs/`;

const Hero = ({ video }) => {
  return (
    <header
      className="hero"
      style={{
        background: `url("https://image.tmdb.org/t/p/original//9nBVkNBe4x9HKDAzxjxlIqecxCW.jpg")`,
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
            <div className="fadedBottom"></div>
          </>
        ) : ''
      }
    </header>
  );
};

export default Hero;
