import { Contract as arc200 } from "./arc200";

interface InfoI {
  lptBals: {
    lpHeld: string;
    lpMinted: string;
  };
  poolBals: {
    A: string;
    B: string;
  };
  protoInfo: {
    protoFee: number;
    lpFee: number;
    totFee: number;
    protoAddr: string;
    locked: boolean;
  };
  protoBals: {
    A: string;
    B: string;
  };
  tokB: number;
  tokA: number;
}

interface Asset {
  contractId: number;
  tokenId?: string | null;
  amount?: string;
  symbol?: string;
  decimals?: string;
}

export class Contract extends arc200 {
  Info: () => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  swap: (
    addr: string,
    poolId: number,
    A: Asset,
    B: Asset
  ) => Promise<
    | { success: true; txns: string[]; returnValue: any }
    | { success: false; error: any }
  >;
  rate: (info: InfoI) => number;
}
