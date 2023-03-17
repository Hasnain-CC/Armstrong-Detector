import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect, getObjectCount, speakLength } from "./utilities";

import logo from "./assets/images/logo.png";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    runCoco();
  }, []);

  useEffect(() => {
    speakLength(objects);
  }, [objects]);

  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      const ctx = canvasRef.current.getContext("2d");

      drawRect(obj, ctx);
      if (obj.length !== 0 && objects.length !== obj.length) {
        setObjects(obj);
      }
    }
  };

  const canvasStyle = {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    top: 160,
    left: 0,
    right: 0,
    textAlign: "center",
    zindex: 9,
    width: 640,
    height: 480,
  };

  return (
    <div className="App">
      <header className="AppHeader">
        <img src={logo} className="logo" alt="app-logo"/>
        <h4>Team Armstrong</h4>
      </header>
      <Webcam ref={webcamRef} muted={true} style={canvasStyle} />
      <div className="mt-2">
        {objects.length ? (
          <div>
            <h4>{getObjectCount(objects)}</h4>
            <p>Press space bar to read the count</p>
          </div>
        ) : null}
      </div>
      <div className="canvasDiv">
        <canvas ref={canvasRef} style={canvasStyle} />
      </div>
    </div>
  );
}

export default App;
