import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FireProps {
    intensity: number; // 0-10 scale
    position?: [number, number, number];
    chemicalName?: string;
}

export const Fire = ({ intensity, position = [0, 0, 0], chemicalName }: FireProps) => {
    const fireGroupRef = useRef<THREE.Group>(null);
    const timeRef = useRef(0);

    // Get fire color based on chemical
    const getFireColor = (chemicalName?: string) => {
        switch (chemicalName?.toLowerCase()) {
            case 'methane':
                return { base: [1, 0.2, 0], tip: [1, 1, 0.3] }; // Blue-tipped flame
            case 'hydrogen':
                return { base: [1, 0.8, 0], tip: [1, 1, 1] }; // Bright white flame
            case 'sodium':
                return { base: [1, 0.3, 0], tip: [1, 1, 0] }; // Yellow flame
            default:
                return { base: [1, 0.3, 0], tip: [1, 0.8, 0] }; // Orange flame
        }
    };

    const fireColor = getFireColor(chemicalName);

    // Create more realistic fire particles
    const particles = useMemo(() => {
        const particleCount = Math.min(Math.floor(intensity * 15), 100); // More particles
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);
        const maxLifetimes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Initial positions (base of fire with some randomness)
            const radius = Math.random() * 0.3;
            const angle = Math.random() * Math.PI * 2;
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.random() * 0.2;
            positions[i3 + 2] = Math.sin(angle) * radius;

            // Colors based on chemical
            const colorMix = Math.random();
            colors[i3] = fireColor.base[0] + (fireColor.tip[0] - fireColor.base[0]) * colorMix;
            colors[i3 + 1] = fireColor.base[1] + (fireColor.tip[1] - fireColor.base[1]) * colorMix;
            colors[i3 + 2] = fireColor.base[2] + (fireColor.tip[2] - fireColor.base[2]) * colorMix;

            // Sizes (smaller at base, larger in middle)
            sizes[i] = Math.random() * 0.08 + 0.02;

            // Velocities with more realistic physics
            velocities[i3] = (Math.random() - 0.5) * 0.02; // Horizontal drift
            velocities[i3 + 1] = 0.03 + Math.random() * 0.04; // Upward movement
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02; // Depth drift

            // Lifetime management
            lifetimes[i] = 0;
            maxLifetimes[i] = 2 + Math.random() * 3; // 2-5 seconds
        }

        return { positions, colors, sizes, velocities, lifetimes, maxLifetimes, count: particleCount };
    }, [intensity, fireColor]);

    // Animate fire particles with more realistic physics
    useFrame((_, delta) => {
        if (!fireGroupRef.current || particles.count === 0) return;
        timeRef.current += delta;

        const firePoints = fireGroupRef.current.children[0] as THREE.Points;
        if (!firePoints || !firePoints.geometry) return;

        const positionAttribute = firePoints.geometry.attributes.position;
        const colorAttribute = firePoints.geometry.attributes.color;
        const sizeAttribute = firePoints.geometry.attributes.size;

        if (!positionAttribute || !colorAttribute || !sizeAttribute) return;

        const positions = positionAttribute.array as Float32Array;
        const colors = colorAttribute.array as Float32Array;
        const sizes = sizeAttribute.array as Float32Array;

        for (let i = 0; i < particles.count; i++) {
            const i3 = i * 3;

            // Update lifetime
            particles.lifetimes[i] += delta;

            // Add turbulence and wind effects
            const turbulence = Math.sin(timeRef.current * 2 + i) * 0.01;
            const wind = Math.sin(timeRef.current * 0.5) * 0.005;

            // Update positions with more realistic physics
            positions[i3] += particles.velocities[i3] + turbulence + wind;
            positions[i3 + 1] += particles.velocities[i3 + 1] + turbulence * 0.5;
            positions[i3 + 2] += particles.velocities[i3 + 2] + turbulence;

            // Add upward acceleration (buoyancy)
            particles.velocities[i3 + 1] += 0.001;

            // Add horizontal drift (convection)
            particles.velocities[i3] += (Math.random() - 0.5) * 0.001;
            particles.velocities[i3 + 2] += (Math.random() - 0.5) * 0.001;

            // Reset particles that die or go too high
            if (positions[i3 + 1] > 3 || particles.lifetimes[i] > particles.maxLifetimes[i]) {
                const radius = Math.random() * 0.3;
                const angle = Math.random() * Math.PI * 2;
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = Math.random() * 0.2;
                positions[i3 + 2] = Math.sin(angle) * radius;
                particles.lifetimes[i] = 0;
                particles.velocities[i3] = (Math.random() - 0.5) * 0.02;
                particles.velocities[i3 + 1] = 0.03 + Math.random() * 0.04;
                particles.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
            }

            // Color changes based on height and lifetime
            const heightFactor = Math.max(0, 1 - positions[i3 + 1] / 3);
            const lifeFactor = Math.max(0, 1 - particles.lifetimes[i] / particles.maxLifetimes[i]);
            const combinedFactor = heightFactor * lifeFactor;

            // More realistic color progression
            const colorMix = Math.random() * 0.5 + 0.5; // Less random variation
            colors[i3] = (fireColor.base[0] + (fireColor.tip[0] - fireColor.base[0]) * colorMix) * combinedFactor;
            colors[i3 + 1] = (fireColor.base[1] + (fireColor.tip[1] - fireColor.base[1]) * colorMix) * combinedFactor;
            colors[i3 + 2] = (fireColor.base[2] + (fireColor.tip[2] - fireColor.base[2]) * colorMix) * combinedFactor;

            // Size changes based on height and lifetime
            sizes[i] = particles.sizes[i] * combinedFactor * (0.5 + Math.random() * 0.5);
        }

        positionAttribute.needsUpdate = true;
        colorAttribute.needsUpdate = true;
        sizeAttribute.needsUpdate = true;

        // Add subtle rotation and swaying
        fireGroupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.05;
        fireGroupRef.current.rotation.x = Math.sin(timeRef.current * 0.4) * 0.02;
    });

    if (intensity <= 0) return null;

    return (
        <group ref={fireGroupRef} position={position}>
            {/* Fire Particles */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particles.positions, 3]}
                        count={particles.count}
                        array={particles.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[particles.colors, 3]}
                        count={particles.count}
                        array={particles.colors}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        args={[particles.sizes, 1]}
                        count={particles.count}
                        array={particles.sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Core flame body - more realistic shape */}
            <mesh position={[0, 0.8, 0]}>
                <coneGeometry args={[0.3, 1.6, 8, 1, true]} />
                <meshBasicMaterial
                    color={new THREE.Color(...fireColor.tip)}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Inner flame core */}
            <mesh position={[0, 0.6, 0]}>
                <coneGeometry args={[0.2, 1.2, 8, 1, true]} />
                <meshBasicMaterial
                    color={new THREE.Color(...fireColor.base)}
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Base glow effect */}
            <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial
                    color={new THREE.Color(...fireColor.base)}
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Heat distortion effect */}
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshBasicMaterial
                    color="#ff6600"
                    transparent
                    opacity={0.05}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Point lights for realistic illumination */}
            <pointLight
                position={[0, 0.5, 0]}
                color={new THREE.Color(...fireColor.tip)}
                intensity={intensity * 2}
                distance={4}
            />
            <pointLight
                position={[0, 1.2, 0]}
                color={new THREE.Color(...fireColor.base)}
                intensity={intensity * 1.5}
                distance={3}
            />
        </group>
    );
};
