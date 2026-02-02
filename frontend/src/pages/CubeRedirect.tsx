import { useEffect } from "react";

export default function CubeRedirect() {
  useEffect(() => {
    window.location.replace("/3DCube.html");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white grid place-items-center">
      <div className="text-white/70">Opening 3D Cube…</div>
    </div>
  );
}