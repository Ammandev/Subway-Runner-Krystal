import './App.css';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState, useCallback } from "react";

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

  const [isHighQuality, setIsHighQuality] = useState(true);

  const handleResize = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dpr = isHighQuality ? window.devicePixelRatio || 1 : 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      } else {
        console.error("WebGL context not available.");
      }

      console.log(
        `Canvas resized: Internal resolution (${canvas.width}x${canvas.height}), Visible size (${width}px x ${height}px)`
      );
    }

    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, [isHighQuality]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const sendTelegramDataToUnity = useCallback(() => {
    if (isLoaded) {
      sendMessage("Data", "UseTestinitData");
      sendMessage("Data", "SetSwipe", "25");
    }
  }, [isLoaded, sendMessage]);

  useEffect(() => {
    window.hideLoadingScreen = () => {
      sendTelegramDataToUnity();
    };
    window.openstoreScreen = async () => {
      // Placeholder
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
          width: `${windowDimensions.width}px`,
          height: `${windowDimensions.height}px`,
        }}
        unityProvider={unityProvider}
      />
      <button
        onClick={() => setIsHighQuality((prev) => !prev)}
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
