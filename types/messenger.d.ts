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

type PartKeyInfoEvent = [...ContractEvent, PartKeyInfo];

interface PartKeyInfoI extends EventI {
  who: string;
  address: string;
  vote_k: string;
  sel_k: string;
  vote_fst: number;
  vote_lst: number;
  vote_kd: number;
  sp_key: string;
}

export class Contract extends Base {
  PartKeyInfo(query?: EventQuery): Promise<PartKeyInfoI[]>;
}
