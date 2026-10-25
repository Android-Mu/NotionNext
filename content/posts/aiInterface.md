---
id: 37067766-9938-8082-b2ec-ec1fce469aa4
title: 2026年免费AI API接口大全：DeepSeek、Qwen、ChatGPT、Gemini等主流大模型免费调用指南
slug: article/aiInterface
type: Post
status: Published
category: AIGC / AI看点
tags: 免费AI接口, GLM API, Gemini API, 大模型API, 免费大模型, AI接口调用
date: 2026-05-31
lastEditedDate: 2026-05-30T17:18:48.203Z
summary: 整理了2026年国内外13个主流AI大模型的免费API接口，包括DeepSeek、通义千问、智谱GLM、Google Gemini等，详细列出注册地址、免费额度、调用方法和OpenAI兼容性，适合开发者和AI爱好者低成本入门大模型开发。
---

好消息：2026 年几乎所有主流大模型都提供了免费或极低价的 API。有的完全免费，有的送几十元体验金，有的按量计费低到几乎不要钱。

这篇文章小编花了 3 个小时写完，帮你一次性搞清楚：哪些API免费、怎么注册、怎么调用、哪个最适合你。

### 一、速查表：免费额度一览

| 平台 | 免费额度 | 注册地址 | OpenAI兼容 |
| --- | --- | --- | --- |
| 智谱GLM | 2000万token + Flash模型永久免费 | [open.bigmodel.cn](http://open.bigmodel.cn/) | ✅ |
| Google Gemini | Flash模型免费 | ai.google.dev | ❌ |
| HuggingFace | 免费推理API | [huggingface.co](http://huggingface.co/) | ✅ |
| 讯飞星火 | 20万token + Lite永久免费 | [xinghuo.xfyun.cn](http://xinghuo.xfyun.cn/) | 部分 |
| 阿里通义 | 新用户共约7000万token | [bailian.console.aliyun.com](http://bailian.console.aliyun.com/) | ✅ |
| DeepSeek | 无免费层，但极便宜 | [platform.deepseek.com](http://platform.deepseek.com/) | ✅ |
| 豆包 | 新用户送20元券 | [https://volcengine.com/L/02y8m7ybt9I/](https://volcengine.com/L/02y8m7ybt9I/)  邀请码：VK5YL8VU | ✅ |
| Kimi | 新用户送15元券 | [platform.kimi.com](http://platform.kimi.com/) | ✅ |
| 百度千帆 | 新用户送20元券 | [cloud.baidu.com/product/wenxinworkshop](http://cloud.baidu.com/product/wenxinworkshop) | ✅ |
| OpenAI | 新账号可能送$5-18 | [platform.openai.com](http://platform.openai.com/) | ✅ |
| [Together.ai](http://together.ai/) | 新用户有免费额度 | [api.together.ai](http://api.together.ai/) | ✅ |

### 二、国内平台详解

#### 2.1 智谱GLM API（推荐：有完全免费模型）

**注册地址**：[https://open.bigmodel.cn](https://www.bigmodel.cn/invite?icode=PTWnIyzgud6ZUKv0FvM0rGczbXFgPRGIalpycrEwJ28%3D)

- **GLM-4.7-Flash 模型完全免费、不限量**（200K上下文）

- GLM-4.6V-Flash（视觉模型）也完全免费

**主要模型和价格**：

| 模型 | 输入价格（/百万token） | 输出价格（/百万token） |
| --- | --- | --- |
| GLM-5.1 | 6-8元 | 24-28元 |
| GLM-4.7 | 2-4元 | 8-16元 |
| GLM-4.7-FlashX | 0.5元 | 3元 |
| GLM-4.7-Flash | 免费 | 免费 |

**OpenAI兼容**：✅ 完全兼容，可直接用 OpenAI SDK 调用

**调用示例**：

```Python
from openai import OpenAI

client = OpenAI(
    api_key="你的智谱API Key",
    base_url="<https://open.bigmodel.cn/api/paas/v4>"
)

response = client.chat.completions.create(
    model="glm-4.7-flash",  # 免费模型
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

**推荐理由**：Flash模型永久免费，适合学习和小项目；付费模型价格也比OpenAI便宜很多。

#### 2.2 阿里通义千问 API（推荐：新用户送大量额度）

**注册地址**：[https://bailian.console.aliyun.com](https://bailian.console.aliyun.com/)

**免费额度**：

- 每个模型送 100万 token（输入+输出各100万），有效期90天

- 新用户总共可获得约 7000万 token 免费额度

- 覆盖所有模型（qwen3.7-max、qwen3-max、qwen-turbo等）

**主要模型和价格（国内区域，每百万token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| qwen3.7-max | 12元 | 36元 |
| qwen3-max | 2.5元 | 10元 |
| qwen3.5-plus | 0.8元 | 4.8元 |
| qwen-turbo | 0.8元 | 2元 |
| qwen-long | 0.5元 | 2元 |

**OpenAI兼容**：✅ 百炼平台提供OpenAI兼容格式

**调用示例**：

```Python
from openai import OpenAI

client = OpenAI(
    api_key="你的百炼API Key",
    base_url="<https://dashscope.aliyuncs.com/compatible-mode/v1>"
)

response = client.chat.completions.create(
    model="qwen-turbo",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

**推荐理由**：新用户送的额度非常多，足够玩很久；中文理解能力国内最强之一。

#### 2.3 DeepSeek API（推荐：极便宜+强能力）

**注册地址**：[https://platform.deepseek.com](https://platform.deepseek.com/)

**免费额度**：没有明确的免费层，但价格极低，实际花费很少

**主要模型和价格（每百万token）**：

| 模型 | 输入价格 | 输出价格 | 缓存输入 |
| --- | --- | --- | --- |
| deepseek-v4-flash | $0.14 | $0.28 | $0.0028 |
| deepseek-v4-pro | $0.435 | $0.87 | - |

**上下文**：100万 token，最大输出 384K token

**OpenAI兼容**：✅ 兼容OpenAI格式，也兼容Anthropic格式

**调用示例**：

```Python
from openai import OpenAI

client = OpenAI(
    api_key="你的DeepSeek API Key",
    base_url="<https://api.deepseek.com>"
)

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

**推荐理由**：性价比之王。Flash模型输入只要$0.14/百万token，约1元人民币能处理700万token。代码和推理能力接近GPT-5级别。

#### 2.4 豆包API（火山方舟）

**注册地址**：[https://www.volcengine.com/product/ark](https://www.volcengine.com/product/ark)

**免费额度**：新用户送20元体验券

**主要模型和价格（每百万token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| doubao-seed-2.0-pro | 3.2元 | 16元 |
| doubao-seed-2.0-lite | 0.6元 | 3.6元 |
| doubao-seed-2.0-mini | 0.2元 | 2元 |
| doubao-seed-1.6-flash | 0.15元 | 1.50元 |

**OpenAI兼容**：✅ 火山方舟提供OpenAI兼容接口

**推荐理由**：字节跳动出品，月活3.45亿；Flash模型也很便宜（0.15元/百万token输入）。

#### 2.5 Kimi API（月之暗面）

**注册地址**：[https://platform.kimi.com](https://platform.kimi.com/)

**免费额度**：新用户送15元体验券（有效期3个月）

**主要模型和价格（每百万token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| Kimi K2.6 | $1.20 | $4.50 |
| Kimi K2.5 | $0.60 | $3.00 |
| Kimi K2 | $0.60 | $2.50 |

**上下文**：256K token

**OpenAI兼容**：✅ Kimi API兼容OpenAI格式

**推荐理由**：长文档处理能力最强，支持上传整本书进行分析。

#### 2.6 百度千帆（文心一言）

**注册地址**：[https://cloud.baidu.com/product/wenxinworkshop](https://cloud.baidu.com/product/wenxinworkshop)

**免费额度**：实名认证后送20元体验券

**主要模型和价格（每千token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| ERNIE 5.1 | 0.004元 | 0.018元 |
| ERNIE 4.5 Turbo | 0.0008元 | 0.0032元 |
| ERNIE-Lite-Pro-128K | 0.0002元 | 0.0004元 |

**OpenAI兼容**：✅ 千帆平台支持OpenAI兼容格式

**推荐理由**：百度生态整合，中文信息检索能力强；千帆平台还托管了DeepSeek、Qwen等第三方模型。

#### 2.7 讯飞星火API

**注册地址**：[https://xinghuo.xfyun.cn/sparkapi](https://xinghuo.xfyun.cn/sparkapi)

**免费额度**：

- 个人认证：20万 token

- 企业认证：100万 token

- **Spark Lite 模型永久免费**

**主要模型和价格（每百万token）**：

| 模型 | 价格 |
| --- | --- |
| Spark Lite | 免费 |
| Spark Ultra | 0.8元 |
| X2（深度推理） | 2-3元 |

**OpenAI兼容**：部分兼容（星辰MaaS平台兼容OpenAI格式）

**推荐理由**：语音交互能力最强，Spark Lite永久免费适合轻量使用。

### 三、海外平台详解

#### 3.1 Google Gemini API（推荐：有慷慨免费层）

**注册地址**：[https://ai.google.dev](https://ai.google.dev/) **控制台**：[https://aistudio.google.com](https://aistudio.google.com/)

**免费额度**：

- **Gemini 3.5 Flash 完全免费**

- **Gemma 4（开源模型）完全免费**

- 有频率限制但无token计费

**主要模型和价格（每百万token，付费层）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| Gemini 3.5 Flash | 免费/付费$1.50 | 免费/付费$9.00 |
| Gemini 3.1 Pro | $2.00 | $12.00 |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 |

**OpenAI兼容**：❌ Google用自己的API格式，但有SDK适配器

**调用示例**（Python SDK）：

```Python
from google import genai

client = genai.Client(api_key="你的Gemini API Key")

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="你好"
)
print(response.text)
```

**推荐理由**：免费层非常慷慨，Flash模型免费且能力很强；100万token上下文。

#### 3.2 HuggingFace Inference API

**注册地址**：[https://huggingface.co](https://huggingface.co/)

**免费额度**：注册即可使用免费推理API，PRO用户（$9/月）有更多额度

**支持模型**：数百个模型，通过多家推理服务商（Cerebras、Groq、Together等）

**API端点**：`https://router.huggingface.co/{provider}/v1/chat/completions`

**OpenAI兼容**：✅ 使用OpenAI兼容格式

**推荐理由**：一个账号访问数百个模型，自动选择最快/最便宜的推理后端。

#### 3.3 OpenAI API

**注册地址**：[https://platform.openai.com](https://platform.openai.com/)

**免费额度**：新账号可能获得$5-18免费额度（不同时期不同）

**主要模型和价格（每百万token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| GPT-5.5 | $5.00 | $30.00 |
| GPT-5.4 | $2.50 | $15.00 |
| GPT-5.4 mini | $0.75 | $4.50 |

**OpenAI兼容**：✅ 标准制定者

**推荐理由**：最强模型，但价格也最贵。适合对质量要求极高的场景。

#### 3.4 Anthropic Claude API

**注册地址**：[https://console.anthropic.com](https://console.anthropic.com/)

**免费额度**：新账号送$5免费额度；创业公司可申请$25K-$100K

**主要模型和价格（每百万token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| Claude Opus 4.8 | $5 | $25 |
| Claude Sonnet 4.6 | $3 | $15 |
| Claude Haiku 4.5 | $1 | $5 |

**OpenAI兼容**：❌ Anthropic自有格式，但有SDK适配器

**推荐理由**：代码能力最强之一，安全性和推理能力优秀。

#### 3.5 [Together.ai](http://together.ai/)

**注册地址**：[https://api.together.ai](https://api.together.ai/)

**免费额度**：新用户有免费额度（不定期活动）

**主要模型和价格（每百万token）**：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| DeepSeek V4 Pro | $2.10 | $4.40 |
| Qwen3.5 9B | $0.10 | $0.15 |
| GLM-5.1 | $1.40 | $4.40 |

**OpenAI兼容**：✅

**推荐理由**：一个平台调用多家开源模型，Batch API半价。

### 四、怎么选？推荐组合

#### 方案一：纯白嫖（一分钱不花）

1. **智谱 GLM-4.7-Flash** — 永久免费，日常对话/写作

1. **Google Gemini 3.5 Flash** — 永久免费，多模态能力强

1. **讯飞 Spark Lite** — 永久免费，语音场景

#### 方案二：极低成本（每月10元以内）

1. **DeepSeek V4 Flash** — 约1元/700万token

1. **豆包 Seed-2.0-mini** — 0.2元/百万token输入

1. **Qwen Turbo** — 0.8元/百万token输入

1. 配合上面的免费模型轮询使用

#### 方案三：开发者/项目用

1. **Qwen API**（新用户7000万token免费）— 中文最强

1. **DeepSeek API** — 代码推理最强，价格低

1. **Gemini API** — 免费+100万token上下文

1. 根据场景切换模型

### 五、快速上手：5分钟调通第一个API

#### 步骤一：选择平台注册

推荐从智谱开始（有完全免费模型）：

1. 访问 [https://open.bigmodel.cn](https://open.bigmodel.cn/)

1. 注册账号（手机号即可）

1. 实名认证

1. 进入控制台，创建API Key

#### 步骤二：安装依赖

```Bash
pip install openai
```

#### 步骤三：写代码调用

```Python
from openai import OpenAI

# 智谱GLM（免费）
client = OpenAI(
    api_key="你的API Key",
    base_url="<https://open.bigmodel.cn/api/paas/v4>"
)

response = client.chat.completions.create(
    model="glm-4.7-flash",
    messages=[
        {"role": "system", "content": "你是一个有用的助手"},
        {"role": "user", "content": "用Python写一个快速排序"}
    ],
    temperature=0.7,
    max_tokens=2000
)

print(response.choices[0].message.content)
```

#### 步骤四：切换不同平台

只需要改 `api_key` 和 `base_url`：

```Python
# DeepSeek
client = OpenAI(api_key="xxx", base_url="<https://api.deepseek.com>")

# 通义千问
client = OpenAI(api_key="xxx", base_url="<https://dashscope.aliyuncs.com/compatible-mode/v1>")

# Groq
client = OpenAI(api_key="xxx", base_url="<https://api.groq.com/openai/v1>")

# Kimi
client = OpenAI(api_key="xxx", base_url="<https://api.kimi.com/v1>")

# 豆包
client = OpenAI(api_key="xxx", base_url="<https://ark.cn-beijing.volces.com/api/v3>")
```

代码完全一样，只改两行就能切换模型。这就是OpenAI兼容格式的好处。

*如果这篇文章对你有帮助，欢迎收藏和分享。有问题可以在评论区留言。*
