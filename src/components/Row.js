import React, { useState, useLayoutEffect } from "react";
import "./Row.css";
import LockIcon from '../assets/lock.svg';
import PlayIcon from '../assets/play.svg';
import leavesIcon from '../assets/leaves.svg';
import { buyPrivateVideo, buySubscription } from '../web3'

const Row = ({ account, dflix, title, videos, currentVideo, setCurrentVideo, noScroll=false, clickable=true, subscribed, privateMetadata }) => {

  const [loading, setLoading] = useState();

  useLayoutEffect(() => {
    const root = document.querySelector('#root');
    if (loading) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      if (!root.classList.contains('loading')) {
        root.classList.add('loading');
      }
    }
    if (!loading) {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      if (root.classList.contains('loading')) {
        root.classList.remove('loading');
      }
    }
  }, [loading]);

  const hadleClick = (video) => {
    if (!clickable) return;
    if (video.isSubscription && !subscribed) {
      window.alert('Please subscribe to watch this content.');
      return;
    }
    if (video.isPrivate && !isAlreadyPaid(account, video)) {
      setLoading(true)
      buyPrivateVideo(account, dflix, video).then(() => {
        setCurrentVideo(video);
        setLoading(false)
      }).catch(err => {
        console.error(err)
        window.alert('Transaction failed!');
        setLoading(false)
      })
    } else {
      setCurrentVideo(video);
    }
  };

  const isAlreadyPaid = (account, video) => {
    const filtered = privateMetadata.filter(vid => vid.videoId === video.id && vid.author === account);
    return filtered && filtered[0];
  }

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
                  src={leavesIcon}
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
