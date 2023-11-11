import JSONRequest from '../jsonrequest';
export default class SetSyncRound extends JSONRequest {
    constructor(c, intDecoding, round) {
        super(c, intDecoding);
        this.round = round;
        this.round = round;
    }
    path() {
        return `/v2/ledger/sync/${this.round}`;
    }
    async do(headers = {}) {
        const res = await this.c.post(this.path(), headers);
        return res.body;
    }
}
//# sourceMappingURL=setSyncRound.js.map