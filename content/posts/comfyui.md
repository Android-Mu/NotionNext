---
id: 37267766-9938-8048-819d-c369e13bc2d1
title: ComfyUI 中文入门教程：零基础也能玩转AI绘画工作流（附安装包）
slug: article/comfyui
type: Post
status: Published
category: AIGC / AI绘图
tags: ComfyUI教程, ComfyUI安装, AI绘画, Stable Diffusion工作流, AI绘画工具, SD工作流, ComfyUI入门
date: 2026-06-02
lastEditedDate: 2026-06-02T07:22:25.070Z
summary: ComfyUI是2026年最火的AI绘画工作流工具，本文从零基础出发，手把手教你安装、配置、搭建第一个文生图工作流，并提供国内模型下载地址、常见报错解决方案和必装插件推荐。
---

如果你玩过 Stable Diffusion，一定听说过 ComfyUI。

和传统的 WebUI 不同，ComfyUI 用"节点连线"的方式构建工作流，看起来像电路图，用起来像搭积木——灵活、强大、可复现。

2026年，ComfyUI 已经成为AI绘画领域的主流工具，社区活跃度远超 WebUI。如果你还没试过，这篇文章带你从零开始。

![vx_codingSmart_2026-06-01_1112_23.png](/images/posts/02f0b53f-vx_codingSmart_2026-06-01_1112_23.png.png)

### 一、ComfyUI 是什么？

#### 1.1 和 WebUI 的区别

| 对比项 | WebUI (A1111) | ComfyUI |
| --- | --- | --- |
| 操作方式 | 表单填写 | 节点连线 |
| 学习曲线 | 低（像填表格） | 中等（需要理解逻辑） |
| 灵活性 | 一般 | 极高（任意组合） |
| 可视化 | 预设界面 | 自由搭建 |
| 速度 | 较快 | 更快（优化更好） |
| 适合人群 | 快速出图 | 深度创作、批量生产 |

#### 1.2 为什么越来越多人用 ComfyUI

1. **更灵活**：想怎么组合就怎么组合，不受预设限制

1. **更快**：显存优化更好，同样配置生成更快

1. **可复现**：工作流可以保存、分享、复用

1. **社区活跃**：自定义节点生态爆发式增长

1. **支持新模型更快**：FLUX、SD3.5等新模型通常先支持ComfyUI

### 二、安装教程

#### 2.1 方式一：桌面应用（推荐新手）

最简单的方式，一键安装。

1. [下载对应系统的安装包（Windows / Mac / Linux）](https://pan.quark.cn/s/f2379258c9dd)

1. 双击安装，一路下一步

1. 打开即可使用

**优点**：自动安装Python、依赖、更新
**缺点**：体积较大

#### 2.2 方式二：便携包（Windows）

适合不想污染系统环境的用户。

1. 从 [GitHub Releases](https://pan.quark.cn/s/f2379258c9dd) 下载便携包（.7z格式）

  - NVIDIA 20系以上：标准版
  - NVIDIA 10系：CUDA 12.6版本
  - AMD显卡：ROCm版本
  - Intel显卡：XPU版本
1. 解压到任意目录

1. 运行 `run_nvidia_gpu.bat`（NVIDIA）或对应脚本

#### 2.3 方式三：命令行安装（Mac/Linux/开发者）

```Bash
# 安装 comfy-cli
pip install comfy-cli

# 一键安装 ComfyUI
comfy install

# 启动
comfy launch
```

#### 2.4 方式四：手动安装

```Bash
# 克隆仓库
git clone <https://github.com/comfyanonymous/ComfyUI>
cd ComfyUI

# 安装依赖
pip install -r requirements.txt

# 安装 PyTorch（根据显卡选择）
# NVIDIA:
pip install torch torchvision --index-url <https://download.pytorch.org/whl/cu130>
# AMD:
pip install torch torchvision --index-url <https://download.pytorch.org/whl/rocm7.2>

# 启动
python main.py
```

#### 2.5 Mac (Apple Silicon) 安装

```Bash
git clone <https://github.com/comfyanonymous/ComfyUI>
cd ComfyUI
pip install -r requirements.txt
python main.py --force-fp16
```

M1/M2/M3/M4 芯片均支持，使用 MPS 后端加速。

### 三、硬件要求

| 配置 | 最低要求 | 推荐配置 |
| --- | --- | --- |
| GPU | NVIDIA 10系 / AMD RDNA / Apple M1 | NVIDIA 20系+ / Apple M2+ |
| 显存 | 4GB（SD1.5） | 12GB+（SDXL/FLUX） |
| 内存 | 8GB | 16GB+ |
| 硬盘 | 20GB（不含模型） | 50GB+（含模型） |
| Python | 3.10+ | 3.12/3.13 |

**没有显卡？** 可以用CPU模式（`--cpu`参数），但非常慢。建议用云端方案（Comfy Cloud）。

### 四、界面介绍

打开 ComfyUI 后，默认显示一个空白画布。右键可以添加节点，按住连线可以连接节点。

#### 4.1 常用快捷键

| 快捷键 | 功能 |
| --- | --- |
| Ctrl+Enter | 开始生成 |
| Ctrl+S | 保存工作流 |
| 双击空白处 | 搜索节点 |
| Ctrl+Z | 撤销 |
| 鼠标中键拖动 | 平移画布 |
| 滚轮 | 缩放 |

#### 4.2 核心节点介绍

| 节点名 | 功能 |
| --- | --- |
| Load Checkpoint | 加载模型 |
| CLIP Text Encode | 文字编码（提示词） |
| Empty Latent Image | 创建空白画布 |
| KSampler | 采样器（核心） |
| VAE Decode | 解码为图片 |
| Save/Preview Image | 保存/预览图片 |
| Load Image | 加载图片（用于图生图） |

### 五、第一个工作流：文生图

#### 步骤1：下载模型

先下载一个基础模型（Checkpoint），放到 `models/checkpoints/` 目录下。

**新手推荐模型**：

| 模型 | 显存需求 | 说明 |
| --- | --- | --- |
| Stable Diffusion 1.5 | 4GB | 最轻量，学习用 |
| SDXL | 8-12GB | 质量更好 |
| FLUX.1 | 12-24GB | 最新一代，效果最好 |

**国内下载地址**：

- LiblibAI（liblib.art）：国内最大，直连下载

- [hf-mirror.com](http://hf-mirror.com/)：HuggingFace国内镜像

- [modelscope.cn](http://modelscope.cn/)：阿里模型库

**hf-mirror下载方法**：

```Bash
# 设置环境变量
export HF_ENDPOINT=https://hf-mirror.com

# 安装huggingface_hub
pip install -U huggingface_hub

# 下载模型（示例）
huggingface-cli download stabilityai/stable-diffusion-xl-base-1.0 --local-dir ./models/checkpoints/
```

#### 步骤2：搭建工作流

在画布上右键添加以下节点，按顺序连接：

```Plain Text
Load Checkpoint
  ├─ model → KSampler (model)
  ├─ clip  → CLIP Text Encode (正向提示词)
  └─ clip  → CLIP Text Encode (反向提示词)

CLIP Text Encode (正向) → KSampler (positive)
CLIP Text Encode (反向) → KSampler (negative)

Empty Latent Image → KSampler (latent_image)

KSampler (latent) → VAE Decode (samples)
Load Checkpoint (vae) → VAE Decode (vae)

VAE Decode (image) → Save Image
```

#### 步骤3：填写参数

**KSampler 参数**：

| 参数 | 推荐值 | 说明 |
| --- | --- | --- |
| seed | 随机 | 种子，固定可复现 |
| steps | 20-30 | 采样步数 |
| cfg | 7 | 提示词引导强度 |
| sampler_name | euler / dpmpp_2m | 采样器 |
| scheduler | normal / karras | 调度器 |
| denoise | 1.0 | 去噪强度（文生图用1.0） |

**正向提示词示例**：

```Plain Text
a beautiful sunset over the ocean, golden light, clouds,
reflection on water, 8k, highly detailed, cinematic lighting
```

**反向提示词示例**：

```Plain Text
low quality, blurry, watermark, text, deformed, ugly
```

#### 步骤4：生成

按 `Ctrl+Enter` 开始生成。第一次会比较慢（加载模型），之后就快了。

### 六、图生图工作流

和文生图的区别：用 Load Image + VAE Encode 替代 Empty Latent Image。

```Plain Text
Load Image → VAE Encode → KSampler (latent_image)
```

**关键参数**：

- `denoise`：0.4-0.7（越低越保留原图，越高越自由创作）

- 建议先用 0.5 测试

### 七、必装自定义节点

#### 7.1 安装 ComfyUI Manager（必装第一步）

Manager 是管理所有自定义节点的工具，必须先装。

```Bash
cd ComfyUI/custom_nodes
git clone <https://github.com/ltdrdata/ComfyUI-Manager> comfyui-manager
```

重启 ComfyUI 后，菜单栏会出现 Manager 按钮。

#### 7.2 推荐节点包

| 节点包 | 功能 | 安装方式 |
| --- | --- | --- |
| ComfyUI-Manager | 节点管理器 | 手动clone（见上） |
| Impact Pack | 检测、分割、局部重绘 | Manager安装 |
| AnimateDiff Evolved | 视频/动画生成 | Manager安装 |
| KJNodes | 实用工具集 | Manager安装 |
| WAS Node Suite | 通用工具集 | Manager安装 |
| rgthree-comfy | UI增强 | Manager安装 |
| Comfyroll | 额外工作流节点 | Manager安装 |
| Video Helper Suite | 视频处理 | Manager安装 |

**通过 Manager 安装**：打开 Manager → Install Custom Nodes → 搜索名称 → Install → 重启

### 八、常见问题和解决方案

#### 8.1 CUDA out of memory（显存不足）

**解决方法**：

- 降低分辨率（先用512x512测试）

- 启动时加参数：`python main.py --lowvram`

- 启用 VAE Tiling：在VAE Decode节点上右键启用

- 减少batch size

#### 8.2 找不到模型

**检查**：

- 模型文件放在正确的子目录下（`models/checkpoints/`、`models/loras/` 等）

- 文件名不要有特殊字符

- 支持的格式：.safetensors、.ckpt、.pt

#### 8.3 自定义节点安装失败

**解决方法**：

- Manager配置中设置 `bypass_ssl = True`

- 设置 git 路径

- GitHub加速：设置环境变量 `GITHUB_ENDPOINT=https://mirror.ghproxy.com/<https://github.com`>

#### 8.4 生成黑图

**原因**：VAE 不匹配
**解决**：切换VAE模型，或使用Checkpoint自带的VAE

#### 8.5 Mac上特别慢

**解决**：

- 确保使用 `-force-fp16` 参数

- M1芯片建议用SD1.5（不要用SDXL）

- M2/M3/M4 可以跑SDXL

#### 8.6 Windows上出现事件循环错误

**解决**：在 Manager 配置中设置 `windows_selector_event_loop_policy = True`

### 九、模型下载指南

#### 9.1 国内下载渠道

| 渠道 | 网址 | 说明 |
| --- | --- | --- |
| LiblibAI | liblib.art | 国内最大，12万+模型，直连 |
| hf-mirror | [hf-mirror.com](http://hf-mirror.com/) | HuggingFace国内镜像 |
| ModelScope | [modelscope.cn](http://modelscope.cn/) | 阿里模型库 |
| LiblibAI客户端 | 客户端内下载 | 更稳定 |

#### 9.2 hf-mirror 使用方法

```Bash
# 方法1：环境变量
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download 模型名 --local-dir 目标目录

# 方法2：hfd工具
wget <https://hf-mirror.com/hfd/hfd.sh>
chmod a+x hfd.sh
./hfd.sh 模型名
```

#### 9.3 GitHub 加速

```Bash
# 克隆时使用加速
export GITHUB_ENDPOINT=https://mirror.ghproxy.com/<https://github.com>
git clone <https://github.com/xxx/xxx.git>
```

### 十、总结

ComfyUI 的学习曲线确实比 WebUI 陡一些，但一旦上手，你会发现它的灵活性和强大是 WebUI 无法比的。

**给新手的建议**：

1. 先用桌面应用一键安装，别折腾环境

1. 从 SD1.5 开始练习，熟悉后再上 SDXL/FLUX

1. 先用默认工作流，理解每个节点的作用

1. 多看视频教程，跟着做一遍

1. 装好 Manager，善用社区节点

*如果这篇文章对你有帮助，欢迎收藏和分享。*
