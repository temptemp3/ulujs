# h2vd2

HumbleSwap V2 Protocol library 

## todo 

- [ ] complete impl safe function non-read-only methods
- [ ] add events
- [ ] correct abi args

## usage

```
import { CONTRACT, abi } from "hsv2js";
const ci = new CONTRACT(HMBLPALGOGALGO, algodClient, indexerClient, abi.hsv2.swap)
```

### deposit liquidity

```
ci.setFee(2000);
ci.setPaymentAmount(1000); // 0.001 Algo
ci.setAssetTransfers([[1000, GALGO]]); // 0.001 gAlgo
const Provider_depositR = await ci.Provider_deposit([1000, 1000]); // 0.000967
//if (!Provider_depositR.success) ...
await signSendAndConfirm(Provider_depositR.txns, sk);
```

### withdraw liquidity

### swapAForB

### swapBForA