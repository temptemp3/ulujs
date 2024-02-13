import CONTRACT, { oneAddress } from "arccjs";
import schema from "../../abi/hsv2/swap.js";

/*
 * ObjectFromInfo
 * - converts info.returnValue to object
 */
const ObjectFromInfo = (info) => {
  const [liquidityToken, lptBals, poolBals, protoInfo, protoBals, tokB, tokA] =
    info;
  const [protoFee, lpFee, totFee, protoAddr, locked] = protoInfo;
  return {
    liquidityToken: liquidityToken.toString(),
    lptBals: lptBals.map((x) => x.toString()),
    poolBals: poolBals.map((x) => x.toString()),
    protoInfo: {
      protoFee: protoFee.toString(),
      lpFee: lpFee.toString(),
      totFee: totFee.toString(),
      protoAddr: protoAddr.toString(),
      locked: locked !== 0,
    },
    protoBals: protoBals.map((x) => x.toString()),
    tokB: tokB.toString(),
    tokA: tokA[0] === 0 ? "0" : tokA[1].toString(),
  };
};

/*
 * Info
 * - wrapper for CONTRACT.Info
 * - returns info with returnValue raw or as object depending on opts
 */
const Info = async (ci, opts) => {
  const info = await ci.Info();
  return opts.returnObject
    ? {
        ...info,
        returnValue: ObjectFromInfo(info.returnValue),
      }
    : info;
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
      returnObject: false,
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
  Provider_deposit = async (arg0, arg1) =>
    await this.contractInstance.Provider_deposit(arg0, arg1);
  Info = async () => await Info(this.contractInstance, this.opts);
}

export default Contract;
