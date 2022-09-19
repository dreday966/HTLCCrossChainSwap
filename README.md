# HTLCCrossChainSwap

This demo shows how HTLC can be used to perform the cross-chain token swap. HTLC is used on the bitcoin lightning network. But we can also use it on EVM to make an atomic cross-chain token swap. ERC20, ERC721 and native token are all supported.

## How it works?
Suppose Alice and Bob want to swap ETH on Rinkeby and ETH on Ropsten. They can follow the following steps
1. Alice generates a random number r and computes its hash.
2. Alice locks her ETH with hash, only those who know r can withdraw it or Alice can refund after two hours. 
3. Alice sends her hash to Bob. 
4. Bob locks his ETH with hash, only those who know r can withdraw it or Bob can refund after one hour.
5. Alice withdraws the token locked by Bob with r and reveals r to Bob.
6. Bob withdraws the token locked by Alice with r.

Let us consider how a player can act badly and how another player can respond to keep funds safe. 
1. If Alice has locked her ETH, Bob stops to lock his ETH. Alice can refund her ETH after two hours.
2. If both Alice and Bob have locked their ETH but Alice refuses to send r to Bob. Then Alice can withdraw ETH locked by Bob. Because blockchain is a public ledger, Bob can check the blockchain to find out r and withdraw ETH locked by Alice.
3. If both Alice and Bob have locked their ETH, then Alice wants to wait 2 hours to refund her ETH. Bob can refund his ETH after 1 hour before Alice refunds.


## Smart Contract
/smart-contracts folder contains smart contract code. 

/smart-contracts/contracts/HTLC.sol is the main smart contract. It can lock ERC20, ERC721 and native Token with a hash. Those who have the pre-image of this hash can unlock and withdraw the token.

## Test cases against smart contracts

/smart-contracts/test/HTLC.js contains test cases against smart HTLC.sol. Run the following commands to test
```
cd smart-contracts
npm install
npx hardhat test
```

## Comunication Server
/sevrer folder contains a nodejs server for communication between players. Run the following commands to start the server.

```
cd server
npm install
node index.js
```

## Client 
/web folder contains a web client to interact with. Run the following commands to start the web application.

```
cd web
npm install
npm start
```

## How to run the demo
1. Run client web and communication server.
2. Open http://localhost:3008 on two separate web browsers with metamask installed
3. Toggle network of metamask to Ropsten for one browser and Rinkeby for another.