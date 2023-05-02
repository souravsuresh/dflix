import Web3 from "web3";
import { Web3Storage } from "web3.storage";
import dflixABI from "./abis/DFLIX.json";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNiNjUxNjlGYjdGMDc4OTM1RWQ2MWFlQmE5YjI1NzljOThGMDAyMmMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODI1NjE2NzMwNTEsIm5hbWUiOiJkYXBwLXRlc3QifQ.Xt1FrR5lV_ifejRZAqGdMm6twM2Q6SxNQwoqtKtrCnw";
const client = new Web3Storage({ token });

export async function loadWeb3() {
    console.log('loadWeb3 started...');
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        throw new Error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
    console.log('loadWeb3 completed...', window.web3);
}

export async function loadAccount() {
    console.log('loadAccount started...');
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log('loadAccount completed...', accounts);
    return accounts[0];
}

export async function loadContract(account) {
    if (!account) return;
    console.log('loadContract started...');
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = dflixABI.networks[networkId];
    
    if (networkData) {
        const dflix = new web3.eth.Contract(dflixABI.abi, networkData.address);
        console.log('loadContract completed...', dflix);
        return dflix;
    } else {
        throw new Error("dflix contract not deployed to detected network.");
    }
}

export async function loadVideos(account, dflix) {
    if (!account || !dflix) return [];
    console.log('loadVideos started...');
    const numVideo = await dflix.methods.numVideo().call();
    
    // Starting in reverse order to get latest videos
    const videos = [];
    for (var i = numVideo; i > 0; i--) {
        const video = dflix.methods.videos(i).call();
        videos.push(video);
    }
    const resolved_videos = await Promise.all(videos);
    console.log('loadVideos completed...', resolved_videos);
    return resolved_videos;
}

export async function loadPrivateVideosMapping(account, dflix) {
    if (!account || !dflix) return [];
    console.log('loadPrivateVideosMapping started...');
    const numVideo = await dflix.methods.numPrivateVideo().call();
    
    // Starting in reverse order to get latest videos
    const videos = [];
    for (var i = numVideo; i > 0; i--) {
        const video = dflix.methods.privateVideosMapping(i).call();
        videos.push(video);
    }
    const resolved_videos = await Promise.all(videos);
    console.log('loadPrivateVideosMapping completed...', resolved_videos);
    return resolved_videos;
}

export async function uploadVideo(account, dflix, {title, video, thumbnail, description = "", isPrivate = false, fees = 0, isSubscription = false}) {
    if (!account || !dflix) return;
    console.log('uploadVideo started...');
    const contentHash = await client.put([video], { wrapWithDirectory: false });
    const thumbnailHash = await client.put([thumbnail], { wrapWithDirectory: false });
    console.log("Uploaded video for " + account + " with title: " + title + " with hash value " + contentHash);
    
    const _hash = await dflix.methods.uploadVideo(contentHash, title, description, isPrivate, parseFloat(fees), isSubscription).send({ from: account });
    console.log('uploadVideo completed...', "Transaction hash ::", _hash);    
    return _hash;
}

export async function isSubscribed(account, dflix) {
    if (!account || !dflix) return;
    console.log('isSubscribed started...');
    const response = await dflix.methods.subscription(account).call()
    console.log('isSubscribed completed...', response);
    return response;
}

export async function buySubscription(account, dflix) {
    if (!account || !dflix) return;
    console.log('buySubscription started...');
    const fromDate = new Date();
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() + 30);
    const data = await dflix.methods.buySubscription(account, fromDate.getTime(), toDate.getTime()).send({ from: account });
    console.log('buySubscription completed...', data);
    return data;
}

export async function buyPrivateVideo(account, dflix, video) {
    if (!account && !dflix) return;
    console.log('buyPrivateVideo started...')
    const data = await dflix.methods.buyPrivateVideo(video.id).send({from: account});
    console.log('buyPrivateVideo completed...', data)
}