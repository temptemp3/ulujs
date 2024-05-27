import { ContractEvent, EventI } from "./event";
import { ApprovalEvent, TransferEvent, Contract as arc200 } from "./arc200";

type PoolSelectionMethod = "rate" | "k" | "round";

interface BalsI {
  A: string;
  B: string;
}

type ProtoInfo = [bigint, bigint, bigint, string, boolean];

type HarvestEvent = [...ContractEvent, ProtoInfo];

interface HarvestI extends EventI {
  protoFee: number;
  lpFee: number;
  totFee: number;
  protoAddr: string;
  locked: boolean;
}

type WithdrawEvent = [
  ...ContractEvent,
  string, // who
  bigint, // lpIn
  [bigint, bigint], // outBals
  [bigint, bigint] // poolBals
];

interface WithdrawI extends EventI {
  who: string;
  lpIn: string;
  outBals: BalsI;
  poolBals: BalsI;
}

type DepositEvent = [
  ...ContractEvent,
  string, // Who
  [bigint, bigint], // inBals
  bigint, // lpOut
  [bigint, bigint] // poolBals
];

interface DepositI extends EventI {
  who: string;
  inBals: BalsI;
  lpOut: string;
  poolBals: BalsI;
}

type SwapEvent = [
  ...ContractEvent,
  string, // Who
  [bigint, bigint], // inBals
  [bigint, bigint], // outBals
  [bigint, bigint] // poolBals
];

interface SwapI extends EventI {
  who: string;
  inBals: BalsI;
  outBals: BalsI;
  poolBals: BalsI;
}

interface InfoI {
  lptBals: {
    lpHeld: string;
    lpMinted: string;
  };
  poolBals: {
    A: string;
    B: string;
  };
  protoInfo: {
    protoFee: number;
    lpFee: number;
    totFee: number;
    protoAddr: string;
    locked: boolean;
  };
  protoBals: {
    A: string;
    B: string;
  };
  tokB: number;
  tokA: number;
}

interface Asset {
  contractId: number;
  tokenId?: string | null;
  amount?: string;
  symbol?: string;
  decimals?: number;
}

export class Contract extends arc200 {
  Info: () => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  swap: (
    addr: string,
    poolId: number,
    A: Asset,
    B: Asset
  ) => Promise<
    | { success: true; txns: string[]; returnValue: any }
    | { success: false; error: any }
  >;
  deposit: (
    addr: string,
    poolId: number,
    A: Asset,
    B: Asset
  ) => Promise<
    | { success: true; txns: string[]; returnValue: any }
    | { success: false; error: any }
  >;
  static rate: (info: InfoI, A: any, B: any) => number;
  static decodeWithdrawEvent: (event: WithdrawEvent) => WithdrawI;
  static decodeDepositEvent: (event: DepositEvent) => DepositI;
  static decodeSwapEvent: (event: SwapEvent) => SwapI;
  static decodeHarvestEvent: (event: HarvestEvent) => HarvestI;
  selectPool: (
    pools: any[],
    A: any,
    B: any,
    method?: PoolSelectionMethod
  ) => any;
  WithdrawEvents(query?: EventQuery): Promise<WithdrawEvent[]>;
  DepositEvents(query?: EventQuery): Promise<DepositEvent[]>;
  SwapEvents(query?: EventQuery): Promise<SwapEvent[]>;
  HarvestEvents(query?: EventQuery): Promise<HarvestEvent[]>;
  getEvents(query: EventQuery): Promise<
    [
      // arc200 events
      {
        name: "arc200_Transfer";
        signature: string;
        selector: string;
        events: TransferEvent[];
      },
      {
        name: "arc200_Approval";
        signature: string;
        selector: string;
        events: ApprovalEvent[];
      },
      // swap events
      {
        name: "Withdraw";
        signature: string;
        selector: string;
        events: WithdrawEvent[];
      },
      {
        name: "Deposit";
        signature: string;
        selector: string;
        events: DepositEvent[];
      },
      {
        name: "Swap";
        signature: string;
        selector: string;
        events: SwapEvent[];
      },
      {
        name: "Harvest";
        signature: string;
        selector: string;
        events: HarvestEvent[];
      }
    ]
  >;
}
