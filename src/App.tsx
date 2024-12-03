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

  const [isHighQuality, setIsHighQuality] = useState(true); // State to manage quality
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle resizing to maintain proper scaling
  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      adjustCanvasResolution(isHighQuality); // Update canvas resolution on resize
    }

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isHighQuality]);

  // Function to adjust canvas resolution dynamically
  const adjustCanvasResolution = useCallback((highQuality: boolean) => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dpr = highQuality ? window.devicePixelRatio || 1 : 1; // High quality uses DPR
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
  }, []);

  // Function to toggle quality
  const toggleQuality = () => {
    setIsHighQuality((prev) => !prev);
    adjustCanvasResolution(!isHighQuality); // Adjust resolution based on the new quality setting
  };

  // Function to send data to Unity after the game is loaded
  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded) {
      sendMessage("Data", "UseTestinitData");
      sendMessage("Data", "SetSwipe", "25");
    }
  }, [isLoaded, sendMessage]);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      adjustCanvasResolution(isHighQuality); // Set initial resolution
    }
  }, [adjustCanvasResolution, isHighQuality]);

  useEffect(() => {
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };
    window.openstoreScreen = async () => {
      // Future implementation
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
      {/* Button to toggle quality */}
      <button
        onClick={toggleQuality}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Toggle Quality ({isHighQuality ? "High" : "Low"})
      </button>
    </div>
  );
}

export default App;
