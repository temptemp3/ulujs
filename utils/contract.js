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
