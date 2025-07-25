import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ThreeJSVisualizationProps {
  data: any;
}

// Rotating mesh component
function RotatingMesh({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<any>();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Network node component
function NetworkNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<any>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Connection line component
function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = [start, end];
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4f46e5" />
    </line>
  );
}

export const ThreeJSVisualization: React.FC<ThreeJSVisualizationProps> = ({
  data
}) => {
  if (!data) {
    return (
      <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No 3D data to visualize</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border bg-gradient-to-br from-background to-muted/20">
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Render network nodes if available */}
        {data.nodes && data.nodes.map((node: any, index: number) => (
          <NetworkNode 
            key={index}
            position={[node.x, node.y, node.z]} 
            color={node.color || '#4f46e5'} 
          />
        ))}
        
        {/* Render connection lines if available */}
        {data.links && data.nodes && data.links.map((link: any, index: number) => {
          const sourceNode = data.nodes[link.source];
          const targetNode = data.nodes[link.target];
          if (sourceNode && targetNode) {
            return (
              <ConnectionLine
                key={index}
                start={[sourceNode.x, sourceNode.y, sourceNode.z]}
                end={[targetNode.x, targetNode.y, targetNode.z]}
              />
            );
          }
          return null;
        })}
        
        {/* Render simple objects if no network data */}
        {data.objects && data.objects.map((obj: any, index: number) => (
          <RotatingMesh 
            key={index}
            position={obj.position} 
            color={obj.color || '#4f46e5'} 
          />
        ))}
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};