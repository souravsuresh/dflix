import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";

import Home from "./pages/Home";
import Channel from "./pages/Channel";

import { loadWeb3, loadAccount, loadContract, isSubscribed } from './web3'
import "./App.css";


export default function App() {
  const [account, setAccount] = useState();
  const [dflix, setDflix] = useState();
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    loadWeb3().then(() => {
      loadAccount().then(setAccount)
    })
  }, []);

  useEffect(() => {
    loadContract(account).then(setDflix)
  }, [account]);

  useEffect(() => {
    isSubscribed(account, dflix)
      .then(response => {
        setSubscribed(response.subscribed)
      })
      .catch(console.error)
  }, [account, dflix])

  const props = {account, dflix, subscribed};

  return (
    <Switch>
      <Route path="/">
        <Home {...props} />
      </Route>
      <Route path="/channel">
        <Channel {...props} />
      </Route>
    </Switch>
  );
}
