import * as THREE from "three";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";
import { useTheme } from "../context/ThemeProvider";
import { themeAccentHex } from "../theme/themes";

const techNames = [
  "Java",
  "Spring Boot",
  "Angular",
  "Spring Data JPA",
  "Hibernate",
  "MySQL",
  "AWS",
  "Kafka",
  "Jenkins",
  "JavaScript",
] as const;

export type TechName = (typeof techNames)[number];

const skillDescriptions: Record<TechName, string> = {
  Java:
    "Primary language for enterprise backends: OOP, collections, concurrency, and JVM ecosystem. I use it daily for Spring Boot services, APIs, and business logic.",
  "Spring Boot":
    "Opinionated framework for production microservices—auto-configuration, embedded servers, and clean integration with Spring Data JPA, security, and REST.",
  Angular:
    "Full-featured SPA framework for structured UIs: components, routing, forms, and RxJS. I build responsive employee and ops dashboards with reusable modules.",
  "Spring Data JPA":
    "Simplifies persistence with repositories and entities over Hibernate. I use it for clean data access, queries, and transactional services on MySQL and other SQL stores.",
  Hibernate:
    "ORM layer mapping Java objects to relational schemas. I rely on it for entity relationships, lazy loading, and portable database access behind JPA.",
  MySQL:
    "Relational database for transactional apps. I design schemas, indexes, and queries for employee portals, monitoring data, and reporting workloads.",
  AWS:
    "Cloud platform for hosting, scaling, and supporting delivery. I work with AWS-aligned deployment and infrastructure patterns alongside CI/CD pipelines.",
  Kafka:
    "Distributed event streaming for async, decoupled systems. I use it where reliable messaging and high-throughput pipelines matter between services.",
  Jenkins:
    "Automation server for builds and pipelines. I configure jobs and nodes to run tests, integrate with tools like APTMT, and support Dev/UAT/Prod promotion.",
  JavaScript:
    "Core web scripting alongside Angular: dynamic UI behavior, AJAX calls, and browser APIs. I use it for interactive features and integration with REST backends.",
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function mixWithWhite(hex: string, t: number) {
  const { r, g, b } = hexToRgb(hex);
  const rr = Math.round(r + (255 - r) * t);
  const gg = Math.round(g + (255 - g) * t);
  const bb = Math.round(b + (255 - b) * t);
  return `rgb(${rr},${gg},${bb})`;
}

function mixWithBlack(hex: string, t: number) {
  const { r, g, b } = hexToRgb(hex);
  const rr = Math.round(r * (1 - t));
  const gg = Math.round(g * (1 - t));
  const bb = Math.round(b * (1 - t));
  return `rgb(${rr},${gg},${bb})`;
}

const createLabelTexture = (label: string, accentHex: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const { r, g, b } = hexToRgb(accentHex);
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, mixWithWhite(accentHex, 0.78));
  gradient.addColorStop(0.45, mixWithWhite(accentHex, 0.42));
  gradient.addColorStop(1, mixWithWhite(accentHex, 0.08));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
  ctx.lineWidth = 10;
  ctx.strokeRect(28, 28, 456, 456);

  ctx.fillStyle = mixWithBlack(accentHex, 0.72);
  ctx.font = "bold 52px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const words = label.split(" ");
  if (words.length > 1) {
    ctx.fillText(words.slice(0, -1).join(" "), 256, 215);
    ctx.fillText(words[words.length - 1], 256, 285);
  } else {
    ctx.fillText(label, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map((_, i) => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
  skillIndex: i % techNames.length,
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  skillIndex: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
  onSkillClick: (name: TechName) => void;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  skillIndex,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
  onSkillClick,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const skillName = techNames[skillIndex];

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSkillClick(skillName);
    },
    [onSkillClick, skillName]
  );

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
        onClick={handleClick}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const { theme } = useTheme();
  const accentHex = themeAccentHex[theme];
  const [isActive, setIsActive] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<TechName | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const workEl = document.getElementById("work");
      if (!workEl) return;
      const threshold = workEl.getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    const textures = techNames.map((name) =>
      createLabelTexture(name, accentHex)
    );
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.5,
          metalness: 0.12,
          roughness: 0.55,
          clearcoat: 0.2,
          clearcoatRoughness: 0.35,
        })
    );
  }, [accentHex]);

  const onSkillClick = useCallback((name: TechName) => {
    setSelectedSkill(name);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  useEffect(() => {
    if (!selectedSkill) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedSkill, closeModal]);

  const skillModal =
    selectedSkill &&
    createPortal(
      <div
        className="techstack-skill-modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="techstack-skill-title"
        onClick={closeModal}
      >
        <div
          className="techstack-skill-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="techstack-skill-modal-close"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
          <h3 id="techstack-skill-title">{selectedSkill}</h3>
          <p>{skillDescriptions[selectedSkill]}</p>
        </div>
      </div>,
      document.body
    );

  return (
    <div className="techstack">
      <h2>My Techstack</h2>
      <p className="techstack-hint">Click a skill sphere for details</p>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.65)}
        className="tech-canvas"
      >
        <ambientLight intensity={1.25} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="#f0fdfa"
          intensity={1.2}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2.2} color="#ffffff" />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              scale={props.scale}
              skillIndex={props.skillIndex}
              material={materials[props.skillIndex]}
              isActive={isActive}
              onSkillClick={onSkillClick}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.55}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.05} />
        </EffectComposer>
      </Canvas>

      {skillModal}
    </div>
  );
};

export default TechStack;
