import { Contract as arc200 } from "./arc200";

export class Contract extends arc200 {
  deposit: (
    amount: bigint
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  withdraw: (
    amount: bigint
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  createBalanceBox: (
    address: string
  ) => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
  register: () => Promise<
    { success: true; returnValue: any } | { success: false; error: any }
  >;
}
