declare const WECHAT_NOTICE_KV: KVNamespace;
const WECHAT_TOKEN_KEY = "__WECHAT_TOKEN_KEY__";

class Wechat {
    public static async flushWechatToken(): Promise<string> {
        return "123";
    }
    public static async getWeChatToken(): Promise<string> {
        const token = await WECHAT_NOTICE_KV.get(WECHAT_TOKEN_KEY);
        if (token === null) {
            const nextToken = await this.flushWechatToken();
            await WECHAT_NOTICE_KV.put(WECHAT_TOKEN_KEY, nextToken, {
                expirationTtl: 7000
            });
            return nextToken;
        }
        return token;
    }
}

export default Wechat;