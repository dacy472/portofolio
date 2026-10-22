import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

function makeSphere(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = radius * (0.25 + Math.random() * 0.75);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function Orbit({ radius, speed, color, tilt, scroll }) {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * speed * (1 + scroll.current);
  });

  return (
    <group ref={group} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.014, 12, 120]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Scene({ pointer, scroll }) {
  const group = useRef(null);
  const particles = useRef(null);
  const knot = useRef(null);
  const core = useRef(null);
  const violet = useMemo(() => makeSphere(1500, 5.2), []);
  const pink = useMemo(() => makeSphere(420, 2.6), []);

  useFrame((state, delta) => {
    const groupNode = group.current;
    if (!groupNode) return;

    const targetX = pointer.current.y * -0.22;
    const targetY = pointer.current.x * 0.28;
    groupNode.rotation.x = THREE.MathUtils.damp(groupNode.rotation.x, targetX, 2.4, delta);
    groupNode.rotation.y = THREE.MathUtils.damp(groupNode.rotation.y, targetY, 2.4, delta);
    groupNode.position.y = THREE.MathUtils.damp(groupNode.position.y, scroll.current * -0.8, 2, delta);

    if (particles.current) particles.current.rotation.y += delta * (0.08 + scroll.current * 0.12);

    const cameraZ = 5.2 + scroll.current * 2.4;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, cameraZ, 2.5, delta);

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
    if (knot.current) {
      knot.current.rotation.x += delta * 0.35;
      knot.current.rotation.y += delta * 0.55;
      knot.current.scale.setScalar(pulse);
    }
    if (core.current) {
      core.current.rotation.y -= delta * 0.4;
      core.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={group}>
      <group ref={particles}>
      <Points positions={violet} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#c4b5fd"
          size={0.018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points positions={pink} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fb7185"
          size={0.032}
          sizeAttenuation
          depthWrite={false}
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      </group>

      <group position={[2.85, 0.15, -0.6]}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[0.72, 0.2, 140, 18]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.55} />
        </mesh>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.34} />
        </mesh>
        <Orbit radius={1.85} speed={0.55} color="#818cf8" tilt={[0.5, 0.2, 0]} scroll={scroll} />
        <Orbit radius={2.25} speed={-0.32} color="#ec4899" tilt={[1.2, 0.4, 0.3]} scroll={scroll} />
      </group>

      <mesh position={[-2.5, -0.7, -1.3]} rotation={[0.6, 0.4, 0.2]}>
        <torusGeometry args={[1.05, 0.02, 16, 90]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const [frameloop, setFrameloop] = useState(() => (document.hidden ? 'never' : 'always'));

  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.hidden ? 'never' : 'always');
    };
    const onPointerMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1);
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 58 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <Scene pointer={pointer} scroll={scroll} />
      </Canvas>
    </div>
  );
}
