import CONTRACT, { oneAddress } from "arccjs";
import schema from "../../abi/other/hsv2/netTok.js";

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
  Provider_deposit = async (arg0, arg1) =>
    await this.contractInstance.Provider_deposit(arg0, arg1);
}

export default Contract;
