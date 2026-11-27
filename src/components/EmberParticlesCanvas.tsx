import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function createEmberTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, 'rgba(255, 225, 160, 1)');
    grad.addColorStop(0.28, 'rgba(255, 130, 40, 0.85)');
    grad.addColorStop(0.65, 'rgba(233, 59, 30, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function detectWebGLSupport(): { supported: boolean; isSoftwareGl: boolean } {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      (probeCanvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (probeCanvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) {
      return { supported: false, isSoftwareGl: true };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

export default function EmberParticlesCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const { supported, isSoftwareGl } = detectWebGLSupport();
    if (!supported) {
      setDisabled(true);
      return;
    }

    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const count = isTouch ? 130 : 260;

    let renderer: THREE.WebGLRenderer;
    try {
      const dpr = isSoftwareGl
        ? 1
        : Math.min(window.devicePixelRatio || 1, isTouch ? 1.75 : 2);
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl && dpr < 1.5,
        stencil: false,
        depth: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(dpr);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch {
      setDisabled(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 40);
    camera.position.set(0, 0, 10);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const drifts = new Float32Array(count);
    const phases = new Float32Array(count);

    const colorHot = new THREE.Color('#FFB23F');
    const colorEmber = new THREE.Color('#E9632D');
    const colorRed = new THREE.Color('#FF3B2E');
    const tmpColor = new THREE.Color();

    const resetParticle = (i: number, randomY: boolean) => {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 18;
      positions[i3 + 1] = randomY ? (Math.random() - 0.5) * 12 : -6.2 - Math.random() * 2.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.55 + Math.random() * 1.45;
      drifts[i] = (Math.random() - 0.5) * 0.65;
      phases[i] = Math.random() * Math.PI * 2;

      const mix = Math.random();
      if (mix < 0.35) {
        tmpColor.copy(colorHot);
      } else if (mix < 0.78) {
        tmpColor.copy(colorEmber);
      } else {
        tmpColor.copy(colorRed);
      }
      colors[i3] = tmpColor.r;
      colors[i3 + 1] = tmpColor.g;
      colors[i3 + 2] = tmpColor.b;
    };

    for (let i = 0; i < count; i++) {
      resetParticle(i, true);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const emberTexture = createEmberTexture();
    const material = new THREE.PointsMaterial({
      size: isTouch ? 0.24 : 0.28,
      map: emberTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frameId = 0;
    let isDisposed = false;
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let lastTime = performance.now();
    let fpsAccumulator = 0;
    let fpsFrames = 0;
    let currentDprScale = 1;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    const tick = (now?: number) => {
      if (isDisposed || !isVisible || !isTabVisible) {
        frameId = 0;
        return;
      }

      const currentNow = typeof now === 'number' ? now : performance.now();
      const dt = Math.min((currentNow - lastTime) / 1000, 0.05);
      lastTime = currentNow;

      // Adaptive resolution check if GPU drops below 45 fps
      if (!isSoftwareGl && dt > 0) {
        fpsAccumulator += dt;
        fpsFrames++;
        if (fpsAccumulator >= 1.2) {
          const avgFps = fpsFrames / fpsAccumulator;
          if (avgFps < 45 && currentDprScale > 0.65) {
            currentDprScale = Math.max(0.65, currentDprScale - 0.15);
            const baseDpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.75 : 2);
            renderer.setPixelRatio(Math.max(1, baseDpr * currentDprScale));
          }
          fpsAccumulator = 0;
          fpsFrames = 0;
        }
      }

      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const t = currentNow * 0.001;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += speeds[i] * dt;
        arr[i3] += (drifts[i] + Math.sin(t * 1.4 + phases[i]) * 0.32) * dt;
        if (arr[i3 + 1] > 6.5) {
          resetParticle(i, false);
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(() => tick());
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      if (isDisposed || frameId !== 0 || !isVisible || !isTabVisible) return;
      lastTime = performance.now();
      if (isSoftwareGl) {
        tick();
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        frameId = 0;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible && isTabVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      if (isVisible && isTabVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const resizeObserver = new ResizeObserver(() => {
      if (isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    startLoop();

    return () => {
      isDisposed = true;
      stopLoop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      emberTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (disabled) return null;

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    />
  );
}
