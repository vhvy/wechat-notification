import Wechat from "@/utils/Wechat";
import { ControllerParams } from "@/utils/Url";

async function handleWechatNotice(params: ControllerParams): Promise<Response> {
    const msg = params.query.msg;
    const user = params.query.user;
    const res = await Wechat.sendMsgToUser(msg, user);
    return new Response(JSON.stringify(res));
}

export default handleWechatNotice;