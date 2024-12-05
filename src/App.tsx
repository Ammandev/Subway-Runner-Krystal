import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState, useCallback } from "react";

// Extend the Window interface to include hideLoadingScreen as optional
declare global {
  interface Window {
    hideLoadingScreen?: () => void;
    openstoreScreen?: () => void;
  }
}

function App() {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "build/Webgl.loader.js",
    dataUrl: "build/Webgl.data",
    frameworkUrl: "build/Webgl.framework.js",
    codeUrl: "build/Webgl.wasm",
  });

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle resizing to maintain proper scaling
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Dynamically adjust canvas resolution
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr; // Internal resolution
        canvas.height = window.innerHeight * dpr; // Internal resolution
        canvas.style.width = `${window.innerWidth}px`; // Physical screen size
        canvas.style.height = `${window.innerHeight}px`; // Physical screen size
      }
    };

    handleResize(); // Set dimensions initially
    window.addEventListener("resize", handleResize); // Listen for resize events
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  // Function to send data to Unity after the game is loaded
  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded) {
      sendMessage("Data", "UseTestinitData");
      sendMessage("Data", "SetSwipe", "25");
    }
  }, [isLoaded, sendMessage]);

  // Set up canvas resolution on load
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
  }, []);

  // Define global functions for the window object
  useEffect(() => {
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };
    window.openstoreScreen = async () => {
      // Future implementation placeholder
    };
    return () => {
      delete window.hideLoadingScreen;
      delete window.openstoreScreen;
    };
  }, [sendTelegramDataToUnity]);

  return (
    <div className="App">
      <Unity
        style={{
          width: `${windowDimensions.width}px`, // Match the physical screen size
          height: `${windowDimensions.height}px`,
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
}

export default App;
