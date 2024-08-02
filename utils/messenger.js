export const PartKeyInfoToObject = (pki) => {
  const [
    txId,
    round,
    ts,
    who,
    address,
    vote_k,
    sel_k,
    vote_fst,
    vote_lst,
    vote_kd,
    sp_key,
  ] = pki;
  return {
    txId,
    round,
    ts,
    who,
    address,
    vote_k: Buffer.from(vote_k, "hex").toString("base64"),
    sel_k: Buffer.from(sel_k, "hex").toString("base64"),
    vote_fst: Number(vote_fst),
    vote_lst: Number(vote_lst),
    vote_kd: Number(vote_kd),
    sp_key: Buffer.from(sp_key, "hex").toString("base64"),
  };
};
