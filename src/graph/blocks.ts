import { BlockFields, BlockData } from "./types.js"
import { callQuery } from "./utils.js"

const ethereumBlocksSubgraph = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'

export async function getBlockByTimestampRaw(timestamp_start: number, timestamp_end: number) {
    let queryString = `
      query blocks {
        blocks(
        where: {timestamp_gt: "${timestamp_start}", timestamp_lt: "${timestamp_end}"} 
        orderBy: number 
        orderDirection: desc
        ) {
            id
            timestamp
            gasUsed
            gasLimit
            number
            size
          }
        }
    `

    const json: any = await callQuery(queryString, ethereumBlocksSubgraph)
    return json.data
}

export async function getLastBlocksRaw(n: number = 10) {
    const queryString = `
query blocks {
          blocks(
            first: ${n}
                orderBy: number
                orderDirection: desc
              ) 
        {
            id
            timestamp
            gasUsed
            gasLimit
            number
            size
          }
    }
    `
    const json: any = await callQuery(queryString, ethereumBlocksSubgraph)
    return json.data
}

export async function getBlockRaw(block: number) {
    const queryString = `
query blocks {
          blocks(
            where: {number: ${block}}
              ) 
        {
            id
            timestamp
            gasUsed
            gasLimit
            number
            size
          }
    }
    `
    const json: any = await callQuery(queryString, ethereumBlocksSubgraph)
    return json.data
}

export function parseAndFormatBlock(rawBlockData: any): BlockData | null {
    if (!rawBlockData) {
        return null
    }
    return {
        id: rawBlockData.blocks[0].id,
        timestamp: parseInt(rawBlockData.blocks[0].timestamp),
        gasUsed: parseInt(rawBlockData.blocks[0].gasUsed),
        gasLimit: parseInt(rawBlockData.blocks[0].gasLimit),
        number: parseInt(rawBlockData.blocks[0].number),
        size: parseInt(rawBlockData.blocks[0].size),
    }
}

export function parseBlocks(rawBlocksData: any) {
    let blocks: BlockFields[] = []
    if (rawBlocksData && rawBlocksData.blocks) {
        rawBlocksData.blocks.forEach((rawBlock: any) => {
            blocks.push(rawBlock)
        })
        return blocks
    }
    return []
}

export function formatBlocks(blocks: BlockFields[]) {
    const parsedBlocks: BlockData[] = blocks.map((block) => {
        return {
            id: block.id,
            timestamp: parseInt(block.timestamp),
            gasUsed: parseInt(block.gasUsed),
            gasLimit: parseInt(block.gasLimit),
            number: parseInt(block.number),
            size: parseInt(block.size),
        }
    })
    return parsedBlocks
}

// Note that this returns one block before the timestamp, not the block after the timestamp.
export async function getBlocksForTimestamps(timestamps: number[]) {
    const blocks: BlockData[] = []
    // NOTE: This is to ensure at least one block is returned for each timestamp. This just needs to be more than the network native block time (Eth: ~ 12 sec)
    const SafeBlockInterval = 60
    for (const t of timestamps) {
        const tempBlocks = parseBlocks(await getBlockByTimestampRaw(t - SafeBlockInterval, t))
        const formattedBlocks = formatBlocks(tempBlocks)
        // This is because blocks are returned in descending order
        blocks.push(formattedBlocks.shift())
    }
    return blocks
}

export async function getBlockRangeForTimestamps(timestamp_start: number, timestamp_end: number) {
    const blocks: BlockData[] = []
    const tempBlocks = parseBlocks(await getBlockByTimestampRaw(timestamp_start, timestamp_end))
    const formattedBlocks = formatBlocks(tempBlocks)
    return formattedBlocks
}

export async function getLastBlocks(n: number = 10) {
    const blocks = parseBlocks(await getLastBlocksRaw(n))
    return formatBlocks(blocks)
}
