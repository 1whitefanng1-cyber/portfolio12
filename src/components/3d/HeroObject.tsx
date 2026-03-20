import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function HeroObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);

  const timeRef = useRef(0);
  const targetScaleVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta;
      const t = timeRef.current;
      
      // Smoothly adjust rotation speed based on hover
      const targetRotSpeedX = hovered ? 0.8 : 0.2;
      const targetRotSpeedY = hovered ? 1.2 : 0.3;
      
      meshRef.current.rotation.x += delta * targetRotSpeedX;
      meshRef.current.rotation.y += delta * targetRotSpeedY;
      
      // Gentle floating
      meshRef.current.position.y = Math.sin(t) * 0.2;

      // Pulsing scale effect on hover
      const pulse = hovered ? 1.05 + Math.sin(t * 8) * 0.05 : 1;
      const targetScale = clicked ? 1.2 : pulse;
      
      targetScaleVec.set(targetScale, targetScale, targetScale);
      meshRef.current.scale.lerp(targetScaleVec, 0.1);
    }
  });

  return (
    <Icosahedron
      ref={meshRef}
      args={[1.5, 4]}
      onClick={() => setClick(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <MeshDistortMaterial
        color={hovered ? "#00F3FF" : "#4B0082"}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.8}
        roughness={0.2}
        distort={hovered ? 0.4 : 0.2}
        speed={hovered ? 5 : 2}
      />
    </Icosahedron>
  );
}
