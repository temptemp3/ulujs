import algosdk from "algosdk";
import BigNumber from "bignumber.js";
import { abi, swap as Contract } from "../index.js";
import { makeBuilder, makeCtc } from "./contract.js";

export const decodeSwapEvent = (event) => {
  const [txId, round, ts, who, inBals, outBals, poolBals] = event;
  return {
    txId,
    round,
    ts,
    who,
    inBals: (([A, B]) => ({ A, B }))(inBals.map(String)),
    outBals: (([A, B]) => ({ A, B }))(outBals.map(String)),
    poolBals: (([A, B]) => ({ A, B }))(poolBals.map(String)),
  };
};

export const decodeWithdrawEvent = (event) => {
  const [txId, round, ts, who, lpIn, outBals, poolBals] = event;
  return {
    txId,
    round,
    ts,
    who,
    lpIn: String(lpIn),
    outBals: (([A, B]) => ({ A, B }))(outBals.map(String)),
    poolBals: (([A, B]) => ({ A, B }))(poolBals.map(String)),
  };
};

export const decodeDepositEvent = (event) => {
  const [txId, round, ts, who, inBals, lpOut, poolBals] = event;
  return {
    txId,
    round,
    ts,
    who,
    inBals: (([A, B]) => ({ A, B }))(inBals.map(String)),
    lpOut: String(lpOut),
    poolBals: (([A, B]) => ({ A, B }))(poolBals.map(String)),
  };
};

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

export const swap = async (contractInstance, addr, poolId, A, B, extraTxns =[]) => {
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
    for (const p4 of [1, 0]) {
      // 0 is withdraw with optin, 1 is withdraw without optin
      // when swap out token is a vsa, optin before withraw
      for (const p3 of [28500, 0]) {
        // 0 is deposit vsa without pmt, 28500 is deposit vsa with pmt
        // when swap in token is a vsa or wvoi, deposit with pmt
        for (const p2 of [28501, 0]) {
          // 0 is do not ensure balance, 28500 is ensure balance
          // when swap out token balance does not exist ensure it
          for (const p1 of [28100, 0]) {
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
              if (p3 > 0) {
                const obj0 = (await builder.tokA.createBalanceBox(acc.addr))
                  .obj;
                const payment = p3;
                buildO.push({ ...obj0, payment });
              }
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
            ci.setExtraTxns([...buildO, ...extraTxns]);
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

export const deposit = async (
  contractInstance,
  addr,
  poolId,
  A,
  B,
  extraTxns = [],
  opts = { debug: true }
) => {
  if (!addr || !poolId || !A.amount || !B.amount) {
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

    // if (!infoR.success) {
    //   throw new Error("Info failed");
    // }
    // const info = infoR.returnValue;
    // if (
    //   !(
    //     (info.tokA === A.contractId && info.tokB === B.contractId) ||
    //     (info.tokA === B.contractId && info.tokB === A.contractId)
    //   )
    // ) {
    //   throw new Error("Invalid pair");
    // }

    const symbolAR = await ciTokA.arc200_symbol();
    if (!symbolAR.success) {
      throw new Error("symbolA failed");
    }
    const symbolA = symbolAR.returnValue;

    const symbolBR = await ciTokB.arc200_symbol();
    if (!symbolBR.success) {
      throw new Error("symbolB failed");
    }
    const symbolB = symbolBR.returnValue;

    const decAR = await ciTokA.arc200_decimals();
    if (!decAR.success) {
      throw new Error("decA failed");
    }
    const decA = Number(decAR.returnValue);

    const amtAi = BigInt(
      new BigNumber(A.amount).times(new BigNumber(10).pow(decA)).toFixed(0)
    );

    const decBR = await ciTokB.arc200_decimals();
    if (!decBR.success) {
      console.log("decB failed");
      return;
    }
    const decB = Number(decBR.returnValue);

    const amtBi = BigInt(
      new BigNumber(B.amount).times(new BigNumber(10).pow(decB)).toFixed(0)
    );

    const balAR = await ciTokA.arc200_balanceOf(acc.addr);
    if (!balAR.success) {
      throw new Error("balA failed");
    }
    const balA = balAR.returnValue;

    // TODO should ignore for wrapped asset
    // if (A.tokenId !== "0" && amtAi > balA) {
    //   throw new Error(
    //     `Deposit abort insufficient ${A.symbol} balance (${new BigNumber(
    //       (balA - amtAi).toString()
    //     )

    //       .dividedBy(new BigNumber(10).pow(Number(decA)))
    //       .toFixed(Math.min(3, Number(decA)))} ${A.symbol})`
    //   );
    // }

    const balBR = await ciTokB.arc200_balanceOf(acc.addr);
    if (!balBR.success) {
      throw new Error("balB failed");
    }
    const balB = balBR.returnValue;

    // TODO should ignore for wrapped asset
    // if (B.tokenId !== "0" && amtBi > balB) {
    //   throw new Error(
    //     `Deposit abort insufficient ${B.symbol} balance (${new BigNumber(
    //       (balB - amtBi).toString()
    //     )
    //       .dividedBy(new BigNumber(10).pow(Number(decB)))
    //       .toFixed(Math.min(3, Number(decB)))} ${B.symbol})`
    //   );
    // }

    // calculate new allowances
    const arc200_allowanceAR = await ciTokA.arc200_allowance(
      acc.addr,
      algosdk.getApplicationAddress(poolId)
    );
    if (!arc200_allowanceAR.success)
      throw new Error("Abort allowance no return");
    const arc200_allowanceA = arc200_allowanceAR.returnValue;
    const newArc200_allowanceA = arc200_allowanceA + amtAi;
    const arc200_allowanceBR = await ciTokB.arc200_allowance(
      acc.addr,
      algosdk.getApplicationAddress(poolId)
    );
    if (!arc200_allowanceBR.success)
      throw new Error("Abort allowance no return");
    const arc200_allowanceB = arc200_allowanceBR.returnValue;
    const newArc200_allowanceB = arc200_allowanceB + amtBi;

    ciPool.setFee(4000);
    const simR = await ciPool.Provider_deposit(1, [amtAi, amtBi], 0);
    if (infoR.success && !simR.success)
      throw new Error("Abort deposit no return");

    const payments = [];
    for (const p6 of [1,0]) { 
    for (const p5 of /*first deplosit*/ [0, 1]) {
      for (const p4 of /*tokA vsa deposit*/ [0, 28500]) {
        for (const p3 of /*tokB vsa deposit */ [0, 28501]) {
          for (const p2 of /*tokB approve payment*/ [0, 28100]) {
            for (const p1 of /*tokA approval payment*/ [0, 28101]) {
              const payment = [p1, p2, p3, p4, p5, p6];
              payments.push(payment);
            }
          }
        }
      }
    }
  }

    // move last payment to second payment position
    //const lastPayment = payments.pop();
    //payments.splice(1, 0, lastPayment);

    let customR;
    for (const payment of payments) {
      const [p1, p2, p3, p4, p5, p6] = payment;
      const buildO = [];
      console.log({ p1, p2, p3, p4, p5, p6, A, B });
      // -------------------------------------------
      // if new pool
      // -------------------------------------------
      if (!infoR.success) {
        const name = `ARC200 LP - ${symbolA}/${symbolB}`;
        const symbol = "ARC200LT";
        const CTCINFO_TRI = 389316; // TODO accept as tri option
        const ZERO_ADDRESS =
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";
        const _reachp_0_params = [
          0,
          [
            [
              [
                ...new Uint8Array(Buffer.from(name)),
                ...new Uint8Array(32 - name.length),
              ],
              [
                ...new Uint8Array(Buffer.from(symbol)),
                ...new Uint8Array(8 - symbol.length),
              ],
            ],
            [CTCINFO_TRI, A.contractId, B.contractId],
            ZERO_ADDRESS,
          ],
        ];
        const msg = `Deploy pool ${name}`;
        const note = new TextEncoder().encode(msg);
        const { obj } = await builder.pool._reachp_0(_reachp_0_params);
        buildO.push({
          ...obj,
          payment: 1e6,
          note
        });
      }
      // -------------------------------------------
      // if first deposit
      // -------------------------------------------
      do {
        if (p5 > 0) {
          const res = await builder.tokA.arc200_transfer(
            algosdk.getApplicationAddress(poolId),
            0
          );
          const res2 = await builder.tokB.arc200_transfer(
            algosdk.getApplicationAddress(poolId),
            0
          );
          const msg = `Initialize pool ${A.symbol} balances`;
          if(opts.debug) {
            console.log(msg, 28502);
          }
          buildO.push({
            ...res.obj,
            payment: 28502,
            note: new TextEncoder().encode(
              msg
            ),
          });
          const msg2 = `Initialize pool ${B.symbol} balances`;
          if(opts.debug) {
            console.log(msg2, 28502);
          }
          buildO.push({
            ...res2.obj,
            payment: 28502,
            note: new TextEncoder().encode(
              msg2
            ),
          });
        }
      } while (0);
      // -------------------------------------------

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
        const { obj } = await builder.tokA.deposit(amtAi);
        const payment = p4;
        const aamt = amtAi;
        const xaid = Number(A.tokenId);
        const msg = `Deposit ${new BigNumber(amtAi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(A.decimals))
            .toFixed(Number(A.decimals))
        )} ${A.symbol} to application address ${algosdk.getApplicationAddress(
          A.contractId
        )} from user address ${acc.addr}`;
        if(opts.debug) {
          console.log(msg, payment);
        }
        const note = new TextEncoder().encode(
          msg
        );
        const txnO = {
          ...obj,
          xaid,
          aamt,
          payment,
          note,
        };
        buildO.push(txnO);
      }
      // -------------------------------------------
      if (
        B.tokenId !== "0" &&
        !isNaN(Number(B.tokenId)) &&
        Number(B.tokenId) > 0
      ) {
        const { obj } = await builder.tokB.deposit(amtBi);
        const payment = p3;
        const aamt = amtBi;
        const xaid = Number(B.tokenId);
        const msg = `Deposit ${new BigNumber(amtBi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(B.decimals))
            .toFixed(Number(B.decimals))
        )} ${B.symbol} to application address ${algosdk.getApplicationAddress(
          B.contractId
        )} from user address ${acc.addr}`;
        if(opts.debug) {
          console.log(msg, payment);
        }
        const note = new TextEncoder().encode(msg);
        const txnO = {
          ...obj,
          xaid,
          aamt,
          payment,
          note,
        };
        buildO.push(txnO);
      }
      // -------------------------------------
      // if voi/wvoi in
      //   1 pmt x
      //   1 deposit x
      // -------------------------------------------
      if (A.tokenId === "0") {
        // Add box creation
        const msg = `Deposit ${new BigNumber(amtAi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(A.decimals))
            .toFixed(Number(A.decimals))
        )} ${A.symbol} to application address ${algosdk.getApplicationAddress(
          A.contractId
        )} from user address ${acc.addr}`;
        const { obj } = await builder.tokA.deposit(amtAi);
        const payment = amtAi;
        if(opts.debug) {
          console.log(msg, payment);
        }
        const note = new TextEncoder().encode(
          msg 
        );
        const txnO = {
          ...obj,
          payment,
          note,
        };
        buildO.push(txnO);
      }
      if (B.tokenId === "0") {
        // Add box creation
        const { obj } = await builder.tokB.deposit(amtBi);
        const payment = amtBi;
        const msg = `Deposit ${new BigNumber(amtBi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(B.decimals))
            .toFixed(Number(B.decimals))
        )} ${B.symbol} to application address ${algosdk.getApplicationAddress(
          B.contractId
        )} from user address ${acc.addr}`;
        if(opts.debug) {
          console.log(msg, payment);
        }
        const note = new TextEncoder().encode(
          msg
        );
        const txnO = {
          ...obj,
          payment,
          note,
        };
        buildO.push(txnO);
      }
      // -------------------------------------
      // 1 pmt 28100
      // 1 approve x
      // -------------------------------------
      do {
        const { obj } = await builder.tokA.arc200_approve(
          algosdk.getApplicationAddress(poolId),
          newArc200_allowanceA
        );
        const payment = p1;
        const msg = `Approve ${new BigNumber(amtAi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(decA))
            .toFixed(Number(decA))
        )} ${A.symbol} to application address ${algosdk.getApplicationAddress(
          poolId
        )} from user address ${acc.addr}`;
        if(opts.debug) {
          console.log(msg, payment);
        }
        const note = new TextEncoder().encode(msg);
        const txnO = {
          ...obj,
          payment,
          note,
        };
        buildO.push(txnO);
      } while (0);
      // -------------------------------------
      // 1 pmt 28100
      // 1 approve y
      // -------------------------------------
      do {
        const { obj } = await builder.tokB.arc200_approve(
          algosdk.getApplicationAddress(poolId),
          newArc200_allowanceB
        );
        const payment = p2;
        const msg = `Approve ${new BigNumber(amtBi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(decB))
            .toFixed(Number(decB))
        )} ${B.symbol} to application address ${algosdk.getApplicationAddress(
          poolId
        )} from user address ${acc.addr}`;
        if(opts.debug) {
          console.log(msg, payment);
        }
        const note = new TextEncoder().encode(msg);
        const txnO = {
          ...obj,
          payment,
          note,
        };
        buildO.push(txnO);
      } while (0);
      // -------------------------------------
      // deposit
      // -------------------------------------
      do {
        const { obj } = await builder.pool.Provider_deposit(
          0,
          [amtAi, amtBi],
          infoR.success ? simR.returnValue : 0
        );
        const msg = `Provider_deposit ${new BigNumber(amtAi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(decA))
            .toFixed(Number(decA))
        )} ${A.symbol} and ${new BigNumber(amtBi.toString()).dividedBy(
          new BigNumber(10)
            .pow(Number(decB))
            .toFixed(Number(decB))
        )} ${B.symbol} to application address ${algosdk.getApplicationAddress(
          poolId
        )} from user address ${acc.addr}`;
        if(opts.debug) {
          console.log(msg);
        }
        const note = new TextEncoder().encode(msg);
        const txnO = {
          ...obj,
          note,
        };
        buildO.push(txnO);
      } while (0);
      // -------------------------------------
      console.log(buildO, extraTxns);
      //ci.setBeaconId(390001) // wVOI
      //ci.setBeaconSelector("e33d8052"); // touch()void
      ci.setDebug(opts.debug);
      ci.setStep(5); // increase step for grs txns
      ci.setFee(4000); // fee for custom
      //if(p6 > 0) {
      //  ci.setExtraTxns([...extraTxns, ...buildO]);
      //} else {
        ci.setExtraTxns(buildO);
      //}
      ci.setEnableGroupResourceSharing(true);
      //const accounts = [algosdk.getApplicationAddress(poolId)];
      // if (!isNaN(Number(A.tokenId)) && Number(A.tokenId) > 0) {
      //   accounts.push(algosdk.getApplicationAddress(A.contractId));
      // }
      // if (!isNaN(Number(B.tokenId)) && Number(B.tokenId) > 0) {
      //   accounts.push(algosdk.getApplicationAddress(B.contractId));
      // }
      //ci.setAccounts(accounts);
      customR = await ci.custom();
      console.log(customR);
      if (!customR.success) {
        console.log(`custom failed skipping (${p1},${p2})`);
        continue;
      }
      console.log(`custom success (${p1},${p2})`);
      return {
        ...customR,
        objs: buildO,
      };
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

export const rate = (info, mA, mB) => {
  const { poolBals, tokA: pTokA, tokB: pTokB } = info;
  const { A: poolA, B: poolB } = poolBals;
  const mTokA = mA?.tokenId || 0;
  const mTokB = mB?.tokenId || 0;
  const valid =
    (pTokA === mTokA && pTokB === mTokB) ||
    (pTokA === mTokB && pTokB === mTokA);
  if (!valid) {
    return 0;
  }
  const swapAForB = pTokA === mTokA && pTokB === mTokB;
  const [decA, decB] = swapAForB ? [mA?.decimals, mB?.decimals] : [mB?.decimals, mA?.decimals];
  const poolASU = new BigNumber(poolA).dividedBy(
    new BigNumber(10).pow(Number(decA))
  );
  const poolBSU = new BigNumber(poolB).dividedBy(
    new BigNumber(10).pow(Number(decB))
  );
  const rate = swapAForB
    ? poolBSU.dividedBy(poolASU).toNumber()
    : poolASU.dividedBy(poolBSU).toNumber();
  return rate;
};

export const k = (info) => {
  const { poolBals } = info;
  const { A: poolA, B: poolB } = poolBals;
  const poolABN = new BigNumber(poolA);
  const poolBBN = new BigNumber(poolB);
  const k = poolABN.times(poolBBN);
  return k;
};

export const selectPool = async (
  contractInstance,
  pools,
  A,
  B,
  method = "poolId"
) => {
  console.log({ pools, A, B });
  const { algodClient, indexerClient } = contractInstance;
  let pool;
  let maxRate = 0;
  let maxK = new BigNumber(0);
  let minRound = Number.MAX_SAFE_INTEGER;
  let minPoolId = Number.MAX_SAFE_INTEGER;
  for (const p of pools) {
    const { poolId, round } = p;
    const ci = new Contract(poolId, algodClient, indexerClient, abi.swap);
    const infoR = await ci.Info(contractInstance);
    if (!infoR.success) throw new Error("Failed to get pool info");
    const info = infoR.returnValue;
    switch (method) {
      default:
      case "rate": {
        // TODO depreciate
        const exchangeRate = rate(info, A, B);
        console.log({ exchangeRate, rate: exchangeRate });
        if (maxRate < exchangeRate) {
          pool = { ...p, rate: exchangeRate };
          maxRate = exchangeRate;
        }
        break;
      }
      case "k": {
        // TODO depreciate
        const cp = k(info);
        if (maxK.lt(cp)) {
          pool = { ...p, k: cp.toString() };
          maxK = cp;
        }
        break;
      }
      case "round": {
        // TODO depreciate
        if (minRound > round) {
          pool = { ...p, round };
          minRound = round;
        }
        break;
      }
      case "poolId": {
        if (minPoolId > poolId) {
          pool = { ...p, poolId };
          minPoolId = poolId;
        }
      }
    }
  }
  return pool;
};
