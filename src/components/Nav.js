import React, { useEffect, useState } from "react";
import { Link } from "wouter";

import { isSubscribed, buySubscription } from '../web3'

import "./Nav.css";

const Nav = ({ account, dflix }) => {

  const [isBlack, setIsBlack] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleScroll = ({ account, dflix }) => {
    if (window.scrollY > 100) {
      setIsBlack(true);
    } else {
      setIsBlack(false);
    }
  };

  useEffect(() => {
    isSubscribedHandler();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const buySubscriptionHandler = () => {
    buySubscription(account, dflix).then(console.log).catch(console.error)
  }

  const isSubscribedHandler = () => {
    isSubscribed(account, dflix)
      .then(response => {
        setSubscribed(response.subscribed)
      })
      .catch(console.error)
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
            !subscribed 
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
