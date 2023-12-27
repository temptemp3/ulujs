import CONTRACT from "arccjs";

import HSV2ANN from "../../abi/other/hsv2/ann.json" assert { type: "json" }; // hsv2 announcer

/*
 * oneAddress is the address of the account that holds more
 * more than 0 ALGOs. This account is used to allow for simulation.
 */
export const oneAddress =
  "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ";

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
        ...HSV2ANN,
        methods: [],
        events: [...HSV2ANN.events],
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
    return handleResponse("Announce", res);
  };
}

export default Contract;
