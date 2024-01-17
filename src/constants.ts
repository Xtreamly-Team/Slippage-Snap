import { SupportedChainId, Token } from '@uniswap/sdk-core'

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'


export const EthUsdtPoolAddresses = ['0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
        '0x11b815efb8f581194ae79006d24e0d814b7697f6',
        '0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b',
        '0xc5af84701f98fa483ece78af83f11b6c38aca71d',]

export const POOLS_DICTIONARY = {
    'ETH-USDT': EthUsdtPoolAddresses,
}

// Currencies and Tokens

export const WETH_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether'
)

export const WBTC_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  18,
  'WBTC',
  'Wrapped Bitcoin'
)

export const AAVE_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
  18,
  'AAVE',
  'AAVE'
)

export const USDT_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'USDT'
)
