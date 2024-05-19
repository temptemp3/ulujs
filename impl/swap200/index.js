import CONTRACT from "arccjs";

import arc200Schema from "../../abi/arc200/index.js";
import swap200Extension from "../../abi/swap200/index.js";

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

// :::'###::::'########:::'######:::'#######::::'#####:::::'#####:::
// ::'## ##::: ##.... ##:'##... ##:'##.... ##::'##.. ##:::'##.. ##::
// :'##:. ##:: ##:::: ##: ##:::..::..::::: ##:'##:::: ##:'##:::: ##:
// '##:::. ##: ########:: ##::::::::'#######:: ##:::: ##: ##:::: ##:
//  #########: ##.. ##::: ##:::::::'##:::::::: ##:::: ##: ##:::: ##:
//  ##.... ##: ##::. ##:: ##::: ##: ##::::::::. ##:: ##::. ##:: ##::
//  ##:::: ##: ##:::. ##:. ######:: #########::. #####::::. #####:::
// ..:::::..::..:::::..:::......:::.........::::.....::::::.....::::

const BalanceBoxCost = 28500;
const AllowanceBoxCost = 28100;

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

// :'######::'##:::::'##::::'###::::'########:::'#######::::'#####:::::'#####:::
// '##... ##: ##:'##: ##:::'## ##::: ##.... ##:'##.... ##::'##.. ##:::'##.. ##::
//  ##:::..:: ##: ##: ##::'##:. ##:: ##:::: ##:..::::: ##:'##:::: ##:'##:::: ##:
// . ######:: ##: ##: ##:'##:::. ##: ########:::'#######:: ##:::: ##: ##:::: ##:
// :..... ##: ##: ##: ##: #########: ##.....:::'##:::::::: ##:::: ##: ##:::: ##:
// '##::: ##: ##: ##: ##: ##.... ##: ##:::::::: ##::::::::. ##:: ##::. ##:: ##::
// . ######::. ###. ###:: ##:::: ##: ##:::::::: #########::. #####::::. #####:::
// :......::::...::...:::..:::::..::..:::::::::.........::::.....::::::.....::::

/*
 * reserve
 * - return amount to redeam or add to liquidity
 * @param contractInstance: contract instance
 * @param addr: address
 * @returns: bigint
 */
export const reserve = async (contractInstance, addr) =>
  handleResponse(`Reserve ${addr}`, await contractInstance.reserve(addr));

/*
 * Info
 * - get info
 * @param contractInstance: contract instance
 * @returns: info
 * @note: info = [lptBals, poolBals, protoInfo, protoBals, tokB, tokA]
 * @note: protoInfo = [protoFee, lpFee, totFee, protoAddr, locked]
 * @note: protoBals = [protoA, protoB]
 * @note: tokB: token B balance
 * @note: tokA: token A balance
 * @note: lptBals: liquidity provider token balances
 * @note: poolBals: pool token balances
 */
export const Info = async (contractInstance) => {
  const infoR = await contractInstance.Info();
  if (!infoR.success) return infoR;
  const [lptBals, poolBals, protoInfo, protoBals, tokB, tokA] =
    infoR.returnValue;
  const [protoFee, lpFee, totFee, protoAddr, locked] = protoInfo;
  return {
    success: true,
    returnValue: {
      lptBals: (([lpHeld,lpMinted]) => ({ lpHeld, lpMinted }))(lptBals.map(String)),
      poolBals: (([A,B]) => ({ A, B }))(poolBals.map(String)),
      protoInfo: {
        protoFee: Number(protoFee),
        lpFee: Number(lpFee),
        totFee: Number(totFee),
        protoAddr,
        locked,
      },
      protoBals: (([A,B]) => ({ A, B }))(protoBals.map(String)),
      tokB: Number(tokB),
      tokA: Number(tokA),
    },
  };
};

/*
 * swap
 * - swap tokens
 * @param ci: contract instance
 * @param amount: amount to swap
 * @param ol: output liquidity
 * @param swapAForB: swap A for B
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *          if simulate: false { success: bool, txId: string }
 * @note: swapAForB: true  => swap A for B
 *                false => swap B for A
 * @note: ol: output liquidity
 * @note: amount: amount to swap
 */
const swap = async (
  ci,
  amount,
  ol,
  swapAForB,
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
    const SWAP200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    SWAP200.contractInstance.setFee(5000);
    SWAP200.contractInstance.setPaymentAmount(28500 * 2);
    const res = swapAForB
      ? await SWAP200.contractInstance.Trader_swapAForB(amount, ol)
      : await SWAP200.contractInstance.Trader_swapBForA(amount, ol);
    if (!res.success) throw new Error("Trader_swap failed");
    return res;
  } catch (e) {
    console.log(e);
  }
};

/*
 * withdraw
 * - withdraw tokens from reserve or liquidity
 * @param ci: contract instance
 * @param amount: amount to withdraw
 * @param isA: withdraw A
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *         if simulate: false { success: bool, txId: string }
 * @note: isA: true  => withdraw A
 *           false => withdraw B
 */
const withdrawReserve = async (
  ci,
  amount,
  isA,
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
    const SWAP200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    SWAP200.contractInstance.setFee(3000);
    SWAP200.contractInstance.setPaymentAmount(28500 * 2);
    let res = isA
      ? await SWAP200.contractInstance.Provider_withdrawA(amount)
      : await SWAP200.contractInstance.Provider_withdrawB(amount);
    if (!res.success) throw new Error("Trader_withdraw failed");
    return res;
  } catch (e) {
    console.log(e);
  }
};

/*
 * depositReserve
 * - deposits tokens to reserve from balance
 * @param ci: contract instance
 * @param amount: amount to deposit
 * @param isA: deposit A
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 */
const depositReserve = async (
  ci,
  amount,
  isA,
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
    const SWAP200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    SWAP200.contractInstance.setFee(3000);
    SWAP200.contractInstance.setPaymentAmount(28500 * 2);
    let res = isA
      ? await SWAP200.contractInstance.Provider_depositA(amount)
      : await SWAP200.contractInstance.Provider_depositB(amount);
    if (!res.success) throw new Error("Provider_deposit failed");
    return res;
  } catch (e) {
    console.log(e);
  }
};

const depositLiquidity = async (ci, lp, ol, simulate, waitForConfirmation) => {
  try {
    const opts = {
      acc: { addr: ci.getSender(), sk: ci.getSk() },
      simulate,
      formatBytes: true,
      waitForConfirmation,
    };
    const SWAP200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    SWAP200.contractInstance.setFee(2000);
    SWAP200.contractInstance.setPaymentAmount(28500);
    let res = await SWAP200.contractInstance.Provider_deposit(lp, ol);
    if (!res.success) throw new Error("Provider_deposit failed");
    return res;
  } catch (e) {
    console.log(e);
  }
};

const withdrawLiquidity = async (
  ci,
  lp,
  outls,
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
    const SWAP200 = new Contract(
      ci.getContractId(),
      ci.algodClient,
      ci.indexerClient,
      opts
    );
    SWAP200.contractInstance.setFee(2000);
    SWAP200.contractInstance.setPaymentAmount(28500);
    let res = await SWAP200.contractInstance.Provider_withdraw(lp, outls);
    if (!res.success) throw new Error("Provider_withdraw failed");
    return res;
  } catch (e) {
    console.log(e);
  }
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
      {
        ...arc200Schema,
        methods: [...arc200Schema.methods, ...swap200Extension.methods],
        events: [...arc200Schema.events, ...swap200Extension.events],
      },
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
  hasBalance = async (addr) => await hasBalance(this.contractInstance, addr);
  hasAllowance = async (addrFrom, addrSpender) =>
    await hasAllowance(this.contractInstance, addrFrom, addrSpender);
  //   arc200 state methood not supported swap200
  //  helper methods
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
  //  standard methods
  reserve = async (addr) => await reserve(this.contractInstance, addr);
  Info = async () => await Info(this.contractInstance);
  Trader_swapAForB = async (amount, ol, simulate, waitForConfirmation) =>
    await swap(
      this.contractInstance,
      amount,
      ol,
      true,
      simulate,
      waitForConfirmation
    );
  Trader_swapBForA = async (amount, ol, simulate, waitForConfirmation) =>
    await swap(
      this.contractInstance,
      amount,
      ol,
      false,
      simulate,
      waitForConfirmation
    );
  Provider_withdrawA = async (amount, simulate, waitForConfirmation) =>
    await withdrawReserve(
      this.contractInstance,
      amount,
      true,
      simulate,
      waitForConfirmation
    );
  Provider_withdrawB = async (amount, simulate, waitForConfirmation) =>
    await withdrawReserve(
      this.contractInstance,
      amount,
      false,
      simulate,
      waitForConfirmation
    );
  Provider_depositA = async (amount, simulate, waitForConfirmation) =>
    await depositReserve(
      this.contractInstance,
      amount,
      true,
      simulate,
      waitForConfirmation
    );
  Provider_depositB = async (amount, simulate, waitForConfirmation) =>
    await depositReserve(
      this.contractInstance,
      amount,
      false,
      simulate,
      waitForConfirmation
    );
  Provider_deposit = async (lp, ol, simulate, waitForConfirmation) =>
    await depositLiquidity(
      this.contractInstance,
      lp,
      ol,
      simulate,
      waitForConfirmation
    );
  Provider_withdraw = async (lp, outls, simulate, waitForConfirmation) =>
    await withdrawLiquidity(
      this.contractInstance,
      lp,
      outls,
      simulate,
      waitForConfirmation
    );
  //  helper methods
  swap = async (amount, ol, swapAForB, simulate, waitForConfirmation) =>
    await swap(
      this.contractInstance,
      amount,
      ol,
      swapAForB,
      simulate,
      waitForConfirmation
    );
  withdrawReserve = async (amount, isA, simulate, waitForConfirmation) =>
    await withdrawReserve(
      this.contractInstance,
      amount,
      isA,
      simulate,
      waitForConfirmation
    );
  depositReserve = async (amount, isA, simulate, waitForConfirmation) =>
    await depositReserve(
      this.contractInstance,
      amount,
      isA,
      simulate,
      waitForConfirmation
    );
  depositLiquidity = async (lp, ol, simulate, waitForConfirmation) =>
    await depositLiquidity(
      this.contractInstance,
      lp,
      ol,
      simulate,
      waitForConfirmation
    );
  withdrawLiquidity = async (lp, outls, simulate, waitForConfirmation) =>
    await withdrawLiquidity(
      this.contractInstance,
      lp,
      outls,
      simulate,
      waitForConfirmation
    );
}

export default Contract;
