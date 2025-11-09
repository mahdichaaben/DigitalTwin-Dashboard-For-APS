declare module "react-unity-webgl" {
  import * as React from "react";

  export interface UnityContextOptions {
    loaderUrl: string;
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
  }

  export function useUnityContext(options: UnityContextOptions): {
    unityProvider: any; 

  };

  export const Unity: React.FC<{ unityProvider: any; style?: React.CSSProperties }>;

  export default Unity;
}
