import React, { useEffect, useState } from "react";

import { uploadVideo } from '../web3'

import "./Upload.css";
import ImageIcon from '../assets/image.svg';
import VideoIcon from '../assets/video.svg';

const Upload = ({ account, dflix }) => {
  const [title, setTitle] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(false)

  const captureThumbnail = () => {
    const file = document.querySelector('#input-thumbnail-upload');
    setThumbnail(file.files[0]);
  };
  
  const captureVideo = () => {
    const file = document.querySelector("#input-video-upload");
    setVideo(file.files[0]);
  }

  useEffect(() => {
    if (!thumbnail) {
      document.querySelector('#preview-thumbnail').hidden = true;
      return;
    }
    document.querySelector('#preview-thumbnail').src = URL.createObjectURL(thumbnail);
    document.querySelector('#preview-thumbnail').hidden = false
  }, [thumbnail])
  
  useEffect(() => {
    if (!video) {
      document.querySelector('#preview-video').hidden = true;
      return;
    }
    document.querySelector('#preview-video').src = URL.createObjectURL(video);
    document.querySelector('#preview-video').hidden = false
    document.querySelector('#preview-video').load();
  }, [video])

  const uploadFiles = () => {
    console.log('uploading files...', title, thumbnail, video);
    
    if (!title) {
      window.alert('Please enter title');
      return;
    }
    
    if (!thumbnail) {
      window.alert('Please select thumbnail.');
      return;
    }
    
    if (!video) {
      window.alert('Please select video.');
      return;
    }

    const content = {
      title,
      video,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
      fees: 0,
      isPrivate: false,
      isSubscription: false
    }
    setLoading(true)
    uploadVideo(account, dflix, content)
      .then(() => {
        window.alert('Upload successful.')
        clearAll()
        setLoading(false)
      })
      .catch(err => {
        console.error('upload failed', err)
        window.alert('Upload failed.')
        setLoading(false)
      })
  }

  function clearAll() {
    setTitle('')
    setThumbnail()
    setVideo()
  }

  return (
    <div className="upload-container">
      <h2 className="upload-title-text">Enter Title</h2>
      <input
        id="upload-title-input"
        type="text"
        required
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="upload">
        <div>
          <h2>Upload Thumbnail</h2>
          
          <input
            type="file"
            id="input-thumbnail-upload"
            accept="image/*"
            onChange={captureThumbnail}
            hidden
          />
          
          <button className="upload-area" id="btn-drop">
            <span className="upload-area-icon">
              <img src={ImageIcon} alt="upload icon"/> 
            </span>
            <span className="upload-area-title">Drag an image here to upload.</span>
            <span className="upload-area-description">
              Alternatively, you can select a file by <br/><strong>clicking here</strong>
            </span>
            <label for="input-thumbnail-upload" className="upload-label" ></label>
          
            <img className="preview-upload" id="preview-thumbnail" alt="uploaded thumbnail" hidden/>
          </button>
        </div>

        <div>
          <h2>Upload Video</h2>
          
          <input
            type="file"
            id="input-video-upload"
            accept="video/*"
            onChange={captureVideo}
            hidden
          />
          
          <button className="upload-area" id="btn-drop">
            <span className="upload-area-icon">
              <img src={VideoIcon} alt="upload icon"/> 
            </span>
            <span className="upload-area-title">Drag a video here to upload.</span>
            <span className="upload-area-description">
              Alternatively, you can select a file by <br/><strong>clicking here</strong>
            </span>
            <label for="input-video-upload" className="upload-label" ></label>
            
            <video className="preview-upload" id="preview-video" alt="uploaded video" hidden/>
          </button>
        </div>

      </div>

      <button className="btn-primary" onClick={uploadFiles} disabled={loading}> {loading ? "LOADING..." : "UPLOAD" }</button>
    </div>
  );
};

export default Upload;
