export class CONTRACT {
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
  setExtraTxns(extraTxns: any): void;
  setPaymentAmount(amount: number): void;
  setFee(fee: number): void;
  custom: () => any;
  setTransfers(transfers: any[]): void;
  getEvents(opts: { minRound: number }): any;
  setAccounts: any;
  setEnableGroupResourceSharing: any;
  setBeaconId: any;
  setBeaconSelector: any;
  setOptins: any;
  // ARC72
  arc72_approve: any;
  // mp205
  v_sale_listingByIndex: any;
  a_sale_listNet: any;
  a_sale_buyNet: any;
  a_sale_listSC: any;
  a_sale_buySC: any;
  a_sale_claimSC: any;
  a_sale_deleteListing: any;
  manager: any;
  // arc200
  arc200_approve: any;
  arc200_transfer: any;
  arc200_balanceof: any;
  hasBalance: any;
  // swap
  Trader_swapAForB: any;
  Trader_swapBForA: any;
  Provider_withdrawA: any;
  Provider_withdrawB: any;
  reserve: any;
  // tri
  Register: any;
}
