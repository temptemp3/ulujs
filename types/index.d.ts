declare module "arc72js" {
  type ContractEvent = [
    string, // Transaction ID
    number, // Round
    number // Timestamp
  ];
  type ApprovalEvent = [
    ...ContractEvent,
    string, // Owner
    string, // Approved
    bigint // TokenId
  ];
  type ApprovalForAllEvent = [
    ...ContractEvent,
    string, // Owner
    string, // Controller
    boolean // Approved
  ];
  type TransferEvent = [
    ...ContractEvent,
    string, // From
    string, // To
    bigint // TokenId
  ];
  class Contract {
    constructor(
      contractId: number,
      algodClient: algosdk.Algodv2,
      indexerClient: algosdk.Indexer,
      opts?: {
        acc?: { addr: string; sk: Uint8Array };
        simulate?: boolean;
        formatBytes?: boolean;
        waitForConfirmation?: boolean;
      }
    );
    arc72_balanceOf(
      addr: string
    ): Promise<
      { success: true; returnValue: bigint } | { success: false; error: any }
    >;
    arc72_getApproved(
      tokenId: bigint
    ): Promise<
      { success: true; returnValue: string } | { success: false; error: any }
    >;
    arc72_isApprovedForAll(
      addrOwner: string,
      addrOperator: string
    ): Promise<
      { success: true; returnValue: boolean } | { success: false; error: any }
    >;
    arc72_ownerOf(
      tokenId: bigint
    ): Promise<
      { success: true; returnValue: string } | { success: false; error: any }
    >;
    arc72_tokenByIndex(
      index: bigint
    ): Promise<
      { success: true; returnValue: bigint } | { success: false; error: any }
    >;
    arcc72_totalSupply(): Promise<
      { success: true; returnValue: bigint } | { success: false; error: any }
    >;
    arc72_tokenURI(
      tokenId: bigint
    ): Promise<
      { success: true; returnValue: string } | { success: false; error: any }
    >;
    supportsInterface(
      interfaceId: string
    ): Promise<
      { success: true; returnValue: boolean } | { success: false; error: any }
    >;
    arc72_approve<T extends boolean>(
      addrSpender: string,
      tokenId: bigint,
      simulate: T,
      waitForConfirmation: boolean
    ): Promise<
      | (T extends true
          ? { success: true; txns: string[] }
          : { success: true; txId: string })
      | { success: false; error: any }
    >;
    arc72_setApprovalForAll<T extends boolean>(
      addrOperator: string,
      approved: boolean,
      simulate: T,
      waitForConfirmation: boolean
    ): Promise<
      | (T extends true
          ? { success: true; txns: string[] }
          : { success: true; txId: string })
      | { success: false; error: any }
    >;
    arc72_transferFrom<T extends boolean>(
      addrFrom: string,
      addrTo: string,
      tokenId: bigint,
      simulate: T,
      waitForConfirmation: boolean
    ): Promise<
      | (T extends true
          ? { success: true; txns: string[] }
          : { success: true; txId: string })
      | { success: false; error: any }
    >;
    arc72_Approval(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<ApprovalEvent[]>;
    arc72_ApprovalForAll(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<ApprovalForAllEvent[]>;
    arc72_Transfer(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<TransferEvent[]>;
    getEvents(query: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<
      [
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
        },
        {
          name: "arc72_Transfer";
          signature: string;
          selector: string;
          events: TransferEvent[];
        }
      ]
    >;
  }
  export default Contract;
}
