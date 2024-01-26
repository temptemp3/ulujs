import CONTRACT from "arccjs";

import schema from "../../abi/arc200/index.js";

const BalanceBoxCost = 28500;
const AllowanceBoxCost = 28100;

/*
 * oneAddress is the address of the account that holds more
 * more than 0 ALGOs. This account is used to allow for simulation.
 */
export const oneAddress =
  "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ";

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

/*
 * handleResponse
 * - handle response
 * @param name: name of method
 * @param res: response
 * @returns: response
 */
const handleResponse = (name, res) => {
  /*
  if (process.env.DEBUG === "1") {
    console.log(`${name}: ${res.returnValue}`);
  }
  */
  return res;
};

/*
 * arc200_name
 * - get name
 * @param contractInstance: contract instance
 * @returns: name (String)
 */
export const arc200_name = async (contractInstance) =>
  handleResponse("Name", await contractInstance.arc200_name());

/*
 * arc200_symbol
 * - get symbol
 * @param contractInstance: contract instance
 * @returns: symbol (String)
 */
export const arc200_symbol = async (contractInstance) =>
  handleResponse("Symbol", await contractInstance.arc200_symbol());

/*
 * arc200_totalSupply
 * - get total supply
 * @param contractInstance: contract instance
 * @returns: total supply (Int)
 */
export const arc200_totalSupply = async (contractInstance) =>
  handleResponse("Total Supply", await contractInstance.arc200_totalSupply());

/*
 * arc200_decimals
 * - get number of decimals
 * @param contractInstance: contract instance
 * @returns: number of decimals (Int)
 */
export const arc200_decimals = async (contractInstance) =>
  handleResponse(
    "Number of Decimals",
    await contractInstance.arc200_decimals()
  );

/*
 * arc200_balanceOf
 * - get balance of addr
 * @param contractInstance: contract instance
 * @param addr: address to check
 * @returns: balance (Int)
 */
export const arc200_balanceOf = async (contractInstance, addr) =>
  handleResponse(
    `BalanceOf ${addr}`,
    await contractInstance.arc200_balanceOf(addr)
  );

/*
 * arc200_allowance
 * - check if spender is allowed to spend from addrFrom
 * @param contractInstance: contract instance
 * @param addrFrom: from address
 * @param addrSpender: spender address
 * @returns: allowance (Int)
 */
export const arc200_allowance = async (
  contractInstance,
  addrFrom,
  addrSpender
) =>
  handleResponse(
    `Allowance from: ${addrFrom} spender: ${addrSpender}`,
    await contractInstance.arc200_allowance(addrFrom, addrSpender)
  );

/*
 * hasBalance
 * - check if addr has balance
 * @param contractInstance: contract instance
 * @param addr: address to check
 * @returns: bool
 */
export const hasBalance = async (contractInstance, addr) =>
  handleResponse(`HasBalance ${addr}`, await contractInstance.hasBalance(addr));

/*
 * hasAllowance
 * - check if spender is allowed to spend from addrFrom
 * @param contractInstance: contract instance
 * @param addrFrom: from address
 * @param addrSpender: spender address
 * @returns: bool
 */
export const hasAllowance = async (contractInstance, addrFrom, addrSpender) =>
  handleResponse(
    `HasAllowance from: ${addrFrom} spender: ${addrSpender}`,
    await contractInstance.hasAllowance(addrFrom, addrSpender)
  );

/*
 * safe_arc200_transfer
 * - send
 * @param ci: contract instance
 * @param addrTo: to address
 * @param amt: amount to send
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *           if simulate: false { success: bool, txId: string }
 */
export const safe_arc200_transfer = async (
  ci,
  addrTo,
  amt,
  simulate,
  waitForConfirmation
) => {
  try {
    const opts = {
      acc: { addr: ci.getSender(), sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const ARC200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    const bal = await ci.arc200_balanceOf(addrTo);
    const addPayment = !bal.success || (bal.success && bal.returnValue === 0n);
    if (addPayment) {
      ARC200.contractInstance.setPaymentAmount(BalanceBoxCost);
    }
    const addrFrom = ARC200.contractInstance.getSender();
    console.log(`Transfer from: ${addrFrom} to: ${addrTo} amount: ${amt}`);
    return await ARC200.contractInstance.arc200_transfer(addrTo, amt);
  } catch (e) {
    console.log(e);
  }
};

/*
 * safe_arc200_transferFrom
 * - spend
 * @param ci: contract instance
 * @param addrFrom: from address
 * @param addrTo: to address
 * @param amt: amount to spend
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *           if simulate: false { success: bool, txId: string }
 */
export const safe_arc200_transferFrom = async (
  ci,
  addrFrom,
  addrTo,
  amt,
  simulate,
  waitForConfirmation
) => {
  try {
    const opts = {
      acc: { addr: ci.getSender(), sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const ARC200RO = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient
    );
    const ARC200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    const balTo = await ARC200RO.contractInstance.arc200_balanceOf(addrTo);
    const balFrom = await ARC200RO.contractInstance.arc200_balanceOf(addrFrom);
    const allowance = await ARC200RO.contractInstance.arc200_allowance(
      addrFrom,
      addrTo
    );
    if (!balTo.success || !balFrom.success || !allowance.success)
      throw new Error("Failed to get balance or allowance");
    let BoxCost = 0n;
    if (balTo.returnValue === 0n) BoxCost += BigInt(BalanceBoxCost);
    if (balFrom.returnValue === 0n) BoxCost += BigInt(BalanceBoxCost);
    if (allowance.returnValue === 0n) BoxCost += BigInt(AllowanceBoxCost);
    if (BoxCost > 0n) {
      ARC200.contractInstance.setPaymentAmount(BoxCost);
    }
    const addrSpender = ARC200.contractInstance.getSender();
    console.log(
      `TransferFrom spender: ${addrSpender} from: ${addrFrom} to: ${addrTo} amount: ${amt}`
    );
    return await ARC200.contractInstance.arc200_transferFrom(
      addrFrom,
      addrTo,
      amt
    );
  } catch (e) {
    console.log(e);
  }
};

/*
 * safe_arc200_approve
 * - approve spending
 * @param ci: contract instance
 * @param addrSpender: spender address
 * @param amt: amount to approve
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *           if simulate: false { success: bool, txId: string }
 */

export const safe_arc200_approve = async (
  ci,
  addrSpender,
  amt,
  simulate,
  waitForConfirmation
) => {
  try {
    const opts = {
      acc: { addr: ci.getSender(), sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const ARC200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    const addrFrom = ARC200.contractInstance.getSender();
    const all = await ci.arc200_allowance(addrFrom, addrSpender);
    const addPayment = !all.success || (all.success && all.returnValue === 0n);
    if (addPayment) {
      ARC200.contractInstance.setPaymentAmount(AllowanceBoxCost);
    }
    console.log(
      `Approval from: ${addrFrom} spender: ${addrSpender} amount: ${amt}`
    );
    return await ARC200.contractInstance.arc200_approve(addrSpender, amt);
  } catch (e) {
    console.log(e);
  }
};

/*
 * getEvents
 * - get events
 * @param ci: contract instance
 */
export const getMetadata = async (ci) => {
  const [name, symbol, totalSupply, decimals] = await Promise.all([
    ci.arc200_name(),
    ci.arc200_symbol(),
    ci.arc200_totalSupply(),
    ci.arc200_decimals(),
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
}

export default Contract;
