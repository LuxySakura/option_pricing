# 期权定价计算器 Web 应用
Option Pricing Project for ShinnyTech

## TODO 
- [√] 学习 Black-Scholes 模型
- [√] Python虚拟环境中初始化项目
- [√] API 设计数据结构
- [ ] 前端UI/UX设计
- [ ] 前端页面开发
- [ ] 减少后端服务器API压力处理
- [√] 依赖描述文件
- [√] 自动化测试文件
- [ ] **`README.md` 文档:**
    - [√] **环境设置:** 清晰说明如何配置本地环境、安装依赖.
    - [ ] **项目目录说明:**
    - [√] **运行指南:** 清晰说明如何运行你的程序和自动化测试.
    - [ ] **设计思路 (重要):** 介绍你的设计决策, 例如为什么选择某个数据结构, 如何组织代码以方便未来扩展等.
    - [ ] **假设与取舍 (加分项):** 如果你对需求做了任何假设, 或者在实现中做了某些权衡 (如性能与可读性), 请在此说明.
- [ ] 代码格式规范

## 代码目录结构说明

### `\venv`文件夹
该文件夹用于存储Python虚拟环境相关文件。
#### `\venv\Scripts`为Python虚拟环境相关文件以及对应的激活脚本


### `\app`文件夹
该文件夹包含后端API的源代码。
#### `\app\main.py`为后端期权定价模型代码

### `\frontend`文件夹
该文件夹包含前端应用的源代码。
#### `\frontend\react-app`文件夹存储基于React框架的前端代码

### `\scripts`文件夹
存储依赖安装以及运行相关的批处理脚本

### `\tests`文件夹
存储后端API测试的相关测试文件
#### `\tests\test_option_pricing.py`为后端期权定价API测试文件

## 环境设置

### 项目执行前提：已安装Node.js & Python
#### 推荐`Node.js`版本：`v22.13.0`
#### 推荐`Python`版本：`3.13.1`

### 一键安装所有依赖

本项目提供了一键安装脚本，可以自动创建Python虚拟环境并安装所有后端和前端依赖：
#### 1. 定位到脚本所在目录
```bash
cd scripts\bulid
```

#### 2. Windows CMD (批处理文件)

```bash
# 中文版安装脚本
build_all_for_one.bat

# 英文版安装脚本（如果遇到编码问题，请使用此版本）
build_all_for_one_en.bat
```

#### 2. Windows PowerShell

```powershell
# 首次运行可能需要设置执行策略
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 然后执行PowerShell脚本
.\build_all_for_one.ps1
```

### 手动安装 - Python虚拟环境

如果您希望手动安装依赖，可以按照以下步骤操作：

#### 1. 创建虚拟环境

虚拟环境已经创建在项目根目录下的`venv`文件夹中。如果需要重新创建，可以执行：

```bash
# 在项目根目录下执行
python -m venv venv
```

#### 2. 激活虚拟环境

**Windows系统：**

```bash
# CMD命令行
venv\Scripts\activate.bat

# PowerShell
.\venv\Scripts\Activate.ps1
```

**Linux/macOS系统：**

```bash
source venv/bin/activate
```

激活后，命令行前面会出现`(venv)`前缀，表示当前已在虚拟环境中。

#### 3. 安装后端依赖

```bash
pip install -r requirements.txt
```

#### 4. 安装前端依赖

```bash
cd frontend/react-app
npm install
cd ../..
```

#### 5. 退出虚拟环境

完成工作后，可以通过以下命令退出虚拟环境：

```bash
deactivate
```

## 运行指南

### 一键启动
本项目提供了多种启动脚本，以实现一键启动前后端服务：
#### 1. 首先定位到脚本所在的文件夹目录
```bash
cd scripts\run
```

#### 2. Windows CMD (批处理文件)

```bash
# 英文版启动脚本（推荐）
start_en.bat

# 或使用中文版启动脚本（如果遇到编码问题，请使用英文版）
start.bat
```

#### 2. Windows PowerShell

```powershell
# 首次运行可能需要设置执行策略
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 然后执行PowerShell脚本
.\start_dev.ps1
```

### 手动逐步启动

#### 1. 后端API服务

1.1 确保已激活虚拟环境（见上方"激活虚拟环境"步骤）

1.2 启动FastAPI服务：

```bash
# 在项目根目录下执行
uvicorn app.main:app --reload
```

服务将在 http://127.0.0.1:8000 上运行

1.3 访问API文档：
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

#### 2. 前端应用

项目还提供了基于React的现代化前端实现：

2.1 安装Node.js依赖：

```bash
# 在frontend/react-app目录下执行
npm install
```

2.2 构建生产版本：

```bash
# 在frontend/react-app目录下执行
npm run build
```

2.3 启动开发服务器：

```bash
# 在frontend/react-app目录下执行
npm start
```

应用将在 http://localhost:3000 上运行，并自动代理API请求到后端服务。

详细说明请参考 `frontend/react-app/README.md` 文件。

### 运行测试

```bash
# 在项目根目录下执行
python -m pytest
```

## 设计思路
总体思路：前端使用React框架进行编写；后端使用Python FastAPI进行定价模型的价格计算请求。
用户在前端提交表单后，将会调用`axios`库向`Python FastAPI`发送对应的`POST`请求，并将获得的`response`渲染到页面上

### 前端计算器界面
（基于React实现）
#### 前端计算器界面组件拆解
前端计算器可拆解为如下几个组件，其相关信息介绍如下：
- 表单组件(**OptionCalculator**)
    - 目标：获取用户要计算期权价格所需所有数据
    - 期权类型
        - 组件形式：radio
    - 标的当前市场价格
        - 组件形式：input
    - 提交按钮 -> 根据用户提交数据，调用后端API计算定价

- 价格显示组件
    - 目标：显示计算后的结果
- 错误信息提示组件
    - 目标：提示可能出现的错误信息

#### 前端用户鲁棒性设计
- [√] 表单提交项某项为空处理
- [ ] 提交参数不符合规范处理（例如，提交了非数字的字符串）
- [ ] 将后端错误信息以Dialog形式返回到前端进行渲染
- [√] 价格限制为两位小数
- [ ] 用户提交次数限制
- [√] 增加了到期时间单位的设置
- [√] 根据单位计算提交到后端的结果（按照交易日进行转换）

### 后端定价API
（基于FastAPI实现）
- 实现Black-Scholes期权定价模型的核心定价逻辑
由于Black-Scholes期权定价模型在处理**看涨期权**和**看跌期权**时对应不同的模型，因此API在处理时需要根据接收到的期权方向进行分别的计算。
#### Black-Scholes期权定价模型 API 涉及的数据结构
- 期权方向：看涨(Call)/看跌(Put)
    - 是否必填：是
    - 数据类型：Boolean
        - True -> Call
        - False -> Put
- 标的资产当前市场价格 **(Spot Price)**
    - 是否必填：是
    - 数据类型：Float（保留小数点后两位）
    - 取值范围：> 0
- 行权价格 **(Strike Price)**
    - 是否必填：是
    - 期权合约中规定的，未来可以用来买入（看涨）或卖出（看跌）标的资产的价格。它是衡量期权是价内、价外还是平价的关键基准。
    - 数据类型：Float（保留小数点后两位）
    - 取值范围：> 0
- 期权剩余到期时间 **T-t (Time to Maturity)**
    - 是否必填：是
    - 通常以年为单位，例如，一个3个月后到期的期权，其(T-t)就是0.25年。
    - 数据类型：Float（保留小数点后 n 位数）
    - 取值范围：>= 0
- 无风险利率 **r (Risk-Free Interst Rate)**
    - 是否必填：是
    - 指与期权期限相匹配的国债利率，代表了资金的时间价值
    - 被用来将未来的现金流（行权价格K）折现到当前价值
    - 数据类型：Float
    - 取值范围：负无穷 -> 正无穷
- 波动率 **σ (Volatility)**
    - 是否必填：是
    - 描述资产价格变动的程度，衡量资产价格在未来不确定性的大小
    - 模型中**唯一一个无法直接从市场观察到的参数**
    - 估计方法
        - 历史波动率：根据历史价格估算
        - 隐含波动率：从现有期权价格中反推
    - 数据类型：Float
    - 取值范围：> 0
- 股息率 **q (Dividend Yield)**
    - 是否必填：是
    - 标的资产的年化连续股息率
    - 数据类型：Float
    - 取值范围：>= 0
- N(d)
    - 是否必填：否（后端自行计算）
    - 标准正态分布的累计分布函数(CDF)，计算一个变量小于或等于d的概率。
#### API 接口设计
- Endpoint
    - `POST /api/price`：接收用户提交的表单数据，并计算对应的欧式期权价格
- API 核心文件路径：`app/main.py`
- `class OptionPricingInput(BaseModel)`:
    - 定义了一个类，存储前端输入表单提交的数据
    - 属性：
        - `is_call`: 期权方向，布尔类型，True 表示看涨，False 表示看跌
        - `spot_price`: 标的资产当前价格，浮点数类型
        - `strike_price`: 行权价格，浮点数类型
        - `time_to_maturity`: 到期时间，浮点数类型
        - `risk_free_rate`: 无风险利率，浮点数类型
        - `volatility`: 波动率，浮点数类型
        - `dividend_yield`: 年化连续股息率，浮点数类型
- `class OptionPricingOutput(BaseModel)`：
    - 定义了一个类，存储定价模型计算的结果
    - 属性：
        - `option_type`: 期权类型，字符串类型，"Call" 或 "Put"
        - `option_price`: 期权价格，浮点数类型

- `def black_scholes_price()`：
    - 后端API的核心方法，用于计算期权的定价
    - 输入：
        - 期权类型：`is_call`
        - 标的资产当前价格：`spot_price`
        - 行权价格：`strike_price`
        - 到期时间：`time_to_maturity`
        - 无风险利率：`risk_free_rate`
        - 波动率：`volatility`
        - 年化连续股息率：`dividend_yield`
    - 输出：期权价格`price`
- `def calculate_option_price()`：
    - API用于处理POST请求的函数，调用`def black_scholes_price()`计算期权价格并返回结果
- `def read_root()`：
    - API用于处理GET请求的函数，打印欢迎信息
#### 鲁棒性处理
本后端API使用Pydantic进行API的参数校验工作和报错提示。
同时定义了支持中文的报错参数字典`PYDANTIC_ERROR_PARAM_MAP` & 报错参数字典`PYDANTIC_ERROR_MSG_MAP`。使得API在检测到潜在错误时会发挥错误处的中文版本，方便用户更清晰认识潜在的错误。
- 处理无效参数（当参数无效时，后端返回对应的错误信息显示到前端）
    - 价格<=0
    - 时间<0
    - 波动率<=0
    - 股息率<0

### API 测试用例设计

**测试文件位置**
后端API对应的测试文件名为：`test_option_pricing.py`
对应路径为：`tests/test_option_pricing.py`

**执行测试**
在**虚拟环境激活 & 依赖已安装**的情况下，在根目录下执行如下命令：
```bash
pytest tests/test_option_pricing.py
```


**测试文件说明**
本测试文件包含如下三种测试用例，具体的测试用例说明如下：
- 正常测试用例
    - 正常情况 1：看涨期权计算，提交时间单位为年
        - 相关测试函数名：`test_call_option_pricing()`
        - 输入：看涨期权，S=100，K=105，T=1，r=0.05，σ=0.2, q=0
        - 输出：预期的看涨期权价格
    - 正常情况 2：看跌期权计算，提交时间单位为年
        - 相关测试函数名：`test_put_option_pricing()`
        - 输入：看跌期权，S=100，K=95，T=1，r=0.05，σ=0.2, q=0
        - 输出：预期的看跌期权价格
- 边界测试用例
    - 边界情况 1：期权剩余到期时间 = 0
        - 相关测试函数名：`test_zero_time_to_maturity()`
        - 输入：
            - {看涨期权，S=100，K=95，T=0，r=0.05，σ=0.2, q=0}
            - {看跌期权，S=100，K=95，T=0，r=0.05，σ=0.2, q=0}
        - 输出：到期时间为0的看涨/跌期权价格应等于内在价值
- 异常测试用例
    - 异常情况 1：期权剩余到期时间 < 0
        - 相关测试函数名：`test_neg_time_to_maturity()`
        - 输入：S=-10，K=95，T=-1.0，r=0.05，σ=0.2, q=0
        - 输出：预期的错误信息，解释输入的无效数据
    - 异常情况 2：当前标的资产价格 <= 0
        - 相关测试函数名：`test_zero_spot_price()`
        - 输入：S=-10，K=95，T=1.0，r=0.05，σ=0.2, q=0
        - 输出：预期的错误信息，解释输入的无效数据
    - 异常情况 3：行权价格 <= 0
        - 相关测试函数名：`test_zero_strike_price()`
        - 输入：S=10，K=-95，T=1.0，r=0.05，σ=0.2, q=0
        - 输出：预期的错误信息，解释输入的无效数据
    - 异常情况 4：波动率 <= 0
        - 相关测试函数名：`test_zero_volatility()`
        - 输入：S=10，K=-95，T=1.0，r=0.05，σ=0.0, q=0
        - 输出：预期的错误信息，解释输入的无效数据

## 假设/取舍
- Black-Scholes期权定价模型涉及的假设
    - 标的资产价格服从几何布朗运动，波动率恒定
    - 无风险利率已知且恒定
    - **期权类型**：欧式期权
- 前端表单参数设置
    - 假设用户已知期权到期时间
    - 假设用户已知期权波动率
    - 假设用户以及期权股息率
    - 假设用户已知当前无风险利率
- 前端匹配`timeUnit`时使用`find()`：第一个匹配项后就立即停止遍历，并只返回那一个元素，提高性能

## 依赖文件描述与说明

### python后端依赖
项目中Python后端 API运行过程中涉及到的各个依赖库及其版本信息存储在
`requirements.txt`文件中

### React前端依赖
项目中使用React框架进行前端系统的开发，涉及到的各个依赖库及其相关信息存储在
`/frontend/react-app/package.json`文件中
