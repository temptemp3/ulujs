import JSONRequest from '../jsonrequest';
import { GetSyncRoundResponse } from './models/types';
export default class GetSyncRound extends JSONRequest {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return `/v2/ledger/sync`;
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        return GetSyncRoundResponse.from_obj_for_encoding(body);
    }
}
//# sourceMappingURL=getSyncRound.js.map