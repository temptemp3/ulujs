type ContractEvent = [
  string, // Transaction ID
  number, // Round
  number // Timestamp
];
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
type ApprovalForAllEvent = [
  ...ContractEvent,
  string, // Owner
  string, // Spender
  boolean // T/F
];
type EventQuery = {
  minRound?: number;
  maxRound?: number;
  address?: string;
  round?: number;
  txid?: string;
};

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

  arc72_tokenURI: (
    tid: number
  ) => Promise<
    { success: true; returnValue: string } | { success: false; error: any }
  >;
  arc72_balanceOf: (
    addr: string
  ) => Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  arc72_getApproved: (
    tid: number
  ) => Promise<
    { success: true; returnValue: string } | { success: false; error: any }
  >;
  arc72_isApprovedForAll: (
    addr: string,
    addr2: string
  ) => Promise<
    { success: true; returnValue: boolean } | { success: false; error: any }
  >;
  arc72_ownerOf: (
    tid: number
  ) => Promise<
    { success: true; returnValue: string } | { success: false; error: any }
  >;
  arc72_tokenByIndex: (
    tid: number
  ) => Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  arc72_totalSupply: () => Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;
  supportsInterface: (
    sel: any
  ) => Promise<
    { success: true; returnValue: boolean } | { success: false; error: any }
  >;
  arc72_transferFrom<T extends boolean>(
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
  arc72_approve<T extends boolean>(
    addr: string,
    tid: number,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;
  arc72_setApprovalForAll<T extends boolean>(
    addr: string,
    approve: boolean,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;
  arc72_Approval: (query: EventQuery) => Promise<ApprovalEvent[]>;
  arc72_ApprovalForAll: (query: EventQuery) => Promise<ApprovalForAllEvent[]>;
  arc72_Transfer: (query: EventQuery) => Promise<TransferEvent[]>;
  getEvents: (query: EventQuery) => Promise<
    [
      {
        name: "arc72_Transfer";
        signature: string;
        selector: string;
        events: TransferEvent[];
      },
      {
        name: "arc72_Approval";
        signature: string;
        selector: string;
        events: ApprovalEvent[];
      },
      {
        name: "arc72_ApprovalForAll";
        signature: string;
        selector: string;
        events: ApprovalForAllEvent[];
      }
    ]
  >;
}
