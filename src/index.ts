import { parseUrl } from "./utils/Url";
import Wechat from "./utils/Wechat";
import { ControllerParams } from "./utils/Url";

async function handleWechatNotice(params: ControllerParams, env: Env): Promise<Response> {
	const { msg, user = "d", push_key } = params.query;
	const { WECHAT_PUSH_SECERT } = env;
	
	if (WECHAT_PUSH_SECERT?.toLowerCase() !== push_key?.toLowerCase()) {
		return new Response(JSON.stringify({
			err: "Cannot find push key!"
		}));
	}

	const wechatService = new Wechat(env);

	const res = await wechatService.sendMsgToUser(msg, user);
	return new Response(JSON.stringify(res));
}


export interface Env {
	WECHAT_NOTICE_KV: KVNamespace;
	WECHAT_COMPANY_ID: string;
	WECHAT_APP_SECERT: string;
	WECHAT_AGENT_ID: string;
	WECHAT_PUSH_SECERT: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { url, method } = request;
		const urlInfo = parseUrl(url);
		const params = {
			...urlInfo,
			method
		};
		if (params.path !== "/") return new Response();
		let res;
		try {
			res = await handleWechatNotice(params, env);
		} catch (error) {
			console.log(error);
			res = new Response((error as Error).message || "Oops!");
		}
		return res;
	},
};
