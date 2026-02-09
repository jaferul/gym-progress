export type AvatarOption = {
  id: string;
  name: string;
  src: string;
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "flame", name: "Flame", src: "/avatars/flame.svg" },
  { id: "bolt", name: "Bolt", src: "/avatars/bolt.svg" },
  { id: "summit", name: "Summit", src: "/avatars/summit.svg" },
  { id: "wave", name: "Wave", src: "/avatars/wave.svg" },
  { id: "nova", name: "Nova", src: "/avatars/nova.svg" },
  { id: "iron", name: "Iron", src: "/avatars/iron.svg" },
];

export function getAvatarById(id: string): AvatarOption | null {
  return AVATAR_OPTIONS.find((a) => a.id === id) || null;
}
