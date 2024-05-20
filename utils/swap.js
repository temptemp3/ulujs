/*
 * Info
 * - get info
 * @param contractInstance: contract instance
 * @returns: info
 * @note: info = [lptBals, poolBals, protoInfo, protoBals, tokB, tokA]
 * @note: protoInfo = [protoFee, lpFee, totFee, protoAddr, locked]
 * @note: protoBals = [protoA, protoB]
 * @note: tokB: token B balance
 * @note: tokA: token A balance
 * @note: lptBals: liquidity provider token balances
 * @note: poolBals: pool token balances
 */
export const Info = async (contractInstance) => {
  const infoR = await contractInstance.Info();
  if (!infoR.success) return infoR;
  const [lptBals, poolBals, protoInfo, protoBals, tokB, tokA] =
    infoR.returnValue;
  const [protoFee, lpFee, totFee, protoAddr, locked] = protoInfo;
  return {
    success: true,
    returnValue: {
      lptBals: (([lpHeld, lpMinted]) => ({ lpHeld, lpMinted }))(
        lptBals.map(String)
      ),
      poolBals: (([A, B]) => ({ A, B }))(poolBals.map(String)),
      protoInfo: {
        protoFee: Number(protoFee),
        lpFee: Number(lpFee),
        totFee: Number(totFee),
        protoAddr,
        locked,
      },
      protoBals: (([A, B]) => ({ A, B }))(protoBals.map(String)),
      tokB: Number(tokB),
      tokA: Number(tokA),
    },
  };
};
