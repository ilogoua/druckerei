"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { store } from "../lib/store";
import { Graph, type WorldNode, type Link } from "./components/Graph";

export default function Home() {
  const [worldsCount, setWorldsCount] = useState(store.worlds.size);
  const [linksCount] = useState(store.links.length);

  const [myKey, setMyKey] = useState<string | null>(null);
  const [myWorldId, setMyWorldId] = useState<string | null>(null);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);

  // временные данные графа (пока без реальных связей/приглашений)
  const [nodes, setNodes] = useState<WorldNode[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  // при загрузке читаем мой мир из localStorage и рисуем кружок
  useEffect(() => {
    const raw = localStorage.getItem("ilogoua:myWorld");
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as {
        id: string;
        key: string;
        label?: string;
        createdAt?: number;
      };

      setMyWorldId(saved.id);
      setMyKey(saved.key);

      setNodes([
        {
          id: saved.id,
          label: saved.label ?? "Мой мир",
          createdAt: saved.createdAt ?? Date.now(),
          x: 0.5,
          y: 0.5,
        },
      ]);

      setSelectedWorldId(saved.id);
    } catch {
      // если в localStorage мусор — просто игнор
    }
  }, []);

  function createWorld() {
    if (myWorldId) return;

    const world = store.createWorld("Мой мир");
    const createdAt = Date.now();

    setWorldsCount(store.worlds.size);
    setMyWorldId(world.id);
    setMyKey(world.key);

    localStorage.setItem(
      "ilogoua:myWorld",
      JSON.stringify({ id: world.id, key: world.key, label: "Мой мир", createdAt })
    );

    // добавляем свой кружок в граф
    setNodes([
      {
        id: world.id,
        label: "Мой мир",
        createdAt,
        x: 0.5,
        y: 0.5,
      },
    ]);

    setSelectedWorldId(world.id);
  }

return (
  <main className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#fbfbfc]">
    {/* Если мира нет — показываем одну кнопку по центру */}
    {!myWorldId ? (
      <button
        onClick={createWorld}
        className="rounded-full border px-6 py-3 text-sm text-black/80 hover:text-black hover:border-black/40 transition"
      >
        Создать мир
      </button>
    ) : (
      <div className="w-screen h-screen">
        <Graph
          nodes={nodes}
          links={links}
          myWorldId={myWorldId}
          onSelectWorld={(id) => setSelectedWorldId(id)}
        />
      </div>
    )}
  </main>
);

}
