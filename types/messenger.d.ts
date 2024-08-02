import { ContractEvent, EventI } from "./event";
import { Contract as Base } from "./contract";

type PartKeyInfo = [
  string,
  string,
  string,
  string,
  BigInt,
  BigInt,
  BitInt,
  string
];

export type PartKeyInfoEvent = [...ContractEvent, PartKeyInfo];

export interface PartKeyInfoI extends EventI {
  txId: string;
  round: number;
  ts: number;
  who: string;
  address: string;
  vote_k: string;
  sel_k: string;
  vote_fst: number;
  vote_lst: number;
  vote_kd: number;
  sp_key: string;
}

export class Contract {
  constructor(
    contractId: number,
    algodClient: any,
    indexerClient: any,
    opts?: {
      acc?: { addr: string; sk: Uint8Array };
      simulate?: boolean;
      formatBytes?: boolean;
      waitForConfirmation?: boolean;
    }
  );
  PartKeyInfo(query?: EventQuery): Promise<PartKeyInfoI[]>;
}
