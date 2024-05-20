import CONTRACT from "arccjs";
export const makeConstructor = (contractId, abi) => {
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
export const makeCtc = (contractId, abi) => {
  return new CONTRACT(contractId, algodClient, indexerClient, abi, acc);
};
