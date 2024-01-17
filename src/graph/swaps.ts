import { SwapData, SwapFields } from "./types.js"
import { callQuery, saveToFile } from "./utils.js"

const uniswapV3Subgraph = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'

export async function getSwapsRawData(starting_block: number, end_block: number, token0: string, token1: string, skip?: number) {
    const queryString =
        `
query swaps {
  swaps(
    where: {token0: "${token0}", token1: "${token1}", transaction_: {blockNumber_lt: "${end_block}", blockNumber_gt: "${starting_block}"}}
    orderBy: transaction__blockNumber
    orderDirection: desc
${skip ? "skip: " + skip : ""}
  ) {
    id
    recipient
    sqrtPriceX96
    sender
    tick
    timestamp
    amount0
    amount1
    amountUSD
    origin
    token0 {
      symbol
      name
    }
    token1 {
      name
      symbol
    }
    pool {
      id
    }
    transaction {
      blockNumber
      gasPrice
      gasUsed
      id
      timestamp
    }
  }
}
    `

    const json: any = await callQuery(queryString, uniswapV3Subgraph)
    try {
        const res = json.data
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}


export function parseSwaps(rawSwapData: any) {
    const res: SwapData[] = rawSwapData?.swaps
        ? rawSwapData.swaps.reduce((accum: SwapData[], swapData) => {
            const swap = new SwapData(swapData)
            accum.push(swap)
            return accum
        }, [])
        : []
    return res
}

export async function getAllSwaps(starting_block: number, end_block: number, token0: string, token1: string) {
    let res = await getSwapsRawData(starting_block, end_block,
        token0, token1)
    let swaps = parseSwaps(res)
    let skipped = 0
    const skipStep = 100
    if (res && res.swaps) {
        while (res.swaps.length == 100) {
            skipped += skipStep
            console.log(skipped)
            res = await getSwapsRawData(starting_block, end_block, token0, token1, skipped)
            if (!res || !res.swaps) {
                console.log("Complete")
                break
            }
            console.log(res.swaps.length)
            const newSwaps = parseSwaps(res)
            swaps = [ ...swaps, ...newSwaps ]
        }
    }

    console.log(swaps.length)
    await saveToFile(swaps, "data/old_swaps.json")
}

await getAllSwaps(18762980, 18769417,
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"
)
