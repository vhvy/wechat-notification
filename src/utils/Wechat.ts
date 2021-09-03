import { buildUrl } from "@/utils/Url";

declare const WECHAT_NOTICE_KV: KVNamespace;
declare const WECHAT_COMPANY_ID: string;
declare const WECHAT_APP_SECERT: string;
declare const WECHAT_AGENT_ID: string;

const WECHAT_TOKEN_KEY = "__WECHAT_TOKEN_KEY__";

interface AccessTokenResponse {
    errcode: number;
    errmsg: string;
    access_token: string;
    expires_in: number;
};

interface SendAppMsgParams {
    touser: string;
};

interface TxtMsgContent {
    content: string;
};

interface SendAppTxtMsgParams extends SendAppMsgParams {
    msgtype: "text";
    text: TxtMsgContent
};

interface SendAppTxtMsgParamsFuil extends SendAppTxtMsgParams {
    agentid: number;
}

class Wechat {
    private static readonly baseUrl: string = "https://qyapi.weixin.qq.com/cgi-bin";

    public static async flushWechatToken(): Promise<AccessTokenResponse> {
        const url = buildUrl(this.baseUrl + "/gettoken", {
            corpid: WECHAT_COMPANY_ID,
            corpsecret: WECHAT_APP_SECERT
        });
        const res: AccessTokenResponse = await fetch(url).then(res => res.json());

        if (res.errcode != 0)
            throw new Error(res.errmsg);

        return res;
    }


    public static async getWeChatToken(): Promise<string> {
        const token = await WECHAT_NOTICE_KV.get(WECHAT_TOKEN_KEY);
        if (token === null) {
            const nextTokenInfo = await this.flushWechatToken();
            const { access_token, expires_in } = nextTokenInfo;
            await WECHAT_NOTICE_KV.put(WECHAT_TOKEN_KEY, access_token, {
                expirationTtl: expires_in - 30
            });
            return access_token;
        }
        return token;
    }

    public static async sendMsgToUser(text: string, touser: string): Promise<string> {
        const token: string = await Wechat.getWeChatToken();
        const data: SendAppTxtMsgParamsFuil = {
            touser,
            msgtype: "text",
            text: {
                content: text
            },
            agentid: Number(WECHAT_AGENT_ID)
        };

        const url = buildUrl(this.baseUrl + "/message/send", {
            access_token: token
        });

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(r => r.json());

        return res;
    }
}

export default Wechat;