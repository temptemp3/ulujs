export const PartKeyInfoToObject = (pki) => {
  const [who, address, vote_k, sel_k, vote_fst, vote_lst, vote_kd, sp_key] =
    pki;
  return {
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
