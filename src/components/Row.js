import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Row.css";
import LockIcon from '../assets/lock.svg';
import PlayIcon from '../assets/play.svg';
import leavesSVG from '../assets/leaves.svg';

const Row = ({ title, videos, currentVideo, setCurrentVideo, noScroll=false, clickable=true }) => {

  const hadleClick = (video) => {
    if (!clickable) return;
    setCurrentVideo(video);
  };

  return (
    <div className="row">
      {title ? <h2 style={{marginLeft: "1rem"}}>{title}</h2> : ''}
      <div className={`posters ${noScroll ? "noScroll" : ''}`}>
        {videos && videos.map((video, i) => {
          return (
            <div key={i}>
              
              <div style={{position: "relative", cursor: "pointer"}} onClick={() => hadleClick(video)}>
                <img
                  key={video.id}
                  src={leavesSVG}
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

              {video.isPrivate && (
                <span className="subscription">
                  <img src={LockIcon} alt="locked"/> 
                  private
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
