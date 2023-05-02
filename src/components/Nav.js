import React, { useEffect, useState, useLayoutEffect } from "react";
import { Link } from "wouter";

import { buySubscription, isSubscribed } from '../web3'

import "./Nav.css";

const Nav = ({ account, dflix }) => {

  const [isBlack, setIsBlack] = useState(false);
  const [loading, setLoading] = useState();
  const [subbed, setSubbed] = useState(false);

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

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsBlack(true);
    } else {
      setIsBlack(false);
    }
  };

  useEffect(() => {

    isSubscribed(account, dflix)
      .then(response => {
        if (response && response.subscribed)
          setSubbed(true)
      })
      .catch(console.error)

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [account, dflix]);



  const buySubscriptionHandler = () => {
    setLoading(true)
    buySubscription(account, dflix).then(response => {
      console.log("buySubscription", response)
      setLoading(false)
      setSubbed(response.subscribed)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  

  return (
    <div className={`nav ${isBlack ? "black" : ""}`}>
      <Link href="/">
        <a className="nav_logo">
          <img
            src="/dflix-logo.png"
            alt="logo"
          />
        </a>
      </Link>

      <div className="nav_right">
        <div className="nav_links">
          {
            !subbed 
              ? <button onClick={buySubscriptionHandler}>Buy Subscription</button> 
              : <span style={{cursor: "default"}}>Subscribed User</span>
          }
          <Link href="/channel">My Channel</Link>
        </div>
        
        <img
          className="nav_avatar"
          src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png"
          alt="avatar"
        />
        <div className="nav_avatar_details">{account}</div>
      </div>
    </div>
  );
};

export default Nav;
