import { OnTransactionHandler, OnTransactionResponse } from '@metamask/snaps-types';
import type { OnHomePageHandler, OnInstallHandler, OnUpdateHandler } from '@metamask/snaps-sdk';
import { SupportedTokensETH, WETH_TOKEN_ETH, USDT_TOKEN_ETH, getTradingSymbol } from './constants';

import {
    copyable,
    divider,
    heading,
    panel,
    text,
} from "@metamask/snaps-sdk";
import { decodeTransaction, SwapPath } from './decode';
import { getQuote, predictSlippage } from './server';

const errorPanel = (error: string) => panel([
    heading('Unfortunately an error occured'),
    text(error),
]);

export const onTransaction: OnTransactionHandler = async ({
    transaction,
    chainId,
}) => {
    try {
        let insights: string[] = []
        if (
            // Currently we only support swaps on Ethereum mainnet
            chainId == 'eip155:1' &&
            // Currently we only support swaps on Uniswap Router
            `${transaction.to}`.toLowerCase() == '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad' &&
            transaction.data != undefined) {
            const decoded = await decodeTransaction(transaction.data)
            if (decoded) {
                const firstPath: SwapPath = decoded.path[0]
                const lastPath: SwapPath = decoded.path[decoded!.path.length - 1]

                const tokenIn = SupportedTokensETH[firstPath.tokenIn.toLowerCase()]

                const tokenOut = SupportedTokensETH[lastPath.tokenOut.toLowerCase()]

                const amountIn = +decoded.amountIn / (10 ** tokenIn!.decimals)

                const minOut = +decoded.minAmountOut / (10 ** tokenOut!.decimals)

                const [{ quotedPrice, poolAddress, _ }, predictedSlippage] = await Promise.all([
                    getQuote(
                        tokenIn?.address,
                        tokenOut?.address,
                        amountIn,
                        tokenIn?.decimals,
                        tokenOut?.decimals,
                        firstPath?.fee),
                    predictSlippage(
                        tokenIn?.address,
                        tokenOut?.address,
                        amountIn,
                        tokenIn?.decimals,
                        tokenOut?.decimals,
                        // Whether its a buy or sell
                        tokenIn?.address != WETH_TOKEN_ETH.address,
                        firstPath.fee,
                        getTradingSymbol(tokenIn!, tokenOut!),
                    )
                ])

                // NOTE: This is adjusted for the 0.15% that uniswap interface gets
                let quotedPriceAdjusted = quotedPrice * 0.9985

                const slippageTolerance = Math.round(((quotedPriceAdjusted - minOut) / quotedPriceAdjusted) * 100)


                insights = [
                    `Amount In: ${amountIn} ${tokenIn!.name}`,
                    `Quoted: ${quotedPriceAdjusted.toFixed(4)} ${tokenOut!.name}`,
                    `Min Out: ${minOut.toFixed(4)} ${tokenOut!.name}`,
                    `Slippage Tolerance: ${slippageTolerance}%`,
                    `Fee: ${firstPath?.fee / 10000}%`,
                    `Pool: ${poolAddress}`,
                    `Deadline: ${decoded.deadline}`,
                ]
                return {
                    content: panel([
                        heading('Transaction Insights'),
                        ...(insights.map((insight) => text(insight))),
                        panel([
                            heading('Slippage'),
                            text(`Predicted: ${predictedSlippage.toFixed(3)}%`)
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
    } catch (error) {
        return {
            content: errorPanel(error)
        }
    }
};


export const onHomePage: OnHomePageHandler = async () => {
    return {
        content: panel([
            heading('Xtreamly Slippage Predictor'),
            text('Provides insights and predicts slippage amount on DeX swaps. Currently works on ETH/USDT and ETH/USDC pairs and on Uniswap V3'),
        ]),
    };
};

export const onInstall: OnInstallHandler = async () => {
    return snap.request({
        method: 'snap_dialog',
        params: {
            type: 'alert',
            content: panel([
                heading('Thanks for installing Xtreamly Slippage Predictor'),
                text('Xtreamly slippage predictor provides insights and predicts slippage amount on DeX swaps. Currently works on ETH/USDT and ETH/USDC pair and on Uniswap v3'),
                divider(),
                heading('Starting Guide'),
                text('Head to following link for more info:'),
                copyable('https://info.xtreamly.io'),
                text('You can test using any uniswap v3 interface'),
                copyable('https://app.uniswap.org/swap')
            ]),
        }
    });
}


export const onUpdate: OnUpdateHandler = async () => {
    return snap.request({
        method: 'snap_dialog',
        params: {
            type: 'alert',
            content: panel([
                heading('Updated xtreamly slippage predictor'),
                text('Head to following link for more info about the update:'),
                copyable('https://info.xtreamly.io')
            ]),
        }
    });
}
