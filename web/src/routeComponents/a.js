import { useEffect, useState } from "react";
import { Charts } from "./charts";
import { Some } from "./some";
import crypto from "crypto";
import {ethers} from "ethers";
import { abi, erc20ABI, rinkebyDAI, rinkebyHTLC, ropstenDAI, ropstenHTLC } from "../config";

if (!localStorage.getItem('id')) {
  localStorage.setItem('id', crypto.randomBytes(32).toString("hex"))
}
const id = localStorage.getItem('id')

const updateState = (info) => {
  return fetch('http://127.0.0.1:3000/updateState', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id, 
      info
    })
  })
}

const getOther = () => {
  return fetch('http://127.0.0.1:3000/getState', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id
    })
  }).then(x => x.json());

  // return Promise.resolve({
  //   chain: 'Ropsten',
  //   type: 'Ether',
  //   etherAmount: '0.0001',
  //   reciever: '0x3B5b69585c9210ef340329243dfb002bca68b119',
  //   locked: true,
  // })
}
const genRandom = () => {
  const randomHex = '0x' + crypto.randomBytes(32).toString("hex");
  const hash = ethers.utils.keccak256(randomHex)
  return Promise.resolve({
    randomHex,
    hash
  })
}


const lock = async ({
  type,
  etherAmount,
  tokenAmount,
  nftId,
  hash,
  chain,
  reciever,
}) => {
  
  const contractAddress = chain === 'Rinkeby' ? rinkebyHTLC : ropstenHTLC;
  // const pro = new ethers.providers.Web3Provider(window.ethreum)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
  const daiAddress = chain === 'Rinkeby' ? rinkebyDAI : ropstenDAI
  const dai = new ethers.Contract(daiAddress, erc20ABI, provider.getSigner())
  const tenMinutesLater = Math.round(Date.now() / 1000) + 10 * 60
  if (type === 'Ether') {
    // debugger
    const a = await contract.lockETH(tenMinutesLater, ethers.utils.parseEther(etherAmount), reciever, hash, {value: ethers.utils.parseEther(etherAmount)})
    await a.wait()
  } else if (type === 'DAI Token') {
    debugger
    const aa = await dai.approve(contractAddress, '0xffffffffffffffffffffffffffffffffff')
    await aa.wait()
    const a = await contract.lockToken(tenMinutesLater, [daiAddress, ethers.utils.parseEther(tokenAmount)], reciever, hash)
    await a.wait()
  }

}

const withdraw = async (chain, type, randomHex) => {
  const contractAddress = chain === 'Rinkeby' ? rinkebyHTLC : ropstenHTLC;
  // const pro = new ethers.providers.Web3Provider(window.ethreum)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
  // const tenMinutesLater = Math.round(Date.now() / 1000) + 10 * 60
  if (type === 'Ether') {
    const a = await contract.withdrawETH(randomHex)
    await a.wait()
  } else if (type === 'DAI Token') {
    const a = await contract.withdrawToken(randomHex)
    await a.wait()
  }
}

const refund = async (chain, type) => {
  const contractAddress = chain === 'Rinkeby' ? rinkebyHTLC : ropstenHTLC;
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
  if (type === 'Ether') {
    const a = await contract.refundETH()
    await a.wait()
  } else if (type === 'DAI Token') {
    const a = await contract.refundToken()
    await a.wait()
  }
}
const revealRandom = async (random) => {
  
}

export const A = () => {
  const [chain, setChain] = useState('Rinkeby')
  const [type, setType] = useState('Ether')
  const [etherAmount, setEtherAmount] = useState('')
  // const [tokenName, setTokenName] = useState('DAI')
  const [tokenAmount, setTokenAmount] = useState('')
  const [nftId, setNftId] = useState('')
  const [other, setOther] = useState({})
  const [random, setRandom] = useState(undefined)
  const [hash, setHash] = useState(undefined)
  const [isRandomGenerator, setIsRandomGenerator] = useState(false)
  const [locked, setLocked] = useState(false)
  // const [address, setLocked] = useState(false)
  
  // const [stateMachine, setstate] = useState(undefined)
  useEffect(() => {
    // getOther().then(info => {
    //   setOther(info)
    // })
    
    setInterval(() => {
      getOther().then(info => {
        setOther(info)
      })
    },5*1000)
  },[])
  useEffect(() => {
    updateState({
      chain,
      type,
      etherAmount,
      tokenAmount,
      nftId,
      locked,
      address: window.ethereum.selectedAddress,
      // hash: isRandomGenerator ? hash
    })
  },[chain,type,etherAmount,tokenAmount,nftId,locked]);

  return <div style={{padding: '20px'}}>
    <style>
      {`button{
        margin-right:10px;
      }`
      }  
    </style>
    <h1>HTLC DEMO</h1>
    
    <div style={{display: 'flex', alignItems: 'self-start'}}>
      
      <div style={{width: '50%'}}>
      <p>player id: {id}</p>
      chain: 
      <select value={chain} onChange={(e) => setChain(e.target.value)}>
        <option value="Rinkeby">Rinkeby</option>
        <option value="Ropsten">Ropsten</option>
      </select>
      <br/>
      <br/>

      swap type: 
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Ether">Ether</option>
        <option value="DAI Token">DAI Token</option>
        <option value="APE NFT">APE NFT</option>
      </select>
      <br/>
      <br/>
      {type === 'Ether' && <div>ether amount: <input value={etherAmount} onInput={e => setEtherAmount(e.target.value)}/></div>}
      {type === 'DAI Token' && <div>
        DAI token amount: <input value={tokenAmount} onInput={e => setTokenAmount(e.target.value)}/>
        </div>
      }
      {type === 'APE NFT' && <div>
        
        ape nft id: <input value={nftId} onInput={e => setNftId(e.target.value)}/>
        </div>
      }
      <br/>
      {!random && !(!isRandomGenerator && other.hash) && <button onClick={() => {
        genRandom().then(x => {
          setIsRandomGenerator(true)
          setRandom(x.randomHex)
          setHash(x.hash)
          updateState({
            chain,
            type,
            etherAmount,
            tokenAmount,
            nftId,
            locked,
            address: window.ethereum.selectedAddress,
            hash: x.hash,
          })
        })
      }}>Gen random hex and send its hash to other</button>}
      {!locked && isRandomGenerator && <button onClick={() => {
        lock({
          type,
          etherAmount,
          tokenAmount,
          nftId,
          hash,
          chain: chain,
          reciever: other.address
        }).then(x => {
          setLocked(true)
          debugger
        })
      }}>Lock {type} for 10 minutes</button>}
      {other.locked && !locked && !isRandomGenerator && <button onClick={() => {
        lock({
          type,
          etherAmount,
          tokenAmount,
          nftId,
          hash: other.hash,
          chain: chain,
          reciever: other.address
        }).then(x => {
          setLocked(true)
          // debugger
        })
        // .catch(x => {
        //   debugger
        //   // setIsRandomGenerator(true)
        //   // setRandom(x.randomHex)
        //   // setHash(x.hash)
        // })
      }}>Lock {type} for 5 minutes</button>}
      {locked && <button onClick={() => {
        refund(chain, type).then(x => {
          // setLocked(true)
          // debugger
        })
      }}>Refund </button>}
      {other.locked && (other.random || random) && <button onClick={() => {
        withdraw(other.chain, other.type, other.random || random).then(x => {
          debugger
        })
      }}>Withdraw with random hex number </button>}
      {locked && other.locked && random && <button onClick={() => {
        // revealRandom(random).then(x => {
          updateState({
            chain,
            type,
            etherAmount,
            tokenAmount,
            nftId,
            locked,
            address: window.ethereum.selectedAddress,
            hash,
            random
          }).then(x => {
            debugger
          })
          
        // })
      }}>Reveal random hex number </button>}

      </div>
      
      <div style={{width: '50%', border: '1px solid green', padding: '10px 10px'}}>
      {type === 'Ether' && <span>swap {etherAmount} {chain} {type} </span>}
      {type === 'DAI Token' && <span>swap {tokenAmount} {chain} {type} </span>}
      {type === 'APE NFT' && <span>swap {chain} {type} {nftId && `id = ${nftId}`} </span>}
      
      with

      {other.type === 'Ether' && <span> {other.etherAmount} {other.chain} {other.type} </span>}
      {other.type === 'DAI Token' && <span> {other.tokenAmount} {other.chain} {other.type} </span>}
      {other.type === 'APE NFT' && <span> {other.chain} {other.type} {other.nftId && `id = ${other.nftId}`} </span>}
      
      <br/>
      <br/>
      {(isRandomGenerator ? random : other.random) && `random hex number: ${isRandomGenerator ? random : other.random}`}
      <br/>
      <br/>
      {(isRandomGenerator ? hash : other.hash) && `hash of random hex number: ${isRandomGenerator ? hash : other.hash}`}
      <br/>
      <br/>
      {(other.address ) && `address of other player: ${other.address}`}
      </div>
      

      

      

    </div>
  </div>
}
