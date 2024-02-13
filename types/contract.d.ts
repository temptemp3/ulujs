export class CONTRACT {
  constructor(
    contractId: number,
    algodClient: any,
    indexerClient: any,
    spec: any,
    acc: { addr: string; sk: Uint8Array },
    simulate?: boolean,
    waitForConfirmation?: boolean,
    objectOnly?: boolean
  );
}
