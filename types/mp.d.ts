import { Contract as arc200 } from "./arc200";

type EventQuery = {
    minRound?: number;
    maxRound?: number;
    address?: string;
    round?: number;
    txid?: string;
  };

export class Contract extends arc200 {
  constructor(
    contractId: number,
    algodClient: any,
    indexerClient: any,
    opts?: {
      acc?: { addr: string; sk: Uint8Array };
      simulate?: boolean;
      formatBytes?: boolean;
      waitForConfirmation?: boolean;
      feeBi?: bigint;
    }
  );

  listingByIndex: (
    index: number
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  listNet: (
    collectionId: any,
    tokenId: number,
    listPrice: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  buyNet: (
    listId: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  DeleteNetListingEvent: (query: EventQuery) => Promise<any>;
  BuyEvent: (query: EventQuery) => Promise<any>;
  ListEvent: (query: EventQuery) => Promise<any>;
  getEvents: (query: EventQuery) => Promise<any>;
}
