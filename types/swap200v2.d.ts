import { Contract as arc200 } from "./arc200";

export class Contract extends arc200 {
  reserve: (addr: any) => Promise<any>;
  Info: () => Promise<any>;
  Trader_swapAForB: (
    amount: any,
    ol: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Trader_swapBForA: (
    amount: any,
    ol: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Provider_withdrawA: (
    amount: any,
    simulate: any,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Provider_withdrawB: (
    amount: any,
    simulate: any,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Provider_depositA: (
    amount: any,
    simulate: any,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Provider_depositB: (
    amount: any,
    simulate: any,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Provider_deposit: (
    lp: any,
    ol: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  Provider_withdraw: (
    lp: any,
    outls: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  swap: (
    amount: any,
    ol: any,
    swapAForB: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  withdrawReserve: (
    amount: any,
    isA: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  depositReserve: (
    amount: any,
    isA: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  depositLiquidity: (
    lp: any,
    ol: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  withdrawLiquidity: (
    lp: any,
    outls: any,
    simulate: boolean,
    waitForConfirmation: boolean
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
}
