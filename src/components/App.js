import React, { Component } from "react";
import Web3 from "web3";
import dFlix from "../abis/DFLIX.json";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";
// import "dotenv/config";


const token ="";
const client = new Web3Storage({ token });
const loaderStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

class App extends Component {

    async componentWillMount() {
      
      await this.loadWeb3()
      await this.loadVideos()
    }
  
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }


    async loadVideos() {
        console.log("Load Videos");
        
        const web3 = window.web3;

        // Load account
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });

        // Network ID
        const networkId = await web3.eth.net.getId();
        const networkData = dFlix.networks[networkId];
        
        if (networkData) {
        const dflix = new web3.eth.Contract(dFlix.abi, networkData.address);
        this.setState({ dflix });

        const numVideo = await dflix.methods.numVideo().call();
        this.setState({ numVideo });

        // Starting in reverse order to get latest videos (Can be improved (suggestion based vides!!?))
        for (var i = numVideo; i >= 1; i--) {
            const video = await dflix.methods.videos(i).call();
            this.setState({
            videos: [...this.state.videos, video],
            });
            console.log(video)
        }

        console.log(numVideo);
        
        //Set current video with title to view as default
        const currentVideo = await dflix.methods.videos(numVideo).call();
        console.log(currentVideo);
        this.setState({
            currentHash: currentVideo._hash,
            currentTitle: currentVideo.title,
        });
        this.setState({ loading: false });
        } else {
        window.alert("dflix contract not deployed to detected network.");
        }
    }

    captureFile = (event) => {
        event.preventDefault();
        const file = document.querySelector('input[type="file"]');
        return this.setState({ file: file });
    };

    async uploadVideo(title, description = "", isPrivate = false, fees = 0, isSubscription = false) {
        console.log("Submitting file to IPFS...");

        const video = this.state.file;
        
        //adding file to the IPFS
        const contentHash = await client.put(video.files, { wrapWithDirectory: false });
        console.log("Uploaded video for "+this.state.account+" with title: " + title +" with hash value "+contentHash);
        this.setState({ loading: true });
        this.state.dflix.methods
        .uploadVideo(contentHash, title, description, isPrivate, fees, isSubscription)
        .send({ from: this.state.account })
        .on("transactionHash", (_hash) => {
            console.log("Transaction hash :: "+ _hash);
            this.setState({ loading: false });
        });
    }

    changeVideo = (hash, title) => {
        this.setState({ currentHash: hash });
        this.setState({ currentTitle: title });
        // @TODO more states here!
    };

    constructor(props) {
        super(props);
        this.state = {
          file: null,       // current file
          account: "",      // user account
          dflix: null,    // object 
          videos: [],       // video list  (pagination!?)
          loading: true,    // loading state
          currentHash: null,  // current video hash
          currentTitle: null,   // current video title
          currentDescription : null,

        };
        console.log("Inside constructor");
        this.uploadVideo = this.uploadVideo.bind(this);
        this.captureFile = this.captureFile.bind(this);
        this.changeVideo = this.changeVideo.bind(this);
    }
    
    render() {
        return (
          <div className="bg-dark">
            <Navbar
              account={this.state.account}
            />
            {this.state.loading ? (
              <div id="loader" style={loaderStyle}>
                <p className="text-white">Loading...</p>
              </div>
            ) : (
              <>
                <Main
                  videos={this.state.videos}
                  account={this.state.account}
                  uploadVideo={this.uploadVideo}
                  captureFile={this.captureFile}
                  changeVideo={this.changeVideo}
                  currentHash={this.state.currentHash}
                  currentTitle={this.state.currentTitle}
                />
              </>
            )}
          </div>
        );
      }
}
export default App;