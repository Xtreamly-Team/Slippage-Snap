// TODO: Fix V2 decoding
import { Interface, AbiCoder } from "ethers/lib/utils";
import PolygonRouter from './PolygonRouter.json'


export class SwapPath {
    constructor(
        public tokenIn: string,
        public tokenOut: string,
        public fee: number
    ) {
    }
}

export class DecodedUniswapTransaction {
    constructor(
        public functionName: string,
        public recipient: string,
        public amountIn: string,
        public minAmountOut: string,
        public path: SwapPath[],
        public payerIsUser: boolean,
        public exactIn: boolean,
        public deadline: Date,
    ) {
    }
}

const swapCodes = {
    "00": "V3_SWAP_EXACT_IN",
    "01": "V3_SWAP_EXACT_OUT",
    "08": "V2_SWAP_EXACT_IN",
    "09": "V2_SWAP_EXACT_OUT"
};

const v2VersionDictionary = {
    "swapExactETHForTokens": ["V3_SWAP_EXACT_IN", "V2_SWAP_EXACT_IN"],
    "swapETHForExactTokens": ["V3_SWAP_EXACT_OUT", "V2_SWAP_EXACT_OUT"]
}

const decoder = new Interface(PolygonRouter)

export async function decodeTransaction(rawData: string) {
    const decoded = decodeExecute(rawData)
    return decoded
}


function decodeExecute(transactionInput: string): DecodedUniswapTransaction | null {
    const parsedTx = decoder.parseTransaction({ data: transactionInput });
    const deadlineEpoch = parseInt(parsedTx.args[2])
    const deadlineDate = new Date(deadlineEpoch * 1000)

    let commandsSplit = parsedTx.args[0].substring(2).match(/.{1,2}/g);

    const abiCoder = new AbiCoder();

    let foundFunction;
    let inputForFunction;
    commandsSplit.forEach(
        commandCode => {
            const currentIndex = Object.keys(swapCodes).indexOf(commandCode)
            if (currentIndex !== -1) {
                foundFunction = commandCode;
                inputForFunction = parsedTx.args[1][commandsSplit.indexOf(commandCode)];
            }
        }
    )

    if (!foundFunction || !inputForFunction) {
        return null
    }

    let decoded;
    switch (swapCodes[foundFunction]) {
        case "V3_SWAP_EXACT_IN":
            decoded = abiCoder.decode(["address", "uint256", "uint256", "bytes", "bool"], inputForFunction);
            let decodedPath = extractPathAndFeesFromV3(decoded[3])
            return new DecodedUniswapTransaction(
                swapCodes[foundFunction],
                decoded[0],
                decoded[1].toString(),
                decoded[2].toString(),
                decodedPath,
                decoded[4],
                true,
                deadlineDate
            )
        case "V3_SWAP_EXACT_OUT": //exactOutputSingle FNC 9
            decoded = abiCoder.decode(["address", "uint256", "uint256", "bytes", "bool"], inputForFunction);
            decodedPath = extractPathAndFeesFromV3(decoded[3], true)
            return new DecodedUniswapTransaction(
                swapCodes[foundFunction],
                decoded[0],
                decoded[2].toString(),
                decoded[1].toString(),
                decodedPath, // because exact output swaps are executed in reverse order, in this case tokenOut is actually tokenIn
                decoded[4],
                false,
                deadlineDate
            )
        case "V2_SWAP_EXACT_IN":
            decoded = abiCoder.decode(["address", "uint256", "uint256", "address[]", "bool"], inputForFunction);
            return new DecodedUniswapTransaction(swapCodes[foundFunction],
                decoded[0],
                decoded[1].toString(),
                decoded[2].toString(),
                decoded[3],
                decoded[4],
                true,
                deadlineDate
            )
        case "V2_SWAP_EXACT_OUT":
            decoded = abiCoder.decode(["address", "uint256", "uint256", "address[]", "bool"], inputForFunction);
            return new DecodedUniswapTransaction(swapCodes[foundFunction],
                decoded[0],
                decoded[2].toString(),
                decoded[1].toString(),
                decoded[3],
                decoded[4],
                false,
                deadlineDate
            )
        default:
            console.info("No parseable execute function found in input.")
            return null;
    }
}

function extractPathAndFeesFromV3(fullPath: string, reverse = false): SwapPath[] {
    const fullPathWithoutHexSymbol = fullPath.substring(2);
    let path: SwapPath[] = [];
    let currentAddress = "";
    let tokenSteps: string[] = [];
    let fees: number[] = [];

    for (let i = 0; i < fullPathWithoutHexSymbol.length; i++) {
        const start = i * 46;
        const addressEnd = start + 40;
        currentAddress = `0x${fullPathWithoutHexSymbol.slice(start, addressEnd)}`
        tokenSteps.push(currentAddress);
        if (addressEnd == fullPathWithoutHexSymbol.length) {
            break
        }
        const tokenEnd = addressEnd + 6;
        const currentFeeHex = fullPathWithoutHexSymbol.slice(addressEnd, tokenEnd)
        // Hex to decimal
        const currentFee = currentFeeHex ? parseInt(currentFeeHex, 16) : 0
        fees.push(currentFee);
    }

    for (let i = 0; i < tokenSteps.length - 1; i++) {
        path.push(new SwapPath(tokenSteps[i], tokenSteps[i + 1], fees[i]))
    }
    if (reverse) {
        return path.reverse();
    }
    return path;
}

// function buildTransactionObject(transactionDetails, decodedFunction) {
//     let methodName;
//     if (v2VersionDictionary["swapExactETHForTokens"].includes(decodedFunction.function)) {
//         methodName = "swapExactETHForTokens";
//     } else if (v2VersionDictionary["swapETHForExactTokens"].includes(decodedFunction.function)) {
//         methodName = "swapETHForExactTokens";
//     }
//
//     let contractCall = {
//         "methodName": methodName,
//         "params": {
//             "amountIn": decodedFunction.amountIn,
//             "amountOut": decodedFunction.amountOut,
//             "path": decodedFunction.path,
//             "deadline": "99999999999"
//         }
//     }
//
//
//     if (methodName === undefined) {
//         return undefined;
//     }
//
//     return {
//         'status': transactionDetails.status,
//         'direction': transactionDetails.direction,
//         'hash': transactionDetails.hash,
//         'value': transactionDetails.value,
//         'contractCall': JSON.stringify(contractCall),
//         'counterparty': transactionDetails.counterparty,
//         'estimatedBlocksUntilConfirmed': transactionDetails.estimatedBlocksUntilConfirmed,
//         'dispatchTimestamp': transactionDetails.dispatchTimestamp,
//         'maxFeePerGas': transactionDetails.maxFeePerGas,
//         'maxPriorityFeePerGas': transactionDetails.maxPriorityFeePerGas,
//         'gas': transactionDetails.gas,
//         'from': transactionDetails.from,
//         'type': transactionDetails.type,
//         'gasPriceGwei': transactionDetails.gasPriceGwei,
//         'gasPrice': transactionDetails.gasPriceGwei
//     }
// }
//

