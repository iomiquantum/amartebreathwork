import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

export function Aurora() {
  const reduced = usePrefersReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Blob 1 — emerald top-left */}
      <motion.div
        animate={
          reduced
            ? {}
            : {
                x: [0, 60, -20, 0],
                y: [0, -40, 30, 0],
                scale: [1, 1.15, 0.95, 1],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-[-10%] h-[60vh] w-[60vw] rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,150,0.55) 0%, rgba(0,200,150,0) 70%)",
        }}
      />
      {/* Blob 2 — gold bottom-right */}
      <motion.div
        animate={
          reduced
            ? {}
            : {
                x: [0, -50, 30, 0],
                y: [0, 40, -20, 0],
                scale: [1, 0.9, 1.1, 1],
              }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-16 bottom-[-15%] h-[55vh] w-[55vw] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0) 70%)",
        }}
      />
      {/* Blob 3 — deep emerald center-top */}
      <motion.div
        animate={
          reduced
            ? {}
            : {
                x: [0, -30, 20, 0],
                y: [0, 20, -10, 0],
              }
        }
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/3 top-1/4 h-[40vh] w-[40vw] rounded-full opacity-40 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(15,61,52,0.6) 0%, rgba(15,61,52,0) 70%)",
        }}
      />
    </div>
  );
}
