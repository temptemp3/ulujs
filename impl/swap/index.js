import CONTRACT, { oneAddress, prepareString } from "arccjs";
import ARC200Contract from "../arc200/index.js";
import {
  arc200_name,
  arc200_symbol,
  arc200_totalSupply,
  arc200_decimals,
  arc200_balanceOf,
  arc200_allowance,
  hasBalance,
  hasAllowance,
  safe_arc200_transfer,
  safe_arc200_transferFrom,
  safe_arc200_approve,
} from "../../utils/arc200.js";
import { Info, rate, selectPool, swap } from "../../utils/swap.js";
import { combineABI } from "../../utils/abi.js";
import arc200Schema from "../../abi/arc200/index.js";
import swap200Extension from "../../abi/swap/index.js";

// :'######::'##:::::'##::::'###::::'########::
// '##... ##: ##:'##: ##:::'## ##::: ##.... ##:
//  ##:::..:: ##: ##: ##::'##:. ##:: ##:::: ##:
// . ######:: ##: ##: ##:'##:::. ##: ########::
// :..... ##: ##: ##: ##: #########: ##.....:::
// '##::: ##: ##: ##: ##: ##.... ##: ##::::::::
// . ######::. ###. ###:: ##:::: ##: ##::::::::
// :......::::...::...:::..:::::..::..:::::::::

/*
 * Contract class
 * - wrapper for CONTRACT class
 */
class Contract extends ARC200Contract {
  constructor(
    contractId,
    algodClient,
    indexerClient,
    opts = {
      acc: { addr: oneAddress },
      simulate: true,
      formatBytes: true,
      waitForConfirmation: false,
    }
  ) {
    super(contractId, algodClient, indexerClient, opts);
    this.ciSwap = new CONTRACT(
      contractId,
      algodClient,
      indexerClient,
      combineABI(swap200Extension),
      opts.acc,
      opts.simulate,
      opts.waitForConfirmation
    );
  }
  Info = async () => await Info(this.ciSwap);
  swap = async (addr, poolId, A, B) =>
    await swap(this.ciSwap, addr, poolId, A, B);
  static rate = (info, A, B) => rate(info, A, B);
  selectPool = async (pools, A, B, method) =>
    await selectPool(this.ciSwap, pools, A, B, method);
  getEvents = async (query) => {
    return await this.ciSwap.getEvents(query);
  };
  WithdrawEvents = async (query) => await this.ciSwap.WithdrawEvent(query);
  DepositEvents = async (query) => await this.ciSwap.DepositEvent(query);
  SwapEvents = async (query) => await this.ciSwap.SwapEvent(query);
  HarvestEvents = async (query) => await this.ciSwap.HarvestEvent(query);
}

export default Contract;
