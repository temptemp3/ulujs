/*
 * handleResponse
 * - handle response
 * @param name: name of method
 * @param res: response
 * @returns: response
 */
export const handleResponse = (name, res) => {
  if (process.env.DEBUG === "1") {
    console.log(`${name}: ${res.returnValue}`);
  }
  return res;
};
