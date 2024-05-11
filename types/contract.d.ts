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
  getContractId: () => number;
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
  setOnComplete: any;
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
  arc200_balanceOf: any;
  arc200_allowance: any;
  hasBalance: any;
  hasAllowance: any;
  hasBox: any;
  // nt200
  createBalanceBox: any;
  createAllowanceBox: any;
  deposit: any;
  withdraw: any;
  // swap
  Trader_swapAForB: any;
  Trader_swapBForA: any;
  Provider_withdrawA: any;
  Provider_withdrawB: any;
  Provider_withdraw: any;
  Provider_depositA: any;
  Provider_depositB: any;
  Provider_deposit: any;
  reserve: any;
  SwapEvent: any;
  // tri
  Register: any;
  // stakr
  Pool: any;
  Stake: any;
  staked: any;
  Info: any;
  rewardsAvailable: any;
  rewardsAvailableAt: any;
  Staker_stake: any;
  Staker_harvest: any;
  Staker_withdraw: any;
  Funder_deployPool: any;
  // reach
  _reachp_0: any;
  // scs
  setup: any;
  configure: any;
  fill: any;
  participate: any;
  close: any;
  // channels
  ChannelCreate: any;
  a_channeler_useChannel: any;
}

