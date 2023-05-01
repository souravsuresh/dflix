import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Row.css";
import LockIcon from '../assets/lock.svg';
import PlayIcon from '../assets/play.svg'

const baseUrl = `https://w3s.link/ipfs/`;
const sampleImage = `https://image.tmdb.org/t/p/original//9n2tJBplPbgR2ca05hS5CKXwP2c.jpg`;
const sampleVideo = `https://www.youtube.com/watch?v=xthe53TvFg4`;

const Row = ({ title, videos, currentVideo, setCurrentVideo, noScroll=false }) => {

  const hadleClick = (video) => {
    setCurrentVideo(video)
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className={`posters ${noScroll ? "noScroll" : ''}`}>
        {videos && videos.map((video, i) => {
          return (
            <div key={i}>
              
              <div style={{position: "relative", cursor: "pointer"}} onClick={() => hadleClick(video)}>
                <img
                  key={video.id}
                  src={sampleImage}
                  // src={`${baseUrl}${video._hash}`}
                  alt={video.title}
                  className="poster"
                />
                {currentVideo && video.id === currentVideo.id && (
                  <div className="playing-backdrop"></div>
                )}
              </div>
              
              <h4 style={{marginTop: "5px"}}>
                {video.title}
              </h4>
              
              {video.isSubscription && (
                <span className="subscription">
                  <img src={LockIcon} alt="locked"/> 
                  subscription
                </span>
              )}
              
              {currentVideo && video.id === currentVideo.id && (
                <span className="playing">
                  <img src={PlayIcon} alt="locked"/> Playing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Row;
