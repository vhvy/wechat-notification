import { Env } from "..";
import { buildUrl } from "./Url";

const WECHAT_TOKEN_KEY = "__WECHAT_TOKEN_KEY__";

interface WeChatResponse {
    errcode: number;
    errmsg: string;
};

interface AccessTokenResponse extends WeChatResponse {
    access_token: string;
    expires_in: number;
};

interface SendTxtMsgResponse extends WeChatResponse {
    invaliduser: string;
    invalidparty: string;
    invalidtag: string;
    msgid: string;
    response_code: string;
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
    private readonly baseUrl: string = "https://qyapi.weixin.qq.com/cgi-bin";

    private env: Env;

    public constructor(env: Env) {
        this.env = env;
    }

    public async flushWechatToken(): Promise<AccessTokenResponse> {
        const url = buildUrl(this.baseUrl + "/gettoken", {
            corpid: this.env.WECHAT_COMPANY_ID,
            corpsecret: this.env.WECHAT_APP_SECERT
        });
        const res: AccessTokenResponse = await fetch(url).then(res => res.json());

        if (res.errcode != 0)
            throw new Error(res.errmsg);

        return res;
    }


    public async getWeChatToken(): Promise<string> {
        const token = await this.env.WECHAT_NOTICE_KV.get(WECHAT_TOKEN_KEY);
        if (token === null) {
            const nextTokenInfo = await this.flushWechatToken();
            const { access_token, expires_in } = nextTokenInfo;
            await this.env.WECHAT_NOTICE_KV.put(WECHAT_TOKEN_KEY, access_token, {
                expirationTtl: expires_in - 30
            });
            return access_token;
        }
        return token;
    }

    public async sendMsgToUser(text: string, touser: string): Promise<SendTxtMsgResponse> {
        const token: string = await this.getWeChatToken();
        const data: SendAppTxtMsgParamsFuil = {
            touser,
            msgtype: "text",
            text: {
                content: text
            },
            agentid: Number(this.env.WECHAT_AGENT_ID)
        };
        console.log(data)
        const url = buildUrl(this.baseUrl + "/message/send", {
            access_token: token
        });

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(r => r.json()) as SendTxtMsgResponse;

        return res;
    }
}

export default Wechat;