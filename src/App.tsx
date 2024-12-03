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

  const [isHighQuality, setIsHighQuality] = useState(true);

  // Adjust canvas size and resolution dynamically
  const adjustCanvasResolution = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dpr = isHighQuality ? window.devicePixelRatio || 1 : 1; // High quality uses DPR
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set internal resolution (high DPI for sharp rendering)
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      // Set visible size to match screen dimensions
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Force WebGL to scale correctly
      const gl = canvas.getContext("webgl");
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      console.log(
        `Canvas adjusted: Internal resolution (${canvas.width}x${canvas.height}), Visible size (${width}px x ${height}px)`
      );
    }
  }, [isHighQuality]);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      adjustCanvasResolution();
    };

    handleResize(); // Initial adjustment
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustCanvasResolution]);

  // Toggle between high and low quality
  const toggleQuality = () => {
    setIsHighQuality((prev) => !prev);
    adjustCanvasResolution(); // Update resolution immediately
  };

  // Send data to Unity after the game is loaded
  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded) {
      sendMessage("Data", "UseTestinitData");
      sendMessage("Data", "SetSwipe", "25");
    }
  }, [isLoaded, sendMessage]);

  // Adjust resolution on initial load
  useEffect(() => {
    adjustCanvasResolution();
  }, [adjustCanvasResolution]);

  // Define global functions for interaction
  useEffect(() => {
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };
    window.openstoreScreen = async () => {
      // Placeholder for future implementation
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
          width: "100%", // Match screen size
          height: "100%",
        }}
        unityProvider={unityProvider}
      />
      {/* Quality Toggle Button */}
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
