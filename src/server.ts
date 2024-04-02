import { PredictSlippageAPIUrl, PublicTestAPIBetaKey, QuotePriceAPIUrl } from "./constants"

export async function predictSlippage(tokenInAddress: string, tokenOutAddress: string, amountIn: number, decimalIn: number, decimalOut: number, isBuy: boolean, fee: number, symbol: string): Promise<number> {

    try {
        const url = `${PredictSlippageAPIUrl}?tokenInAddress=${tokenInAddress}&tokenOutAddress=${tokenOutAddress}&amountIn=${amountIn}&decimalIn=${decimalIn}&decimalOut=${decimalOut}&fee=${fee}&isBuy=${isBuy}&symbol=${symbol}`

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
