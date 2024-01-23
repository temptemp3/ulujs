import CONTRACT, { oneAddress } from "arccjs";
import schema from "../../abi/other/hsv2/ann.js";

/*
 * decodeSymbol
 * - decode symbol from hex
 */
const decodeSymbol = (hex) => {
  return Buffer.from(hex, "hex")
    .filter((b) => b !== 0)
    .toString("utf8");
};

/*
 * decodeAnnounceEvent
 * - decode announce event
 */
const decodeAnnounceEvent = (evt) => {
  const [txid, round, timestamp, ...args] = evt;
  const [address, opts, _] = args;
  const [
    ctcInfo,
    startBlock,
    endBlock,
    rewardTokenId,
    rewardsPerBlock,
    stakedTokenId,
    mPairTokenAId,
    rPairTokenASymbol,
    pairTokenBId,
    rPairTokenBSymbol,
    rewardTokenDecimals,
    rRewardTokenSymbol,
    stakedTokenDecimals,
    stakedTokenPoolId,
    rStakedTokenSymbol,
    stakedTokenTotalSupply,
  ] = opts;
  let pairTokenAId;
  if (mPairTokenAId[0] === "01") {
    pairTokenAId = BigInt("0x" + mPairTokenAId[1]);
  } else {
    pairTokenAId = 0n;
  }
  const pairTokenASymbol = decodeSymbol(rPairTokenASymbol);
  const pairTokenBSymbol = decodeSymbol(rPairTokenBSymbol);
  const rewardTokenSymbol = decodeSymbol(rRewardTokenSymbol);
  const stakedTokenSymbol = decodeSymbol(rStakedTokenSymbol);
  return {
    txid: txid,
    round: round,
    timestamp: timestamp,
    address: address,
    ctcInfo: ctcInfo,
    startBlock: startBlock,
    endBlock: endBlock,
    rewardTokenId: rewardTokenId,
    rewardsPerBlock: rewardsPerBlock,
    stakedTokenId: stakedTokenId,
    pairTokenAId: pairTokenAId,
    pairTokenASymbol: pairTokenASymbol,
    pairTokenBId: pairTokenBId,
    pairTokenBSymbol: pairTokenBSymbol,
    rewardTokenDecimals: rewardTokenDecimals,
    rewardTokenSymbol: rewardTokenSymbol,
    stakedTokenDecimals: stakedTokenDecimals,
    stakedTokenPoolId: stakedTokenPoolId,
    stakedTokenSymbol: stakedTokenSymbol,
    stakedTokenTotalSupply: stakedTokenTotalSupply,
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
  getEvents = async (query) => await this.contractInstance.getEvents(query);
  Announce = async (query) => {
    const res = await this.contractInstance.Announce(query);
    return {
      ...res,
      events: res.events.map(decodeAnnounceEvent),
    };
  };
}

export default Contract;
