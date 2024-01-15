import { OnTransactionHandler, OnTransactionResponse } from '@metamask/snaps-types';
import type { OnRpcRequestHandler, Transaction } from '@metamask/snaps-sdk';

import {
    copyable,
    divider,
    heading,
    panel,
    spinner,
    text,
} from "@metamask/snaps-sdk";
import { decodeTransaction } from './decode';


export const onTransaction: OnTransactionHandler = async ({
    transaction,
    chainId,
    transactionOrigin,
}) => {
    let insights: string[] = []
    console.log('TRANSACTION')
    console.log(transaction.data)
    if (transaction.data != undefined) {
        console.log(transaction.data)
        const decoded = await decodeTransaction(transaction.data)
        if (decoded) {
            insights = [
                `Amount In: ${decoded.amountIn}`,
                `Amount Out: ${decoded.amountOut}`,
                `Token In: ${decoded.path[0]}`,
                `Token Out: ${decoded.path[1]}`,
                `Predicted Slippage: -2%`
            ]
            console.log(insights)
        }
    }
    return {
        content: panel([
            heading('My Transaction Insights'),
            text('Here are the insights:'),
            ...(insights.map((insight) => text(insight)))
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
