import CONTRACT, { oneAddress } from "arccjs";
import ARC200Contract from "../arc200/index.js";
import {
  Info,
  rate,
  selectPool,
  swap,
  decodeDepositEvent,
  decodeWithdrawEvent,
  decodeSwapEvent,
} from "../../utils/swap.js";
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
      swap200Extension,
      opts.acc,
      opts.simulate,
      opts.waitForConfirmation
    );
  }
  Info = async () => await Info(this.ciSwap);
  swap = async (addr, poolId, A, B) =>
    await swap(this.ciSwap, addr, poolId, A, B);
  static rate = (info, A, B) => rate(info, A, B);
  static decodeDepositEvent = (event) => decodeDepositEvent(event);
  static decodeWithdrawEvent = (event) => decodeWithdrawEvent(event);
  static decodeSwapEvent = (event) => decodeSwapEvent(event);
  // TODO add decodeHarvestEvent
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
