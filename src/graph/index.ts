import yargs from "yargs";
import inquirer from "inquirer";
import { getBlockRangeForTimestamps, getBlockRaw, getBlocksForTimestamps, getLastBlocks, getLastBlocksRaw, parseAndFormatBlock } from "./blocks.js";
import { getPoolsForBlock } from "./pools.js";
import { saveToFile, useDeltaTimestamps } from "./utils.js";
import { EthUsdtPoolAddresses, POOLS_DICTIONARY } from "../constants.js";
import { PoolData } from "./types.js";
import { assert } from "console";

async function getPoolsAtBlockNumber(blockNumber: number, poolAddresses: string[]) {
    const rawBlockData = await getBlockRaw(blockNumber)
    const block = parseAndFormatBlock(rawBlockData)
    if (!block) {
        console.log(`Could not get block ${blockNumber}`)
        return null
    }
    const timestamps = useDeltaTimestamps(block.timestamp)
    const [last24HourBlock, last48HourBlock, lastWeekBlock] = await getBlocksForTimestamps(timestamps)

    const res = await getPoolsForBlock(block, last24HourBlock, last48HourBlock, lastWeekBlock, poolAddresses)

    return res

}

async function getPoolsByTimestampRange(timestamp_start: number, timestamp_end: number, poolAddresses: string[]) {
    const blocks = await getBlockRangeForTimestamps(timestamp_start, timestamp_end)
    const res: { [blockNumber: number]: { [address: string]: PoolData } } = {}
    for (const block of blocks) {
        try {
            const pools = await getPoolsAtBlockNumber(block.number, poolAddresses)
            res[block.number] = pools
            saveToFile(res, `./data/pools.json`)
        } catch (error) {
            console.log(error)
        }
    }
    return res
}

async function getPoolsByBlockRange(block_start: number, block_end: number, poolAddresses: string[]) {
    const res: { [blockNumber: number]: { [address: string]: PoolData } } = {}
    for (let blockNumber = block_start; blockNumber <= block_end; blockNumber++) {
        const progrss = Math.floor(((blockNumber - block_start) * 100) / (block_end - block_start))

        console.log(`Getting block ${blockNumber}: ${progrss}%`)
        try {
            const pools = await getPoolsAtBlockNumber(blockNumber, poolAddresses)
            res[blockNumber] = pools
            saveToFile(res, `./data/pools_${block_start}_${block_end}.json`)
        } catch (error) {
            console.log(error)
        }
    }
    return res
}


async function main() {
    const args = process.argv.slice(2)
    const argv = yargs(args).argv
    console.log(argv)
    if (argv["d"]) {
        console.log("Running in daemon mode")
        if (argv["start_block"] && argv["end_block"]) {
            const start_block = parseInt(argv["start_block"].toString())
            const end_block = parseInt(argv["end_block"].toString())
            console.log(`Getting blocks from ${start_block} to ${end_block}`)
            const res = await getPoolsByBlockRange(start_block, end_block, EthUsdtPoolAddresses)
            console.log("Complete")
        }
    } else {
        const pools_answer = await inquirer.prompt(
            {
                name: 'Liquidity-Pools',
                type: 'checkbox',
                choices: Object.keys(POOLS_DICTIONARY),
                message: 'Which liquidity pools you want to get',
                default() {
                    return ['ETH-USDT']
                }
            }
        )
        const userChoices = pools_answer["Liquidity-Pools"]
        const poolsToGet = []
        for (const pool of userChoices) {
            poolsToGet.push(...POOLS_DICTIONARY[pool])
        }
        console.log(`Getting pools: \n${poolsToGet.join("\n")}`)
        const start_block_answer = await inquirer.prompt(
            {
                name: 'start-block',
                type: 'number',
                message: 'Start block:',
            }
        )
        const end_block_answer = await inquirer.prompt(
            {
                name: 'end-block',
                type: 'number',
                message: 'End block:',
            }
        )
        const start_block = parseInt(start_block_answer["start-block"].toString())
        const end_block = parseInt(end_block_answer["end-block"].toString())
        assert(start_block < end_block, "Start block must be less than end block")
        assert(start_block > 17000000, "Start block must be greater than 17000000")
        assert(end_block > 17000000, "End block must be greater than 17000000")
        console.log(`Getting blocks from ${start_block} to ${end_block}`)
        const res = await getPoolsByBlockRange(start_block, end_block, poolsToGet)
        console.log("Complete")
    }
}

await main()
