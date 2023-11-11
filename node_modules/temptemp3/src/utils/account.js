/*
 * zeroAddress is the address of the account that holds 0 ALGOs and
 * cannot send transactions.
 */
export const zeroAddress =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";

/*
 * oneAddress is the address of the account that holds more
 * more than 0 ALGOs. This account is used to allow for simulation.
 */
export const oneAddress = 
  "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ";

/*
 * getAccountInfo
 * - get account info
 * @param algodClient: algod client
 * @param addr: address to check
 * @returns: account info
 */
export const getAccountInfo = async (algodClient, addr) =>
  await algodClient.accountInformation(addr).do();
