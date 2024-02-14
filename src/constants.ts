import { ChainId, Token } from '@uniswap/sdk-core'

export const ServerUrl = 'https://api.xtreamly.io'

export const QuotePriceAPIUrl = `${ServerUrl}/quoted_price_gas_fee_pool_address`

export const PredictSlippageAPIUrl = `${ServerUrl}/predict_slippage`

export const PublicTestAPIBetaKey = 'lKFdfPEe3xaW5nq1rPNMNaQtrI0ffTmIUhU6SMAa'

export const RpcNodeUrl = 'https://nd-hrmrouztdfhwnmw5pn255q3i7a.t.ethereum.managedblockchain.eu-west-2.amazonaws.com?billingtoken=nVBr2VZ5akyj5lRHEOGxobat73ULeOZbm7nBagveIH'

// Currencies and Tokens
export const MATIC_TOKEN_POLYGON = new Token(
    ChainId.POLYGON,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
)

export const USDT_TOKEN_POLYGON = new Token(
    ChainId.POLYGON,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    6,
    'USDT',
    'USDT'
)

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

export const SupportedTokensPolygon: Record<string, Token> = {
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': MATIC_TOKEN_POLYGON,
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': USDT_TOKEN_POLYGON
}

export const SupportedTokensETH: Record<string, Token> = {
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': WETH_TOKEN_ETH,
    '0xdac17f958d2ee523a2206206994597c13d831ec7': USDT_TOKEN_ETH
}
