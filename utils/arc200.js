import { handleResponse } from "./debug.js";

// :::'###::::'########:::'######:::'#######::::'#####:::::'#####:::
// ::'## ##::: ##.... ##:'##... ##:'##.... ##::'##.. ##:::'##.. ##::
// :'##:. ##:: ##:::: ##: ##:::..::..::::: ##:'##:::: ##:'##:::: ##:
// '##:::. ##: ########:: ##::::::::'#######:: ##:::: ##: ##:::: ##:
//  #########: ##.. ##::: ##:::::::'##:::::::: ##:::: ##: ##:::: ##:
//  ##.... ##: ##::. ##:: ##::: ##: ##::::::::. ##:: ##::. ##:: ##::
//  ##:::: ##: ##:::. ##:. ######:: #########::. #####::::. #####:::
// ..:::::..::..:::::..:::......:::.........::::.....::::::.....::::

export const BalanceBoxCost = 28500;
export const AllowanceBoxCost = 28100;

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
 * @depreciate
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
 * @depreciate
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
