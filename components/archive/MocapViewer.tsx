"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useAnimations } from "@react-three/drei";
import { useFBX } from "@react-three/drei";
import { Media } from "@/types";

function FBXModel({ url }: { url: string }) {
  const fbx = useFBX(url);
  const { actions, names } = useAnimations(fbx.animations, fbx);

  useEffect(() => {
    if (names.length > 0) {
      actions[names[0]]?.play();
    }
  }, [actions, names]);

  return <primitive object={fbx} scale={0.01} />;
}

interface MocapViewerProps {
  mocapFiles: Media[];
}

export default function MocapViewer({ mocapFiles }: MocapViewerProps) {
  if (mocapFiles.length === 0) return null;

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
            <OrbitControls />
          </Canvas>
        </div>
      ))}
    </div>
  );
}