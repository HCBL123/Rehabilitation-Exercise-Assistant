import React, { Suspense, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, Environment } from '@react-three/drei';
import { Alert, AlertDescription } from '../components/ui/alert';

function Model() {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, '/assets/sample-poses/model.glb');

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={2}
      position={[0, 0, 0]}
    />
  );
}

function ErrorBoundary({ children }) {
  return (
    <ErrorBoundary fallback={
      <Alert variant="destructive">
        <AlertDescription>Error loading 3D model</AlertDescription>
      </Alert>
    }>
      {children}
    </ErrorBoundary>
  );
}

export default function StaticModelViewer() {
  return (
    <div className="w-full">
      <div className="w-full h-96 bg-gray-100 rounded-lg">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          className="w-full h-full"
        >
          <ErrorBoundary>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Model />
              <Environment preset="city" />
              <OrbitControls />
            </Suspense>
          </ErrorBoundary>
        </Canvas>
      </div>
    </div>
  );
}
