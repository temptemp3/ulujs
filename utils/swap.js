import algosdk from "algosdk";
import BigNumber from "bignumber.js";
import { abi } from "../index.js";
import { makeBuilder, makeCtc } from "./contract.js";

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

export const swap = async (contractInstance, addr, poolId, A, B) => {
  if (!addr || !poolId || !A.amount || !B.decimals) {
    return {
      success: false,
      error: "Invalid arguments",
    };
  }
  try {
    const acc = {
      addr,
      sk: new Uint8Array(0),
    };
    const contracts = {
      tokA: { contractId: A.contractId, abi: abi.nt200 },
      tokB: { contractId: B.contractId, abi: abi.nt200 },
      pool: { contractId: poolId, abi: abi.swap },
    };
    const builder = makeBuilder(contractInstance, acc, contracts);
    const [ciTokA, ciTokB, ciPool, ci] = [
      [A.contractId, abi.arc200],
      [B.contractId, abi.arc200],
      [poolId, abi.swap],
      [poolId, abi.custom],
    ].map(([contractId, abi]) =>
      makeCtc(contractInstance, acc, contractId, abi)
    );
    const infoR = await Info(contractInstance);
    if (!infoR.success) {
      throw new Error("Info failed");
    }
    const info = infoR.returnValue;
    if (
      !(
        (info.tokA === A.contractId && info.tokB === B.contractId) ||
        (info.tokA === B.contractId && info.tokB === A.contractId)
      )
    ) {
      throw new Error("Invalid pair");
    }
    const swapAForB = A.contractId == info.tokA && B.contractId == info.tokB;
    const decAR = await ciTokA.arc200_decimals();
    if (!decAR.success) {
      console.log("decA failed");
      return;
    }
    const decA = Number(decAR.returnValue);
    const amtBi = BigInt(
      new BigNumber(A.amount).times(new BigNumber(10).pow(decA)).toFixed(0)
    );

    const balAR = await ciTokA.arc200_balanceOf(acc.addr);
    if (!balAR.success) {
      throw new Error("balA failed");
    }
    const balA = balAR.returnValue;
    const balBR = await ciTokB.arc200_balanceOf(acc.addr);
    if (!balBR.success) {
      throw new Error("balB failed");
    }
    const balB = balBR.returnValue;
    if (!A.tokenId && amtBi > balA) {
      throw new Error(
        `Swap abort insufficient ${A.symbol} balance (${new BigNumber(
          (balA - amtBi).toString()
        )
          .dividedBy(new BigNumber(10).pow(Number(decA)))
          .toFixed(Math.min(3, Number(decA)))} ${A.symbol})`
      );
    }
    let customR;
    for (const p4 of [0, 1]) {
      // 0 is withdraw with optin, 1 is withdraw without optin
      // when swap out token is a vsa, optin before withraw
      for (const p3 of [0, 28500]) {
        // 0 is deposit vsa without pmt, 28500 is deposit vsa with pmt
        // when swap in token is a vsa or wvoi, deposit with pmt
        for (const p2 of [0, 28500]) {
          // 0 is do not ensure balance, 28500 is ensure balance
          // when swap out token balance does not exist ensure it
          for (const p1 of [0, 28100]) {
            // 0 is do not approve, 28100 is approve
            // when swap in token approval does not exist pay for
            // approval box
            const buildO = [];
            // -------------------------------------------
            // if vsa in
            //   1 axfer x
            //   1 deposit x
            // -------------------------------------------
            if (
              A.tokenId !== "0" &&
              !isNaN(Number(A.tokenId)) &&
              Number(A.tokenId) > 0
            ) {
              const { obj } = await builder.tokA.deposit(amtBi);
              const payment = p3;
              const aamt = amtBi;
              const xaid = Number(A.tokenId);
              const txnO = {
                ...obj,
                xaid,
                aamt,
                payment,
                note: new TextEncoder().encode(
                  `Deposit ${new BigNumber(amtBi.toString()).dividedBy(
                    new BigNumber(10).pow(Number(decA)).toFixed(Number(decA))
                  )} ${
                    A.symbol
                  } to application address ${algosdk.getApplicationAddress(
                    A.contractId
                  )} from user address ${acc.addr}`
                ),
              };
              buildO.push(txnO);
            }
            // -------------------------------------------
            // if voi/wvoi in
            //   1 pmt x
            //   1 deposit x
            // -------------------------------------------
            if (A.tokenId === "0") {
              // if (p3 > 0) {
              //   const obj0 = (await builder.tokA.createBalanceBox(acc.addr))
              //     .obj;
              //   const payment = p3;
              //   console.log({ obj0, payment });
              //   buildO.push({ ...obj0, payment });
              // }
              const { obj } = await builder.tokA.deposit(amtBi);
              const payment = amtBi;
              const note = new TextEncoder().encode(
                `Deposit ${new BigNumber(amtBi.toString()).dividedBy(
                  new BigNumber(10).pow(Number(decA)).toFixed(Number(decA))
                )} ${
                  A.symbol
                } to application address ${algosdk.getApplicationAddress(
                  A.contractId
                )} from user address ${acc.addr}`
              );
              const txnO = {
                ...obj,
                payment,
                note,
              };
              buildO.push(txnO);
            }
            // -------------------------------------------
            // 1 pmt 28100
            // 1 approve x
            // -------------------------------------------
            do {
              const { obj } = await builder.tokA.arc200_approve(
                algosdk.getApplicationAddress(poolId),
                amtBi
              );
              const payment = p1;
              const note = new TextEncoder().encode(
                `Approve ${new BigNumber(amtBi.toString()).dividedBy(
                  new BigNumber(10).pow(Number(decA)).toFixed(Number(decA))
                )} ${
                  A.symbol
                } to application address ${algosdk.getApplicationAddress(
                  poolId
                )} from user address ${acc.addr}`
              );
              const txnO = {
                ...obj,
                payment,
                note,
              };
              buildO.push(txnO);
            } while (0);
            // -------------------------------------------
            // 2 pmt 28500
            // 2 transfer 0
            // -------------------------------------------
            if (p2 > 0) {
              const { obj } = await builder.tokB.arc200_transfer(
                algosdk.getApplicationAddress(poolId),
                0
              );
              const payment = p2;
              const note = new TextEncoder().encode(
                `Transfer 0 ${
                  B.symbol
                } to application address ${algosdk.getApplicationAddress(
                  poolId
                )} from user address ${acc.addr}`
              );
              const txnO = {
                ...obj,
                payment,
                note,
              };
              buildO.push(txnO);
            }
            // -------------------------------------------
            // 3 swap
            // -------------------------------------------
            let whichOut;
            do {
              ciPool.setFee(4000); // fee to simulate swap
              const swapMethod = swapAForB
                ? "Trader_swapAForB"
                : "Trader_swapBForA";
              const sim = await ciPool[swapMethod](1, amtBi, 0);
              if (!sim.success) {
                throw new Error("sim failed");
              }
              const [outA, outB] = sim.returnValue;
              whichOut = swapAForB ? outB : outA;
              if (whichOut === BigInt(0)) {
                throw new Error("Swap abort no return");
              }
              const { obj } = await builder.pool[swapMethod](
                0,
                amtBi,
                whichOut
              );
              const outBSU = new BigNumber(whichOut).dividedBy(
                new BigNumber(10).pow(Number(B.decimals))
              );
              const rateSU = outBSU.dividedBy(new BigNumber(A.amount));
              const note = new TextEncoder().encode(
                `Swap ${A.amount} ${A.symbol} for ${outBSU.toFixed(
                  Number(B.decimals)
                )} ${B.symbol} (rate = ${rateSU.toFixed(6)} ${B.symbol}/${
                  A.symbol
                }) from application address ${algosdk.getApplicationAddress(
                  poolId
                )} to user address ${acc.addr}`
              );
              const txnO = {
                ...obj,
                note,
              };
              buildO.push(txnO);
            } while (0);
            // -------------------------------------------
            // if voi/wvoi/vsa out
            //   1 withdraw y
            // -------------------------------------------
            if (!isNaN(Number(B.tokenId)) && Number(B.tokenId) >= 0) {
              const { obj } = await builder.tokB.withdraw(whichOut);
              const note = new TextEncoder().encode(
                `Withdraw ${new BigNumber(whichOut).dividedBy(
                  new BigNumber(10)
                    .pow(Number(B.decimals))
                    .toFixed(Number(B.decimals))
                )} ${B.symbol}
                   from application address ${algosdk.getApplicationAddress(
                     B.contractId
                   )} to user address ${acc.addr}`
              );
              const txnO =
                p4 > 0 && Number(B.tokenId) > 0
                  ? {
                      ...obj,
                      xaid: Number(B.tokenId),
                      snd: acc.addr,
                      arcv: acc.addr,
                      note,
                    }
                  : {
                      ...obj,
                      note,
                    };
              buildO.push(txnO);
            }
            // -------------------------------------------
            ci.setFee(4000); // fee for custom
            ci.setExtraTxns(buildO);
            ci.setEnableGroupResourceSharing(true);
            const accounts = [algosdk.getApplicationAddress(poolId)];
            if (!isNaN(Number(A.tokenId)) && Number(A.tokenId) > 0) {
              accounts.push(algosdk.getApplicationAddress(A.contractId));
            }
            if (!isNaN(Number(B.tokenId)) && Number(B.tokenId) > 0) {
              accounts.push(algosdk.getApplicationAddress(B.contractId));
            }
            ci.setAccounts(accounts);
            customR = await ci.custom();
            if (!customR.success) {
              console.log(`custom failed skipping (${p1},${p2},${p3},${p4})`);
              continue;
            }
            console.log(`custom success (${p1},${p2},${p3},${p4})`);
            return {
              ...customR,
              objs: buildO,
            };
          }
          if (customR.success) break;
        }
        if (customR.success) break;
      }
    }
    throw new Error("custom failed end");
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e.message,
    };
  }
};

export const rate = (info) => {
  const { poolBals } = info;
  const { A: poolA, B: poolB } = poolBals;
  const poolASU = new BigNumber(poolA).dividedBy(
    new BigNumber(10).pow(Number(decA))
  );
  const poolBSU = new BigNumber(poolB).dividedBy(
    new BigNumber(10).pow(Number(decB))
  );
  const rate = poolBSU.dividedBy(poolASU).toNumber();
  return rate;
};
