import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import { toPercent2, toPercent4 } from "../utils/display";
import moment from "moment";
// import {  } from "../utils/display";
export const width = '300px';
const Price = ({ symbol }) => {
  const [price, setPrice] = useState('')
  useEffect(() => {
    fetch(`/api/price/${symbol}`)
          .then((x) => x.json())
          .then(setPrice);
  }, [])
  
  return <div style={{width}}>
    <span>{symbol}价格(美元): </span>
    <span>{price}</span>
  </div>
}

const Computation = ({ title, name, displayFn }) => {
  const [data, setData] = useState('')
  useEffect(() => {
    fetch(`/api/computation/${name}`)
          .then((x) => x.json())
          .then(setData);
  }, [])

  const defaultFn = x => new Decimal(x).toFixed(2)
  
  return <div style={{width}}>
    <span>{title}: </span>
    <span> {data && (displayFn || defaultFn)(data) }</span>
  </div>
}

const FundingRate = ({ symbol }) => {
  const [data, setData] = useState('')
  useEffect(() => {
    fetch(`/api/lastFundingRate/${symbol}`)
          .then((x) => x.json())
          .then(setData);
  }, [])
  
  return <div style={{width}}>
    <span>{symbol} FRates: </span>
    <span> {data && toPercent4(data)}</span>
  </div>
}

const links = [
  ["Old Page", "/old"],
  ["Hedging", "/api/hedging"],
  ["Trade Fee", "/api/trade-fee/ADAUSDT"],
  ["Coin Future Interests", "api/binanceCoinFutureInterests"]
]
const symbols = [
  "BTC",
  "ADA",
  "ERG",
  "ETH",
  "ALGO",
  "XVS",
  "BNB",
  "COMP",
  "BCH",
  "DOT",
  "EOS",
  "EGLD",
]
const computations = [
  ['Kucoin Interest', 'kucoinInterest', x => x],
  ['币安OTC买入', 'cnyBuy'],
  ['币安OTC买出', 'cnySell'],
  ['Venus安全值', 'venusRatio'],
  ['Venus Log', 'venusLog', x => {
    const [ts, can] = x.split(' ')
    return moment(Number(ts)).format('MM-DD HH:mm') + ' ' + can
  }],
  ['总资产', 'portfolioSum'],
  ['总代币', 'tokenSum'],
  ['总稳定币', 'stableSum'],
  ['赢Claude', 'winClaude', x => x],
]
const fundingRates = [
  'DOT',
  'ADA',
  'BNB',
  'ETH',
  'BTC',
]

const View = ({}) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}>
      {links.map((x) => <a style={{width}} href={x[1]}>{x[0]}</a>)}
      
      {symbols.map(symbol => <Price symbol={symbol}/>)}
      {computations.map(([title, name, displayFn]) => <Computation name={name} title={title} displayFn={displayFn}/>)}
      {fundingRates.map((symbol) => <FundingRate symbol={symbol} />)}
    {/* <p><span>Kucoin利率(年): </span><span id="kucoinInterest"></span></p>
    
    <p><span>1,000,000,000 kishu价格(美元): </span><span id="p12"></span></p>
    <p><span>Venus 安全值: </span><span id="p17"></span></p> */}
    {/* <div>
      <canvas height="80" id="15"></canvas>
    </div> *
    <div>
      <canvas height="80" id="16"></canvas>
    </div>
    <div style="width: 400px;">
      <canvas height="120" width="120px" id="17"></canvas>
      <p><span>总值: </span><span id="p18"></span></p>
    </div>
    <p>
      <input id="i1" type="text" /><button onclick="check(event)">check</button>
    </p> */}
    </div>
  );
};

export const Some = () => {
  const [state, setStateFn] = useState({});
  const setState = (updates) =>
    setStateFn((oldState) => ({ ...oldState, ...updates }));
  return <View {...state} />;
};
