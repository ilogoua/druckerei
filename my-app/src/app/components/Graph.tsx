"use client";

import React, { useMemo, useState } from "react";

export type WorldNode = {
  id: string;
  label: string;
  createdAt: number;
  x: number; // 0..1
  y: number; // 0..1
};

export type Link = {
  id: string;
  a: string;
  b: string;
  createdAt: number;
};

function fmtAgeDays(createdAt: number) {
  const days = Math.max(0, Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24)));
  return `${days} дн.`;
}

export function Graph({
  nodes,
  links,
  myWorldId,
  onSelectWorld,
}: {
  nodes: WorldNode[];
  links: Link[];
  myWorldId: string | null;
  onSelectWorld: (id: string) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hoverReadyId, setHoverReadyId] = useState<string | null>(null);
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);

  const toPx = (v: number) => Math.round(v * 1000);

  const nodeById = useMemo(() => {
    const m = new Map<string, WorldNode>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  const hovered = hoverId ? nodeById.get(hoverId) : null;

  return (
    <div className="relative w-full h-full bg-[#fbfbfc] overflow-hidden">
      <svg viewBox="0 0 1000 1000" className="w-full h-full">
        {/* links */}
        {links.map((l) => {
          const a = nodeById.get(l.a);
          const b = nodeById.get(l.b);
          if (!a || !b) return null;

          const ax = toPx(a.x), ay = toPx(a.y);
          const bx = toPx(b.x), by = toPx(b.y);

          return (
            <g key={l.id}>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
              <circle cx={(ax + bx) / 2} cy={(ay + by) / 2} r={6} fill="rgba(0,0,0,0.08)" />
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map((n) => {
          const cx = toPx(n.x);
          const cy = toPx(n.y);
          const isMe = myWorldId === n.id;
          const isHover = hoverId === n.id;
          const isHoverReady = hoverReadyId === n.id;


          return (
            <g
              key={n.id}
             onMouseEnter={() => {
  setHoverId(n.id);

  // сброс на всякий
  setHoverReadyId(null);

  // ставим задержку перед появлением текста
  const t = window.setTimeout(() => {
    setHoverReadyId(n.id);
  }, 550); // <- пауза перед текстом (можешь менять)
  setHoverTimer(t);
}}

onMouseLeave={() => {
  setHoverId((cur) => (cur === n.id ? null : cur));

  // убираем текст сразу
  setHoverReadyId((cur) => (cur === n.id ? null : cur));

  // отменяем таймер, если ушли раньше
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    setHoverTimer(null);
  }
}}

              onClick={() => onSelectWorld(n.id)}
              style={{ cursor: "pointer" }}
            >
              
{isHover && (
<circle
  cx={cx}
  cy={cy}
  r={78}
  fill="url(#haloWarm)"
  filter="url(#softGlow)"
  style={{
  opacity: isHoverReady ? 1 : 0,
  transform: isHoverReady ? "translateY(0px)" : "translateY(10px)",
  transition: "opacity 600ms ease, transform 600ms ease",
  }}
/>
)}

{/* основной круг */}
<circle
  cx={cx}
  cy={cy}
  r={46}
  fill="white"
  stroke="rgba(0,0,0,0.18)"
  strokeWidth={1.5}
/>

{isMe && (
  <text
    x={cx}
    y={cy + 92}
    textAnchor="middle"
    fontSize="20"
    fill="rgba(0,0,0,0.55)"
    pointerEvents="none"
    style={{
      opacity: isHover ? 1 : 0,
      transform: isHover ? "translateY(0px)" : "translateY(-6px)",
      transition: "opacity 320ms ease, transform 320ms ease",
    }}
  >
    {n.label}
  </text>
)}

            </g>
          );
        })}
        <defs>
          <radialGradient id="haloWarm" cx="50%" cy="50%" r="50%">
  <stop offset="55%" stopColor="rgba(255,255,255,0)" />
  <stop offset="75%" stopColor="rgba(255,200,120,0.10)" />
  <stop offset="100%" stopColor="rgba(255,200,120,0)" />
</radialGradient>
  <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="4" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>
      </svg>
      
 </div>
  );
}
