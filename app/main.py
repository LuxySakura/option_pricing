from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
import numpy as np
from scipy.stats import norm

app = FastAPI(
    title="期权定价API",
    description="基于Black-Scholes模型的期权定价计算器API",
    version="0.1.0",
)

# --- 自定义异常处理器 ---
# 创建一个从 Pydantic 错误类型到中文消息的映射
PYDANTIC_ERROR_PARAM_MAP = {
    "spot_price": "标的当前价格",
    "strike_price": "行权价格",
    "time_to_maturity": "到期时间",
    "volatility": "波动率",
    "risk_free_rate": "无风险利率",
    "q": "股息率",
}

PYDANTIC_ERROR_MSG_MAP = {
    "greater_than": "输入值必须大于 {gt}",
    "greater_than_equal": "输入值必须大于或等于 {ge}",
    "less_than": "输入值必须小于 {lt}",
    "less_than_equal": "输入值必须小于或等于 {le}",
}


# 当Pydantic模型验证失败时，FastAPI会抛出RequestValidationError
# 使用@app.exception_handler来捕获这个异常，并自定义返回的中文响应。
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    捕获请求体验证错误并返回自定义的中文错误响应。
    """
    error_messages = []
    for error in exc.errors():
        field = " -> ".join(map(str, error["loc"][1:]))  # 从 'body' 之后开始取字段名
        error_type = error["type"]

        # 尝试从映射中获取中文消息模板
        message_template = PYDANTIC_ERROR_MSG_MAP.get(error_type)
        param_template = PYDANTIC_ERROR_PARAM_MAP.get(field)

        # 调整参数为中文
        if param_template:
            field = param_template

        if message_template:
            # 如果有上下文信息 (如 gt=0)，则用它来格式化消息
            # error.get('ctx') 会返回一个像 {'gt': 0} 这样的字典
            if error.get("ctx"):
                message = message_template.format(**error["ctx"])
            else:
                message = message_template
        else:
            # 如果映射中没有找到对应的中文模板，则使用 Pydantic 的默认英文消息
            message = error["msg"]

        error_messages.append(f"参数 '{field}' 无效: {message}")

    # 将所有错误信息合并为一个字符串
    detail = "; ".join(error_messages)

    # 返回一个HTTP 400错误，并将自定义的错误信息放在 "detail" 字段中
    return JSONResponse(
        status_code=400,
        content={"detail": f"输入数据校验失败: {detail}"},
    )


# --- 输入和输出模型 ---


# 定义输入表单的class
class OptionPricingInput(BaseModel):
    """期权定价输入参数模型"""

    # 期权方向
    is_call: bool = Field(
        ..., description="期权方向：True为看涨(Call)，False为看跌(Put)"
    )
    # 标的资产当前价格
    spot_price: float = Field(..., gt=0, description="标的资产当前市场价格，必须大于0")
    # 行权价格
    strike_price: float = Field(..., gt=0, description="行权价格，必须大于0")
    # 到期时间
    time_to_maturity: float = Field(
        ..., ge=0, description="期权剩余到期时间（年），必须大于等于0"
    )
    # 无风险利率
    risk_free_rate: float = Field(..., description="无风险利率")
    # 波动率
    volatility: float = Field(..., gt=0, description="波动率，必须大于0")
    # 年化连续股息率
    q: float = Field(..., ge=0, description="年化连续股息率，必须大于等于0")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "is_call": True,
                "spot_price": 100.0,
                "strike_price": 95.0,
                "time_to_maturity": 0.5,
                "risk_free_rate": 0.05,
                "volatility": 0.2,
                "q": 0.0,
            }
        }
    )


class OptionPricingOutput(BaseModel):
    """期权定价输出结果模型"""

    option_price: float = Field(..., description="期权价格")
    option_type: str = Field(..., description="期权类型：Call或Put")


# --- 核心计算逻辑 ---


def black_scholes_price(
    is_call: bool, S: float, K: float, T: float, r: float, sigma: float, q: float
) -> float:
    """计算包含连续股息率的Black-Scholes-Merton期权价格

    参数:
        is_call (bool): 是否为看涨期权
        S (float): 标的资产当前价格
        K (float): 行权价格
        T (float): 到期时间（年）
        r (float): 无风险利率
        sigma (float): 波动率
        q (float): 年化连续股息率

    返回:
        float: 期权价格
    """
    # 防止因时间或波动率无效而产生数学错误
    if T <= 0 or sigma <= 0:
        # 如果到期，期权价格即为内在价值
        return max(S - K, 0) if is_call else max(K - S, 0)

    # 1. 修改d1的计算，引入股息率q
    d1 = (np.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if is_call:
        # 2. 修改看涨期权价格公式，对S进行股息贴现
        price = S * np.exp(-q * T) * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    else:
        # 3. 修改看跌期权价格公式，对S进行股息贴现
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * np.exp(-q * T) * norm.cdf(-d1)

    return round(price, 2)


# --- API 路由 ---


@app.get("/")
def read_root():
    return {"message": "欢迎使用期权定价API"}


@app.post("/api/price", response_model=OptionPricingOutput)
def calculate_option_price(input_data: OptionPricingInput):
    """
    计算期权价格。
    输入数据会由OptionPricingInput模型自动验证。
    如果验证失败，`validation_exception_handler`会捕获错误并返回400响应。
    """
    try:
        price = black_scholes_price(
            is_call=input_data.is_call,
            S=input_data.spot_price,
            K=input_data.strike_price,
            T=input_data.time_to_maturity,
            r=input_data.risk_free_rate,
            sigma=input_data.volatility,
            q=input_data.q,
        )

        return OptionPricingOutput(
            option_price=price,
            option_type="看涨期权(Call)" if input_data.is_call else "看跌期权(Put)",
        )
    except Exception as e:
        # 这个try-except块现在主要用于捕获计算过程中可能出现的其他运行时错误
        raise HTTPException(status_code=500, detail=f"内部计算错误: {str(e)}")
