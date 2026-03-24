/**
 * 3D character next to the “Hello” landing block.
 *
 * **Swap the model**
 * - Put your `.glb` in `public/models/` (e.g. `public/models/my-hero.glb`).
 * - Set `loadMode` to `"plain"` and `plainModelUrl` to that path.
 *
 * **Important:** Scroll animations and idle/typing/hover clips assume the *original*
 * rig: bones like `spine006`, `spine005`, `footL`/`footR`, meshes like `screenlight`,
 * `Plane004`, and clips like `introAnimation`, `typing`, `Blink`, etc. A different
 * model will load, but you may need to update `boneData.ts`, `animationUtils.ts`,
 * `GsapScroll.ts`, and the mesh names below so names match your export.
 */
export const CHARACTER_CONFIG = {
  /** `encrypted` — default bundle. `plain` — load a normal Draco-compressed GLB from `public/`. */
  loadMode: "encrypted" as "encrypted" | "plain",

  encryptedUrl: "/models/character.enc?v=2",
  encryptedPassword: "MyCharacter12",

  /** e.g. `/models/character.glb` — file must live under `public/` */
  plainModelUrl: "/models/character.glb",

  /** Recolor meshes only if present (exact glTF node names) */
  shirtMeshName: "BODY.SHIRT",
  pantMeshName: "Pant",
  shirtColor: "#8B4513",
  pantColor: "#000000",
} as const;
