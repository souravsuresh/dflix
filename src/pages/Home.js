import Banner from "../components/Banner";
import Row from "../components/Row";
import Nav from "../components/Nav";

import request from "../request";
import { loadVideos } from '../web3'
import { useEffect } from "react";

export default function Home({ account, dflix }) {

    useEffect(() => {
        loadVideos(account, dflix)
            .then(response => {
                console.log('load videos response', response)
            })
            .catch(console.error)
    }, []);

    return (
        <div className="app">
            <Nav account={account} dflix={dflix} />
            <Banner url={request.fetchNetflixOriginals} />
            <Row
                key="1"
                title="DFLIX ORIGINALS"
                fetchUrl={request.fetchNetflixOriginals}
                isLarge="true"
            />
            <Row key="2" title="Trending Now" fetchUrl={request.fetchTrending} />
            <Row key="3" title="Top Rated" fetchUrl={request.fetchTopRated} />
            <Row key="4" title="Action Movies" fetchUrl={request.fetchActionMovies} />
            <Row key="5" title="Comedy Movies" fetchUrl={request.fetchComedyMovies} />
            <Row key="6" title="Horror Movies" fetchUrl={request.fetchHorrorMovies} />
            <Row key="7" title="Romance Movies" fetchUrl={request.fetchRomanceMovies} />
            <Row key="8" title="Documentaries" fetchUrl={request.fetchDocumentries} />
        </div>
    );
}
