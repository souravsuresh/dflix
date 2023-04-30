import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Banner.css";

const Banner = ({ url }) => {
  const [moviePoster, setMoivePoster] = useState([]);

  const getMoviePoster = async () => {
    const request = await axios.get(url);
    setMoivePoster(
      request.data.results[
        Math.floor(Math.random() * request.data.results.length) + 1
      ]
    );
  };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };
  useEffect(() => {
    getMoviePoster();
  }, []);
  return (
    <header
      className="banner"
      style={{
        background: `url("https://image.tmdb.org/t/p/original/${moviePoster?.backdrop_path}")`,
      }}
    >
      <div className="banner_contents">
        <h1 className="banner_title">
          {moviePoster?.name ||
            moviePoster?.title ||
            moviePoster?.original_name}
        </h1>
        <div className="banner_buttons">
          <button className="banner_button">Play</button>
          <button className="banner_button">My List</button>
        </div>
        <h1 className="banner_description">
          {truncate(moviePoster?.overview, 200)}
        </h1>
      </div>
      <div className="fadedBottom"></div>
    </header>
  );
};

export default Banner;
