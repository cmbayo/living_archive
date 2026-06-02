"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import { useFBX } from "@react-three/drei";

interface Character {
  id: number;
  name: string;
  mocapUrl: string | null;
}

interface LotSceneProps {
  modelUrl: string | null;
//   characters: Character[];
  mocapFiles: Media[];
}

function LotModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, 0, 0]} />;
}

function CharacterModel({ url, index, total }: { url: string; index: number, total: number }) {
  const fbx = useFBX(url);
  const { actions, names } = useAnimations(fbx.animations, fbx);

  useEffect(() => {
    if (names.length > 0) {
      actions[names[0]]?.play();
    }
  }, [actions, names]);

  // space characters around the structure
  const angle = (index / total) * Math.PI * 2;
  const radius = 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return <primitive object={fbx} scale={.1} position={[x, 0, z]} />;
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

//   const activeCharacters = characters.filter(c => c.mocapUrl !== null);

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