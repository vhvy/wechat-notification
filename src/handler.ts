import Wechat from "@/utils/Wechat";

async function handleRequest(request: Request): Promise<Response> {
    const token = await Wechat.getWeChatToken();
    return new Response(`Request method: ${request.method + token}`);
};

export {
    handleRequest
};