const baseUrl = 'https://aws.something.com/api/v1'

const generateTokenBaseUrl = `${baseUrl}/Authentication/GenerateToken`

const slippagePredictBaseUrl = `${baseUrl}/Slippage`

export async function predictSlippage(amountIn: number, gasPrice: number, isBuy: boolean, poolAddress: string, fee: number): Promise<number> {

    return 200;
    const authResRaw = await fetch(generateTokenBaseUrl)

    const authValue = (await authResRaw.json())['token']

    const slippagePredictUrl = `${slippagePredictBaseUrl}?amountIn=${amountIn}&gasPrice=${gasPrice}&isBuy=${isBuy}&poolAddress=${poolAddress}&feeTier=${fee}`

    const slippageResRaw = await fetch(slippagePredictUrl, {
        headers: {
            'Authorization': `Bearer ${authValue}`
        }
    })

    const slippageValue = (await slippageResRaw.json())['slippage']

    return slippageValue
}
