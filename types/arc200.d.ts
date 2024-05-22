import { ContractEvent, EventQuery } from "./event";

// ARC-200 specific events

type TransferEvent = [
  ...ContractEvent,
  string, // From
  string, // To
  bigint // Amount
];
type ApprovalEvent = [
  ...ContractEvent,
  string, // Owner
  string, // Spender
  bigint // Amount
];

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

  arc200_name(): Promise<
    { success: true; returnValue: string } | { success: false; error: any }
  >;
  arc200_symbol(): Promise<
    { success: true; returnValue: string } | { success: false; error: any }
  >;
  arc200_totalSupply(): Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  arc200_decimals(): Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  arc200_balanceOf(
    addr: string
  ): Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  arc200_allowance(
    addrFrom: string,
    addrSpender: string
  ): Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  arc200_transfer<T extends boolean>(
    addrTo: string,
    amt: bigint,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;
  arc200_transferFrom<T extends boolean>(
    addrFrom: string,
    addrTo: string,
    amt: bigint,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;
  arc200_approve<T extends boolean>(
    addrSpender: string,
    amt: bigint,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;
  arc200_Transfer(query?: EventQuery): Promise<TransferEvent[]>;
  arc200_Approval(query?: EventQuery): Promise<ApprovalEvent[]>;
  getEvents(query: EventQuery): Promise<
    [
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
      }
    ]
  >;
  hasBalance(
    addr: string
  ): Promise<
    { success: true; returnValue: 0 | 1 } | { success: false; error: any }
  >;
  hasAllowance(
    addrFrom: string,
    addrSpender: string
  ): Promise<
    { success: true; returnValue: 0 | 1 } | { success: false; error: any }
  >;
  getMetadata(): Promise<
    | {
        success: true;
        returnValue: {
          name: string;
          symbol: string;
          totalSupply: bigint;
          decimals: bigint;
        };
      }
    | {
        success: false;
        error: any;
      }
  >;
}

export function arc200_name(
  contractInstance: Contract
): Promise<
  { success: true; returnValue: string } | { success: false; error: any }
>;

export function arc200_symbol(
  contractInstance: Contract
): Promise<
  { success: true; returnValue: string } | { success: false; error: any }
>;

export function arc200_totalSupply(
  contractInstance: Contract
): Promise<
  { success: true; returnValue: bigint } | { success: false; error: any }
>;

export function arc200_decimals(
  contractInstance: Contract
): Promise<
  { success: true; returnValue: bigint } | { success: false; error: any }
>;

export function arc200_balanceOf(
  contractInstance: Contract,
  addr: string
): Promise<
  { success: true; returnValue: bigint } | { success: false; error: any }
>;

export function arc200_allowance(
  contractInstance: Contract,
  addrFrom: string,
  addrSpender: string
): Promise<
  { success: true; returnValue: bigint } | { success: false; error: any }
>;

export function hasBalance(
  contractInstance: Contract,
  addr: string
): Promise<
  { success: true; returnValue: 0 | 1 } | { success: false; error: any }
>;

export function hasAllowance(
  contractInstance: Contract,
  addrFrom: string,
  addrSpender: string
): Promise<
  { success: true; returnValue: 0 | 1 } | { success: false; error: any }
>;

export function safe_arc200_transfer<T extends boolean>(
  ci: Contract,
  addrTo: string,
  amt: bigint,
  simulate: T,
  waitForConfirmation: boolean
): Promise<
  | (T extends true
      ? { success: true; txns: string[] }
      : { success: true; txId: string })
  | { success: false; error: any }
>;

export function safe_arc200_transferFrom<T extends boolean>(
  ci: Contract,
  addrFrom: string,
  addrTo: string,
  amt: bigint,
  simulate: T,
  waitForConfirmation: boolean
): Promise<
  | (T extends true
      ? { success: true; txns: string[] }
      : { success: true; txId: string })
  | { success: false; error: any }
>;

export function safe_arc200_approve<T extends boolean>(
  ci: Contract,
  addrSpender: string,
  amt: bigint,
  simulate: T,
  waitForConfirmation: boolean
): Promise<
  | (T extends true
      ? { success: true; txns: string[] }
      : { success: true; txId: string })
  | { success: false; error: any }
>;
