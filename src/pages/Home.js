import Row from "../components/Row";
import Nav from "../components/Nav";
import Hero from "../components/Hero";

import { loadVideos } from '../web3'
import { useEffect, useState } from "react";

export default function Home({ account, dflix }) {
    const [currentVideo, setCurrentVideo] = useState();
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        setVideos([]);
        loadVideos(account, dflix).then(response => {
            setVideos([...response])
            if (!currentVideo && response && response[0]) {
                setCurrentVideo(response[0])
            }
            console.log('videos state updated', videos)
        }).catch(console.error)
    }, []);

    useEffect(() => {
        console.info('VIDEOS UPDATED!!!')
    }, [videos])

    return (
        <div className="app">
            <Nav account={account} dflix={dflix} />
            <Hero video={currentVideo}/>
            <Row key="0" title="All" videos={videos} currentVideo={currentVideo} setCurrentVideo={setCurrentVideo} noScroll={true}/>
        </div>
    );
}
