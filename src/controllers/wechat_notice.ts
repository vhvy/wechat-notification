import Wechat from "@/utils/Wechat";
import { ControllerParams } from "@/utils/Url";

async function handleWechatNotice(params: ControllerParams): Promise<Response> {
    const msg = decodeURIComponent(params.query.msg);
    const res = await Wechat.sendMsgToUser(msg);
    return new Response("ok");
}


export default handleWechatNotice;