"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

// 3D model component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c4922a" wireframe />
    </mesh>
  );
}

interface ModelViewerProps {
  url: string;
}

// console.log("media:", media);
// console.log("model:", model);

export default function ModelViewer({ url }: ModelViewerProps) {
  return (
    <div className="model-viewer">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<LoadingFallback />}>
          <Model url={url} />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}