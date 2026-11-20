import React from "react";

import { RadarSweep } from "./RadarSweep";
export default function ScanOverlay() {
  return (
    <div
      className="
        fixed inset-0
        bg-black/80
        backdrop-blur-sm
        z-50
        flex items-center justify-center
      "
    >
      <RadarSweep />
    </div>
  );
}
