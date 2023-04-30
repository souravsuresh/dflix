import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";

import Home from "./pages/Home";
import Channel from "./pages/Channel";

import { loadWeb3, loadAccount, loadContract, loadVideos } from './web3'
import "./App.css";


export default function App() {
  const [account, setAccount] = useState();
  const [dflix, setDflix] = useState();
  const [videos, setVideos] = useState();

  useEffect(() => {
    loadWeb3().then(() => {
      loadAccount().then(setAccount)
    })
  }, []);

  useEffect(() => {
    loadContract(account).then(setDflix)
  }, [account]);

  useEffect(() => {
    loadVideos(account, dflix).then(setVideos);
  }, [account, dflix]);

  useEffect(() => {
    console.log('videos loaded...', videos)
  }, [videos]);

  return (
    <Switch>
      <Route path="/">
        <Home account={account} dflix={dflix} />
      </Route>
      <Route path="/channel">
        <Channel account={account} dflix={dflix} />
      </Route>
    </Switch>
  );
}
