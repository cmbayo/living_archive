"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import { useFBX } from "@react-three/drei";
import { Media } from "@/types";
import * as THREE from "three"

const GROUND_Y = 0;
const STRUCTURE_SIZE = 5;
const CHARACTER_HEIGHT = 1.5;

interface LotSceneProps {
  modelUrl: string | null;
  mocapFiles: Media[];
}

function LotModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? STRUCTURE_SIZE / maxDim : 1;

  return <primitive object={scene} scale={scale} position={[0, GROUND_Y, 0]} />;
}

function CharacterModel({ url, index, total }: { url: string; index: number, total: number }) {
  const fbx = useFBX(url);
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
  const scale = size.y > 0 ? CHARACTER_HEIGHT / size.y : 0.01;

  // space characters around the structure
  const angle = (index / total) * Math.PI * 2;
  const radius = 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return <primitive object={fbx} scale={scale} position={[x, GROUND_Y, z]} />;
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

  return (
    <div className="model-viewer">
      <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Suspense fallback={<LoadingFallback />}>
          {modelUrl && <LotModel url={modelUrl} />}
          {mocapFiles
            .filter(file => file.url && file.url.length > 0)
            .map((file, i) => (
            <CharacterModel
                key={file.id}
                url={file.url}
                index={i}
                total={mocapFiles.length}
              />
          ))}
          <Environment preset="night" />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}