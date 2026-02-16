import { nanoid } from "nanoid";

export type World = {
  id: string;
  name?: string;
  createdAt: number;
  key: string; // ключ мира
};

export type Link = {
  a: string;
  b: string;
  createdAt: number;
};

export type Invite = {
  code: string;
  inviterWorldId: string;
  createdAt: number;
  usedAt?: number;
  usedByWorldId?: string;
};

class MemoryStore {
  worlds = new Map<string, World>();
  links: Link[] = [];
  invites = new Map<string, Invite>();

  canCreateWithoutInvite() {
    return this.worlds.size === 0;
  }

  createWorld(name = "Мой мир") {
    const id = crypto.randomUUID();
    const key = nanoid(24);

    const world: World = {
      id,
      name,
      createdAt: Date.now(),
      key,
    };

    this.worlds.set(id, world);
    return world;
  }

  createInvite(inviterWorldId: string) {
    const code = nanoid(10);
    const inv: Invite = { code, inviterWorldId, createdAt: Date.now() };
    this.invites.set(code, inv);
    return inv;
  }

  useInvite(code: string, newWorldId: string) {
    const inv = this.invites.get(code);
    if (!inv) return { ok: false as const, reason: "invite_not_found" };
    if (inv.usedAt) return { ok: false as const, reason: "invite_used" };

    inv.usedAt = Date.now();
    inv.usedByWorldId = newWorldId;
    this.invites.set(code, inv);

    this.links.push({ a: inv.inviterWorldId, b: newWorldId, createdAt: Date.now() });

    return { ok: true as const, invite: inv };
  }
}

export const store = new MemoryStore();
