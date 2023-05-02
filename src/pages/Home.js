import Row from "../components/Row";
import Nav from "../components/Nav";
import Hero from "../components/Hero";

import { loadVideos, loadPrivateVideosMapping } from '../web3'
import { useEffect, useState } from "react";

export default function Home({ account, dflix, subscribed }) {
    const [currentVideo, setCurrentVideo] = useState();
    const [videos, setVideos] = useState();
    const [privateMetadata, setPrivateMetadata] = useState();
    
    useEffect(() => {
        loadVideos(account, dflix).then(response => {
            setVideos([...response])
            if (!currentVideo && response) {
                const filtered = response.filter(vid => !vid.isPrivate && !vid.isSubscription)
                if (filtered) setCurrentVideo(filtered[0])
            }
        });

        loadPrivateVideosMapping(account, dflix).then(response => {
            setPrivateMetadata([...response])
        })
    }, [account, dflix, currentVideo]);

    return (
        <div className="app">
            <Nav account={account} dflix={dflix} subscribed={subscribed} />
            <Hero video={currentVideo}/>
            <Row 
                key="0" 
                title="Library" 
                videos={videos} 
                privateMetadata={privateMetadata}
                currentVideo={currentVideo} 
                setCurrentVideo={setCurrentVideo} 
                account={account}
                dflix={dflix}
                subscribed={subscribed}
                noScroll={true} />
        </div>
    );
}
