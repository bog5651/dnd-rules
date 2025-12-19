import '@babylonjs/loaders/glTF';

import type { ArcRotateCamera } from '@babylonjs/core';
import { Color4, CubeTexture, Engine, Scene, SceneLoader } from '@babylonjs/core';

const engines: Record<string, Engine> = {};

export const use3dAnimation = () => {
  async function render(fileName: string, radius = 0): Promise<HTMLCanvasElement> {
    dispose(fileName);

    const canvas = document.createElement('canvas');
    const engine = new Engine(canvas, true, {}, true);

    engines[fileName] = engine;

    engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.createDefaultCameraOrLight(true, true, true);

    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
      `/media/${fileName}.env`,
      scene
    );

    SceneLoader.ShowLoadingScreen = false;
    await SceneLoader.AppendAsync('/media/', `${fileName}.glb`, scene);

    const activeCamera = scene.activeCamera as ArcRotateCamera;
    activeCamera.alpha += Math.PI;
    activeCamera.radius = radius;
    activeCamera.lowerRadiusLimit = activeCamera.upperRadiusLimit = activeCamera.radius;
    activeCamera.panningSensibility = 0;

    engine.runRenderLoop(() => {
      scene.render();
    });

    return canvas;
  }

  function dispose(fileName: string): void {
    const engine = engines[fileName];

    if (engine) {
      engine.stopRenderLoop();
      engine.dispose();

      delete engines[fileName];
    }
  }

  function resize(fileName: string): void {
    engines[fileName]?.resize();
  }

  async function renderCoin(): Promise<HTMLCanvasElement> {
    return render('coin', 0.07);
  }

  return {
    render,
    dispose,
    resize,
    renderCoin
  };
};
