import CONTRACT, { oneAddress } from "arccjs";
import schema from "../../abi/arc72/index.js";

// const BalanceBoxCost = 28500;
// const AllowanceBoxCost = 28100;

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

/* read-only methods */

/*
 * arc72_balanceOf
 * - get balance of addr
 * @param contractInstance: contract instance
 * @param addr: address
 * @returns: balance (Int)
 */
const arc72_balanceOf = async (contractInstance, addr) =>
  handleResponse("Balance", await contractInstance.arc72_balanceOf(addr));

/*
 * arc72_getApproved
 * - get approved address
 * @param contractInstance: contract instance
 * @param tid: token id
 * @returns: approved address (String)
 */
const arc72_getApproved = async (contractInstance, tid) =>
  handleResponse("GetApproved", await contractInstance.arc72_getApproved(tid));

/*
 * arc72_isApprovedForAll
 * - check if spender is approved for all
 * @param contractInstance: contract instance
 * @param addr: address
 * @returns: bool
 */
const arc72_isApprovedForAll = async (contractInstance, addr, addr2) =>
  handleResponse(
    "IsApprovedForAll",
    await contractInstance.arc72_isApprovedForAll(addr, addr2)
  );

/*
 * arc72_ownerOf
 * - get owner of
 * @param contractInstance: contract instance
 * @param tid: token id
 * @returns: owner (String)
 */
const arc72_ownerOf = async (contractInstance, tid) =>
  handleResponse("OwnerOf", await contractInstance.arc72_ownerOf(tid));

/*
 * arc72_tokenByIndex
 * - get token by index
 * @param contractInstance: contract instance
 * @param tid: token id
 * @returns: token (Int)
 */
const arc72_tokenByIndex = async (contractInstance, tid) =>
  handleResponse(
    "TokenByIndex",
    await contractInstance.arc72_tokenByIndex(tid)
  );

/*
 * arc72_totalSupply
 * - get total supply
 * @param contractInstance: contract instance
 * @returns: total supply (Int)
 */
const arc72_totalSupply = async (contractInstance) =>
  handleResponse("Total Supply", await contractInstance.arc72_totalSupply());

/*
 * arc72_tokenURI
 * - get token URI
 * @param contractInstance: contract instance
 * @param tid: token id
 * @returns: token URI (String)
 */
const arc72_tokenURI = async (contractInstance, tid) =>
  handleResponse("TokenURI", await contractInstance.arc72_tokenURI(tid));

/*
 * supportsInterface
 * - check if interface is supported
 * @param contractInstance: contract instance
 * @param sel: selector
 * @returns: bool
 */
const supportsInterface = async (contractInstance, sel) =>
  handleResponse(
    "SupportsInterface",
    await contractInstance.supportsInterface(sel)
  );

/*
 * safe_arc72_transfer
 * - send
 * @param ci: contract instance
 * @param addrTo: to address
 * @param amt: amount to send
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *           if simulate: false { success: bool, txId: string }
 */
// export const safe_arc72_transfer = async (
//   ci,
//   addrTo,
//   amt,
//   simulate,
//   waitForConfirmation
// ) => {
//   try {
//     const opts = {
//       acc: { addr: ci.getSender(), sk: ci.getSk() },
//       simulate,
//       formatBytes: true,
//       waitForConfirmation,
//     };
//     const ARC72 = new Contract(
//       ci.getContractId(),
//       ci.algodClient,
//       ci.indexerClient,
//       opts
//     );
//     const bal = await ci.arc72_balanceOf(addrTo);
//     const addPayment = !bal.success || (bal.success && bal.returnValue === 0n);
//     if (addPayment) {
//       ARC72.contractInstance.setPaymentAmount(BalanceBoxCost);
//     }
//     const addrFrom = ARC72.contractInstance.getSender();
//     console.log(`Transfer from: ${addrFrom} to: ${addrTo} amount: ${amt}`);
//     return await ARC72.contractInstance.arc72_transfer(addrTo, amt);
//   } catch (e) {
//     console.log(e);
//   }
// };

/*
 * safe_arc72_transferFrom
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
// export const safe_arc72_transferFrom = async (
//   ci,
//   addrFrom,
//   addrTo,
//   amt,
//   simulate,
//   waitForConfirmation
// ) => {
//   try {
//     const opts = {
//       acc: { addr: ci.getSender(), sk: ci.getSk() },
//       simulate,
//       formatBytes: true,
//       waitForConfirmation,
//     };
//     const ARC72 = new Contract(
//       ci.getContractId(),
//       ci.algodClient,
//       ci.indexerClient,
//       opts
//     );
//     const bal = await ci.arc72_balanceOf(addrTo);
//     const addPayment = !bal.success || (bal.success && bal.returnValue === 0n);
//     if (addPayment) {
//       ARC72.contractInstance.setPaymentAmount(BalanceBoxCost);
//     }
//     const addrSpender = ARC72.contractInstance.getSender();
//     console.log(
//       `TransferFrom spender: ${addrSpender} from: ${addrFrom} to: ${addrTo} amount: ${amt}`
//     );
//     return await ARC72.contractInstance.arc72_transferFrom(
//       addrFrom,
//       addrTo,
//       amt
//     );
//   } catch (e) {
//     console.log(e);
//   }
// };

/*
 * safe_arc72_approve
 * - approve spending
 * @param ci: contract instance
 * @param addrSpender: spender address
 * @param amt: amount to approve
 * @param simulate: boolean
 * @param waitForConfirmation: boolean
 * @returns: if simulate: true  { success: bool, txns: string[] }
 *           if simulate: false { success: bool, txId: string }
 */
// export const safe_arc72_approve = async (
//   ci,
//   addrSpender,
//   amt,
//   simulate,
//   waitForConfirmation
// ) => {
//   try {
//     const opts = {
//       acc: { addr: ci.getSender(), sk: ci.getSk() },
//       simulate,
//       formatBytes: true,
//       waitForConfirmation,
//     };
//     const ARC72 = new Contract(
//       ci.getContractId(),
//       ci.algodClient,
//       ci.indexerClient,
//       opts
//     );
//     const addrFrom = ARC72.contractInstance.getSender();
//     const all = await ci.arc72_allowance(addrFrom, addrSpender);
//     const addPayment = !all.success || (all.success && all.returnValue === 0n);
//     if (addPayment) {
//       ARC72.contractInstance.setPaymentAmount(AllowanceBoxCost);
//     }
//     console.log(
//       `Approval from: ${addrFrom} spender: ${addrSpender} amount: ${amt}`
//     );
//     return await ARC72.contractInstance.arc72_approve(addrSpender, amt);
//   } catch (e) {
//     console.log(e);
//   }
// };

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
        ...schema,
        methods: [...schema.methods],
        events: [...schema.events],
      },
      opts.acc,
      opts.simulate,
      opts.waitForConfirmation
    );
    this.opts = opts;
  }
  // standard methods
  arc72_tokenURI = async (tid) => {
    const res = await arc72_tokenURI(this.contractInstance, tid);
    if (!res.success) return res;
    if (this.opts?.formatBytes)
      return {
        ...res,
        returnValue: prepareString(res.returnValue),
      };
    return res;
  };
  arc72_balanceOf = async (addr) =>
    await arc72_balanceOf(this.contractInstance, addr);
  arc72_getApproved = async (tid) =>
    await arc72_getApproved(this.contractInstance, tid);
  arc72_isApprovedForAll = async (addr, addr2) =>
    await arc72_isApprovedForAll(this.contractInstance, addr, addr2);
  arc72_ownerOf = async (tid) =>
    await arc72_ownerOf(this.contractInstance, tid);
  arc72_tokenByIndex = async (tid) =>
    await arc72_tokenByIndex(this.contractInstance, tid);
  arc72_totalSupply = async () =>
    await arc72_totalSupply(this.contractInstance);
  supportsInterface = async (sel) =>
    await supportsInterface(this.contractInstance, sel);
  arc72_transferFrom = async (
    addrFrom,
    addrTo,
    amt,
    simulate,
    waitForConfirmation
  ) => {};
  arc72_approve = async (addrSpender, amt, simulate, waitForConfirmation) => {};
  arc72_setApprovalForAll = async (
    addrSpender,
    approve,
    simulate,
    waitForConfirmation
  ) => {};
  arc72_Approval = async (query) =>
    await this.contractInstance.arc72_Approval(query);
  arc72_ApprovalForAll = async (query) =>
    await this.contractInstance.arc72_ApprovalForAll(query);
  arc72_Transfer = async (query) =>
    await this.contractInstance.arc72_Transfer(query);
  // non-standard methods
  getEvents = async (query) => await this.contractInstance.getEvents(query);
}

export default Contract;
