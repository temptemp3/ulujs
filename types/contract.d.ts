export interface GetEventOpts {
  minRound?: number;
  maxRound?: number;
  address?: string;
  round?: number;
  txid?: string;
  sender?: string;
  limit?: number;
}
export class CONTRACT {
  [key: string]: (...args: any[]) => any; // any function
  // specific functions
  constructor(
    contractId: number,
    algodClient: any,
    indexerClient: any,
    spec: any,
    acc: { addr: string; sk: Uint8Array },
    simulate?: boolean,
    waitForConfirmation?: boolean,
    objectOnly?: boolean
  );
  getContractId: () => number;
  setExtraTxns(extraTxns: any): void;
  setPaymentAmount(amount: number): void;
  setFee(fee: number): void;
  custom: () => any;
  setTransfers(transfers: any[]): void;
  getEvents(opts: GetEventOpts): any;
  getEnableParamsLastRoundMod: () => boolean;
  getEnableRawBytes: () => boolean;
  setStep: any;
  setAccounts: any;
  setEnableGroupResourceSharing: any;
  setBeaconId: any;
  setBeaconSelector: any;
  setOptins: any;
  setOnComplete: any;
  setEnableParamsLastRoundMod: any;
  setEnableRawBytes: any;
}
