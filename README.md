# HTLCCrossChainSwap

This is a demo shows how HTLC can be used to perform cross chain token swap. HTLC is used on bitcoin lightening network. But we can also use it on EVM to make atomic cross chain token swap. ERC20, ERC721 and native token are all supported.

## How it works ?
Suppose Alice and Bob want to swap ETH on Rinkeby and ETH on Ropsten. They can follow following steps
1. Alice generate a random number r and compute its hash.
2. Alice lock her ETH with hash, only those who konw r can withdraw it or Alice can refund after two hours. 
3. Alice send her hash to Bob. 
4. Bob lock his ETH with hash, only those who konw r can withdraw it or Bob can refund after one hour.
5. Alice withdraw the token locked by Bob with r and reveal r to Bob.
6. Bob withdraw the token locked by Alice with r.

Let us consider how player can act badly and how other player can response to keep fund safe. 
1. If Alice have locked her ETH, Bob stop to lock his ETH. Alice can refund her ETH after two hours.
2. If both Alice and Bob have locked their ETH but Alice refuse to send r to Bob. Then Alice can withdraw ETH locked by Bob. Because blockchain is public ledger, Bob can check the blockchain to find out r and withdraw ETH locked by Alice.
3. If both Alice and Bob have locked their ETH, then Alice want to wait 2 hours to refund her ETH. Bob can refund his ETH after 1 hour before Alice refund.


## Smart Contract
/smart-contracts folder contains smart contract code. 

/smart-contracts/contracts/HTLC.sol is the main smart contract. It can lock ERC20，ERC721 and native Token with a hash. Those who have the pre-image of this hash can unlock and withdraw the token.

## Test cases against smart contract

/smart-contracts/test/HTLC.js contains test cases against smart HTLC.sol. Run following commands to test
```
cd smart-contracts
npm install
npx hardhat test
```

## Comunication Server
/sevrer folder contains a nodejs server for communication betwwen players. Run following commands to start the server.

```
cd server
npm install
node index.js
```

## Client 
/web folder contains a web client to interact with. Run following commands to start the web application.

```
cd web
npm install
npm start
```

## How to run demo
1. Run client web and comunication server.
2. Open http://localhost:3008 on two seperate web browsers with metamask installed
3. Toogle network of metamask to Ropsten for one browser and Rinkeby for another.