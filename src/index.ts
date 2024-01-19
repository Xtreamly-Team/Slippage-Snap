import { OnTransactionHandler, OnTransactionResponse } from '@metamask/snaps-types';
import type { OnRpcRequestHandler, Transaction } from '@metamask/snaps-sdk';
import { SupportedTokensETH, SupportedTokensPolygon, WETH_TOKEN_ETH, USDT_TOKEN_ETH } from './constants';

import {
    copyable,
    divider,
    heading,
    panel,
    spinner,
    text,
} from "@metamask/snaps-sdk";
import { decodeTransaction, SwapPath } from './decode';
import { getQuote } from './quote';
import { predictSlippage } from './slippage_prediction';


export const onTransaction: OnTransactionHandler = async ({
    transaction,
    chainId,
    transactionOrigin,
}) => {
    let insights: string[] = []
    // For polygon: eip155:89, for ETH: eip155:1
    console.log(chainId)
    // https://app.uniswap.org
    console.log(transactionOrigin)
    if (transactionOrigin == 'https://app.uniswap.org' && transaction.data != undefined) {
        const decoded = await decodeTransaction(transaction.data)
        const path1: SwapPath = decoded!.path[0]
        // Currently we assume all swaps have only one path. Will add support for multihop swaps later
        if (decoded) {
            const ethTokens = SupportedTokensETH

            const tokenIn = ethTokens[path1.tokenIn.toLowerCase()]

            const tokenOut = ethTokens[path1.tokenOut.toLowerCase()]

            const amountIn = +decoded.amountIn / (10 ** tokenIn!.decimals)

            const minOut = +decoded.minAmountOut / (10 ** tokenOut!.decimals)

            let { quotedPrice, poolAddress, gasPrice } = await getQuote(
                tokenIn?.address,
                tokenOut?.address,
                amountIn,
                tokenIn?.decimals,
                tokenOut?.decimals,
                path1?.fee
            )

            // NOTE: This is adjusted for the 0.15% that uniswap interface gets
            let quotedPriceAdjusted = quotedPrice * 0.9985

            const slippageTolerance = Math.round(((quotedPriceAdjusted - minOut) / quotedPriceAdjusted) * 100)

            const predictedSlippage = await predictSlippage(
                amountIn,
                gasPrice,
                tokenIn?.address == USDT_TOKEN_ETH.address,
                poolAddress,
                path1.fee
            )

            insights = [
                `Amount In: ${amountIn} ${tokenIn!.name}`,
                `Quoted: ${quotedPriceAdjusted.toFixed(4)} ${tokenOut!.name}`,
                `Min Out: ${minOut.toFixed(4)} ${tokenOut!.name}`,
                `Slippage Tolerance: ${slippageTolerance}%`,
                `Fee: ${path1?.fee / 10000}%`,
                `Gas Price: ${gasPrice}`,
                `Pool: ${poolAddress}`,
                `Deadline: ${decoded.deadline}`,
            ]
            return {
                content: panel([
                    heading('Transaction Insights'),
                    ...(insights.map((insight) => text(insight))),
                    panel([
                        heading('Slippage'),
                        text(`Predicted: ${(predictedSlippage / 100).toFixed(2)}%`)
                    ])
                ])
            } as OnTransactionResponse;
        }
    }
    return {
        content: panel([
            heading('Transaction not supported')
        ])
    } as OnTransactionResponse;
};
