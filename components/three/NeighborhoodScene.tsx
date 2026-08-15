"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useWebGLSupport } from "@/lib/hooks/useWebGLSupport";
import { getHexPosition3D } from "@/components/archive/HexUtils";

const STRUCTURE_SIZE = 5;
const HEX_SPACING = 3;

interface LotStructure {
  id: number;
  name: string;
  modelUrl: string | null;
}

interface NeighborhoodSceneProps {
  lots: LotStructure[];
}

function StructureModel({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene } = useGLTF(url);

  const normalized = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? STRUCTURE_SIZE / maxDim : 1;
    clone.scale.setScalar(scale);

    box.setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box.min.y, -center.z);

    return clone;
  }, [scene]);

  return <primitive object={normalized} position={position} />;
}

function PlaceholderStructure({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={[position[0], STRUCTURE_SIZE / 2, position[2]]}>
      <boxGeometry args={[STRUCTURE_SIZE * 0.6, STRUCTURE_SIZE * 0.6, STRUCTURE_SIZE * 0.6]} />
      <meshStandardMaterial color="#c4922a" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function Ground({ extent }: { extent: number }) {
  const size = Math.max(extent * 2.5, 12);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#0d0d20" />
    </mesh>
  );
}

function SceneContent({ lots, extent }: { lots: LotStructure[]; extent: number }) {
  const positions = lots.map((_, i) => getHexPosition3D(i, lots.length, HEX_SPACING));

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Ground extent={extent} />

      {lots.map((lot, i) => {
        const position = positions[i];
        if (lot.modelUrl) {
          return <StructureModel key={lot.id} url={lot.modelUrl} position={position} />;
        }
        return <PlaceholderStructure key={lot.id} position={position} />;
      })}

      <Environment preset="night" />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        target={[0, STRUCTURE_SIZE / 2, 0]}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c4922a" wireframe />
    </mesh>
  );
}

function WebGLFallback() {
  return (
    <div className="neighborhood-scene neighborhood-scene--fallback">
      <p>3D viewer requires WebGL. Try Firefox or enable hardware acceleration in Chrome settings.</p>
    </div>
  );
}

function computeExtent(count: number) {
  if (count === 0) return 10;
  const positions = Array.from({ length: count }, (_, i) => getHexPosition3D(i, count, HEX_SPACING));
  const xs = positions.map(p => p[0]);
  const zs = positions.map(p => p[2]);
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs), 6);
}

export default function NeighborhoodScene({ lots }: NeighborhoodSceneProps) {
  const webGLSupported = useWebGLSupport();
  const extent = useMemo(() => computeExtent(lots.length), [lots.length]);
  const camDistance = extent + 10;

  if (lots.length === 0) {
    return (
      <div className="model-placeholder">no structures in this neighborhood yet</div>
    );
  }

  if (webGLSupported === null) return null;
  if (webGLSupported === false) return <WebGLFallback />;

  const modelCount = lots.filter(l => l.modelUrl).length;

  return (
    <section className="neighborhood-scene-section">
      <div className="section-title">
        structures in 3D
        {modelCount < lots.length && (
          <span className="neighborhood-scene-meta">
            {" "}— {modelCount} of {lots.length} with models
          </span>
        )}
      </div>
      <div className="neighborhood-scene">
        <Canvas camera={{ position: [0, camDistance * 0.55, camDistance], fov: 45 }}>
          <Suspense fallback={<LoadingFallback />}>
            <SceneContent lots={lots} extent={extent} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
