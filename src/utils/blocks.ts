import { Block } from "../models/block";

/** Union of two block lists keyed by height, newest first. */
export function mergeBlocks(existing: Block[], incoming: Block[]): Block[] {
  if (incoming.length === 0) return existing;
  const byHeight = new Map<number, Block>();
  for (const block of existing) byHeight.set(block.height, block);
  let changed = false;
  for (const block of incoming) {
    if (!byHeight.has(block.height)) {
      byHeight.set(block.height, block);
      changed = true;
    }
  }
  if (!changed) return existing;
  return Array.from(byHeight.values()).sort((a, b) => b.height - a.height);
}
