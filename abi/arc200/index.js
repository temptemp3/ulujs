import arc200Spec from "./contract.js";
import arc200Extension from "./extension.js";
const arc200Schema = {
  ...arc200Spec,
  methods: [...arc200Spec.methods, ...arc200Extension.methods],
  events: [...arc200Spec.events, ...arc200Extension.events],
};
export default arc200Schema;
