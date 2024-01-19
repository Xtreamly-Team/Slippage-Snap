import { OnTransactionHandler, OnTransactionResponse } from '@metamask/snaps-types';
import type { OnRpcRequestHandler, Transaction } from '@metamask/snaps-sdk';
import { SupportedTokensETH, SupportedTokensPolygon } from './constants';

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


export const onTransaction: OnTransactionHandler = async ({
    transaction,
    chainId,
    transactionOrigin,
}) => {
    let insights: string[] = []
    // For polygon: eip155:89
    console.log(chainId)
    // https://app.uniswap.org
    console.log(transactionOrigin)
    if (transactionOrigin == 'https://app.uniswap.org' && transaction.data != undefined) {
        console.log(transaction.data)
        const decoded = await decodeTransaction(transaction.data)
        const path1: SwapPath = decoded!.path[0]
        // Currently we assume all swaps have only one path. Will add support for multihop swaps later
        if (decoded) {
            const ethTokens = SupportedTokensETH

            const tokenIn = ethTokens[path1.tokenIn.toLowerCase()]

            const tokenOut = ethTokens[path1.tokenOut.toLowerCase()]

            const amountIn = +decoded.amountIn / (10 ** tokenIn!.decimals)

            const minOut = +decoded.minAmountOut / (10 ** tokenOut!.decimals)

            let { quotedPrice, poolAddress } = await getQuote(
                tokenIn?.address,
                tokenOut?.address,
                amountIn,
                tokenIn?.decimals,
                tokenOut?.decimals,
                path1?.fee
            )

            // This is adjusted for the 0.15% that uniswap interface gets
            let quotedPriceAdjusted = quotedPrice * 0.9985

            const slippageTolerance = Math.round(((quotedPriceAdjusted - minOut) / quotedPriceAdjusted) * 100)

            insights = [
                `Amount In: ${amountIn} ${tokenIn!.name}`,
                `Quoted: ${quotedPriceAdjusted.toFixed(4)} ${tokenOut!.name}`,
                `Min Out: ${minOut.toFixed(4)} ${tokenOut!.name}`,
                `Slippage Tolerance: ${slippageTolerance}%`,
                `Fee: ${path1?.fee / 10000}%`,
                `Pool: ${poolAddress}`,
                `Deadline: ${decoded.deadline}`,
            ]
            console.log(insights)
        }
        return {
            content: panel([
                heading('Transaction Insights'),
                ...(insights.map((insight) => text(insight))),
                panel([
                    heading('Slippage'),
                    text('Predicted: 2%')
                ])
            ])
        } as OnTransactionResponse;
    }
    return {
        content: panel([
            heading('Transaction not supported')
        ])
    } as OnTransactionResponse;
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @throws If the request method is not valid for this snap.
 * @returns The result of `snap_dialog`.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
    origin,
    request,
}) => {
    switch (request.method) {
        case 'hello':
            return snap.request({
                method: 'snap_dialog',
                params: {
                    type: 'confirmation',
                    content: panel([
                        text(`Hello, **${origin}**!`),
                        text('This custom confirmation is just for display purposes.'),
                        text(
                            'But you can edit the Snap source code to make it do something, if you want to!',
                        ),
                    ]),
                },
            });
        default:
            throw new Error("Method not found.");
    };
}
