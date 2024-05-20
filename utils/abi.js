export const combineABI = (abi, abi2) => {
  const combinedABI = {
    name: abi.name,
    desc: abi.desc,
    methods: [...abi.methods, ...abi2.methods],
    events: [...abi.events, ...abi2.events],
  };
  return combinedABI;
};
