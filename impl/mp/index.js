import CONTRACT, { oneAddress } from "arccjs";
import schema from "../../abi/mp/index.js";
import { buy, ensure, list } from "../../utils/mp.js";

const ListingBoxCost = 60900;
const BuyFee = 4000;

/*
 * handleResponse
 * - handle response
 * @param name: name of method
 * @param res: response
 * @returns: response
 */
const handleResponse = (name, res) => {
  return res;
};

/*
 * buyNetPaymentAmount
 * - calculate buyNet payment amount
 * @param lPrc: list price
 * @param feeBi: fee basis points
 * @returns: buyNet payment amount
 */
const buyNetPaymentAmount = (lPrc, feeBi) => (lPrc * (100n + feeBi)) / 100n;

/*
 * listingByIndex
 * - get listing by index
 * @param contractInstance: contract instance
 * @param tid: token id
 * @returns: listing
 */
export const listingByIndex = async (contractInstance, tid) =>
  handleResponse(`Listing ${tid}`, await contractInstance.listingByIndex(tid));

/*
 * state
 * - get state
 * @param contractInstance: contract instance
 * @returns: state
 */
export const state = async (contractInstance) =>
  handleResponse(`Info`, await contractInstance.state());

/*
 * safe_buyNet
 * - buy net
 * @param ci: contract instance
 * @param listId: list id
 * @param simulate: simulate
 * @param waitForConfirmation: wait for confirmation
 * @returns: response
 */
const safe_buyNet = async (
  ci,
  listId,
  feeBi,
  simulate,
  waitForConfirmation
) => {
  try {
    const opts = {
      acc: { addr: ci.getSender(), sk: ci.getSk() },
      simulate,
      formatBytes: false,
      waitForConfirmation,
    };
    const mp = new Contract(
      mp.getContractId(),
      mp.algodClient,
      mp.indexerClient,
      opts
    );
    mp.contractInstance.setFee(BuyFee);
    mp.contractInstance.setPaymentAmount(buyNetPaymentAmount(lPrc, feeBi));
    let res = await ci.contractInstance.buyNet(listId);
    if (!res.success) throw new Error("buyNet failed");
    return res;
  } catch (e) {
    console.log(e);
  }
};

/*
 * safe_listNet
 * - list net
 * @param ci: contract instance
 * @param collectionId: collection id
 * @param tokenId: token id
 * @param listPrice: list price
 * @param simulate: simulate
 * @param waitForConfirmation: wait for confirmation
 * @returns: response
 */
const safe_listNet = async (
  ci,
  collectionId,
  tokenId,
  listPrice,
  simulate,
  waitForConfirmation
) => {
  try {
    const opts = {
      acc: { addr: ci.getSender(), sk: ci.getSk() },
      simulate,
      formatBytes: false,
      waitForConfirmation,
    };
    const mp = new Contract(
      mp.getContractId(),
      mp.algodClient,
      mp.indexerClient,
      opts
    );
    mp.contractInstance.setPaymentAmount(ListingBoxCost);
    let res = await mp.contractInstance.listNet(
      collectionId,
      tokenId,
      listPrice
    );
    if (!res.success) throw new Error("listNet failed");
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
      feeBi: 0n,
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
  listingByIndex = async (index) =>
    await listingByIndex(this.contractInstance, index);
  state = async () => await state(this.contractInstance);
  listNet = async (
    collectionId,
    tokenId,
    listPrice,
    simulate,
    waitForConfirmation
  ) =>
    await safe_listNet(
      this.contractInstance,
      collectionId,
      tokenId,
      listPrice,
      simulate,
      waitForConfirmation
    );
  buyNet = async (listId, simulate, waitForConfirmation) =>
    await safe_buyNet(
      this.contractInstance,
      listId,
      this.opts.feeBi,
      simulate,
      waitForConfirmation
    );
  manager = async () => await this.contractInstance.manager();
  deleteListing = async (listId) => {
    this.contractInstance.setFee(2000);
    return await this.contractInstance.a_sale_deleteListing(listId);
  }
  DeleteListingEvent = async (query) => await this.contractInstance.e_sale_DeleteListingEvent(query);
  BuyEvent = async (query) =>
    await this.contractInstance.e_sale_BuyEvent(query);
  ListEvent = async (query) =>
    await this.contractInstance.e_sale_ListEvent(query);
  getEvents = async (query) => await this.contractInstance.getEvents(query);
  static buy = async (addr, listings, currency, opts) =>
    await buy(addr, listings, currency, opts);
  static list = async (addr, token, price, currency, opts) =>
    await list(addr, token, price, currency, opts);
  static ensure = async (addr, token, price, currency, opts) =>
    await ensure(addr, token, price, currency, opts);
}

export default Contract;
