from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Optional
import numpy as np
from scipy.stats import norm

app = FastAPI(
    title="期权定价API",
    description="基于Black-Scholes模型的期权定价计算器API",
    version="0.1.0"
)


class OptionPricingInput(BaseModel):
    """期权定价输入参数模型"""
    is_call: bool = Field(..., description="期权方向：True为看涨(Call)，False为看跌(Put)")
    spot_price: float = Field(..., gt=0, description="标的资产当前市场价格")
    strike_price: float = Field(..., gt=0, description="行权价格")
    time_to_maturity: float = Field(..., ge=0, description="期权剩余到期时间（年）")
    risk_free_rate: float = Field(..., description="无风险利率")
    volatility: float = Field(..., gt=0, description="波动率")

    class Config:
        schema_extra = {
            "example": {
                "is_call": True,
                "spot_price": 100.0,
                "strike_price": 95.0,
                "time_to_maturity": 0.5,
                "risk_free_rate": 0.05,
                "volatility": 0.2
            }
        }


class OptionPricingOutput(BaseModel):
    """期权定价输出结果模型"""
    option_price: float = Field(..., description="期权价格")
    option_type: str = Field(..., description="期权类型：Call或Put")


def black_scholes_price(is_call: bool, S: float, K: float, T: float, r: float, sigma: float) -> float:
    """计算Black-Scholes期权价格
    
    参数:
        is_call (bool): 是否为看涨期权
        S (float): 标的资产当前价格
        K (float): 行权价格
        T (float): 到期时间（年）
        r (float): 无风险利率
        sigma (float): 波动率
        
    返回:
        float: 期权价格
    """
    # 防止除零错误
    if T == 0:
        # 如果到期时间为0，则期权价格为内在价值
        return max(S - K, 0) if is_call else max(K - S, 0)
    
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    
    if is_call:
        # 看涨期权价格
        return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    else:
        # 看跌期权价格
        return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)


@app.get("/")
def read_root():
    return {"message": "欢迎使用期权定价API"}


@app.post("/api/price", response_model=OptionPricingOutput)
def calculate_option_price(input_data: OptionPricingInput):
    """计算期权价格"""
    try:
        price = black_scholes_price(
            is_call=input_data.is_call,
            S=input_data.spot_price,
            K=input_data.strike_price,
            T=input_data.time_to_maturity,
            r=input_data.risk_free_rate,
            sigma=input_data.volatility
        )
        
        return OptionPricingOutput(
            option_price=price,
            option_type="Call" if input_data.is_call else "Put"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"计算错误: {str(e)}")