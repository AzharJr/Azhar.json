import React, { useRef, useMemo } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.preload('/models/star_orb.glb');

export function SpeedObject({
  position,
  orbData,
  onClick,
  onHover,
  onUnhover,
  isHovered,
  isZoomedIn,
  selectedOrb,
  rotationSpeed,
}) {
  const groupRef = useRef();
  const { nodes } = useGLTF('/models/star_orb.glb');

  const innerRef = useRef();
  const outerRef = useRef();

  // Create enhanced custom shader for water-like warping effect
  const waterShader = useMemo(() => ({
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        
        // Enhanced vertex displacement for water effect
        vec3 pos = position;
        float wave1 = sin(position.x * 4.0 + time * 2.5) * 
                     sin(position.y * 3.0 + time * 1.8) * 
                     sin(position.z * 3.5 + time * 2.2) * 0.03;
        float wave2 = cos(position.x * 2.0 + time * 1.2) * 
                     cos(position.y * 2.5 + time * 1.5) * 
                     cos(position.z * 2.8 + time * 1.8) * 0.02;
        pos += normal * (wave1 + wave2);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      uniform float time;
      uniform vec3 color;
      
      void main() {
        // Create complex flowing water patterns
        float flow1 = sin(vUv.x * 12.0 + time * 2.0) * 0.5 + 0.5;
        float flow2 = cos(vUv.y * 8.0 + time * 1.5) * 0.5 + 0.5;
        float flow3 = sin((vUv.x + vUv.y) * 6.0 + time * 1.8) * 0.5 + 0.5;
        float flow4 = cos((vUv.x - vUv.y) * 4.0 + time * 2.2) * 0.5 + 0.5;
        
        // Combine flows for complex water texture
        float waterPattern = (flow1 + flow2 + flow3 + flow4) / 4.0;
        
        // Add concentric ripples
        float ripple = sin(length(vUv - vec2(0.5)) * 25.0 - time * 4.0) * 0.5 + 0.5;
        
        // Add turbulence
        float turbulence = sin(vUv.x * 20.0 + time * 3.0) * 
                          sin(vUv.y * 15.0 + time * 2.5) * 0.3 + 0.7;
        
        // Create dynamic transparency based on patterns
        float alpha = 0.2 + waterPattern * 0.5 + ripple * 0.3 + turbulence * 0.2;
        alpha = clamp(alpha, 0.1, 0.9);
        
        // Enhanced color variation with depth
        vec3 waterColor = mix(color, vec3(0.3, 0.7, 1.0), waterPattern * 0.4);
        waterColor = mix(waterColor, vec3(0.1, 0.4, 0.8), ripple * 0.3);
        waterColor = mix(waterColor, vec3(0.8, 0.9, 1.0), turbulence * 0.2);
        
        // Add fresnel effect for realistic water
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        waterColor = mix(waterColor, vec3(1.0, 1.0, 1.0), fresnel * 0.3);
        
        gl_FragColor = vec4(waterColor, alpha);
      }
    `
  }), []);

  // Define enhanced materials with better metallic properties
  const materials = useMemo(() => ({
    // Semi-metallic inner core with enhanced properties
    core: new THREE.MeshStandardMaterial({
      color: orbData.color,
      emissive: orbData.color,
      emissiveIntensity: isHovered ? 1.2 : 0.6,
      metalness: 0.8,
      roughness: 0.2,
      toneMapped: false,
      envMapIntensity: 1.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    }),
    
    // Water-like outer shell with custom shader
    shell: new THREE.ShaderMaterial({
      vertexShader: waterShader.vertexShader,
      fragmentShader: waterShader.fragmentShader,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#4a90e2') }
      },
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
    }),
  }), [isHovered, orbData.color, waterShader]);

  // Enhanced animation with more dynamic effects
  useFrame((state, delta) => {
    if (groupRef.current && !isZoomedIn) {
      groupRef.current.rotation.y += rotationSpeed;
    }
    if(innerRef.current) {
        innerRef.current.rotation.y += delta * 2.0;
        innerRef.current.rotation.x += delta * 0.5;
    }
    if(outerRef.current) {
        outerRef.current.rotation.y -= delta * 0.8;
        outerRef.current.rotation.z += delta * 0.3;
    }
    
    // Update shader time uniform for water animation
    if (materials.shell.uniforms) {
      materials.shell.uniforms.time.value += delta;
    }
  });

  const coreNode = nodes.Object_4;
  const shellNode = nodes.Object_6;

  if (!coreNode || !shellNode) {
    return null;
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Enhanced hover text with glow effect */}
      {isHovered && !isZoomedIn && (
        <Html position={[0, 1.8, 0]} center>
          <div className="bg-black/90 text-white px-6 py-3 rounded-xl backdrop-blur-md border border-white/30 shadow-2xl">
            <h3 className="text-xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {orbData.title}
            </h3>
          </div>
        </Html>
      )}

      <group
        scale={0.1} // Adjust scale as needed
        onPointerEnter={(e) => { e.stopPropagation(); onHover(); }}
        onPointerLeave={(e) => { e.stopPropagation(); onUnhover(); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <group ref={innerRef}>
            <mesh geometry={coreNode.geometry} material={materials.core} />
        </group>
        <group ref={outerRef}>
            <mesh geometry={shellNode.geometry} material={materials.shell} />
        </group>
      </group>

      {/* Enhanced detail panel */}
      {isZoomedIn && selectedOrb === orbData.id && (
        <Html position={[0, 0, 1.5]} center>
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 text-white p-8 rounded-2xl backdrop-blur-lg border border-white/20 max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {orbData.title}
            </h2>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">{orbData.description}</p>
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}