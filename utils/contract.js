import CONTRACT from "arccjs";

export const makeConstructor = (contractInstance, acc, contractId, abi) => {
  const { algodClient, indexerClient } = contractInstance;
  const ci = new CONTRACT(
    contractId,
    algodClient,
    indexerClient,
    abi,
    acc,
    true,
    false,
    true
  );
  ci.setAgentName(contractInstance.getAgentName());
  return ci;
};

export const makeCtc = (contractInstance, acc, contractId, abi) => {
  const { algodClient, indexerClient } = contractInstance;
  const ci = new CONTRACT(contractId, algodClient, indexerClient, abi, acc);
  ci.setAgentName(contractInstance.getAgentName());
  return ci;
};

export const makeBuilder = (contractInstance, acc, contracts) => {
  return Object.fromEntries(
    Object.entries(contracts).map(([key, { contractId, abi }]) => [
      key,
      makeConstructor(contractInstance, acc, contractId, abi),
    ])
  );
};

export class uluClient {
  algodClient;
  indexerClient;
  address;
  constructor(algodClient, indexerClient, address) {
    this.algodClient = algodClient;
    this.indexerClient = indexerClient;
    this.address = address;
  }
  makeCI(ctcInfo, spec) {
    return makeCI(
      this.algodClient,
      this.indexerClient,
      this.address,
      ctcInfo,
      spec
    );
  }
  makeConstructor(ctcInfo, spec) {
    return makeConstructor2(
      this.algodClient,
      this.indexerClient,
      this.address,
      ctcInfo,
      spec
    );
  }
}

const makeCI = (
  algodClient,
  indexerClient,
  addr,
  ctcInfo,
  spec
) =>
  new CONTRACT(ctcInfo, algodClient, indexerClient, spec, {
    addr,
    sk: new Uint8Array(0),
  });

  const makeConstructor2 = (
    algodClient,
    indexerClient,
    addr,
    ctcInfo,
    spec
  ) =>
    new CONTRACT(
      ctcInfo,
      algodClient,
      indexerClient,
      spec,
      {
        addr,
        sk: new Uint8Array(0),
      },
      true,
      false,
      true
    );
  
