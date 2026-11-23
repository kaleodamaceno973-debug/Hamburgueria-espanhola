import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Hambúrguer 3D procedural (sem modelos externos ≈ 0 KB de assets).
 * Camadas se separam conforme o progresso do scroll.
 */

export type BurgerScene = {
  setProgress: (p: number) => void;
  setActive: (step: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  renderOnce: () => void;
  dispose: () => void;
};

const R = 1.55; // raio base

/** ruído barato e determinístico */
function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}
function noise1(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

function lathe(points: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments);
}

function bunTop(materials: THREE.Material[]) {
  const group = new THREE.Group();
  const H = 1.05;
  const pts: [number, number][] = [];
  pts.push([0, -0.06], [R * 0.9, -0.06], [R * 1.0, 0.02], [R * 1.03, 0.12]);
  for (let i = 1; i <= 16; i++) {
    const a = (i / 16) * (Math.PI / 2);
    pts.push([Math.max(0.0001, R * 1.03 * Math.cos(a)), 0.12 + H * Math.sin(a) * (1 - 0.08 * Math.sin(a * 2))]);
  }
  const bunMat = new THREE.MeshPhysicalMaterial({ color: 0xc9772c, roughness: 0.45, clearcoat: 0.55, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color(0xffc27a) });
  materials.push(bunMat);
  const dome = new THREE.Mesh(lathe(pts, 72), bunMat);
  group.add(dome);

  // miolo (face inferior clara)
  const crumbMat = new THREE.MeshStandardMaterial({ color: 0xf0cf96, roughness: 0.95 });
  materials.push(crumbMat);
  const crumb = new THREE.Mesh(new THREE.CircleGeometry(R * 0.92, 48), crumbMat);
  crumb.rotation.x = Math.PI / 2;
  crumb.position.y = -0.055;
  group.add(crumb);

  // gergelim instanciado
  const seedGeo = new THREE.SphereGeometry(0.055, 8, 6);
  const seedMat = new THREE.MeshStandardMaterial({ color: 0xf6e7c1, roughness: 0.6 });
  materials.push(seedMat);
  const COUNT = 70;
  const seeds = new THREE.InstancedMesh(seedGeo, seedMat, COUNT);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < COUNT; i++) {
    const a = 0.12 + hash(i + 1) * 1.05; // ângulo polar
    const t = hash(i * 7.3) * Math.PI * 2;
    const r = R * 1.03 * Math.sin(a);
    const y = 0.12 + H * Math.cos(a) * (1 - 0.08 * Math.sin((Math.PI / 2 - a) * 2)) + 0.01;
    const pos = new THREE.Vector3(r * Math.cos(t), y, r * Math.sin(t));
    const normal = new THREE.Vector3(pos.x / (R * R), (y - 0.12) / (H * H), pos.z / (R * R)).normalize();
    q.setFromUnitVectors(up, normal);
    const spin = new THREE.Quaternion().setFromAxisAngle(normal, hash(i * 3.1) * Math.PI);
    q.premultiply(spin);
    m.compose(pos, q, new THREE.Vector3(1, 0.42, 0.62));
    seeds.setMatrixAt(i, m);
  }
  group.add(seeds);
  return group;
}

function bunBottom(materials: THREE.Material[]) {
  const group = new THREE.Group();
  const pts: [number, number][] = [
    [0, -0.42],
    [R * 0.9, -0.42],
    [R * 0.99, -0.36],
    [R * 1.03, -0.2],
    [R * 1.02, -0.04],
    [R * 0.97, 0.0],
    [0.0001, 0.0],
  ];
  const bunMat = new THREE.MeshPhysicalMaterial({ color: 0xc27029, roughness: 0.5, clearcoat: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xffc27a) });
  materials.push(bunMat);
  group.add(new THREE.Mesh(lathe(pts, 64), bunMat));
  const crumbMat = new THREE.MeshStandardMaterial({ color: 0xf2d39c, roughness: 0.95 });
  materials.push(crumbMat);
  const crumb = new THREE.Mesh(new THREE.CircleGeometry(R * 0.96, 48), crumbMat);
  crumb.rotation.x = -Math.PI / 2;
  crumb.position.y = 0.003;
  group.add(crumb);
  return group;
}

function patty(materials: THREE.Material[]) {
  const geo = new THREE.CylinderGeometry(R * 1.08, R * 1.05, 0.36, 96, 4);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const base = new THREE.Color(0x3a2113);
  const crust = new THREE.Color(0x1f1009);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    const ang = Math.atan2(v.z, v.x);
    if (r > R * 0.7) {
      // borda irregular e crocante (efeito "smash")
      const n = noise1(ang * 6 + 3) * 0.16 + noise1(ang * 19) * 0.06;
      const k = (r + n) / r;
      v.x *= k;
      v.z *= k;
      v.y += (noise1(ang * 11 + v.y * 5) - 0.5) * 0.08;
    } else {
      v.y += (noise1(v.x * 4 + v.z * 3) - 0.5) * 0.05 * Math.sign(v.y);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
    const c = base.clone().lerp(crust, Math.min(1, noise1(ang * 13 + r * 4) * 0.9 + (r > R ? 0.3 : 0)));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0.02 });
  materials.push(mat);
  return new THREE.Mesh(geo, mat);
}

function cheese(materials: THREE.Material[]) {
  const size = R * 1.72;
  const geo = new THREE.PlaneGeometry(size, size, 36, 36);
  geo.rotateX(-Math.PI / 2);
  geo.rotateY(Math.PI / 4);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const d = Math.hypot(v.x, v.z);
    const edge = R * 0.72;
    if (d > edge) v.y -= Math.pow(d - edge, 2) * 1.9 + (noise1(Math.atan2(v.z, v.x) * 8) * 0.06);
    v.y += (noise1(v.x * 3 + 1) - 0.5) * 0.02;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffa51a,
    roughness: 0.35,
    clearcoat: 0.4,
    side: THREE.DoubleSide,
    emissive: new THREE.Color(0x7a3000),
    emissiveIntensity: 0.25,
  });
  materials.push(mat);
  return new THREE.Mesh(geo, mat);
}

function sauce(materials: THREE.Material[]) {
  const geo = new THREE.CylinderGeometry(R * 0.98, R * 0.98, 0.06, 64, 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ang = Math.atan2(v.z, v.x);
    const r = Math.hypot(v.x, v.z);
    if (r > 0.1) {
      const k = 1 + (noise1(ang * 7) - 0.5) * 0.12;
      v.x *= k;
      v.z *= k;
      if (v.y < 0 && noise1(ang * 9 + 2) > 0.72) v.y -= 0.18 * noise1(ang * 31); // gotas
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xff7f3f, roughness: 0.25, clearcoat: 0.8, emissive: new THREE.Color(0x5a1a00), emissiveIntensity: 0.2 });
  materials.push(mat);
  return new THREE.Mesh(geo, mat);
}

function onionsAndPickles(materials: THREE.Material[]) {
  const group = new THREE.Group();
  const onionMat = new THREE.MeshPhysicalMaterial({ color: 0xe9d6e8, roughness: 0.3, transmission: 0.2, thickness: 0.2, clearcoat: 0.5 });
  const pickleMat = new THREE.MeshStandardMaterial({ color: 0x6f8f2a, roughness: 0.55 });
  materials.push(onionMat, pickleMat);
  const ringGeo = new THREE.TorusGeometry(0.34, 0.045, 8, 40);
  const rings: [number, number, number][] = [
    [0.55, 0.3, 0.4],
    [-0.6, -0.25, 0.32],
    [0.1, -0.7, 0.28],
  ];
  for (const [x, z, s] of rings) {
    const t = new THREE.Mesh(ringGeo, onionMat);
    t.rotation.x = Math.PI / 2;
    t.scale.setScalar(s / 0.34);
    t.position.set(x, 0, z);
    group.add(t);
  }
  const pickleGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 28);
  const pickles: [number, number][] = [
    [-0.25, 0.6],
    [0.75, -0.35],
    [-0.85, 0.35],
    [0.05, 0.05],
  ];
  for (const [x, z] of pickles) {
    const p = new THREE.Mesh(pickleGeo, pickleMat);
    p.position.set(x, 0.01, z);
    p.rotation.z = (hash(x * 10) - 0.5) * 0.2;
    group.add(p);
  }
  return group;
}

function tomato(materials: THREE.Material[]) {
  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xd8261c, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.15 });
  const inner = new THREE.MeshStandardMaterial({ color: 0xff5a3c, roughness: 0.6 });
  materials.push(mat, inner);
  const geo = new THREE.CylinderGeometry(0.78, 0.78, 0.13, 40);
  const capGeo = new THREE.CircleGeometry(0.62, 32);
  for (const [x, z] of [
    [-0.62, 0.2],
    [0.62, -0.18],
  ] as const) {
    const s = new THREE.Mesh(geo, mat);
    s.position.set(x, 0, z);
    group.add(s);
    const c = new THREE.Mesh(capGeo, inner);
    c.rotation.x = -Math.PI / 2;
    c.position.set(x, 0.067, z);
    group.add(c);
  }
  return group;
}

function lettuce(materials: THREE.Material[]) {
  const geo = new THREE.RingGeometry(0.01, R * 1.22, 128, 8);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const light = new THREE.Color(0x7cc242);
  const dark = new THREE.Color(0x2c741b);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    const ang = Math.atan2(v.z, v.x);
    const t = r / (R * 1.22);
    v.y += Math.sin(ang * 11 + noise1(ang * 3) * 4) * 0.11 * t * t + (noise1(ang * 23) - 0.5) * 0.06 * t;
    const k = 1 + (noise1(ang * 5) - 0.5) * 0.12 * t;
    v.x *= k;
    v.z *= k;
    pos.setXYZ(i, v.x, v.y, v.z);
    const c = dark.clone().lerp(light, t * 0.8 + noise1(ang * 17) * 0.2);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, side: THREE.DoubleSide });
  materials.push(mat);
  return new THREE.Mesh(geo, mat);
}

export function createBurgerScene(canvas: HTMLCanvasElement, { mobile }: { mobile: boolean }): BurgerScene {
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.75 : 2);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr < 2, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.45;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffe2c4, 0x1a0d05, 0.9));
  const key = new THREE.DirectionalLight(0xfff1df, 2.4);
  key.position.set(4, 7, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xff6a00, 40, 20, 1.6);
  rim.position.set(-4.5, 2.5, -3.5);
  scene.add(rim);
  const fill = new THREE.PointLight(0xffb020, 14, 16, 1.8);
  fill.position.set(4, -1.5, 3);
  scene.add(fill);

  const materials: THREE.Material[] = [];
  const burger = new THREE.Group();
  scene.add(burger);

  // Ordem de baixo para cima: [objeto, y montado, índice do passo]
  const layers: { obj: THREE.Object3D; base: number; step: number }[] = [
    { obj: bunBottom(materials), base: 0, step: 0 },
    { obj: sauce(materials), base: 0.04, step: 1 },
    { obj: patty(materials), base: 0.25, step: 2 },
    { obj: cheese(materials), base: 0.46, step: 3 },
    { obj: onionsAndPickles(materials), base: 0.54, step: 4 },
    { obj: tomato(materials), base: 0.64, step: 5 },
    { obj: lettuce(materials), base: 0.74, step: 5 },
    { obj: bunTop(materials), base: 0.86, step: 0 },
  ];
  layers.forEach((l) => burger.add(l.obj));

  // Sombra de contato falsa (barata)
  const shadowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(0,0,0,0.75)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  materials.push(shadowMat);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.48;
  scene.add(shadow);

  let target = 0;
  let current = 0;
  let active = -1;
  const activeAmt = layers.map(() => 0);
  let raf = 0;
  let running = false;
  let last = performance.now();
  let time = 0;

  const smooth = (e0: number, e1: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  function layout(dt: number) {
    current += (target - current) * Math.min(1, dt * 6);
    const p = current;
    // separa (0→0.14), mantém, e remonta no final (0.86→1)
    const explode = smooth(0, 0.14, p) * (1 - smooth(0.86, 1, p));
    const gap = mobile ? 0.44 : 0.5;
    const n = layers.length;
    layers.forEach((l, i) => {
      const isActive = l.step === active && explode > 0.5;
      activeAmt[i] += ((isActive ? 1 : 0) - activeAmt[i]) * Math.min(1, dt * 7);
      const a = activeAmt[i];
      l.obj.position.y = l.base + (i - (n - 1) / 2) * gap * explode + (i === n - 1 ? 0.25 * explode : 0) - (i === 0 ? 0.2 * explode : 0);
      l.obj.position.x = a * (mobile ? 0 : 0.35);
      l.obj.position.z = a * 0.6;
      l.obj.scale.setScalar(1 + a * 0.08);
      l.obj.rotation.z = a * 0.08;
    });
    burger.rotation.y = p * Math.PI * 2.2 + Math.sin(time * 0.6) * 0.06;
    burger.rotation.x = 0.08 + explode * 0.12;
    burger.position.y = 0.2 + Math.sin(time * 1.2) * 0.03 - explode * 0.15;
    shadow.scale.setScalar(1 + explode * 0.25);
    shadowMat.opacity = 1 - explode * 0.35;
    const dist = (mobile ? 9.2 : 9.6) + explode * (mobile ? 4.4 : 4.6);
    camera.position.set(0, 2.6 + explode * 0.9, dist);
    camera.lookAt(0, 0.3 - explode * 0.05, 0);
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    layout(dt);
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  resize();

  return {
    setProgress(p) {
      target = Math.min(1, Math.max(0, p));
    },
    setActive(step) {
      active = step;
    },
    resize,
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    renderOnce() {
      current = target;
      layers.forEach((_, i) => (activeAmt[i] = 0));
      layout(0.016);
      renderer.render(scene, camera);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
      shadowTex.dispose();
      envRT.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
