import Upload from "../components/Upload";
import Row from "../components/Row";
import Nav from "../components/Nav";

import { loadVideos } from '../web3'
import { useEffect, useState } from "react";

export default function Channel({ account, dflix, subscribed }) {
    const [videos, setVideos] = useState();
    
    useEffect(() => {
        loadVideos(account, dflix).then(response => {
            const data = response.filter(o => o && o.author && o.author === account)
            setVideos([...data])
        });
    }, [account, dflix]);


    return (
        <div className="app">
            <Nav account={account} dflix={dflix} subscribed={subscribed} />
            <Upload account={account} dflix={dflix} />
            <Row
                title="My Videos"
                videos={videos}
                noScroll={true}
                clickable={false}
                privateMetadata={[]}
                account={account}
                dflix={dflix}
            />
        </div>
    );
}
