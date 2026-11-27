import { useEffect, useRef } from 'react';

interface EmbersCanvasProps {
  className?: string;
}

function createSoftParticleTexture(
  THREE: typeof import('three'),
  innerColor: string,
  outerColor: string
) {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.45, outerColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function EmbersCanvas({ className = '' }: EmbersCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let cancelled = false;
    let frameId = 0;
    let cleanupFn: (() => void) | null = null;

    const timer = window.setTimeout(async () => {
      if (cancelled) return;

      const THREE = await import('three');
      if (cancelled || !container) return;

      const isSoftwareGl = (() => {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      })();

      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const dprMax = isTouch ? 1.75 : 2;
      let currentDpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, dprMax);

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && window.devicePixelRatio < 1.5,
        alpha: true,
        stencil: false,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(currentDpr);
      renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        (container.clientWidth || window.innerWidth) / Math.max(container.clientHeight || window.innerHeight, 1),
        0.1,
        50
      );
      camera.position.z = 8;

      // Golden embers
      const emberCount = isTouch ? 120 : 240;
      const emberPos = new Float32Array(emberCount * 3);
      const emberVel = new Float32Array(emberCount * 2); // [vy, swayPhase]
      for (let i = 0; i < emberCount; i++) {
        emberPos[i * 3] = (Math.random() - 0.5) * 14;
        emberPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
        emberPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        emberVel[i * 2] = 0.35 + Math.random() * 0.85;
        emberVel[i * 2 + 1] = Math.random() * Math.PI * 2;
      }

      const emberGeom = new THREE.BufferGeometry();
      const emberPosAttr = new THREE.BufferAttribute(emberPos, 3);
      emberGeom.setAttribute('position', emberPosAttr);

      const emberTex = createSoftParticleTexture(
        THREE,
        'rgba(255, 224, 140, 1)',
        'rgba(255, 162, 48, 0.42)'
      );
      const emberMat = new THREE.PointsMaterial({
        size: isTouch ? 0.16 : 0.14,
        map: emberTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.85,
      });
      const embers = new THREE.Points(emberGeom, emberMat);
      scene.add(embers);

      // Subtle warm grill smoke wisps
      const smokeCount = isTouch ? 18 : 30;
      const smokePos = new Float32Array(smokeCount * 3);
      const smokeVel = new Float32Array(smokeCount);
      for (let i = 0; i < smokeCount; i++) {
        smokePos[i * 3] = (Math.random() - 0.5) * 13;
        smokePos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        smokePos[i * 3 + 2] = -1.5 + Math.random() * 1.5;
        smokeVel[i] = 0.12 + Math.random() * 0.22;
      }

      const smokeGeom = new THREE.BufferGeometry();
      const smokePosAttr = new THREE.BufferAttribute(smokePos, 3);
      smokeGeom.setAttribute('position', smokePosAttr);

      const smokeTex = createSoftParticleTexture(
        THREE,
        'rgba(255, 188, 125, 0.16)',
        'rgba(255, 181, 71, 0.04)'
      );
      const smokeMat = new THREE.PointsMaterial({
        size: 3.4,
        map: smokeTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.35,
      });
      const smoke = new THREE.Points(smokeGeom, smokeMat);
      scene.add(smoke);

      let isInView = true;
      let isTabVisible = !document.hidden;
      let lastTime = performance.now();
      let elapsed = 0;
      let lowFpsStreak = 0;

      const observer = new IntersectionObserver(
        (entries) => {
          isInView = entries[0]?.isIntersecting ?? true;
          if (isInView && isTabVisible && frameId === 0) {
            lastTime = performance.now();
            scheduleNext();
          }
        },
        { threshold: 0.01 }
      );
      observer.observe(container);

      const onVisibilityChange = () => {
        isTabVisible = !document.hidden;
        if (isInView && isTabVisible && frameId === 0) {
          lastTime = performance.now();
          scheduleNext();
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = Math.max(container.clientHeight || window.innerHeight, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize, { passive: true });

      function afterDraw(cb: () => void) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== 'function') {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (cancelled) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      }

      function scheduleNext() {
        if (cancelled || !isInView || !isTabVisible) {
          frameId = 0;
          return;
        }
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }

      function tick() {
        frameId = 0;
        if (cancelled || !isInView || !isTabVisible) return;

        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        elapsed += dt;

        // Adaptive resolution downscale if FPS < 45
        if (!isSoftwareGl && dt > 1 / 45) {
          lowFpsStreak++;
          if (lowFpsStreak > 12 && currentDpr > 1) {
            currentDpr = Math.max(1, currentDpr * 0.75);
            renderer.setPixelRatio(currentDpr);
            lowFpsStreak = 0;
          }
        } else {
          lowFpsStreak = 0;
        }

        // Update embers in-place (zero allocation)
        for (let i = 0; i < emberCount; i++) {
          const idx = i * 3;
          const vy = emberVel[i * 2];
          const phase = emberVel[i * 2 + 1];
          emberPos[idx + 1] += vy * dt;
          emberPos[idx] += Math.sin(elapsed * 1.4 + phase) * 0.25 * dt;
          if (emberPos[idx + 1] > 4.8) {
            emberPos[idx + 1] = -4.8;
            emberPos[idx] = (Math.random() - 0.5) * 14;
          }
        }
        emberPosAttr.needsUpdate = true;

        // Update smoke in-place
        for (let i = 0; i < smokeCount; i++) {
          const idx = i * 3;
          smokePos[idx + 1] += smokeVel[i] * dt;
          smokePos[idx] += Math.cos(elapsed * 0.5 + i) * 0.08 * dt;
          if (smokePos[idx + 1] > 5.2) {
            smokePos[idx + 1] = -5.2;
            smokePos[idx] = (Math.random() - 0.5) * 13;
          }
        }
        smokePosAttr.needsUpdate = true;

        renderer.render(scene, camera);
        scheduleNext();
      }

      // Kick off render
      if (isSoftwareGl) {
        renderer.render(scene, camera);
        scheduleNext();
      } else {
        frameId = requestAnimationFrame(tick);
      }

      cleanupFn = () => {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('resize', onResize);
        emberGeom.dispose();
        emberMat.dispose();
        emberTex.dispose();
        smokeGeom.dispose();
        smokeMat.dispose();
        smokeTex.dispose();
        renderer.dispose();
        if (canvas.parentNode === container) {
          container.removeChild(canvas);
        }
      };
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}
