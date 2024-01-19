import { QuotedPriceAPIBetaKey, QuotePriceAPIUrl } from "./constants";

export async function getQuote(tokenInAddress: string, tokenOutAddress: string, amountIn: number, decimalIn: number, decimalOut: number, fee: number) {

    const url = `${QuotePriceAPIUrl}?tokenInAddress=${tokenInAddress}&tokenOutAddress=${tokenOutAddress}&amountIn=${amountIn}&decimalIn=${decimalIn}&decimalOut=${decimalOut}&fee=${fee}`

    console.log(url)

    const rawRes = await fetch(
        url,
        {
            method: 'GET',
            headers: {
                // "Content-Type": "application/json",
                "x-api-key": QuotedPriceAPIBetaKey,
            },
        }
    )

    const res = await rawRes.json()
    return res
}
