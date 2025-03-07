import { Contract as arc200 } from "./arc200";

export interface TokenType {
  contractId: number;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  creator: string;
  mintRound: number;
  globalState: Record<string, unknown>;
  tokenId: string | null;
  price?: string | null;
}

type EventQuery = {
  minRound?: number;
  maxRound?: number;
  address?: string;
  round?: number;
  txid?: string;
};

export interface NFTIndexerTokenI {
  owner: string;
  approved: string;
  contractId: number;
  tokenId: number;
  metadataURI: string;
  metadata: string;
  ["mint-round"]: number;
}

export interface NFTIndexerListingI {
  transactionId: string;
  mpContractId: number;
  mpListingId: number;
  tokenId: number;
  seller: string;
  price: number;
  currency: number;
  createRound: number;
  createTimestamp: number;
  endTimestamp: number | null;
  royalty: number | null;
  collectionId: number;
  token: TokenType;
  delete?: any;
  sale?: any;
}

interface BaseOptionsI {
  paymentTokenId: number;
  wrappedNetworkTokenId: number;
  extraTxns: any[];
  algodClient: any;
  indexerClient: any;
  manager?: string;
  skipEnsure?: boolean;
  ensureOnly?: boolean;
  strategy?: "merge" | "default";
}

interface BuyOptionsI extends BaseOptionsI {}

interface ListOptionsI extends BaseOptionsI {
  mpContractId: number;
  endTime?: number;
  enforceRoyalties?: boolean;
  listingBoxPaymentOverride?: number;
  listingsToDelete?: NFTIndexerListingI[];
  degenMode?: boolean;
}

interface EnsureOptionsI extends ListOptionsI {}

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
  manager: () => Promise<any>;
  deleteListing: (listId: any) => Promise<any>;
  DeleteListingEvent: (query: EventQuery) => Promise<any>;
  BuyEvent: (query: EventQuery) => Promise<any>;
  ListEvent: (query: EventQuery) => Promise<any>;
  getEvents: (query: EventQuery) => Promise<any>;
  static buy: (
    addr: string,
    listing: any,
    currency: any,
    opts: BuyOptionsI
  ) => Promise<any>;
  static list: (
    addr: string,
    token: NFTIndexerTokenI,
    price: string,
    currency: any,
    opts: ListOptionsI
  ) => Promise<any>;
}
