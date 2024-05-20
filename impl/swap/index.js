import CONTRACT, { oneAddress, prepareString } from "arccjs";
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
import { Info } from "../../utils/swap.js";
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
class Contract {
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
    this.contractInstance = new CONTRACT(
      contractId,
      algodClient,
      indexerClient,
      combineABI(arc200Schema, swap200Extension),
      opts.acc,
      opts.simulate,
      opts.waitForConfirmation
    );
    this.opts = opts;
  }
  // arc200 methods
  //  standard methods
  arc200_name = async () => {
    const res = await arc200_name(this.contractInstance);
    if (!res.success) return res;
    if (this.opts?.formatBytes)
      return {
        ...res,
        returnValue: prepareString(res.returnValue),
      };
    return res;
  };
  arc200_symbol = async () => {
    const res = await arc200_symbol(this.contractInstance);
    if (!res.success) return res;
    if (this.opts?.formatBytes)
      return {
        ...res,
        returnValue: prepareString(res.returnValue),
      };
    return res;
  };
  arc200_totalSupply = async () =>
    await arc200_totalSupply(this.contractInstance);
  arc200_decimals = async () => await arc200_decimals(this.contractInstance);
  arc200_balanceOf = async (addr) =>
    await arc200_balanceOf(this.contractInstance, addr);
  arc200_allowance = async (addrFrom, addrSpender) =>
    await arc200_allowance(this.contractInstance, addrFrom, addrSpender);
  arc200_transfer = async (addrTo, amt, simulate, waitForConfirmation) =>
    await safe_arc200_transfer(
      this.contractInstance,
      addrTo,
      amt,
      simulate,
      waitForConfirmation
    );
  arc200_transferFrom = async (
    addrFrom,
    addrTo,
    amt,
    simulate,
    waitForConfirmation
  ) =>
    await safe_arc200_transferFrom(
      this.contractInstance,
      addrFrom,
      addrTo,
      amt,
      simulate,
      waitForConfirmation
    );
  arc200_approve = async (addrSpender, amt, simulate, waitForConfirmation) =>
    await safe_arc200_approve(
      this.contractInstance,
      addrSpender,
      amt,
      simulate,
      waitForConfirmation
    );
  arc200_Transfer = async (query) =>
    await this.contractInstance.arc200_Transfer(query);
  arc200_Approval = async (query) =>
    await this.contractInstance.arc200_Approval(query);
  //  non-standard methods
  getEvents = async (query) => await this.contractInstance.getEvents(query);
  // arc200_Transfer
  // arc200_Approval
  // depreciate has methods
  hasBalance = async (addr) => await hasBalance(this.contractInstance, addr);
  hasAllowance = async (addrFrom, addrSpender) =>
    await hasAllowance(this.contractInstance, addrFrom, addrSpender);
  //   arc200 state methood not supported swap200
  //  helper methods
  // depreciate getMetadata method
  getMetadata = async () => {
    const [name, symbol, totalSupply, decimals] = await Promise.all([
      this.arc200_name(),
      this.arc200_symbol(),
      this.arc200_totalSupply(),
      this.arc200_decimals(),
    ]);
    if (
      !name.success ||
      !symbol.success ||
      !totalSupply.success ||
      !decimals.success
    ) {
      return {
        success: false,
        error: "Failed to get metadata",
      };
    }
    return {
      success: true,
      returnValue: {
        name: name.returnValue,
        symbol: symbol.returnValue,
        totalSupply: totalSupply.returnValue,
        decimals: decimals.returnValue,
      },
    };
  };
  // swap200 methods
  Info = async () => await Info(this.contractInstance);
  swap = async (addr, poolId, A, B) =>
    await swap(this.contractInstance, addr, poolId, A, B);
}

export default Contract;
