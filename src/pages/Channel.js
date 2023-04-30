import React, { useState, useEffect } from "react";

import Upload from "../components/Upload";
import Row from "../components/Row";
import Nav from "../components/Nav";

import request from "../request";

export default function Channel(props) {
    return (
        <div className="app">
            <Nav {...props} />
            <Upload {...props} />
            <Row
                title="My Uploads"
                fetchUrl={request.fetchNetflixOriginals}
                noScroll={true}
            />
        </div>
    );
}
