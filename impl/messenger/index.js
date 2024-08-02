import CONTRACT, { oneAddress } from "arccjs";
import schema from "../../abi/messenger/index.js";

const PartKeyInfoToObject = (pki) => {
  const [who, address, vote_k, sel_k, vote_fst, vote_lst, vote_kd, sp_key] =
    pki;
  return {
    who,
    address,
    vote_k,
    sel_k,
    vote_fst,
    vote_lst,
    vote_kd,
    sp_key,
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
  PartKeyInfo = async (query) =>
    (await this.contractInstance.PartKeyInfo(query)).map(PartKeyInfoToObject);
}

export default Contract;
