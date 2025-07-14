# 可用资源与工具

---

为了帮助你更好地完成本次考察任务, 我们提供并推荐以下一些免费的在线工具. 你完全可以自由选择任何你熟悉的工具, 这里列出的仅作为参考.

## Webhook 测试

**[Webhook.site](https://webhook.site/)**

- **用途:** 当你在开发需要发送 Webhook 通知的功能时 (例如 "价差监控服务" 题目中的要求), 你需要一个能够接收并展示你发出的 HTTP 请求的服务. `Webhook.site` 就是为此而生的.
- **如何使用:**
    1. 打开 [https://webhook.site/](https://webhook.site/).
    2. 网站会自动为你生成一个唯一的 URL, 例如 `https://webhook.site/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
    3. 将这个 URL 配置到你的程序中作为 Webhook 的目标地址.
    4. 当你的程序发送 POST 请求到这个 URL 时, 你可以在 `Webhook.site` 的页面上实时看到请求的详细内容, 包括 Headers 和 Body, 非常便于调试.

## 量化交易工具包

**[tqsdk (天勤量化)](https://www.shinnytech.com/tqsdk/)**

- **用途:** 一个功能强大的 Python 量化交易工具包, 支持实时行情、历史数据、模拟交易和实盘交易. "可配置的多策略价差监控服务" 题目要求使用此库来完成.
- **如何使用:**
    - **安装:** `pip install tqsdk`
    - **文档:** 强烈建议在开始前阅读其 [官方文档](https://www.shinnytech.com/tqsdk/docs/latest/index.html), 特别是关于 `TqApi` 的使用和异步编程的部分.
    - **GitHub:** 你也可以在 [官方 GitHub 仓库](https://github.com/shinnytech/tqsdk-python) 中找到很多有用的示例代码.

## API 设计与文档

**[Swagger Editor](https://editor.swagger.io/)**

- **用途:** 一个在线的 OpenAPI (曾用名 Swagger) 规范编辑器. 你可以在左边编写 YAML 或 JSON 格式的 API 定义, 右边会实时渲染出漂亮的、可交互的 API 文档. 这对于完成需要 API 设计的任务非常有帮助.

## Python 开发环境

**[venv](https://docs.python.org/3/library/venv.html)**

- **用途:** Python 官方内置的虚拟环境管理工具. 强烈建议你在一个独立的虚拟环境中开始你的项目, 以避免包依赖冲突.
- **如何使用:**
    - 创建环境: `python -m venv .venv`
    - 激活环境 (macOS/Linux): `source .venv/bin/activate`
    - 激活环境 (Windows): `.venv\Scripts\activate`

## 推荐 Python 库

以下是一些在完成任务时可能会用到的高质量 Python 库:

- **Web 框架:**
    - **[FastAPI](https://fastapi.tiangolo.com/):** 一个现代、高性能的 Python Web 框架, 特别适合构建 API. 它内置了基于 Pydantic 的数据校验和 OpenAPI 文档自动生成功能.
    - **[Flask](https://flask.palletsprojects.com/):** 一个轻量级的、灵活的 Python Web 框架, 非常适合快速搭建中小型应用.
- **数据校验:**
    - **[Pydantic](https://docs.pydantic.dev/):** 用于数据校验和设置管理的库. 可以用它来定义清晰的数据模型, 无论是用于 API 的请求体, 还是用于解析配置文件, 都非常方便.
- **配置文件解析:**
    - **[PyYAML](https://pyyaml.org/wiki/PyYAMLDocumentation):** 用于解析 `YAML` 格式配置文件的标准库.
- **数值计算:**
    - **[NumPy](https://numpy.org/):** Python 科学计算的基础库, 处理数值运算时非常高效. 在实现 Black-Scholes 模型时可能会用到.

## 代码风格

**[Black](https://github.com/psf/black)**

- **用途:** "The uncompromising code formatter". 一个强大的、风格统一的 Python 代码格式化工具. 在提交你的代码前, 使用 Black 对项目进行格式化, 可以确保代码整洁、规范.
- **如何使用:**
    - 安装: `pip install black`
    - 运行: `black .` (在你的项目根目录下执行)

**[Ruff](https://docs.astral.sh/ruff/)**

- **用途:** 一个用 Rust 编写的、速度极快的 Python Linter 和代码格式化工具. 它可以替代多个工具 (如 Flake8, isort, pyupgrade), 并且也包含了一个兼容 Black 的格式化器.
- **如何使用:**
    - 安装: `pip install ruff`
    - 检查代码问题 (Lint): `ruff check .`
    - 格式化代码: `ruff format .` 