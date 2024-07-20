export const makeAcc = (addr) => {
  return {
    addr,
    sk: new Uint8Array(0),
  };
};
