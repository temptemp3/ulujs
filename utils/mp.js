import algosdk from "algosdk";
import { uluClient } from "../utils/contract.js";
import abi from "../abi/index.js";

const zeroAddress =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";

const decodeRoyalties = (royalties) => {
  const buf = Buffer.from(royalties, "base64");
  const royaltyPoints = buf.slice(0, 2).readUInt16BE(0);
  const creator1Points = buf.slice(2, 4).readUInt16BE(0);
  const creator2Points = buf.slice(4, 6).readUInt16BE(0);
  const creator3Points = buf.slice(6, 8).readUInt16BE(0);
  const creator1Address = algosdk.encodeAddress(buf.slice(8, 8 + 32 * 1));
  const creator2Address = algosdk.encodeAddress(buf.slice(8 + 32, 8 + 32 * 2));
  const creator3Address = algosdk.encodeAddress(
    buf.slice(8 + 32 * 2, 8 + 32 * 3)
  );
  const creatorAddressCount = [
    creator1Address,
    creator2Address,
    creator3Address,
  ].filter((addr) => addr !== zeroAddress).length;
  const royaltyPercent = (royaltyPoints / 10000) * 100;
  return {
    royaltyPercent,
    royaltyPoints,
    creator1Address,
    creator2Address,
    creator3Address,
    creator1Points,
    creator2Points,
    creator3Points,
    creatorAddressCount,
  };
};

/*
 * ensureBalance
 * - ensure balance
 * @param ci: contract instance
 * @param addr: address
 * @returns: ensure balance
 */
const ensureBalance = async (ci, addr) => {
  let ensureBalance = false;
  do {
    if (listing.currency === 0) break; // abort if VOI
    const res = await ci.arc200_transfer(addr, 0);
    if (res.success) break;
    ci.setPaymentAmount(28500);
    const res2 = await ci.arc200_transfer(addr, 0);
    if (res2.success) ensureBalance = true;
  } while (0);
  return ensureBalance;
};

/*
 * ensureApproval
 * - ensure approval
 * @param ci: contract instance
 * @param spender: spender
 * @param amount: amount
 * @returns: ensure approval
 **/
const ensureARC200Approval = async (ci, spender, amount) => {
  let ensureApproval = false;
  do {
    if (listing.currency === 0) break; // abort if VOI
    const res = await ci.arc200_approve(spender, BigInt(amount));
    if (res.success) break;
    ciPTok.setPaymentAmount(28100);
    const res2 = await ci.arc200_approve(spender, BigInt(amount));
    if (res2.success) {
      ensureApproval = true;
    }
  } while (0);
  return ensureApproval;
};

/*
 * ensureARC72Approval
 * - ensure arc72 approval
 * @param ci: contract instance
 * @param spender: spender
 * @param tokenId: token id
 * @returns: ensure arc72 approval
 */
const ensureARC72Approval = async (ci, spender, tokenId) => {
  let ensureApproval = false;
  do {
    const res = await ci.arc72_approve(spender, tokenId);
    if (res.success) break;
    ci.setPaymentAmount(28500);
    const res2 = await ci.arc72_approve(spender, tokenId);
    if (res2.success) {
      ensureApproval = true;
    }
  } while (0);
  return ensureApproval;
};

/*
 * ensureAccountBalance
 * - ensure account balance
 * @param algodClient: algod client
 * @param addr: address
 * @param minAvailableBalance: min available balance
 * @returns: ensure account balance
 */
const ensureAccountBalance = async (algodClient, addr, minAvailableBalance) => {
  let ensureAccountBalance = false;
  do {
    const accInfo = await algodClient.accountInformation(addr).do();
    const amount = accInfo.amount;
    const minBalance = accInfo["min-balance"];
    const availableBalance = amount - minBalance;
    if (availableBalance < minAvailableBalance) {
      ensureAccountBalance = true;
    }
  } while (0);
  return ensureAccountBalance;
};

/*
 * list
 * - list nft on marketplace
 * @param addr: address
 * @param token: token
 * @param price: price
 * @param currency: currency
 * @param opts: options
 */
export const list = async (addr, token, price, currency, opts) => {
  try {
    const minFee = 4000;

    const priceBi = BigInt(priceBn);

    const currencySymbol = currency.symbol;

    const { algodClient, indexerClient } = opts;

    const metadata = JSON.parse(token.metadata || "{}");

    const royalties = metadata?.royalties;

    const royaltyInfo = royalties;

    const createAddr1 = royaltyInfo?.creator1Address || zeroAddress;
    const createAddr2 = royaltyInfo?.creator2Address || zeroAddress;
    const createAddr3 = royaltyInfo?.creator3Address || zeroAddress;

    const ctcAddr = algosdk.getApplicationAddress(opts.mpContractId);

    const uc = new uluClient(algodClient, indexerClient, addr);

    const ci = uc.makeCI(opts.mpContractId, abi.custom);
    const ciPTok = uc.makeCI(opts.paymentTokenId, abi.arc200);
    const ciWVOI = uc.makeCI(opts.wrappedNetworkTokenId, abi.nt200);
    const ciNFT = uc.makeCI(Number(token.contractId), abi.arc72);
    const ciMP = uc.makeCI(opts.mpContractId, abi.mp);

    const managerR = await ciMP.manager();
    if (!managerR.success) throw new Error("manager failed in simulate");
    const manager = managerR.returnValue;

    const builder = {
      tokV: uc.makeConstructor(opts.wrappedNetworkTokenId, abi.nt200),
      tokP: uc.makeConstructor(opts.paymentTokenId, abi.arc200),
      nft: uc.makeConstructor(Number(token.contractId), abi.arc72),
      mp: uc.makeConstructor(opts.mpContractId, abi.mp),
    };

    const ensureMarketplaceBalance = await ensureBalance(ciPTok, ctcAddr);
    const ensureManagerBalance = await ensureBalance(ciPTok, manager);
    const ensureSellerBalance = await ensureBalance(ciPTok, addr);
    const ensureCreator1Balance = await ensureBalance(ciPTok, createAddr1);
    const ensureCreator2Balance = await ensureBalance(ciPTok, createAddr2);
    const ensureCreator3Balance = await ensureBalance(ciPTok, createAddr3);
    const ensureSellerApproval = await ensureARC72Approval(
      ciNFT,
      ctcAddr,
      token.tokenId
    );

    // ------------------------------------------
    // EXTRAS
    // WVOI
    //   createBalanceBox for self
    //   if royalty createBalanceBox for creator1
    //   if royalty createBalanceBox for creator2
    //   if royalty createBalanceBox for creator3
    // CORE
    //   arc72 approve
    //   mp206 listSC or listNet
    // ------------------------------------------
    let customR;
    for (const p1 of /* arc72_approval box pmt */ [0, 1]) {
      // ------------------------------------------
      // EXTRAS
      // ------------------------------------------
      const buildN = opts.extraTxns || [];
      // ------------------------------------------
      // WVOI
      // ------------------------------------------
      // createBalanceBox for self
      // if royalty createBalanceBox for creator1
      if (royaltyInfo?.creator1Address && ensureCreator1Balance) {
        const res = await builder.tokP.arc200_transfer(createAddr1, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure creator1 balance
          `),
          ignore: true,
        });
      }
      // if royalty createBalanceBox for creator2
      if (royaltyInfo?.creator2Address) {
        const res = await builder.tokP.arc200_transfer(createAddr2, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure creator2 balance
          `),
          ignore: true,
        });
      }
      // if royalty createBalanceBox for creator3
      if (royaltyInfo?.creator3Address) {
        const res = await builder.tokP.arc200_transfer(createAddr3, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure creator3 balance
          `),
          ignore: true,
        });
      }
      // ------------------------------------------
      // CORE
      // ------------------------------------------
      // arc72 approve
      const arc72_approveR = await builder.arc72.arc72_approve(
        algosdk.getApplicationAddress(ctcInfoMp206),
        token.tokenId
      );
      if (!arc72_approveR.success)
        throw new Error("arc72_approve failed in simulate");
      buildN.push({
        ...arc72_approveR.obj,
        payment: p1 > 0 ? 28500 : 0,
        note: new TextEncoder().encode(`
        arc72_approve ${token.tokenId} for ${addr}
        `),
      });
      // mp206 listSC
      const paymentTokenId = opts.paymentTokenId || 0;
      const endTime = opts.endTime || Number.MAX_SAFE_INTEGER;
      const royalties = opts.enforceRoyalties
        ? Math.min(nft?.royalties?.royaltyPoints || 0, 9500)
        : 0; // RoyaltyPoints
      const createPoints1 = opts.enforceRoyalties
        ? nft?.royalties?.creator1Points || 0
        : 0; // CreatePoints1
      const createPoints2 = opts.enforceRoyalties
        ? nft?.royalties?.creator2Points || 0
        : 0; // CreatePoints1
      const createPoints3 = opts.enforceRoyalties
        ? nft?.royalties?.creator3Points || 0
        : 0; // CreatePoints1
      const createAddr1 = opts.enforceRoyalties
        ? nft?.royalties?.creator1Address || zeroAddress
        : zeroAddress; // CreatePoints1
      const createAddr2 = opts.enforceRoyalties
        ? nft?.royalties?.creator2Address || zeroAddress
        : zeroAddress; // CreatePoints1
      const createAddr3 = opts.enforceRoyalties
        ? nft?.royalties?.creator3Address || zeroAddress
        : zeroAddress; // CreatePoints1
      if (paymentTokenId > 0) {
        const a_sale_listSCR = await builder.mp.a_sale_listSC(
          token.contractId,
          token.tokenId,
          paymentTokenId,
          priceBi,
          endTime,
          royalties,
          createPoints1,
          createPoints2,
          createPoints3,
          createAddr1,
          createAddr2,
          createAddr3
        );
        const noteRoyalties = opt.enforceRoyalties
          ? `royalties: ${(royalties / 10000) * 100}`
          : "";
        buildN.push({
          ...a_sale_listSCR.obj,
          payment: ListingBoxCost,
          note: new TextEncoder().encode(`
          a_sale_listSC contractId: nft: ${
            nft.metadata.name
          } listPrice: ${new BigNumber(priceBi.toString()).dividedBy(
            new BigNumber(10).pow(token.decimals).toFixed(token.decimals)
          )} ${token.symbol}  ${noteRoyalties}
          `),
        });
      } else {
        const a_sale_listNetR = await builder.mp.a_sale_listNet(
          token.contractId,
          token.tokenId,
          priceBi,
          endTime,
          royalties,
          createPoints1,
          createPoints2,
          createPoints3,
          createAddr1,
          createAddr2,
          createAddr3
        );
        const noteRoyalties = opt.enforceRoyalties
          ? `royalties: ${(royalties / 10000) * 100}`
          : "";
        buildN.push({
          ...a_sale_listNetR.obj,
          payment: ListingBoxCost,
          note: new TextEncoder().encode(`
          a_sale_listNet contractId: nft: ${
            nft.metadata.name
          } listPrice: ${new BigNumber(priceBi.toString()).dividedBy(
            new BigNumber(10).pow(token.decimals).toFixed(token.decimals)
          )} ${token.symbol} ${noteRoyalties}
          `),
        });
      }
      ci.setEnableGroupResourceSharing(true);
      ci.setFee(minFee);
      ci.setExtraTxns(buildN);
      customR = {
        ...(await ci.custom()),
        objs: buildN,
      };
      if (customR.success) break;
    }
    console.log({ customR });
    return customR;
  } catch (e) {
    return { success: false, error: e.message };
  }
};

/*
 * buy
 * - buy nft from marketplace
 * @param addr: address
 * @param listing: listing
 * @param currency: currency
 * @param opts: options
 */
export const buy = async (addr, listing, currency, opts) => {
  try {
    const minFee = 8000;

    const currencySymbol = currency.symbol;

    const { algodClient, indexerClient } = opts;

    const metadata = JSON.parse(listing.token?.metadata || "{}");

    const royalties = metadata?.royalties
      ? decodeRoyalties(metadata?.royalties || "")
      : null;

    const royaltyInfo = royalties;
    const createAddr1 = royaltyInfo?.creator1Address || zeroAddress;
    const createAddr2 = royaltyInfo?.creator2Address || zeroAddress;
    const createAddr3 = royaltyInfo?.creator3Address || zeroAddress;

    const ctcAddr = algosdk.getApplicationAddress(listing.mpContractId);

    const uc = new uluClient(algodClient, indexerClient, addr);

    const ci = uc.makeCI(listing.mpContractId, abi.custom);

    const ciMP = uc.makeCI(listing.mpContractId, abi.mp);

    const managerR = await ciMP.manager();
    if (!managerR.success) throw new Error("manager failed in simulate");
    const manager = managerR.returnValue;

    const ciWVOI = uc.makeCI(opts.wrappedNetworkTokenId, abi.nt200);

    const wVOIBalanceR = await ciWVOI.arc200_balanceOf(addr);
    if (!wVOIBalanceR.success)
      throw new Error("wVOI balance failed in simulate");
    const wVOIBalance = wVOIBalanceR.returnValue;

    const builder = {
      tokV: uc.makeConstructor(opts.wrappedNetworkTokenId, abi.nt200),
      tokP: uc.makeConstructor(opts.paymentTokenId, abi.arc200),
      nft: uc.makeConstructor(Number(listing.token.contractId), abi.arc72),
      mp: uc.makeConstructor(listing.mpContractId, abi.mp),
    };

    // make pTok
    const ciPTok = uc.makeCI(opts.paymentTokenId, abi.arc200);

    const [
      ensureMarketplaceBalance,
      ensureManagerBalance,
      ensureSellerBalance,
      ensureCreator1Balance,
      ensureCreator2Balance,
      ensureCreator3Balance,
    ] = await Promise.all(
      [
        ctcAddr,
        manager,
        listing.seller,
        createAddr1,
        createAddr2,
        createAddr3,
      ].map((addr) => ensureBalance(ciPTok, addr))
    );

    const ensureBuyerApproval = await ensureARC200Approval(
      ciPTok,
      ctcAddr,
      Number(listing.price)
    );

    const ensureCollectionBalance = await ensureAccountBalance(
      algosdk.getApplicationAddress(Number(listing.collectionId)),
      28500
    );

    // -----------------------------------------
    // ensure
    //   ensure marketplace balance
    //   ensure manager balance
    //   ensure seller balance
    //   ensure creator1 balance
    //   ensure creator2 balance
    //   ensure creator3 balance
    //   ensure buyer approval
    //   ensure collection balance
    //     send payment to collection
    // VOI sale for x
    //   if buyNet and bal(wvoi) > 0
    //     withdraw VOI max(x, bal(wvoi)) as y
    //   mp sale buyNet listId with pmt x
    // SC sale for x
    //   if WVOI
    //     deposit VOI x
    //   if buySC
    //     create balance box for mp
    //     create balance box for seller
    //     if creator1 not zero
    //       create balance box for creator1
    //     if creator2 not zero
    //       create balance box for creator2
    //     if creator3 not zero
    //       create balance box for creator3
    //     arc200 approve x
    //   mp sale buySC listId
    // -----------------------------------------

    let customR;
    for (const p1 of [1]) {
      const buildN = opts.extraTxns || [];

      // ensure marketplace balance
      if (ensureMarketplaceBalance) {
        const res = await builder.tokP.arc200_transfer(ctcAddr, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure marketplace balance
          `),
          ignore: true,
        });
      }

      // ensure manager balance
      if (ensureManagerBalance) {
        const res = await builder.tokP.arc200_transfer(manager, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure manager balance
          `),
          ignore: true,
        });
      }

      // ensure seller balance
      if (ensureSellerBalance) {
        const res = await builder.tokP.arc200_transfer(listing.seller, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure seller balance
          `),
          ignore: true,
        });
      }

      // ensure creator1 balance
      if (ensureCreator1Balance) {
        const res = await builder.tokP.arc200_transfer(createAddr1, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure creator1 balance
          `),
          ignore: true,
        });
      }

      // ensure creator2 balance
      if (ensureCreator2Balance) {
        const res = await builder.tokP.arc200_transfer(createAddr2, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure creator2 balance
          `),
          ignore: true,
        });
      }

      // ensure creator3 balance
      if (ensureCreator3Balance) {
        const res = await builder.tokP.arc200_transfer(createAddr3, 0);
        buildN.push({
          ...res.obj,
          payment: 28500,
          paymentNote: new TextEncoder().encode(`
          arc200_transfer ensure creator3 balance
          `),
          ignore: true,
        });
      }

      // ensure collection balance
      if (ensureCollectionBalance) {
        const res = await builder.nft.arc72_setApprovalForAll(
          zeroAddress,
          true
        );
        buildN.push({
          ...res.obj,
          payment: 100000,
          paymentNote: new TextEncoder().encode(`
          custom payment for nft collection box
          `),
          ignore: true,
        });
      }

      const priceBi = BigInt(listing.price);

      // if buyNet and bal(wvoi) > 0
      if (listing.currency === 0 && wVOIBalance > BigInt(0)) {
        const withdrawAmount = priceBi <= wVOIBalance ? priceBi : wVOIBalance;
        const withdrawAmountSU = Number(withdrawAmount) / 10 ** 6;
        const txnO = await builder.tokV.withdraw(withdrawAmount);
        buildN.push({
          ...txnO.obj,
          note: new TextEncoder().encode(`
          withdraw
          amount: ${withdrawAmountSU} ${currencySymbol}
        `),
        });
      }

      // if buySC
      if (listing.currency > 0) {
        // if WVOI
        //   deposit VOI x
        do {
          if (currency?.tokenId === "0" && wVOIBalance < priceBi) {
            const depositAmount = priceBi - wVOIBalance;
            const txnO = await builder.tokV.deposit(depositAmount);
            buildN.push({
              ...txnO.obj,
              payment: depositAmount,
            });
          }
        } while (0);

        // arc200 approve x
        const txnO = await builder.tokP.arc200_approve(
          ctcAddr,
          BigInt(listing.price)
        );
        buildN.push({
          ...txnO.obj,
          payment: ensureBuyerApproval ? 28100 : 0,
          note: new TextEncoder().encode(`
          arc200_approve
          spender: ${ctcAddr}
          amount: ${BigInt(listing.price).toString()} ${currencySymbol}
        `),
        });
      }

      // call a_sale_buy
      if (listing.currency === 0) {
        // mp sale buyNet listId with pmt x
        const txnO = await builder.mp.a_sale_buyNet(listing.mpListingId);
        buildN.push({
          ...txnO.obj,
          payment: priceBi,
          note: new TextEncoder().encode(`
          a_sale_buyNet
          nft: ${metadata.name}
          price: ${BigInt(listing.price).toString()} ${currencySymbol}
        `),
        });
      } else {
        // mp sale buySC listId
        const txnO = await builder.mp.a_sale_buySC(listing.mpListingId);
        buildN.push({
          ...txnO.obj,
          note: new TextEncoder().encode(`
          a_sale_buySC
          nft: ${metadata.name}
          price: ${BigInt(listing.price).toString()} ${currencySymbol}
        `),
        });
      }
      ci.setFee(minFee);
      ci.setEnableGroupResourceSharing(true);
      ci.setExtraTxns(buildN);
      customR = {
        ...(await ci.custom()),
        objs: buildN,
      };
      if (customR.success) break;
    }
    return customR;
  } catch (e) {
    return { success: false, error: e.message };
  }
};
