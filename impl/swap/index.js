import CONTRACT, { oneAddress } from "arccjs";
import ARC200Contract from "../arc200/index.js";
import {
  Info,
  rate,
  selectPool,
  swap,
  deposit,
  decodeDepositEvent,
  decodeWithdrawEvent,
  decodeSwapEvent,
} from "../../utils/swap.js";
import swap200Extension from "../../abi/swap/index.js";
import pkg from "../../package.json" assert { type: "json" };

// :'######::'##:::::'##::::'###::::'########::
// '##... ##: ##:'##: ##:::'## ##::: ##.... ##:
//  ##:::..:: ##: ##: ##::'##:. ##:: ##:::: ##:
// . ######:: ##: ##: ##:'##:::. ##: ########::
// :..... ##: ##: ##: ##: #########: ##.....:::
// '##::: ##: ##: ##: ##: ##.... ##: ##::::::::
// . ######::. ###. ###:: ##:::: ##: ##::::::::
// :......::::...::...:::..:::::..::..:::::::::

const selectEvent = (events, names) =>
  events.find((e) => names.includes(e.name) && e.events.length > 0)?.events ||
  [];

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
    const ci = new CONTRACT(
      contractId,
      algodClient,
      indexerClient,
      swap200Extension,
      opts.acc,
      opts.simulate,
      opts.waitForConfirmation
    );
    ci.setAgentName(`ulujs-${pkg.version}`);
    this.ciSwap = ci;
  }
  Info = async () => await Info(this.ciSwap);
  swap = async (addr, poolId, A, B) =>
    await swap(this.ciSwap, addr, poolId, A, B);
  deposit = async (addr, poolId, A, B, extraTxns) =>
    await deposit(this.ciSwap, addr, poolId, A, B, extraTxns);
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
  WithdrawEvents = async (query) =>
    selectEvent(await this.ciSwap.getEvents(query), [
      "Withdraw",
      "WithdrawEvent",
    ]);
  DepositEvents = async (query) =>
    selectEvent(await this.ciSwap.getEvents(query), [
      "Deposit",
      "DepositEvent",
    ]);
  SwapEvents = async (query) =>
    selectEvent(await this.ciSwap.getEvents(query), ["Swap", "SwapEvent"]);
  HarvestEvents = async (query) => await this.ciSwap.HarvestEvents(query);
}

export default Contract;
