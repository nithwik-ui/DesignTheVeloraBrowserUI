import React from "react";
import { Glasses } from "lucide-react";
import { BrowserProfile } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface ProfileAvatarProps {
  profile: BrowserProfile;
  size?: number;
  incognito?: boolean;
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  size = 24,
  incognito = false,
  className = "",
}) => {
  if (incognito) {
    return (
      <span
        className={`rounded-full inline-flex items-center justify-center shrink-0 select-none bg-[#27272A] text-[#F4F4F5] border border-[#3F3F46] ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title="Incognito Profile"
      >
        <Glasses style={{ width: `${Math.round(size * 0.58)}px`, height: `${Math.round(size * 0.58)}px` }} />
      </span>
    );
  }

  if (profile.avatarType === "starry-tower") {
    return (
      <span
        className={`rounded-full overflow-hidden inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="32" fill="#172B85" />
          {/* Soft night clouds */}
          <ellipse cx="18" cy="27" rx="7" ry="4" fill="#4659B4" opacity="0.7" />
          <ellipse cx="47" cy="34" rx="8.5" ry="4.5" fill="#4659B4" opacity="0.65" />
          <ellipse cx="22" cy="43" rx="7.5" ry="3.8" fill="#3B4DA3" opacity="0.65" />
          {/* Crescent Moon */}
          <path
            d="M43.5 15.5C45.8 17.2 46.6 20.5 45 23.2C43.4 25.9 40.1 26.9 37.5 25.6C40.3 25.4 42.6 23.3 43.1 20.5C43.5 18.5 43.6 16.9 43.5 15.5Z"
            fill="#F8FAFC"
          />
          {/* Illuminated Golden Spire / Eiffel Silhouette */}
          <path
            d="M31.5 13L33.5 13L35 34L41 47L45 62H19L23 47L29 34L31.5 13Z"
            fill="#EAB308"
          />
          {/* Shaded Right Half of Spire for 3D depth */}
          <path
            d="M32.5 13H33.5L35 34L41 47L45 62H32.5V13Z"
            fill="#1E1B4B"
            opacity="0.58"
          />
          {/* Structural horizontal decks & arch */}
          <rect x="27" y="34" width="10" height="2.4" rx="1" fill="#FACC15" />
          <rect x="23" y="46" width="18" height="2.8" rx="1" fill="#CA8A04" />
          <path d="M24.5 62C24.5 55.5 28 52.5 32 52.5C36 52.5 39.5 55.5 39.5 62H24.5Z" fill="#0F1D5E" />
        </svg>
      </span>
    );
  }

  if (profile.avatarType === "orbit") {
    return (
      <span
        className={`rounded-full inline-flex items-center justify-center shrink-0 select-none bg-[#0F172A] p-0.5 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <OrbitLogo size={Math.max(14, size - 3)} />
      </span>
    );
  }

  return (
    <span
      className={`rounded-full inline-flex items-center justify-center font-semibold text-white shrink-0 select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: profile.color,
        fontSize: `${Math.max(10, Math.round(size * 0.46))}px`,
      }}
    >
      {profile.initial.toUpperCase()}
    </span>
  );
};
