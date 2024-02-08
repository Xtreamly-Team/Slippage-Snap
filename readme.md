# Metamask Snaps User Guide:

Snaps are a new tool introduced by Metamask in 2023 to allow developers extend the default behavior of Metamask wallet. We have packaged our slippage prediction api as a standalone snap that can be installed by users. 

***NOTE: You need to install Metamask Flask in your browser, which is a canary version of Metamask wallet that is used for debuting new features such as snaps***

Here is a step by step guide on how to install xtreamly slippage prediction snap:

## Installation

1- Visit https://snap.xtreamly.io

2- Click "Connect", make sure you have already installed Metamask Flask. 

*Note: If you have both normal and flask versions of Metamask wallet, disable the normal one in your browser extension menu*

3- Click "Install Snap", 

4- Wallet popup opens, accept the permissions and wait till the installation is complete

## Usage

1- Visit https://app.uniswap.org/swap

2- Use ETH and USDT as swap pairs. 

*Note: Make sure you have enough ETH in your wallet for gas, otherwise Swap button would be greyed out. You don't need to execute the actual swap, you only need to initiate the transaction in order for our Snap to be triggered

3- Click swap

4- Confirm transaction popup would be opened. Click on the 'xtreamly_slippage_predictor' menu to see the transaction details which includes the slippage prediction

5- You can either cancel or confirm the transaction.

*Note: You can use other methods to invoke the transaction other than the Uniswap web interface. This can be done by any DApp that triggers the UniswapV3 Universal Router contract with the supported tokens (ETH/USDT)
