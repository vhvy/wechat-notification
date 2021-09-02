import { parseUrl } from "@/utils/Url";
import router from "@/router/index";


async function handleRequest(request: Request): Promise<Response> {
    const { url, method } = request;
    const urlInfo = parseUrl(url);
    const route = router.find(item => item.path === urlInfo.path);
    if (route) {
        const params = {
            ...urlInfo,
            method
        };
        let res;
        try {
            res = await route.handler(params);
        } catch (error) {
            console.log(error);
            res = new Response("Oops!");
        }
        return res;
    }
    return new Response(`nop`);
};

export {
    handleRequest
};