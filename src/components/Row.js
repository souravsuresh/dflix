import React, { useState, useLayoutEffect, useEffect } from "react";
import "./Row.css";
import LockIcon from '../assets/lock.svg';
import PlayIcon from '../assets/play.svg';
import { buyPrivateVideo, isSubscribed } from '../web3'

const baseUrl = `https://w3s.link/ipfs/`;

const Row = ({ account, dflix, title, videos, currentVideo, setCurrentVideo, noScroll=false, clickable=true, privateMetadata }) => {

  const [subbed, setSubbed] = useState(false);
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

  useEffect(() => {
    isSubscribed(account, dflix)
      .then(response => {
        if (response && response.subscribed)
          setSubbed(true)
      })
      .catch(console.error)
  }, [account, dflix]);

  const hadleClick = (video) => {
    if (!clickable) return;
    if (video.isSubscription && !subbed) {
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
                  src={`${baseUrl}${video.thumbnalHash}`}
                  className="poster"
                  alt="poster"
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
