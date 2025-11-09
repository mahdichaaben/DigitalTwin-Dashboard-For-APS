import { Unity, useUnityContext } from "react-unity-webgl";

const DigitalTwin: React.FC = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/build/build3.loader.js",
    dataUrl: "/build/build3.data.gz",
    frameworkUrl: "/build/build3.framework.js.gz",
    codeUrl: "/build/build3.wasm.gz",
  });

  return (
  <div className="w-full h-full">
    <Unity
      unityProvider={unityProvider}
      style={{ width: "100%", height: "100%" }}
    />
  </div>
  );
};

export default DigitalTwin;
