import { zeroAddress } from "arccjs";
import { loadStdlib } from "@reach-sh/stdlib";
import { generateABI } from "ctc2abi";
import * as annBackend from "./index.ann.mjs";
import * as netTokBackend from "./index.netTok.mjs";
import * as tokTokBackend from "./index.tokTok.mjs";
import * as triBackend from "./index.tri.mjs";
import fs from "fs";

const getABI = async (backend, template) => {
  const stdlib = loadStdlib("ALGO");
  const acc = await new stdlib.connectAccount({
    addr: zeroAddress,
  });
  const ctc = acc.contract(backend);
  const abi = await generateABI(ctc, template);
  return abi;
};

console.log("ann:");
const annABI = await getABI(annBackend, {
  name: "Ann",
  desc: "Announcer for Staking Pools",
  methods: [],
  events: [],
});
fs.writeFileSync("abi/ann.json", JSON.stringify(annABI));

console.log("netTok:");
const netTokABI = await getABI(netTokBackend, {
  name: "NetTok",
  desc: "Network-Token Liquidity Pool",
  methods: [],
  events: [],
});
fs.writeFileSync("abi/netTok.json", JSON.stringify(netTokABI));

console.log("tri:");
const triABI = await getABI(triBackend, {
  name: "Tri",
  desc: "Announcer for Liquidity Pools (Triumvirate)",
  methods: [],
  events: [],
});
fs.writeFileSync("abi/tri.json", JSON.stringify(triABI));

console.log("tokTok:");
const tokTokABI = await getABI(tokTokBackend, {
  name: "TokTok",
  desc: "Announcer for Liquidity Pools (TokTok)",
  methods: [],
  events: [],
});
fs.writeFileSync("abi/tokTok.json", JSON.stringify(tokTokABI));
