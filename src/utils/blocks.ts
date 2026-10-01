import { Block } from "../models/block";

export interface BlockTiming {
  /** Mean seconds between consecutive blocks over the sample; undefined with fewer than two blocks. */
  averageSeconds?: number;
  /** Seconds between the two newest blocks. */
  lastDelaySeconds?: number;
  /** How many blocks the average covers. */
  sampleSize: number;
}

const MAX_SAMPLE = 30;

/**
 * Block timing derived from blocks already on the page (newest first), so the
 * overview works on networks whose indexer lacks the metrics endpoint.
 */
export function blockTiming(blocks: Block[]): BlockTiming {
  const sample = blocks.filter((b) => b.dateCrafted instanceof Date && !Number.isNaN(b.dateCrafted.getTime())).slice(0, MAX_SAMPLE);
  if (sample.length < 2) return { sampleSize: sample.length };
  const newest = sample[0].dateCrafted.getTime();
  const oldest = sample[sample.length - 1].dateCrafted.getTime();
  const second = sample[1].dateCrafted.getTime();
  return {
    averageSeconds: Math.max(0, (newest - oldest) / 1000 / (sample.length - 1)),
    lastDelaySeconds: Math.max(0, (newest - second) / 1000),
    sampleSize: sample.length,
  };
}

/**
 * Union of two block lists keyed by height, newest first. A block already held
 * is replaced when the incoming copy carries more transactions, so a copy that
 * arrived short gets corrected by the next fetch instead of sticking.
 */
export function mergeBlocks(existing: Block[], incoming: Block[]): Block[] {
  if (incoming.length === 0) return existing;
  const byHeight = new Map<number, Block>();
  for (const block of existing) byHeight.set(block.height, block);
  let changed = false;
  for (const block of incoming) {
    const held = byHeight.get(block.height);
    if (!held || block.transactions.length > held.transactions.length) {
      byHeight.set(block.height, block);
      changed = true;
    }
  }
  if (!changed) return existing;
  return Array.from(byHeight.values()).sort((a, b) => b.height - a.height);
}
