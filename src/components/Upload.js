import React, { useEffect, useState, useLayoutEffect } from "react";

import { uploadVideo } from '../web3'

import "./Upload.css";
import ImageIcon from '../assets/image.svg';
import VideoIcon from '../assets/video.svg';

const Upload = ({ account, dflix }) => {
  const [title, setTitle] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState();
  const [access, setAccess] = useState('none');

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
    
    if (!description) {
      window.alert('Please enter description');
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
      description,
      fees: 0,
      isPrivate: access === 'private',
      isSubscription: access === 'sub'
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

  function handleAccessControl(e) {
    if (!e.target.value) return;
    setAccess(e.target.value)
  }

  function clearAll() {
    setTitle('')
    setDescription('')
    setThumbnail()
    setVideo()
    setAccess('none')
  }

  useLayoutEffect(() => {
    const root = document.querySelector('#root');
    if (loading) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      if (!root.classList.contains('loading')) {
        root.classList.add('loading');
      }
    }
    if (!loading) {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      if (root.classList.contains('loading')) {
        root.classList.remove('loading');
      }
    }
  }, [loading]);

  return (
    <div className={`upload-container ${loading ? 'loading' : ''}`}>
      <h1 className="upload-title-text" style={{marginBottom: '2rem'}}>Upload Content</h1>
      <h2 className="upload-title-text">Enter Title</h2>
      <input
        id="upload-title-input"
        type="text"
        required
        autoComplete="off"
        onChange={e => setTitle(e.target.value)}
      />
      
      <h2 className="upload-title-text" style={{marginTop: '1rem'}}>Enter Description</h2>
      <textarea
        id="upload-title-input"
        type="text"
        required
        rows={8}
        autoComplete="off"
        onChange={e => setDescription(e.target.value)}
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

      <div style={{marginBottom: '2rem'}}>
        <h2>Select content access control</h2>
        <div className="access-control">
          <div className="radio">
            <input id="access-none" name="access-control" value='none' type="radio" checked={access === 'none'} onChange={handleAccessControl} />
            <label for="access-none" className="radio-label">None</label>
          </div>
          
          <div className="radio">
            <input id="access-private" name="access-control" value='private' type="radio" checked={access === 'private'} onChange={handleAccessControl} />
            <label  for="access-private" className="radio-label">Private</label>
          </div>

          <div className="radio">
            <input id="access-subscribed" name="access-control" value='sub' type="radio" checked={access === 'sub'} onChange={handleAccessControl} />
            <label for="access-subscribed" className="radio-label">Subscriber-Only</label>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={uploadFiles} disabled={loading}> {loading ? "LOADING..." : "UPLOAD" }</button>
    </div>
  );
};

export default Upload;
