declare module "arc200js" {
  class Contract {
    constructor(
      contractId: number,
      algodClient: unknown,
      opts?: {
        acc?: { addr: string; sk: Uint8Array };
        simulate?: boolean;
        formatBytes?: boolean;
        waitForConfirmation?: boolean;
      }
    );

    arc200_name(): Promise<{ success: boolean; returnValue: string }>;
    arc200_symbol(): Promise<{ success: boolean; returnValue: string }>;
    arc200_totalSupply(): Promise<{ success: boolean; returnValue: bigint }>;
    arc200_decimals(): Promise<{ success: boolean; returnValue: bigint }>;
    arc200_balanceOf(
      addr: string
    ): Promise<{ success: boolean; returnValue: bigint }>;
    arc200_allowance(
      addrFrom: string,
      addrSpender: string
    ): Promise<{ success: boolean; returnValue: bigint }>;
    arc200_transfer(
      addrTo: string,
      amt: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<{ success: boolean; txId?: string; txns?: string[] }>;
    arc200_transferFrom(
      addrFrom: string,
      addrTo: string,
      amt: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<{ success: boolean; txId?: string; txns?: string[] }>;
    arc200_approve(
      addrSpender: string,
      amt: bigint,
      simulate: boolean,
      waitForConfirmation: boolean
    ): Promise<{ success: boolean; txId?: string; txns?: string[] }>;
    arc200_Transfer(): Promise<any[]>;
    arc200_Approval(): Promise<any[]>;
    getEvents(query: any): Promise<any[]>;
    hasBalance(addr: string): Promise<{ success: boolean }>;
    hasAllowance(
      addrFrom: string,
      addrSpender: string
    ): Promise<{ success: boolean }>;
    getMetadata(): Promise<{
      success: boolean;
      returnValue: {
        name: string;
        symbol: string;
        totalSupply: bigint;
        decimals: bigint;
      };
    }>;
  }

  export function arc200_name(
    contractInstance: Contract
  ): Promise<{ success: boolean; returnValue: string }>;

  export function arc200_symbol(
    contractInstance: Contract
  ): Promise<{ success: boolean; returnValue: string }>;

  export function arc200_totalSupply(
    contractInstance: Contract
  ): Promise<{ success: boolean; returnValue: bigint }>;

  export function arc200_decimals(
    contractInstance: Contract
  ): Promise<{ success: boolean; returnValue: bigint }>;

  export function arc200_balanceOf(
    contractInstance: Contract,
    addr: string
  ): Promise<{ success: boolean; returnValue: bigint }>;

  export function arc200_allowance(
    contractInstance: Contract,
    addrFrom: string,
    addrSpender: string
  ): Promise<{ success: boolean; returnValue: bigint }>;

  export function hasBalance(
    contractInstance: Contract,
    addr: string
  ): Promise<{ success: boolean }>;

  export function hasAllowance(
    contractInstance: Contract,
    addrFrom: string,
    addrSpender: string
  ): Promise<{ success: boolean }>;

  export function safe_arc200_transfer(
    ci: Contract,
    addrTo: string,
    amt: bigint,
    simulate: boolean,
    waitForConfirmation: boolean
  ): Promise<{ success: boolean; txId?: string; txns?: string[] }>;

  export function safe_arc200_transferFrom(
    ci: Contract,
    addrFrom: string,
    addrTo: string,
    amt: bigint,
    simulate: boolean,
    waitForConfirmation: boolean
  ): Promise<{ success: boolean; txId?: string; txns?: string[] }>;

  export function safe_arc200_approve(
    ci: Contract,
    addrSpender: string,
    amt: bigint,
    simulate: boolean,
    waitForConfirmation: boolean
  ): Promise<{ success: boolean; txId?: string; txns?: string[] }>;

  export default Contract;
}
