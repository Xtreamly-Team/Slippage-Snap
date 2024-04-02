import { ChainId, Token } from '@uniswap/sdk-core'

export const ServerUrl = 'https://api.xtreamly.io'

export const QuotePriceAPIUrl = `${ServerUrl}/quoted_price_gas_fee_pool_address`

export const PredictSlippageAPIUrl = `${ServerUrl}/predict_slippage`

export const PublicTestAPIBetaKey = 'lKFdfPEe3xaW5nq1rPNMNaQtrI0ffTmIUhU6SMAa'

export const RpcNodeUrl = 'https://nd-hrmrouztdfhwnmw5pn255q3i7a.t.ethereum.managedblockchain.eu-west-2.amazonaws.com?billingtoken=nVBr2VZ5akyj5lRHEOGxobat73ULeOZbm7nBagveIH'

// Currencies and Tokens
export const WETH_TOKEN_ETH = new Token(
    ChainId.MAINNET,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    18,
    'WETH',
    'Wrapped Ether'
)

export const USDT_TOKEN_ETH = new Token(
    ChainId.MAINNET,
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    6,
    'USDT',
    'USDT'
)

export const USDC_TOKEN_ETH = new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USDC'
)

export const SupportedTokensETH: Record<string, Token> = {
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': WETH_TOKEN_ETH,
    '0xdac17f958d2ee523a2206206994597c13d831ec7': USDT_TOKEN_ETH,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': USDC_TOKEN_ETH
}

export const CEXEquivalentSymbols: Record<string, string> = {
    'WETH': 'ETH',
    'WBTC': 'BTC',
    'USDT': 'USDT',
    'USDC': 'USDC'
}


export function getTradingSymbol(base: Token, quote: Token) {
    return `${CEXEquivalentSymbols[base.symbol!]}-${CEXEquivalentSymbols[quote.symbol!]}`
}
