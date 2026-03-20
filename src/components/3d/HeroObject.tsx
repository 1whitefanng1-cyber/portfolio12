import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function HeroObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta;
      const t = timeRef.current;
      
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
      
      // Gentle floating
      meshRef.current.position.y = Math.sin(t) * 0.2;
    }
  });

  return (
    <Icosahedron
      ref={meshRef}
      args={[1.5, 4]}
      scale={clicked ? 1.2 : 1}
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
