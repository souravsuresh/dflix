import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";

import Home from "./pages/Home";
import Channel from "./pages/Channel";

import { loadWeb3, loadAccount, loadContract } from './web3'
import "./App.css";


export default function App() {
  const [account, setAccount] = useState();
  const [dflix, setDflix] = useState();

  useEffect(() => {
    loadWeb3().then(() => {
      loadAccount().then(setAccount)
    })
  }, []);

  useEffect(() => {
    loadContract(account).then(setDflix)
  }, [account]);

  const props = {account, dflix};

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
