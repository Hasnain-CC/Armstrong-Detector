import React, { useRef, useEffect, useState } from "react";
import "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect, getObjectCount, speakLength, speakObjectCount } from "./utilities";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import logo from "./assets/images/logo.png";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const msg = new SpeechSynthesisUtterance();

  const commands = [
    {
      command: 'Hello',
      callback: () => {
        msg.text = 'Hello, how can i help you';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
        resetTranscript()
      },
      matchInterim: true
    },
    {
      command: 'count',
      callback: () => {
        speakObjectCount(objects)
        resetTranscript()
      },
      matchInterim: true
    },
    {
      command: 'reset',
      callback: () => {
        msg.text = 'Okay, your wish is my command';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
        resetTranscript()
      },
      matchInterim: true
    },
  ]

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    runCoco();
    listenContinuously()
  }, []);

  useEffect(() => {
    speakLength(objects);
  }, [objects]);

  useEffect(() => {
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript);
      resetTranscript()
    }
  }, [interimTranscript, finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }
 
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
  }

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

  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-GB',
    });
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
