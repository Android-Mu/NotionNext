---
id: 37167766-9938-805f-9d29-ce279223a5f8
title: 【精选】AI绘画提示词大全：Midjourney、Stable Diffusion、ChatGPT image2通用模板
slug: article/imagePrompt
type: Post
status: Published
category: AIGC / AI绘图
tags: AI绘画提示词, Midjourney提示词, Stable Diffusion提示词, Image2提示词, ChatGPT image2, AI生图, AI绘画
date: 2026-05-31
lastEditedDate: 2026-05-31T09:18:02.251Z
summary: 2026年最新AI绘画提示词（Prompt）大全，覆盖Midjourney V7、FLUX、Stable Diffusion、ChatGPT Image四大平台，包含风格词库、场景词库、反向提示词模板和10个即用提示词模板，直接复制即可使用。
---

提示词（Prompt）是 AI 绘画的灵魂。

同样一个模型，提示词写得好和写得差，出来的是两个世界。

这篇文章帮你整理了2026年最新的提示词语法、词库和模板，覆盖 Midjourney V7、FLUX、Stable Diffusion、ChatGPT Image2 四大平台。收藏这一篇，够你用很久。

### 一、各平台提示词语法差异

#### 1.1 Midjourney V7

**基本结构**：

```Plain Text
描述内容 --参数 值
```

**核心语法**：

- 多权重：`关键词::权重`（如 `hot dog::2 food::-1`）

- 反向提示词：`-no text, watermark, blur`

- 参数写在最后，前面加空格

**常用参数**：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| --ar | 宽高比 | --ar 16:9 |
| --s | 风格化程度(0-1000) | --s 200 |
| --c | 混乱度(0-100) | --c 20 |
| --v | 版本 | --v 7 |
| --raw | 减少MJ风格，更忠实提示词 | --raw |
| --sref | 风格参考图片 | --sref [图片URL] |
| --oref | 主体参考（V7新功能） | --oref [图片URL] |
| --draft | 快速模式（10倍速，半价） | --draft |
| --tile | 无缝贴图 | --tile |
| --no | 排除元素 | --no text, watermark |

#### 1.2 FLUX.2

**基本结构**：

```Plain Text
自然语言描述，无需特殊语法
```

**重要特点**：

- ❌ **不支持反向提示词**（--no无效）

- ✅ 用自然语言描述你想要的内容

- ✅ 词序很重要：最重要的元素放最前面

- ✅ 支持JSON结构化提示词

- ✅ 支持HEX颜色码：`color #FF5733`

**提示词长度**：

- 短（10-30词）：快速概念

- 中（30-80词）：最佳长度

- 长（80+词）：复杂场景

**结构**：主体 + 动作 + 风格 + 场景

#### 1.3 Stable Diffusion (ComfyUI/WebUI)

**基本结构**：

```Plain Text
正向提示词
---
反向提示词
```

**核心语法**：

- 权重控制：`(关键词:1.5)` 增强，`(关键词:0.7)` 减弱

- 负面提示词：单独填写

- 支持BREAK分段

#### 1.4 ChatGPT Image (DALL-E)

**基本结构**：

```Plain Text
自然语言描述
```

**关键原则**：

- 第一句话权重最高，把主体放最前面

- 指定具体相机型号：`Shot on Hasselblad 500C`

- 指定3-5个具体颜色，防止过饱和

- 明确排除：`No text, no watermarks`

- 灯光是最关键的细节

### 二、通用质量词库

以下词汇适用于所有平台，加在提示词末尾可提升画质。

#### 2.1 画质提升词

```Plain Text
8k, ultra HD, high resolution, masterpiece, best quality,
highly detailed, sharp focus, professional, award-winning,
photorealistic, hyperrealistic, intricate details
```

#### 2.2 光影控制词

```Plain Text
cinematic lighting, golden hour, blue hour, soft lighting,
dramatic lighting, rim light, backlit, volumetric lighting,
Rembrandt lighting, studio lighting, natural light,
neon lights, ambient light, chiaroscuro
```

#### 2.3 镜头/相机词

```Plain Text
shot on Canon EOS R5, shot on Sony A7IV, shot on Hasselblad,
85mm f/1.4, 35mm wide angle, macro lens, telephoto lens,
shallow depth of field, bokeh, f/1.4, f/2.8, f/8,
Kodak Portra 400, Fuji Pro 400H, film grain
```

### 三、风格词库

#### 3.1 写实摄影风格

```Plain Text
photorealistic, editorial photography, documentary style,
street photography, portrait photography, fashion photography,
lifestyle photography, photojournalism, studio portrait,
magazine cover, Apple-level commercial photography
```

**Midjourney专用**：

```Plain Text
--s 50 --raw
```

#### 3.2 动漫/二次元风格

```Plain Text
anime style, manga style, Japanese illustration,
Studio Ghibli style, Makoto Shinkai style, cel shading,
vibrant colors, clean lines, anime eyes, kawaii
```

**Midjourney专用**：

```Plain Text
--niji 7
```

#### 3.3 油画/水彩/素描

```Plain Text
oil painting, watercolor painting, pencil sketch,
charcoal drawing, acrylic painting, impressionist style,
Van Gogh style, Monet style, classical painting,
fine art, gallery quality
```

#### 3.4 赛博朋克/科幻

```Plain Text
cyberpunk, sci-fi, futuristic, neon city, holographic,
dystopian, blade runner style, synthwave, retrowave,
glitch art, digital art, concept art
```

#### 3.5 中国风/古风

```Plain Text
Chinese traditional art, ink wash painting, guofeng,
Chinese calligraphy, ancient Chinese style, hanfu,
Song Dynasty aesthetic, traditional Chinese architecture,
water ink style, eastern aesthetic
```

#### 3.6 像素风/复古游戏

```Plain Text
pixel art, 16-bit style, retro game art, 8-bit style,
NES style, Game Boy style, PICO-8 palette, voxel art,
isometric pixel art, sprite art
```

#### 3.7 扁平设计/插画

```Plain Text
flat design, vector illustration, minimalist illustration,
geometric art, line art, minimalist, clean design,
graphic design, poster design, editorial illustration
```

#### 3.8 3D渲染

```Plain Text
3D render, Octane render, Unreal Engine 5, Cinema 4D,
Blender 3D, isometric 3D, clay render, low poly,
holographic, iridescent, metallic texture
```

### 四、场景词库

#### 4.1 人物肖像

```Plain Text
portrait of a [age] [gender], [clothing description],
[expression], [pose], [background], [lighting],
professional headshot, close-up portrait, full body shot
```

#### 4.2 风景/自然

```Plain Text
[landscape type] at [time of day], [weather condition],
[mountain/ocean/forest/desert], dramatic sky,
panoramic view, aerial view, golden hour, misty morning
```

#### 4.3 城市/建筑

```Plain Text
[city name] skyline, urban landscape, modern architecture,
Gothic cathedral, Japanese temple, brutalist building,
interior design, minimalist room, cozy café
```

#### 4.4 美食/产品

```Plain Text
[gfood name] on [surface], overhead flat-lay,
studio lighting, styled with [props], food photography,
product shot, hero shot, lifestyle product photo
```

#### 4.5 抽象/概念

```Plain Text
abstract art, geometric patterns, fluid art,
surrealism, dreamscape, cosmic, ethereal,
metaphysical, conceptual art, visual metaphor
```

### 五、反向提示词模板

#### 5.1 通用反向提示词（适用于SD/ComfyUI）

```Plain Text
low quality, worst quality, blurry, out of focus,
watermark, text, logo, signature, username,
deformed, disfigured, mutated, extra limbs,
bad anatomy, bad proportions, ugly, duplicate
```

#### 5.2 人物专用反向提示词

```Plain Text
bad hands, extra fingers, missing fingers, fused fingers,
too many fingers, malformed limbs, extra arms, extra legs,
disconnected limbs, mutation, mutilated, poorly drawn face,
poorly drawn hands, missing arms, missing legs
```

#### 5.3 风景专用反向提示词

```Plain Text
oversaturated, overexposed, underexposed, noise, grain,
chromatic aberration, lens flare, motion blur,
artifacts, JPEG artifacts, compression artifacts
```

#### 5.4 Midjourney 反向提示词

```Plain Text
--no text, watermark, logo, signature, blurry,
low quality, deformed, ugly, duplicate
```

### 六、10个即用提示词模板

#### 模板1：电影感人像

**Midjourney**：

```Plain Text
A young woman reading a book in a sunlit library,
golden hour light streaming through tall windows,
shallow depth of field, shot on 85mm f/1.4,
Kodak Portra 400 film grain, cinematic mood
--ar 2:3 --s 200 --v 7
```

**FLUX**：

```Plain Text
A young woman reading a book at a sunlit café, warm natural light
streaming through tall windows, relaxed morning atmosphere,
contemporary lifestyle photography, shot on 35mm, slight film grain
```

#### 模板2：产品展示图

**Midjourney**：

```Plain Text
Minimalist ceramic coffee mug on marble surface,
studio lighting, three-point softbox setup,
clean white background, commercial photography,
shot on Hasselblad, sharp focus
--ar 1:1 --s 50 --v 7
```

**ChatGPT Image**：

```Plain Text
Hero product shot of a matte black ceramic coffee mug on polished
concrete surface. Soft gradient background. Studio lighting from
camera left. 90mm macro lens, f/8, sharp focus throughout.
Apple-level commercial photography. No text, no watermarks.
```

#### 模板3：奇幻概念艺术

**Midjourney**：

```Plain Text
Ancient dragon perched on crystal mountain peak,
dramatic storm clouds, volumetric lighting,
epic scale, concept art, artstation trending
--ar 16:9 --s 500 --c 20 --v 7
```

**SD/ComfyUI**：

```Plain Text
(masterpiece:1.4), best quality, ancient dragon on crystal mountain,
storm clouds, volumetric lighting, epic scale, concept art,
artstation, highly detailed, sharp focus
---
low quality, blurry, watermark, text, ugly
```

#### 模板4：复古胶片风

**FLUX**：

```Plain Text
Baby penguins in a trampoline park having the time of their lives,
80s vintage photo, shot on Kodak Portra 400, warm tones,
film grain, nostalgic atmosphere, soft focus
```

#### 模板5：中国古风

**SD/ComfyUI**：

```Plain Text
(masterpiece:1.4), best quality, ancient Chinese beauty in hanfu,
standing by a lotus pond, traditional Chinese garden,
ink wash painting style, guofeng, soft lighting,
water ink style, eastern aesthetic, highly detailed
---
modern, western, ugly, deformed, blurry, watermark
```

**Midjourney**：

```Plain Text
Ancient Chinese beauty in flowing hanfu dress, standing by a lotus
pond in a traditional garden, ink wash painting style, ethereal mist,
Chinese traditional art, elegant composition
--ar 2:3 --s 300 --v 7
```

#### 模板6：赛博朋克城市

**Midjourney**：

```Plain Text
Neon-lit cyberpunk city street at night, rain reflections on wet
pavement, holographic advertisements, flying cars, blade runner
atmosphere, dramatic lighting, cinematic wide shot
--ar 16:9 --s 400 --v 7
```

#### 模板7：美食摄影

**ChatGPT Image**：

```Plain Text
Overhead flat-lay of handmade ramen bowl on weathered wooden table.
Rich tonkotsu broth, soft-boiled egg, chashu pork, green onions,
nori. Warm natural light from above. Styled with chopsticks,
sesame seeds, and linen napkin. Shot in Bon Appétit editorial style.
No text, no logos.
```

#### 模板8：App图标/Logo

**Midjourney**：

```Plain Text
Minimalist app icon for a music player, gradient purple to blue,
clean geometric design, rounded corners, flat design,
Apple iOS style, white background
--ar 1:1 --s 100 --v 7
```

#### 模板9：动漫角色

**Midjourney**：

```Plain Text
Anime girl with silver hair and blue eyes, wearing school uniform,
cherry blossom petals falling, soft sunlight,
Studio Ghibli style, detailed background, warm colors
--ar 2:3 --s 250 --niji 7
```

#### 模板10：封面图/海报

**ChatGPT Image**：

```Plain Text
Professional magazine cover design. Bold geometric composition
with a single red rose in the center. Minimalist layout,
clean typography space at top. Dark navy background.
Studio lighting, macro lens, f/2.8, sharp focus on petals.
Editorial quality. No text, no watermarks.
```

### 七、提示词写作技巧

#### 7.1 通用原则

1. **主体放最前面**：第一句话权重最高

1. **具体胜过模糊**："Canon EOS R5拍摄" 比 "高清" 好

1. **灯光是关键**：指定灯光类型效果提升最大

1. **指定风格参考**："Studio Ghibli style" 比 "好看" 有效

1. **控制长度**：太短缺乏细节，太长互相冲突

#### 7.2 各平台注意事项

| 平台 | 注意事项 |
| --- | --- |
| Midjourney | 参数写在最后；用 --raw 减少AI味 |
| FLUX | 不支持反向提示词；用自然语言 |
| SD/ComfyUI | 权重用 (word:1.5) 语法；反向提示词很重要 |
| ChatGPT Image | 明确说"No text, no watermarks" |

#### 7.3 迭代优化方法

1. 先写一个简单版本，看看效果

1. 根据结果调整：加细节、改风格、换灯光

1. 用种子固定好的结果，微调提示词

1. 一次只改一个变量，方便对比

### 八、常用提示词资源站

| 站点 | 网址 | 说明 |
| --- | --- | --- |
| PromptHero | [prompthero.com](http://prompthero.com/) | 全球最大提示词社区 |
| LiblibAI | liblib.art | 国内最大，中文友好 |
| Civitai | [civitai.com](http://civitai.com/) | SD模型+提示词（需VPN） |
| AiShort | aishort.top | 中文ChatGPT提示词 |
| Midjourney官方 | [midjourney.com/showcase](http://midjourney.com/showcase) | 官方作品展示 |

*收藏这篇文章，下次写提示词的时候直接翻出来用。*

### 九、相关推荐

- [**ChatGPT image2 生图经验分享，新手也能快速上手的实用入门指南**](https://okfinish.com/article/mj-basic)

- [**2026最新 Google Gemini Omni 完全使用指南：AI视频生成新时代来了**](https://okfinish.com/article/omni)

- [**2026年免费AI API接口大全：DeepSeek、Qwen、ChatGPT、Gemini等主流大模型免费调用指南**](https://okfinish.com/article/aiInterface)
