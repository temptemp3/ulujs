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
    vote_k,
    sel_k,
    vote_fst,
    vote_lst,
    vote_kd,
    sp_key,
  };
};
