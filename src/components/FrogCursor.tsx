"use client";

import { useEffect, useState, useRef } from "react";

export default function FrogCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hopping, setHopping] = useState(false);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleClick = () => {
      setHopping(true);
      setTimeout(() => setHopping(false), 400);
    };

    // Smooth follow animation
    const animate = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * 0.12;
      currentRef.current.y += dy * 0.12;
      setPos({ x: currentRef.current.x, y: currentRef.current.y });
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 select-none"
      style={{
        left: pos.x - 12,
        top: pos.y - 12,
        fontSize: "24px",
        transition: "none",
        transform: hopping ? "translateY(-8px) scale(1.3)" : "translateY(0) scale(1)",
        transitionProperty: "transform",
        transitionDuration: "0.2s",
      }}
      aria-hidden
    >
      🐸
    </div>
  );
}
