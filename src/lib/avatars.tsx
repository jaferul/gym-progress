import type { ReactNode } from "react";

export type AvatarOption = {
  id: string;
  name: string;
  icon: ReactNode;
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "flame",
    name: "Flame",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#1C1917" />
        <circle cx="60" cy="60" r="56" fill="url(#flame-bg)" />
        <path
          d="M60 28C60 28 44 48 44 64C44 72.8 48.8 80.4 56 84.4V76C56 68 60 56 60 56C60 56 64 68 64 76V84.4C71.2 80.4 76 72.8 76 64C76 48 60 28 60 28Z"
          fill="url(#flame-fire)"
        />
        <path
          d="M56 84.4C56 84.4 52 78 52 72C52 66 56 60 60 56C64 60 68 66 68 72C68 78 64 84.4 64 84.4"
          fill="#FDE68A"
          opacity="0.9"
        />
        <circle cx="60" cy="70" r="6" fill="#FEF3C7" opacity="0.8" />
        <defs>
          <radialGradient id="flame-bg" cx="0.5" cy="0.6" r="0.5">
            <stop offset="0%" stopColor="#7C2D12" />
            <stop offset="100%" stopColor="#1C1917" />
          </radialGradient>
          <linearGradient id="flame-fire" x1="60" y1="28" x2="60" y2="88">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "bolt",
    name: "Bolt",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#0C0A09" />
        <circle cx="60" cy="60" r="56" fill="url(#bolt-bg)" />
        <path
          d="M68 26L42 66H56L52 94L78 54H64L68 26Z"
          fill="url(#bolt-strike)"
        />
        <path
          d="M65 32L44 64H56L52.5 88L73 56H63L65 32Z"
          fill="#FDE68A"
          opacity="0.6"
        />
        <path
          d="M62 42L50 62H57L54.5 80L68 58H61L62 42Z"
          fill="#FFFBEB"
          opacity="0.4"
        />
        <defs>
          <radialGradient id="bolt-bg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#0C0A09" />
          </radialGradient>
          <linearGradient id="bolt-strike" x1="60" y1="26" x2="60" y2="94">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "summit",
    name: "Summit",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#052E16" />
        <circle cx="60" cy="60" r="56" fill="url(#summit-bg)" />
        <path d="M60 28L84 82H36L60 28Z" fill="url(#summit-mountain)" />
        <path
          d="M60 28L72 52L64 46L60 52L56 46L48 52L60 28Z"
          fill="#E2E8F0"
          opacity="0.9"
        />
        <path d="M42 76L36 82H52L46 74L42 76Z" fill="#166534" opacity="0.6" />
        <path d="M78 76L84 82H68L74 74L78 76Z" fill="#166534" opacity="0.6" />
        <circle cx="78" cy="36" r="8" fill="#FDE68A" opacity="0.3" />
        <circle cx="78" cy="36" r="5" fill="#FEF9C3" opacity="0.5" />
        <defs>
          <radialGradient id="summit-bg" cx="0.5" cy="0.7" r="0.6">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="100%" stopColor="#052E16" />
          </radialGradient>
          <linearGradient id="summit-mountain" x1="60" y1="28" x2="60" y2="82">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="40%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "wave",
    name: "Wave",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#0C1222" />
        <circle cx="60" cy="60" r="56" fill="url(#wave-bg)" />
        <path
          d="M28 58C28 58 36 48 44 48C52 48 52 58 60 58C68 58 68 48 76 48C84 48 92 58 92 58"
          stroke="url(#wave-line1)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M28 70C28 70 36 60 44 60C52 60 52 70 60 70C68 70 68 60 76 60C84 60 92 70 92 70"
          stroke="url(#wave-line2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M28 82C28 82 36 72 44 72C52 72 52 82 60 82C68 82 68 72 76 72C84 72 92 82 92 82"
          stroke="url(#wave-line3)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
        <circle cx="60" cy="38" r="6" fill="#67E8F9" opacity="0.3" />
        <circle cx="60" cy="38" r="3" fill="#CFFAFE" opacity="0.5" />
        <defs>
          <radialGradient id="wave-bg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#164E63" />
            <stop offset="100%" stopColor="#0C1222" />
          </radialGradient>
          <linearGradient id="wave-line1" x1="28" y1="53" x2="92" y2="53">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="wave-line2" x1="28" y1="65" x2="92" y2="65">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="wave-line3" x1="28" y1="77" x2="92" y2="77">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="100%" stopColor="#67E8F9" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "nova",
    name: "Nova",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#1A0A2E" />
        <circle cx="60" cy="60" r="56" fill="url(#nova-bg)" />
        <path
          d="M60 24L66 50L92 50L70 66L78 92L60 76L42 92L50 66L28 50L54 50L60 24Z"
          fill="url(#nova-star)"
        />
        <path
          d="M60 32L64 50L84 50L68 62L74 82L60 72L46 82L52 62L36 50L56 50L60 32Z"
          fill="#FDE68A"
          opacity="0.5"
        />
        <circle cx="60" cy="56" r="8" fill="#FFFBEB" opacity="0.4" />
        <circle cx="60" cy="56" r="4" fill="#FFFFFF" opacity="0.6" />
        <defs>
          <radialGradient id="nova-bg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#3B1D6E" />
            <stop offset="100%" stopColor="#1A0A2E" />
          </radialGradient>
          <linearGradient id="nova-star" x1="60" y1="24" x2="60" y2="92">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="40%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "iron",
    name: "Iron",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#18181B" />
        <circle cx="60" cy="60" r="56" fill="url(#iron-bg)" />
        <rect
          x="32"
          y="56"
          width="56"
          height="8"
          rx="4"
          fill="url(#iron-bar)"
        />
        <circle
          cx="30"
          cy="60"
          r="14"
          fill="url(#iron-plate-l)"
          stroke="#52525B"
          strokeWidth="2"
        />
        <circle cx="30" cy="60" r="8" fill="#27272A" />
        <circle cx="30" cy="60" r="3" fill="#3F3F46" />
        <circle
          cx="90"
          cy="60"
          r="14"
          fill="url(#iron-plate-r)"
          stroke="#52525B"
          strokeWidth="2"
        />
        <circle cx="90" cy="60" r="8" fill="#27272A" />
        <circle cx="90" cy="60" r="3" fill="#3F3F46" />
        <path
          d="M52 46L60 36L68 46"
          stroke="#F43F5E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 42L60 34L65 42"
          stroke="#FB7185"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <defs>
          <radialGradient id="iron-bg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#18181B" />
          </radialGradient>
          <linearGradient id="iron-bar" x1="32" y1="60" x2="88" y2="60">
            <stop offset="0%" stopColor="#71717A" />
            <stop offset="50%" stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#71717A" />
          </linearGradient>
          <linearGradient id="iron-plate-l" x1="16" y1="46" x2="44" y2="74">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
          <linearGradient id="iron-plate-r" x1="76" y1="46" x2="104" y2="74">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

export function getAvatarById(id: string): AvatarOption | null {
  return AVATAR_OPTIONS.find((a) => a.id === id) || null;
}
