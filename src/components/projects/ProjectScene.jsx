import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCheapScene, usePrefersReducedMotion } from './useShowcaseMedia';

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSeeds(count, spread, seed) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: (rand() - 0.5) * spread,
    y: (rand() - 0.5) * spread * 0.55,
    z: (rand() - 0.5) * spread,
    s: 0.08 + rand() * 0.2,
    speed: 0.12 + rand() * 0.32,
    phase: rand() * Math.PI * 2,
    spin: 0.08 + rand() * 0.22,
    tint: rand(),
  }));
}

function makeSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.35, '#9a9a9a');
  gradient.addColorStop(1, '#000000');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function usePresence(ref) {
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden));

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const nearObserver = new IntersectionObserver(([entry]) => {
      setNear(entry.isIntersecting);
    }, { rootMargin: '20% 0px', threshold: 0 });

    const visibleObserver = new IntersectionObserver(([entry]) => {
      setOnScreen(entry.isIntersecting);
    }, { threshold: 0.04 });

    nearObserver.observe(node);
    visibleObserver.observe(node);

    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ref]);

  return { near, playing: onScreen && tabVisible };
}

function ReleaseResources() {
  const scene = useThree((state) => state.scene);
  useLayoutEffect(() => () => {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (!object.material) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && value.isTexture) value.dispose();
        });
        material.dispose();
      });
    });
  }, [scene]);
  return null;
}

function Frame({ sceneType, pointer, children }) {
  const group = useRef(null);
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (sceneType === 'grid') {
      camera.position.set(0, 2.2, 6.4);
      camera.lookAt(0, 0.05, -6);
    } else if (sceneType === 'skyline') {
      camera.position.set(0, 0.45, 11.5);
      camera.lookAt(0, 0.7, -1);
    } else if (sceneType === 'aurora') {
      camera.position.set(0, 0.25, 8.2);
      camera.lookAt(0, 0.7, -2);
    } else {
      camera.position.set(0, 0.2, 8.4);
      camera.lookAt(0, 0, -1);
    }
  }, [camera, sceneType]);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const step = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const targetY = pointer.current.x * 0.16 + Math.sin(time * 0.12) * 0.035;
    const targetX = pointer.current.y * -0.08 + Math.cos(time * 0.1) * 0.02;
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetY, 2.1, step);
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, targetX, 2.1, step);
  });

  return <group ref={group}>{children}</group>;
}

function Dust({ count, color, spread, seed }) {
  const group = useRef(null);
  const positions = useMemo(() => {
    const rand = mulberry32(seed);
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (rand() - 0.5) * spread;
      values[i * 3 + 1] = (rand() - 0.5) * spread * 0.62;
      values[i * 3 + 2] = (rand() - 0.5) * spread;
    }
    return values;
  }, [count, spread, seed]);

  useLayoutEffect(() => {
    const host = group.current;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size: 0.065,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    host.add(points);
    return () => {
      host.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [positions, color]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.045;
  });

  return <group ref={group} />;
}

function placeMotes(mesh, data, dummy, time) {
  data.forEach((item, index) => {
    dummy.position.set(
      item.x + Math.sin(time * item.speed + item.phase) * 0.42,
      item.y + Math.cos(time * item.speed * 0.72 + item.phase) * 0.32,
      item.z,
    );
    dummy.rotation.z = item.phase + time * item.spin;
    dummy.scale.set(item.s * 0.42, item.s, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

function Motes({ count, spread, seed, primary, secondary }) {
  const group = useRef(null);
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => makeSeeds(count, spread, seed), [count, spread, seed]);

  useLayoutEffect(() => {
    const host = group.current;
    const geometry = new THREE.PlaneGeometry(1, 1.45);
    const texture = makeSprite();
    const material = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, seeds.length);
    mesh.frustumCulled = false;
    const color = new THREE.Color();
    const from = new THREE.Color(primary);
    const to = new THREE.Color(secondary);
    seeds.forEach((item, index) => {
      mesh.setColorAt(index, color.copy(from).lerp(to, item.tint));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    host.add(mesh);
    meshRef.current = mesh;
    placeMotes(mesh, seeds, dummy, 0);
    return () => {
      host.remove(mesh);
      meshRef.current = null;
      geometry.dispose();
      material.dispose();
      texture.dispose();
      mesh.dispose();
    };
  }, [seeds, primary, secondary, dummy]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || !seeds.length) return;
    placeMotes(mesh, seeds, dummy, state.clock.elapsedTime);
  });

  return <group ref={group} />;
}

const gridVertex = `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const gridFragment = `
  uniform vec3 uColor;
  uniform vec3 uSecondary;
  uniform float uTime;
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vec2 uv = vUv;
    uv.y += uTime * 0.045;
    vec2 grid = abs(fract(uv * vec2(24.0, 62.0)) - 0.5);
    float line = min(grid.x, grid.y);
    float width = max(fwidth(line) * 1.4, 0.004);
    float mask = 1.0 - smoothstep(width, width * 2.4, line);
    float major = step(0.975, fract(uv.y * 4.5));
    vec3 color = mix(uColor, uSecondary, major);
    float depthFade = pow(1.0 - clamp(vUv.y, 0.0, 1.0), 1.25);
    float side = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    float fogFade = 1.0 - smoothstep(7.0, 28.0, vDist);
    float pulse = 0.74 + 0.26 * sin(uTime * 0.55 + vUv.y * 10.0);
    float alpha = mask * depthFade * side * fogFade * pulse;
    if (alpha < 0.03) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function GridScene({ primary, secondary, cheap }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(primary) },
      uSecondary: { value: new THREE.Color(secondary) },
    },
    vertexShader: gridVertex,
    fragmentShader: gridFragment,
  }), [primary, secondary]);

  const materialRef = useRef(null);

  useLayoutEffect(() => {
    materialRef.current = material;
    return () => {
      materialRef.current = null;
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    const current = materialRef.current;
    if (!current) return;
    current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -12]}>
        <planeGeometry args={[64, 80, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>
      {!cheap && (
        <mesh position={[0, 0.35, -16]} rotation={[0.15, 0, 0]}>
          <planeGeometry args={[22, 3.2]} />
          <meshBasicMaterial
            color={primary}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function ParticleScene({ primary, secondary, cheap }) {
  return (
    <group>
      <Dust count={cheap ? 90 : 340} color={primary} spread={cheap ? 10 : 15} seed={41} />
      {!cheap && <Motes count={16} spread={12} seed={77} primary={primary} secondary={secondary} />}
    </group>
  );
}

function SkylineScene({ primary, secondary, cheap }) {
  const towers = useMemo(() => {
    const count = cheap ? 4 : 8;
    const rand = mulberry32(19);
    return Array.from({ length: count }, (_, index) => ({
      x: (index - (count - 1) / 2) * 1.85 + (rand() - 0.5) * 0.28,
      height: 1.5 + rand() * (cheap ? 2.2 : 3.6),
      z: -1.2 - rand() * (cheap ? 3.5 : 6.5),
      width: 0.38 + rand() * 0.5,
      depth: 0.38 + rand() * 0.42,
    }));
  }, [cheap]);

  return (
    <group>
      {towers.map((tower, index) => (
        <group key={index} position={[tower.x, tower.height / 2 - 1.7, tower.z]}>
          <mesh>
            <boxGeometry args={[tower.width, tower.height, tower.depth]} />
            <meshBasicMaterial color={primary} wireframe transparent opacity={0.72} toneMapped={false} />
          </mesh>
          {!cheap && (
            <mesh scale={[0.78, 0.86, 0.78]}>
              <boxGeometry args={[tower.width, tower.height, tower.depth]} />
              <meshBasicMaterial color={secondary} wireframe transparent opacity={0.38} toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}
      {!cheap && <Motes count={10} spread={14} seed={23} primary={primary} secondary={secondary} />}
    </group>
  );
}

const auroraVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragment = `
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  void main() {
    float wave = sin(vUv.x * 5.2 + uTime * 0.3 + uPhase);
    wave += 0.48 * sin(vUv.y * 2.6 - uTime * 0.18 + uPhase * 1.3);
    float band = smoothstep(0.08, 0.92, wave * 0.5 + 0.5);
    float vertical = smoothstep(0.0, 0.26, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
    float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float shift = 0.5 + 0.5 * sin(uTime * 0.22 + uPhase + vUv.x * 2.0);
    vec3 color = mix(uColorA, uColorB, shift);
    float alpha = band * vertical * edge * 0.4;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function AuroraScene({ primary, secondary, cheap }) {
  const materials = useMemo(() => {
    const count = cheap ? 1 : 3;
    return Array.from({ length: count }, (_, index) => new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: index * 1.7 },
        uColorA: { value: new THREE.Color(primary) },
        uColorB: { value: new THREE.Color(secondary) },
      },
      vertexShader: auroraVertex,
      fragmentShader: auroraFragment,
    }));
  }, [primary, secondary, cheap]);

  const materialsRef = useRef(null);

  useLayoutEffect(() => {
    materialsRef.current = materials;
    return () => {
      materialsRef.current = null;
      materials.forEach((material) => material.dispose());
    };
  }, [materials]);

  useFrame((state) => {
    const list = materialsRef.current;
    if (!list) return;
    const time = state.clock.elapsedTime;
    for (let index = 0; index < list.length; index += 1) {
      list[index].uniforms.uTime.value = time;
    }
  });

  const layers = cheap
    ? [{ y: 0.9, z: -3.2, tilt: 0.08, width: 16, height: 5 }]
    : [
      { y: 1.45, z: -2.4, tilt: 0.05, width: 18, height: 4.4 },
      { y: 0.35, z: -4.4, tilt: -0.08, width: 16, height: 5.4 },
      { y: 1.7, z: -6.2, tilt: 0.12, width: 20, height: 3.8 },
    ];

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh key={layer.z} position={[0, layer.y, layer.z]} rotation={[0.12, 0, layer.tilt]}>
          <planeGeometry args={[layer.width, layer.height]} />
          <primitive object={materials[index]} attach="material" />
        </mesh>
      ))}
      {!cheap && <Motes count={22} spread={13} seed={91} primary={primary} secondary={secondary} />}
    </group>
  );
}

function SceneBody({ theme, cheap }) {
  if (theme.sceneType === 'grid') {
    return <GridScene primary={theme.primary} secondary={theme.secondary} cheap={cheap} />;
  }
  if (theme.sceneType === 'skyline') {
    return <SkylineScene primary={theme.primary} secondary={theme.secondary} cheap={cheap} />;
  }
  if (theme.sceneType === 'aurora') {
    return <AuroraScene primary={theme.primary} secondary={theme.secondary} cheap={cheap} />;
  }
  return <ParticleScene primary={theme.primary} secondary={theme.secondary} cheap={cheap} />;
}

const ProjectScene = ({ theme, pointer }) => {
  const hostRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const cheap = useCheapScene();
  const { near, playing } = usePresence(hostRef);
  const pointerRef = pointer || { current: { x: 0, y: 0 } };
  const fogNear = theme.sceneType === 'particles' ? 4.5 : 8;
  const fogFar = theme.sceneType === 'particles' ? 16 : 30;

  return (
    <div className="project-scene" ref={hostRef} aria-hidden="true">
      {!reduced && near ? (
        <Canvas
          flat
          dpr={[1, 2]}
          frameloop={playing ? 'always' : 'never'}
          camera={{ position: [0, 0.4, 8], fov: 48, near: 0.1, far: 80 }}
          gl={{
            alpha: false,
            antialias: !cheap,
            powerPreference: cheap ? 'low-power' : 'high-performance',
            stencil: false,
          }}
        >
          <color attach="background" args={[theme.fog]} />
          <fog attach="fog" args={[theme.fog, fogNear, fogFar]} />
          <ReleaseResources />
          <Frame sceneType={theme.sceneType} pointer={pointerRef}>
            <SceneBody theme={theme} cheap={cheap} />
          </Frame>
        </Canvas>
      ) : null}
    </div>
  );
};

export default ProjectScene;
