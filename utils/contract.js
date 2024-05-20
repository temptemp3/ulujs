import CONTRACT from "arccjs";
export const makeConstructor = (contractInstance, acc, contractId, abi) => {
  const { algodClient, indexerClient } = contractInstance;
  return new CONTRACT(
    contractId,
    algodClient,
    indexerClient,
    abi,
    acc,
    true,
    false,
    true
  );
};
export const makeCtc = (contractInstance, acc, contractId, abi) => {
  const { algodClient, indexerClient } = contractInstance;
  return new CONTRACT(contractId, algodClient, indexerClient, abi, acc);
};
export const makeBuilder = (contracts) => {
  return Object.fromEntries(
    Object.entries(contracts).map(([key, { contractId, abi }]) => [
      key,
      makeConstructor(contractInstance, acc, contractId, abi),
    ])
  );
};
