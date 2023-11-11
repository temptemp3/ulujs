import JSONRequest from '../jsonrequest';
export default class SetBlockOffsetTimestamp extends JSONRequest {
    constructor(c, intDecoding, offset) {
        super(c, intDecoding);
        this.offset = offset;
        this.offset = offset;
    }
    path() {
        return `/v2/devmode/blocks/offset/${this.offset}`;
    }
    async do(headers = {}) {
        const res = await this.c.post(this.path(), headers);
        return res.body;
    }
}
//# sourceMappingURL=setBlockOffsetTimestamp.js.map