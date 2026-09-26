import { PillTone } from "../components/ui/pill";

/**
 * Color family for a transaction type code (see Transaction.transactionTypeLabel
 * for the mapping of codes to names). Same tone for the same product area so
 * the eye can scan a list: blue = plain VFX moves, orange = anything Bitcoin,
 * gold = NFTs and smart contracts, green = fungible tokens, purple = network
 * and privacy operations.
 */
export function txTypeTone(type: number): PillTone {
  if (type === 0) return "accent";
  if ([1, 7, 8, 9, 22, 23].includes(type)) return "indigo";
  if ([18, 19, 20, 21, 25, 26, 27, 28, 29, 30, 34, 35, 36, 37, 38].includes(type)) return "btc";
  if ([2, 3, 4, 5, 6, 10, 11, 12, 13, 17].includes(type)) return "gold";
  if ([14, 15, 16].includes(type)) return "green";
  if ([31, 32, 33].includes(type)) return "indigo";
  return "neutral";
}
