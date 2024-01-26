import CONTRACT, { oneAddress } from "arccjs";

import schema from "../../abi/nt200/index.js";

import {
  arc200_name,
  arc200_symbol,
  arc200_totalSupply,
  arc200_decimals,
  arc200_balanceOf,
  arc200_allowance,
  safe_arc200_approve,
  safe_arc200_transfer,
  safe_arc200_transferFrom,
  hasAllowance,
  hasBalance,
  getMetadata,
  BalanceBoxCost
} from "../arc200/index.js";
import algosdk from "algosdk";

/*
 * prepareString
 * - prepare string (strip trailing null bytes)
 * @param str: string to prepare
 * @returns: prepared string
 */
const prepareString = (str) => {
  const index = str.indexOf("\x00");
  if (index > 0) {
    return str.slice(0, str.indexOf("\x00"));
  } else {
    return str;
  }
};

export const safe_deposit = async (
  ci,
  amt, // bigint
  simulate,
  waitForConfirmation
) => {
  try {
    const addrFrom = ci.getSender();
    const opts = {
      acc: { addr: addrFrom, sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const NT200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    const ARC200RO = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient
    );
    const balFrom = await ARC200RO.contractInstance.arc200_balanceOf(addrFrom);
    if (!balFrom.success) throw new Error("Failed to get balance or allowance");
    let BoxCost = 0n;
    if (balFrom.returnValue === 0n) BoxCost += BigInt(BalanceBoxCost);
    NT200.contractInstance.setPaymentAmount(BoxCost + amt);
    console.log(`Deposit from: ${addrFrom} amount: ${amt.toString()}`);
    return await NT200.contractInstance.deposit(amt);
  } catch (e) {
    return { success: false, error: e };
  }
}

const safe_withdraw = async (
  ci,
  amt, // bigint
  simulate,
  waitForConfirmation
) => {
  try {
    const addrFrom = ci.getSender();
    const opts = {
      acc: { addr: addrFrom, sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const NT200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    const ARC200RO = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient
    );
    const addrTo = algosdk.getApplicationAddress(ci.getContractId());
    const approvalR = await ARC200RO.contractInstance.arc200_allowance(
      addrFrom,
      addrTo
    );
    if (!approvalR.success) throw new Error("Failed to get balance or allowance");
    const approval = approvalR.returnValue;
    if (approval < amt) throw new Error("Insufficient approval");
    const balTo = await ARC200RO.contractInstance.arc200_balanceOf(addrTo);
    const balFrom = await ARC200RO.contractInstance.arc200_balanceOf(addrFrom);
    if (!balFrom.success || !balTo.success) throw new Error("Failed to get balance or allowance");
    let BoxCost = 0n;
    if (balFrom.returnValue === 0n) BoxCost += BigInt(BalanceBoxCost);
    if (balTo.returnValue === 0n) BoxCost += BigInt(BalanceBoxCost);
    if(BoxCost > 0n) NT200.contractInstance.setPaymentAmount(BoxCost);
    NT200.contractInstance.setFee(2000);
    console.log(`Deposit from: ${addrFrom} amount: ${amt.toString()}`);
    return await NT200.contractInstance.withdraw(amt);
  } catch (e) {
    return { success: false, error: e };
  }
}
    

const safe_createBalanceBox = async (
  ci,
  addr,
  simulate,
  waitForConfirmation
) => {
  try {
    const addrFrom = ci.getSender();
    const opts = {
      acc: { addr: addrFrom, sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const NT200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    const ARC200RO = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient
    );
    const balTo = await ARC200RO.contractInstance.arc200_balanceOf(addr);
    if (!balTo.success) throw new Error("Failed to get balance or allowance");
    let BoxCost = 0n;
    if (balTo.returnValue === 0n) BoxCost += BigInt(BalanceBoxCost);
    if(BoxCost > 0n) {
      NT200.contractInstance.setPaymentAmount(BoxCost);
    }
    console.log("BoxCost", BoxCost.toString());
    console.log(`Create balance box addr: ${addr}`);
    return await NT200.contractInstance.createBalanceBox(addr);
  } catch (e) {
    return { success: false, error: e };
  }
}



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
      schema,
      opts.acc,
      opts.simulate,
      opts.waitForConfirmation
    );
    this.opts = opts;
  }
  // standard methods
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
  // non-standard methods
  getEvents = async (query) => await this.contractInstance.getEvents(query);
  hasBalance = async (addr) => await hasBalance(this.contractInstance, addr);
  hasAllowance = async (addrFrom, addrSpender) =>
    await hasAllowance(this.contractInstance, addrFrom, addrSpender);
  state = async () => {
    const stateR = await this.contractInstance.state();
    if (!stateR.success) {
      return {
        success: false,
        error: "Failed to get state",
      };
    }
    const [
      name,
      symbol,
      decimals,
      totalSupply,
      zeroAddress,
      manager,
      enableZeroAddressBurn,
      closed,
    ] = stateR.returnValue;
    return {
      success: true,
      returnValue: {
        name: prepareString(name),
        symbol: prepareString(symbol),
        decimals,
        totalSupply,
        zeroAddress,
        manager,
        enableZeroAddressBurn,
        closed,
      },
    };
  };
  // helper methods
  getMetadata = async () => await getMetadata(this.contractInstance);
  // nt200 methods
  deposit = async (amt, simulate, waitForConfirmation) =>
    await safe_deposit(
      this.contractInstance,
      amt,
      simulate,
      waitForConfirmation
    );
  withdraw = async (amt, simulate, waitForConfirmation) =>
    await safe_withdraw(
      this.contractInstance,
      amt,
      simulate,
      waitForConfirmation
    );
  createBalanceBox = async (addr, simulate, waitForConfirmation) =>
    await safe_createBalanceBox(this.contractInstance, addr, simulate, waitForConfirmation);
}

export default Contract;
