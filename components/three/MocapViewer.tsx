"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useAnimations } from "@react-three/drei";
import { useFBX } from "@react-three/drei";
import { Media } from "@/types";

// TODO: 
//  - make sure you can change the size of the characters
//  - you can't move them around like you can the structures
//  - move them to where the structures are 
interface FBXModelProps {
  url: string;
  scale?: Number;
  position?: [Number, Number, number];
}

function FBXModel({ url, scale = 0.01, position = [0,0,0]}: FBXModelProps) {
  const fbx = useFBX(url);
  const { actions, names } = useAnimations(fbx.animations, fbx);

  useEffect(() => {
    if (names.length > 0) {
      actions[names[0]]?.play();
    }
  }, [actions, names]);

  return <primitive object={fbx} scale={scale} position={position} />;
}

interface MocapViewerProps {
  mocapFiles: Media[];
  scale?: number;
  sharedCanvas?: boolean; // renders all characters in same scene
}

export default function MocapViewer({ mocapFiles, scale = 0.01, sharedCanvas = false }: MocapViewerProps) {
  if (mocapFiles.length === 0) return null;

  if (sharedCanvas) {
    return (
      <div className="mocap-canvas-wrapper">
        <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            {mocapFiles.map((file, i) => (
              <FBXModel
                key={file.id}
                url={file.url}
                scale={scale}
                position={[i * 2, 0, 0]} // space characters apart on x axis
              />
            ))}
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    );    
  }

  return (
    <div className="mocap-viewer">
      {mocapFiles.map(file => (
        <div key={file.id} className="mocap-canvas-wrapper">
          <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <FBXModel url={file.url} />
            </Suspense>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
        </div>
      ))}
    </div>
  );
}