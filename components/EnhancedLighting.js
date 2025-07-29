import React from 'react';
import * as THREE from 'three';

export function EnhancedLighting() {
  return (
    <>
      {/* Enhanced lighting setup for better material showcase */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light for overall illumination */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Additional directional lights for metallic highlights */}
      <directionalLight 
        position={[-5, 8, 3]} 
        intensity={0.8} 
        color="#ffffff" 
      />
      <directionalLight 
        position={[5, -8, -3]} 
        intensity={0.6} 
        color="#4a90e2" 
      />
      
      {/* Colored point lights for atmosphere */}
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.8} 
        color="#ff6b6b" 
        distance={20}
      />
      <pointLight 
        position={[10, -10, -5]} 
        intensity={0.8} 
        color="#00f5ff" 
        distance={20}
      />
      <pointLight 
        position={[0, 15, 0]} 
        intensity={0.5} 
        color="#ffffff" 
        distance={25}
      />
      
      {/* Rim lighting for water effects */}
      <pointLight 
        position={[0, 0, 10]} 
        intensity={0.3} 
        color="#4a90e2" 
        distance={15}
      />
      <pointLight 
        position={[0, 0, -10]} 
        intensity={0.2} 
        color="#4a90e2" 
        distance={15}
      />
      
      {/* Additional accent lights for metallic surfaces */}
      <spotLight
        position={[8, 12, 8]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.4}
        color="#ffffff"
        castShadow
      />
      
      <spotLight
        position={[-8, 12, -8]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.3}
        color="#4a90e2"
        castShadow
      />
    </>
  );
}

// Alternative minimal lighting setup for performance
export function MinimalLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#4a90e2" />
      <pointLight position={[5, 5, -5]} intensity={0.5} color="#ff6b6b" />
    </>
  );
}

// High-performance lighting setup
export function PerformanceLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <pointLight position={[0, 0, 10]} intensity={0.3} color="#4a90e2" />
    </>
  );
}