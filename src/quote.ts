import { ethers } from 'ethers'
import { CurrentConfig } from './config.js'
import { computePoolAddress } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json' assert { type: 'json' };
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' };
import {
    POOL_FACTORY_CONTRACT_ADDRESS,
    QUOTER_CONTRACT_ADDRESS,
} from './constants.js'
import { getProvider } from './providers.js'
import { toReadableAmount, fromReadableAmount } from './conversion.js'

export async function quote(): Promise<string> {
    const quoterContract = new ethers.Contract(
        QUOTER_CONTRACT_ADDRESS,
        Quoter.abi,
        getProvider()
    )
    const poolConstants = await getPoolConstants()

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        poolConstants.token0,
        poolConstants.token1,
        poolConstants.fee,
        fromReadableAmount(
            CurrentConfig.tokens.amountIn,
            CurrentConfig.tokens.in.decimals
        ).toString(),
        0
    )

    return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}

async function getPoolConstants(): Promise<{
    poolAddress: string
    token0: string
    token1: string
    fee: number
}> {
    const poolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: CurrentConfig.tokens.in,
        tokenB: CurrentConfig.tokens.out,
        fee: CurrentConfig.tokens.poolFee,
    })

    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI.abi,
        getProvider()
    )
    const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
    ])

    return {
        poolAddress,
        token0,
        token1,
        fee,
    }
}
