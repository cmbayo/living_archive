"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import { useFBX } from "@react-three/drei";
import { Media } from "@/types";
import * as THREE from "three"

const GROUND_Y = 0;
const STRUCTURE_SIZE = 5;
const CHARACTER_HEIGHT = 1.5;
const CHARACTER_WIDTH = CHARACTER_HEIGHT * 0.3; // rough approximation

interface LotSceneProps {
  modelUrl: string | null;
  mocapFiles: Media[];
}

function getCharacterPosition(
  index: number,
  total: number,
  existingPositions: [number, number][]
): [number, number, number] {
  const BASE_RADIUS = STRUCTURE_SIZE + CHARACTER_WIDTH;
  const angle = (index / total) * Math.PI * 2;

  let radius = BASE_RADIUS;
  let x = Math.cos(angle) * radius;
  let z = Math.sin(angle) * radius;

  const MIN_DISTANCE = CHARACTER_WIDTH;
  let attempts = 0;

  while (attempts < 10) {
    const overlapping = existingPositions.some(([ex, ez]) => {
      const dist = Math.sqrt((x - ex) ** 2 + (z - ez) ** 2);
      return dist < MIN_DISTANCE;
    });

    if (!overlapping) break;
    radius += CHARACTER_HEIGHT * 0.5;
    x = Math.cos(angle) * radius;
    z = Math.sin(angle) * radius;
    attempts++;
  }

  return [x, GROUND_Y, z];
}

function LotModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? STRUCTURE_SIZE / maxDim : 1;

  return <primitive object={scene} scale={scale} position={[0, GROUND_Y, 0]} />;
}

function CharacterModel({ url, position }: { url: string; position: [number,number, number]}) {
  const fbx = useFBX(url);
  // const clone = useMemo(() => fbx.clone(), [fbx]);
  const { actions, names } = useAnimations(fbx.animations, fbx);

  useEffect(() => {
    if (names.length > 0) {
      actions[names[0]]?.play();
    }

    fbx.traverse(child => {
    if ((child as THREE.Light).isLight) {
        child.visible = false;
        // const light = child as THREE.Light;
        // light.intensity = light.intensity * 0.1;
    }
    });
  }, [actions, names]);

  const box = new THREE.Box3().setFromObject(fbx);
  const size = box.getSize(new THREE.Vector3());
  console.log("character size:", size);
  console.log("character scale:", CHARACTER_HEIGHT / size.y);
  const scale = size.y > 0 ? CHARACTER_HEIGHT / size.y : 0.01;

  return <primitive object={fbx} scale={scale} position={position} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c4922a" wireframe />
    </mesh>
  );
}

export default function LotScene({ modelUrl, mocapFiles }: LotSceneProps) {
  const hasContent = modelUrl || mocapFiles.length > 0;

  if (!hasContent) {
    return (
      <div className="model-placeholder">no structures or characters yet</div>
    );
  }

  const activeFiles = mocapFiles.filter(file => file.url && file.url.length > 0);
  const placedPositions: [number, number][] = [];

  return (
    <div className="model-viewer">
      <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Suspense fallback={<LoadingFallback />}>
          {modelUrl && <LotModel url={modelUrl} />}
          {activeFiles.map((file, i) => { 
              const [x, y, z] = getCharacterPosition(i, activeFiles.length, placedPositions);
              placedPositions.push([x,z]);
              return (
                <CharacterModel
                    key={file.id}
                    url={file.url}
                    position={[x,y,z]}
                  />
              );
          })}
          <Environment preset="night" />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}