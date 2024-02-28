import schema from "./index.js";
import fs from "fs";

fs.writeFileSync("contract.json", JSON.stringify(schema, null, 2));
