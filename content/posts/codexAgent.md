---
id: 37367766-9938-800f-8b6e-eed66438b147
title: Codex免费使用教程：手把手教你白嫖OpenAI最强编程Agent
slug: article/codexAgent
type: Post
status: Published
category: AIGC / AI看点
tags: Codex教程, OpenAI Codex, Codex CLI, AI编程, codex安装, AI编程Agent
date: 2026-06-03
lastEditedDate: 2026-06-03T06:51:07.354Z
summary: OpenAI的Codex编程Agent已经对ChatGPT用户免费开放，本文详细讲解如何注册、安装、配置Codex CLI，以及如何通过ChatGPT账号获取免费API额度，附完整安装教程和常见问题解决方法。
---

最近似乎全民都在学 Codex 了，不管什么职业的都在用 codex 做东西。那 codex 是个什么东西呢？

简单说，它就是一个AI Agent——你给它一个需求，它能为你写代码、搞测试、还能为你处理日常任务，解放你的双手。以前觉得是科幻的事情，现在真的实现了。

最关键的是：**它对ChatGPT Plus/Pro用户是免费的，CLI工具还送免费API额度。**

这篇文章手把手教你怎么用起来。

![vx_codingSmart_2026-06-03_0114_10.png](/images/posts/ab15fd40-vx_codingSmart_2026-06-03_0114_10.png.png)

### 一、免费使用方式

#### 方式一：ChatGPT 网页端（最简单）

如果你有 ChatGPT Plus 或 Pro 账号，Codex 已经内置了，不需要额外付费。

1. [下载 Codex](https://pan.quark.cn/s/7aeede326211)

1. 登录你的 chatgpt 账号

1. 输入需求，Codex 自动开始工作

#### 方式二：Codex CLI（推荐，有免费额度）

Codex CLI 是开源的命令行工具，GitHub 上 86.5k stars。

**免费额度**：

- ChatGPT Plus 用户登录：送 $5 API 额度（30天有效）

- ChatGPT Pro 用户登录：送 $50 API 额度（30天有效）

这个额度足够你用很久了。

### 二、Codex CLI 安装教程

#### macOS / Linux

```Bash
# 方法一：一键安装脚本
curl -fsSL <https://chatgpt.com/codex/install.sh> | sh

# 方法二：npm 安装
npm install -g @openai/codex
```

#### Windows

```Bash
# 通过 npm 安装（需要先装 Node.js）
npm install -g @openai/codex
```

#### 验证安装

```Bash
codex --version
```

看到版本号就说明装好了。

### 三、登录和配置

#### 方法一：用 ChatGPT 账号登录（推荐，有免费额度）

```Bash
codex
```

第一次运行会提示你登录，选择"Sign in with ChatGPT"，浏览器会弹出授权页面，授权即可。

登录后自动获得免费API额度（Plus $5 / Pro $50）。

#### 方法二：用 API Key 登录

如果你有 OpenAI API Key：

```Bash
export OPENAI_API_KEY="sk-你的key"
codex
```

### 四、基本使用

#### 最简单的用法

```Bash
# 在你的项目目录下运行
cd your-project
codex

# 然后输入自然语言需求
> 帮我写一个Python脚本，读取CSV文件并统计每列的空值数量
```

Codex 会：

1. 理解你的需求

1. 创建/修改文件

1. 运行测试

1. 给你看结果

#### 常用命令

```Bash
codex                    # 启动交互模式
codex "你的需求"          # 直接执行任务
codex --model codex-mini # 使用轻量模型
codex --approval auto    # 自动批准文件操作
```

### 五、API 定价

如果你的免费额度用完了，续费价格：

| 模型 | 输入价格 | 输出价格 |
| --- | --- | --- |
| codex-mini-latest | $1.50/百万token | $6/百万token |

**提示词缓存**：开启缓存后打75折。

说实话这个价格不算便宜，但 $5 的免费额度够你体验和做几个小项目了。

### 六、常见问题

**Q1：Codex 和 GitHub Copilot 有什么区别？**

A：Copilot是实时代码补全工具，Codex是自主编程Agent。Copilot帮你写当前这行代码，Codex帮你完成整个任务。

**Q2：免费额度用完了怎么办？**

A：重新用另一个ChatGPT账号登录CLI，或者购买API额度。

**Q3：支持哪些编程语言？**

A：Python、JavaScript、TypeScript、Java、Go、Rust、C++ 等主流语言都支持。

**Q4：代码安全吗？**

A：每个任务在独立沙箱中运行，不会影响你的本地环境。但建议在Git仓库中使用，方便回滚。

**Q5：需要什么配置？**

A：CLI本身很轻量，主要是网络要求。建议4GB+内存，稳定网络连接。

### 七、相关推荐

- [Windows 安装 Codex 教程，解决网络加载失败和启动报错问题](https://okfinish.com/article/win-codex)

- [2026最新 Google Gemini Omni 完全使用指南：AI视频生成新时代来了](https://okfinish.com/article/omni)

*如果你在安装过程中遇到问题，欢迎在评论区留言。*
