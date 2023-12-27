declare module "swap200js" {
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
  type HarvestEvent = [
    ...ContractEvent,
    [
      bigint, // protoFee
      bigint, // lpFee
      bigint, // totFee
      string, // protoAddr
      number // locked
    ]
  ];
  type DepositEvent = [
    ...ContractEvent,
    [
      string, // address
      bals, // [inA, inB]
      bigint, //
      bals, //
      bals //
    ]
  ];
  type SwapEvent = [
    ...ContractEvent,
    [
      string, // address (who)
      bals, // [inA, inB]
      bals, // [outA, outB]
      bals // [poolA, poolB]
    ]
  ];
  type WithdrawEvent = [
    ...ContractEvent,
    [
      string, // address
      bals // [outA, outB]
    ]
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
    arc200_Transfer(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<TransferEvent[]>;
    arc200_Approval(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<ApprovalEvent[]>;
    Harvest(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<HarvestEvent[]>;
    Deposit(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<DepositEvent[]>;
    Swap(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<SwapEvent[]>;
    Withdraw(query?: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<WithdrawEvent[]>;
    getEvents(query: {
      minRound?: number;
      maxRound?: number;
      address?: string;
      round?: number;
      txid?: string;
    }): Promise<
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
        },
        {
          name: "Harvest";
          signature: string;
          selector: string;
          events: HarvestEvent[];
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
          name: "Withdraw";
          signature: string;
          selector: string;
          events: WithdrawEvent[];
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
    reserve(
      addr: string
    ): Promise<
      { success: true; returnValue: bigint } | { success: false; error: any }
    >;
    Info(): Promise<
      | {
          success: true;
          returnValue: [
            lptBals: bals, // [lptMinted, lptSupply]
            poolBals: bals, // [A, B]
            protoInfo: [bigint, bigint, bigint, string, number], // [protoId, protoFee, protoLpFee, protoAddr, locked]
            protoBals: bals, // [protoA, protoB]
            tokB: bigint, // tokB
            tokA: bigint // tokA
          ];
        }
      | {
          success: false;
          error: any;
        }
    >;
    Trader_swapAForB(
      amount: bigint,
      ol: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bals; txns: string[] }
      | { success: false; error: any }
    >;
    Trader_swapBForA(
      amount: bigint,
      ol: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bals; txns: string[] }
      | { success: false; error: any }
    >;
    Trader_withdrawA(
      amount: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    Trader_withdrawB(
      amount: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    Trader_depositA(
      amount: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    Trader_depositB(
      amount: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    Trader_depositLiquidity(
      inBals: bals,
      lpl: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    Provider_withdraw(
      lp: bigint,
      outls: bals,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bals; txns: string[] }
      | { success: false; error: any }
    >;
    swap(
      amount: bigint,
      ol: bigint,
      swapAForB: boolean,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bals; txns: string[] }
      | { success: false; error: any }
    >;
    withdrawReserve(
      amount: bigint,
      isA: boolean,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    depositReserve(
      amount: bigint,
      isA: boolean,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    depositLiquidity(
      inBals: bals,
      lpl: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bigint; txns: string[] }
      | { success: false; error: any }
    >;
    withdrawLiquidity(
      lp: bigint,
      outls: bals,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<
      | { success: true; returnValue: bals; txns: string[] }
      | { success: false; error: any }
    >;
  }

  export default Contract;

  // :::'###::::'########:::'######:::'#######::::'#####:::::'#####:::
  // ::'## ##::: ##.... ##:'##... ##:'##.... ##::'##.. ##:::'##.. ##::
  // :'##:. ##:: ##:::: ##: ##:::..::..::::: ##:'##:::: ##:'##:::: ##:
  // '##:::. ##: ########:: ##::::::::'#######:: ##:::: ##: ##:::: ##:
  //  #########: ##.. ##::: ##:::::::'##:::::::: ##:::: ##: ##:::: ##:
  //  ##.... ##: ##::. ##:: ##::: ##: ##::::::::. ##:: ##::. ##:: ##::
  //  ##:::: ##: ##:::. ##:. ######:: #########::. #####::::. #####:::
  // ..:::::..::..:::::..:::......:::.........::::.....::::::.....::::

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

  // :'######::'##:::::'##::::'###::::'########:::'#######::::'#####:::::'#####:::
  // '##... ##: ##:'##: ##:::'## ##::: ##.... ##:'##.... ##::'##.. ##:::'##.. ##::
  //  ##:::..:: ##: ##: ##::'##:. ##:: ##:::: ##:..::::: ##:'##:::: ##:'##:::: ##:
  // . ######:: ##: ##: ##:'##:::. ##: ########:::'#######:: ##:::: ##: ##:::: ##:
  // :..... ##: ##: ##: ##: #########: ##.....:::'##:::::::: ##:::: ##: ##:::: ##:
  // '##::: ##: ##: ##: ##: ##.... ##: ##:::::::: ##::::::::. ##:: ##::. ##:: ##::
  // . ######::. ###. ###:: ##:::: ##: ##:::::::: #########::. #####::::. #####:::
  // :......::::...::...:::..:::::..::..:::::::::.........::::.....::::::.....::::

  type bals = [bigint, bigint];

  export function reserve(
    contractInstance: Contract,
    addr: string
  ): Promise<
    { success: true; returnValue: bigint } | { success: false; error: any }
  >;

  export function Info(contractInstance: Contract): Promise<
    | {
        success: true;
        returnValue: [
          lptBals: bals, // [lptMinted, lptSupply]
          poolBals: bals, // [A, B]
          protoInfo: [bigint, bigint, bigint, string, number], // [protoId, protoFee, protoLpFee, protoAddr, locked]
          protoBals: bals, // [protoA, protoB]
          tokB: bigint, // tokB
          tokA: bigint // tokA
        ];
      }
    | {
        success: false;
        error: any;
      }
  >;

  export function swap<T extends boolean>(
    contractInstance: Contract,
    amount: bigint,
    ol: bigint,
    swapAForB: boolean,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; returnValue: bals; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;

  export function withdrawReserve<T extends boolean>(
    contractInstance: Contract,
    amount: bigint,
    isA: boolean,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; returnValue: bigint; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;

  export function depositReserve<T extends boolean>(
    contractInstance: Contract,
    amount: bigint,
    isA: boolean,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; returnValue: bigint; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;

  export function depositLiquidity<T extends boolean>(
    contractInstance: Contract,
    inBals: bals,
    lpl: bigint,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; returnValue: bigint; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;

  export function withdrawLiquidity<T extends boolean>(
    contractInstance: Contract,
    lp: bigint,
    outsl: bals,
    simulate: T,
    waitForConfirmation: boolean
  ): Promise<
    | (T extends true
        ? { success: true; returnValue: bals; txns: string[] }
        : { success: true; txId: string })
    | { success: false; error: any }
  >;
}
