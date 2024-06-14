import { PredictSlippageAPIUrl, PublicTestAPIBetaKey, QuotePriceAPIUrl } from "./constants"
import { SwapPath } from "./decode"
import { PoolVolatilitiesSnapshot } from "./models"

export async function predictIndicators(tokenInAddress: string, tokenOutAddress: string, amountIn: number, decimalIn: number, decimalOut: number, isBuy: boolean, fee: number, symbol: string, paths: SwapPath[]): Promise<any> {
    try {
        const url = `${PredictSlippageAPIUrl}?tokenInAddress=${tokenInAddress}&tokenOutAddress=${tokenOutAddress}&amountIn=${amountIn}&decimalIn=${decimalIn}&decimalOut=${decimalOut}&fee=${fee}&isBuy=${isBuy}&symbol=${symbol}`

        const rawRes = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    "x-api-key": PublicTestAPIBetaKey,
                },
                body: JSON.stringify({ paths: paths })
            }
        )

        const res = await rawRes.json()
        return {
            slippage: res['slippage'],
            volatility: res['volatility'],
            price: res['price']
        }
        return res['slippage_percentage']
    } catch (error) {
        throw Error('Error communicating with the server')
    }
}

export async function getQuote(tokenInAddress: string, tokenOutAddress: string, amountIn: number, decimalIn: number, decimalOut: number, fee: number) {

    const url = `${QuotePriceAPIUrl}?tokenInAddress=${tokenInAddress}&tokenOutAddress=${tokenOutAddress}&amountIn=${amountIn}&decimalIn=${decimalIn}&decimalOut=${decimalOut}&fee=${fee}`

    try {
        const rawRes = await fetch(
            url,
            {
                method: 'GET',
                headers: {
                    "x-api-key": PublicTestAPIBetaKey,
                },
            }
        )

        const res = await rawRes.json()
        return res
    } catch (error) {
        throw Error('Error communicating with the server')
    }
}

const SERVER_HOST = 'https://test.xtreamly.io:5000';
const API_URL = `${SERVER_HOST}/api/v1`;

// Takes second not millisecond
export async function getVolatilityForIntervals(intervals: number[]): Promise<PoolVolatilitiesSnapshot[]> {
    let volatilitySnapshots: PoolVolatilitiesSnapshot[] = [];
    let requestUrl = `${API_URL}/Volatility/GetVolatilityForAllPools`
    for (let i = 0; i < intervals.length - 1; i++) {
        const response = await fetch(`${requestUrl}?start=${intervals[i]}&end=${intervals[i+1]}`,
        );
        const rawRes = await response.json();
        const poolVolatilities = PoolVolatilitiesSnapshot.fromServerResponse(intervals[i], rawRes);
        volatilitySnapshots.push(poolVolatilities)
    }

    return volatilitySnapshots
}
