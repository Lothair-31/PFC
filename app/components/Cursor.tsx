"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let fx = 0, fy = 0;
    let cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = cx + "px";
        cursorRef.current.style.top = cy + "px";
      }
    };

    const animate = () => {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = fx + "px";
        followerRef.current.style.top = fy + "px";
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
