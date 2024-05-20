import CONTRACT from "arccjs";
export const makeConstructor = (contractInstance, contractId, abi) => {
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
export const makeCtc = (contractInstance, contractId, abi) => {
  const { algodClient, indexerClient } = contractInstance;
  return new CONTRACT(contractId, algodClient, indexerClient, abi, acc);
};
