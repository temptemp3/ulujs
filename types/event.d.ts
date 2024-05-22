export type ContractEvent = [
  string, // Transaction ID
  number, // Round
  number // Timestamp
];

export interface EventI {
  txId: string;
  round: number;
  timestamp: number;
}

export type EventQuery = {
  minRound?: number;
  maxRound?: number;
  address?: string;
  sender?: string;
  round?: number;
  txid?: string;
};