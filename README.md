# 南天门计划 Demo

一个 AI 原生游戏原型。玩家扮演探索舰「昆仑号」舰长，通过自然语言输入舰长令，系统把指令解析成航行、扫描、护盾、能源、维修、探针和 NPC 通讯等动作。

这一版改为关卡制，不再是漫无目的探索宇宙。每一关都有明确目的地和任务目标，核心循环是：

1. 按关卡航线向目的地推进。
2. 航程中触发随机事件。
3. 玩家用自然语言下令处理事件。
4. 事件解决后继续航行。
5. 达成航程和事件数量要求后完成关卡，进入下一关。

随机事件分为三类：

- NPC 船员问题：疲劳、争执、心理压力、部门冲突。
- 舰船突发问题：反应堆热尖峰、护盾结霜、船体泄漏。
- 宇宙未知问题：异常信标、引力透镜、探针第二心跳、旧舰语音回环。

## 运行

在本目录启动静态服务：

```bash
python -m http.server 5177
```

然后打开：

```text
http://127.0.0.1:5177/
```

## AI / BYOK

- 支持 BYOK：在界面里填入自己的 OpenRouter API Key。
- 请求接口：`POST https://openrouter.ai/api/v1/chat/completions`
- 这个接口是给程序请求用的，不是浏览器页面；直接在浏览器里打开可能会显示错误或空响应。
- 默认 `model_id`：`openai/gpt-4.1-mini`
- 可在界面中改成其他 OpenRouter model slug。
- token 用量会在舰桥右上角累计显示。
- 勾选“本机记住 key”才会把 key 写入 `localStorage`，否则只写入 `sessionStorage`。
- AI 请求会带上当前关卡、航程、已触发事件和 activeEvent，让模型优先解析“如何解决当前事件”。

没有 key 时，demo 会使用本地规则解析器兜底，方便直接试玩和查看代码。

## 文件结构

主要代码在这些文件中：

- `index.html`
- `src/styles.css`
- `src/main.js`
- `README.md`

核心流程：

1. 玩家提交自然语言舰长令。
2. 如果开启 AI 且存在 OpenRouter key，请求模型返回 JSON 指令。
3. 如果 AI 不可用，使用本地解析器生成同样结构的动作。
4. 游戏运行时把动作应用到舰艇状态、NPC 通讯、日志和太空视窗。
5. 关卡系统根据动作判断是否解决 activeEvent；无未解决事件时，继续航行类命令推进航程。

OpenRouter 官方文档入口：https://openrouter.ai/docs/quickstart
