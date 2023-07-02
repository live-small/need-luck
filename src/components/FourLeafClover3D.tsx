import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getRefValue } from '../hooks/RefValue';

const FourLeafClover3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    const init = () => {
      const container = getRefValue(containerRef);

      const scene = new THREE.Scene();

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff);
      renderer.setSize(container.clientWidth, container.clientHeight);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      // Create clover geometry
      const geometry = new THREE.BufferGeometry();

      // Define the shape of a four-leaf clover
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.5, 0.8, 0.1, 1);
      leafShape.quadraticCurveTo(-0.2, 0.8, 0, 0);
      leafShape.quadraticCurveTo(-0.2, -0.8, 0.1, -1);
      leafShape.quadraticCurveTo(0.5, -0.8, 0, 0);

      // Extrude the leaf shape to create the 3D model
      const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false,
      };
      const extrudeGeometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);

      // Create clover material
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      // Create clover mesh
      const clover = new THREE.Mesh(extrudeGeometry, material); // 여기 바뀜: extrudeGeometry를 사용
      scene.add(clover);

      // Add rotated copies of the leaf mesh to create a four-leaf clover
      const rotationAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
      rotationAngles.forEach((angle) => {
        const rotatedClover = clover.clone();
        rotatedClover.rotation.z = angle;
        scene.add(rotatedClover);
      });

      // Render loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        clover.rotation.x += 0.01;
        clover.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      // Start the animation loop
      animate();
    };

    init();

    return () => {
      // Clean up resources when the component unmounts
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        getRefValue(containerRef).removeChild(rendererRef.current.domElement); // 여기 바뀜: rendererRef.current 사용
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ height: '100vh' }} />;
};

export default FourLeafClover3D;
