import { Contract as arc200 } from "./arc200";

export class Contract extends arc200 {
  Info(): Promise<any>;
  Protocol_delete(): Promise<any>;
  Protocol_harvest(arg0: string, arg1: any): Promise<any>;
  Provider_deposit(arg0: any): Promise<any>;
  Provider_withdraw(arg0: any): Promise<any>;
  Trader_swapAForB(arg0: any, arg1: any): Promise<any>;
  Trader_swapBForA(arg0: any, arg1: any): Promise<any>;
  Umvir_propose(arg0: any, arg1: any): Promise<any>;
  Umvir_support(arg0: any, arg1: any): Promise<any>;
  _reachp_0(arg0: any, arg1: any, arg2: any): Promise<any>;
  _reachp_2(arg0: any, arg1: any): Promise<any>;
  register(arg0: any, arg1: any, arg2: any): Promise<any>;
}
