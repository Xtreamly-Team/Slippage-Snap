export interface PoolData {
    // basic token info
    address: string
    blockNumber: number
    timestamp: number
    feeTier: number

    token0: {
        name: string
        symbol: string
        address: string
        decimals: number
        derivedETH: number
    }

    token1: {
        name: string
        symbol: string
        address: string
        decimals: number
        derivedETH: number
    }

    // for tick math
    liquidity: number
    sqrtPrice: number
    tick: number

    // volume
    volumeUSD: number
    volumeUSDChange: number
    volumeUSDWeek: number

    // liquidity
    tvlUSD: number
    tvlUSDChange: number

    // prices
    token0Price: number
    token1Price: number

    // token amounts
    tvlToken0: number
    tvlToken1: number
}


// The following is the type definition for the data returned by the subgraph.
export interface PoolFields {
    id: string
    feeTier: string
    liquidity: string
    sqrtPrice: string
    tick: string
    token0: {
        id: string
        symbol: string
        name: string
        decimals: string
        derivedETH: string
    }
    token1: {
        id: string
        symbol: string
        name: string
        decimals: string
        derivedETH: string
    }
    token0Price: string
    token1Price: string
    volumeUSD: string
    volumeToken0: string
    volumeToken1: string
    txCount: string
    totalValueLockedToken0: string
    totalValueLockedToken1: string
    totalValueLockedUSD: string
}

export interface BlockData {
    id: string
    timestamp: number
    gasUsed: number
    gasLimit: number
    number: number
    size: number
}

export interface BlockFields {
    id: string
    timestamp: string
    gasUsed: string
    gasLimit: string
    number: string
    size: string
}

// The following is the type definition for the data returned by the subgraph.
export interface SwapFields {
    id: string
    sender: string
    recipient: string
    amount0: string
    amount1: string
    amountUSD: string
    sqrtPriceX96: string
    tick: string
    timestamp: string
    origin: string
    pool: {
        id: string
    }
    token0: {
        id: string
        symbol: string
    }
    token1: {
        id: string
        symbol: string
    }
    transaction: {
        blockNumber: string
        gasPrice: string
        gasUsed: string
        id: string
        timestamp: string
    }
}

export class SwapData {
    blockNumber: number
    timestamp: number
    gasPrice: number
    gasUsed: number
    hash: string
    amount0: number
    amount1: number
    amountUSD: number
    sqrtPriceX96: number
    executionPrice: number
    tick: number
    sender: string
    recipient: string
    origin: string
    poolAddress: string
    token0Address: string
    token1Address: string
    token0Symbol: string
    token1Symbol: string
    isBuy: boolean

    constructor(swapData: SwapFields) {
        this.hash = swapData.transaction.id
        this.blockNumber = parseInt(swapData.transaction.blockNumber)
        this.timestamp = parseInt(swapData.transaction.timestamp)
        this.gasPrice = parseFloat(swapData.transaction.gasPrice)
        this.gasUsed = parseFloat(swapData.transaction.gasUsed)
        this.amount0 = parseFloat(swapData.amount0)
        this.amount1 = parseFloat(swapData.amount1)
        this.amountUSD = parseFloat(swapData.amountUSD)
        this.sqrtPriceX96 = parseFloat(swapData.sqrtPriceX96)
        this.executionPrice = Math.abs(parseFloat(swapData.amount1) / parseFloat(swapData.amount0))
        this.tick = parseInt(swapData.tick)
        this.sender = swapData.sender
        this.recipient = swapData.recipient
        this.origin = swapData.origin
        this.poolAddress = swapData.pool.id
        this.token0Address = swapData.token0.id
        this.token1Address = swapData.token1.id
        this.token0Symbol = swapData.token0.symbol
        this.token1Symbol = swapData.token1.symbol
        this.isBuy = this.amount0 > 0
        return this
    }
}
