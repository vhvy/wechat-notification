echo "请输入WECHAT_COMPANT_ID: `n";

wrangler.cmd secret put WECHAT_COMPANY_ID --env development
wrangler.cmd secret put WECHAT_COMPANY_ID --env production


echo "`n请输入WECHAT_APP_SECERT: `n";

wrangler.cmd secret put WECHAT_APP_SECERT --env development
wrangler.cmd secret put WECHAT_APP_SECERT --env production


echo "`n请输入WECHAT_AGENT_ID: `n";

wrangler.cmd secret put WECHAT_AGENT_ID --env development
wrangler.cmd secret put WECHAT_AGENT_ID --env production