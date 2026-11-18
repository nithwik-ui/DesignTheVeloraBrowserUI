import React from "react";
import orbitIconUrl from "../assets/velora-orbit.png";

export const ORBIT_ICON_URL = orbitIconUrl;

interface OrbitLogoProps {
  size?: number;
  dimmed?: boolean;
  className?: string;
  alt?: string;
}

export const OrbitLogo: React.FC<OrbitLogoProps> = ({
  size = 20,
  dimmed = false,
  className = "",
  alt = "Velora Orbit",
}) => {
  return (
    <img
      src={ORBIT_ICON_URL}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`object-contain select-none shrink-0 ${
        dimmed ? "opacity-50 grayscale-[35%]" : ""
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};
