import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { CHARACTER_CONFIG } from "../characterConfig";

function applyOptionalMeshColors(root: THREE.Object3D) {
  const shirt = CHARACTER_CONFIG.shirtMeshName;
  const pant = CHARACTER_CONFIG.pantMeshName;
  root.traverse((child: THREE.Object3D) => {
    if (!child.isMesh) return;
    const mesh = child as THREE.Mesh;
    if (!mesh.material) return;
    if (mesh.name === shirt) {
      const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
      newMat.color = new THREE.Color(CHARACTER_CONFIG.shirtColor);
      mesh.material = newMat;
    } else if (mesh.name === pant) {
      const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
      newMat.color = new THREE.Color(CHARACTER_CONFIG.pantColor);
      mesh.material = newMat;
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = true;
  });
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const finishLoad = async (gltf: GLTF) => {
    const character = gltf.scene;
    await renderer.compileAsync(character, camera, scene);
    applyOptionalMeshColors(character);
    setCharTimeline(character, camera);
    setAllTimeline();
    const footR = character.getObjectByName("footR");
    const footL = character.getObjectByName("footL");
    if (footR) footR.position.y = 3.36;
    if (footL) footL.position.y = 3.36;
    dracoLoader.dispose();
    return gltf;
  };

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        if (CHARACTER_CONFIG.loadMode === "plain") {
          loader.load(
            CHARACTER_CONFIG.plainModelUrl,
            async (gltf) => {
              try {
                resolve(await finishLoad(gltf));
              } catch (e) {
                reject(e);
              }
            },
            undefined,
            (error) => {
              console.error("Error loading plain GLTF:", error);
              reject(error);
            }
          );
          return;
        }

        const encryptedBlob = await decryptFile(
          CHARACTER_CONFIG.encryptedUrl,
          CHARACTER_CONFIG.encryptedPassword
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        loader.load(
          blobUrl,
          async (gltf) => {
            try {
              URL.revokeObjectURL(blobUrl);
              resolve(await finishLoad(gltf));
            } catch (e) {
              URL.revokeObjectURL(blobUrl);
              reject(e);
            }
          },
          undefined,
          (error) => {
            URL.revokeObjectURL(blobUrl);
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
