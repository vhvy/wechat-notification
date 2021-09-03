import Wechat from "@/utils/Wechat";
import { ControllerParams } from "@/utils/Url";

declare const WECHAT_PUSH_SECERT: string;

async function handleWechatNotice(params: ControllerParams): Promise<Response> {
    const { msg, user, push_key } = params.query;

    if (WECHAT_PUSH_SECERT?.toLowerCase() !== push_key?.toLowerCase()) {
        return new Response(JSON.stringify({
            err: "push key error!"
        }));
    }
    
    const res = await Wechat.sendMsgToUser(msg, user);
    return new Response(JSON.stringify(res));
}

export default handleWechatNotice;