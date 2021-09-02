import wechat_notice from "@/controllers/wechat_notice";
import { ControllerParams } from "@/utils/Url";

type Controller = (params: ControllerParams) => Promise<Response>;

interface Route {
    path: string;
    handler: Controller
}

const router: Route[] = [
    {
        path: "/wechat_notice",
        handler: wechat_notice
    }
];

export default router;