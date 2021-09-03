# WeChat-Notifincation ⚡

> 使用企业微信API + CF Workers进行消息推送，手机端用微信即可接收到消息通知。

需要以下内容:

- 一个DNS服务器在CloudFlare的域名。
- 去注册一个企业微信账号(个人即可注册，无需任何认证)。
- CloudFlare的命令行工具 `npm i @cloudflare/wrangler -g`

## 准备工作

- 打开[https://work.weixin.qq.com/](https://work.weixin.qq.com/)，登录企业微信管理后台。

- 将 `我的企业` -> `企业信息` 最下方的`企业ID`保存起来。

- 进入 `我的企业` -> `微信插件` 使用微信扫描最下方的二维码，关注后即可以收到后续的企业微信推送消息。

- `应用管理` -> `应用` 页面最下方创建应用，创建完成后保存`AgentId`和`Secret`。

- (此步可选)在查看`AgentId`的下方有个允许使用此应用的用户列表，可进行编辑。这个地方视企业类型而定，我看到有的企业里这一块是没有的。

## Wrangler

> 文档见此 [https://developers.cloudflare.com/workers/cli-wrangler](https://developers.cloudflare.com/workers/cli-wrangler)

- 使用`wrangler login`进行登录，或者按照上述文档中的`Authentication`部分进行鉴权。

- 将`account_id`填写到`wrangler.toml`中，或者配置到环境变量中。`CF_ACCOUNT_ID=accountID`

- `npm run publish`

## 环境变量配置

打开`CloudFlare`控制面板，进入`Workers`部分。

此时应该出现了一个名为`wechat-notification-production`的worker，点击进入`设置`，添加环境变量，变量如下：

|    变量名称             |     变量值  
| :--------------------- | :-----------
| WECHAT_AGENT_ID        | 应用AgentId
| WECHAT_APP_SECERT      | 应用Secret
| WECHAT_COMPANY_ID      | 企业ID
| WECHAT_PUSH_SECERT     | 自定义，用来防止被恶意滥用接口

进入KV部分，新建一个KV命名空间，返回`Workers`部分，进入刚才的worker，点击进入`设置`，在下方的KV命名空间绑定中点击`编辑变量`，新增变量。

|    变量名称             |    KV 命名空间
| :--------------------- | :-----------
| WECHAT_NOTICE_KV       |  方才新建的KV命名空间名称

## 使用

> 直接使用URL调用即可

- Method: `GET`
- Url: worker里显示的dev域名`wechat-notification-production.example.workers.dev`，或者可以在域名控制面板的Workers部分 -> 添加路由 -> 路由(xxx.example.com/*) -> Worker(wechat-notification-production);
- Path: `wechat_notice`
- Query: 
  - user: 接收消息的微信用户名，此用户名在企业微信管理后台 -> 通讯录 -> 点击联系人详情即可查看。多个接收者用`|`符号连接即可，`@all`则向该企业应用的全部成员发送。
  - push_key: 即`环境变量`部分的`WECHAT_PUSH_SECERT`。
  - msg: 要发送的消息内容，支持换行以及a标签，可打开自定义链接，注意此部分需要进行URL转义(`encodeURIComponent`)

- 示例:
  - user: `vhvy`
  - push_key: `secery_key`
  - msg: `你的快递已到，请携带工卡前往邮件中心领取。\n出发前可查看<a href="http://work.weixin.qq.com">邮件中心视频实况</a>，聪明避开排队。`
  - `https://xxx.example.com/wechat_notice?user=vhvy&push_key=secery_key=%E4%BD%A0%E7%9A%84%E5%BF%AB%E9%80%92%E5%B7%B2%E5%88%B0%EF%BC%8C%E8%AF%B7%E6%90%BA%E5%B8%A6%E5%B7%A5%E5%8D%A1%E5%89%8D%E5%BE%80%E9%82%AE%E4%BB%B6%E4%B8%AD%E5%BF%83%E9%A2%86%E5%8F%96%E3%80%82%0A%E5%87%BA%E5%8F%91%E5%89%8D%E5%8F%AF%E6%9F%A5%E7%9C%8B%3Ca%20href%3D%22http%3A%2F%2Fwork.weixin.qq.com%22%3E%E9%82%AE%E4%BB%B6%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%E5%AE%9E%E5%86%B5%3C%2Fa%3E%EF%BC%8C%E8%81%AA%E6%98%8E%E9%81%BF%E5%BC%80%E6%8E%92%E9%98%9F%E3%80%82`

## 资料

- [企业微信开发文档](https://work.weixin.qq.com/api/doc/90000/90135/90236)
- [CloudFlare Workers开发文档](https://developers.cloudflare.com/workers/)