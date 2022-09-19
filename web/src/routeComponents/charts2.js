import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import _ from "lodash";
const width = "8000px"
const colorMap = [
  "#4810f5",
  "#17c9c9",
  "#c4f42c",
  "#69a69f",
  "#18cb2f",
  "#ef46e2",
  "#578bac",
  "#d0a781",
  "#a1a781",
  "#217795",
  "#277f5c",
  "#b4f135",
  "#e17bb2",
  "#e23881",
  "#6a2dbf",
  "#bfd62c",
  "#ffb4b5",
  "#7b7f73",
  "#14e5b3",
];

const ChartsData = [
  ['/api/computation/btcK', (list) => {
    return {
        labels: list.map((_,i) => i),
        datasets: [{
          label: "BTC走势",
          backgroundColor: 'orange',
          borderColor: 'orange',
          data: list,
        }]
    }
  }, width]
]

const Chart = ({api, fn, type, width}) => {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    fetch(api)
      .then((x) => x.json())
      .then(x => setData(fn(x)));
  }, []);
  
  return data ? <div style={{height: '1500px', width: width}}><Line options={{
    color: 'black',
    backgroundColor: 'black',
    borderColor: 'black', 
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "black"
        }
      },
      y: {
        ticks: {
          color: "black"
        }
      }
    }
  }} data={data}/></div>  : '';
};
export const Charts2 = () => {
  return <div style={{background: '#198964', width: width, display: 'flex', flexWrap: 'wrap'}}>
    {ChartsData.map(([api, fn, width]) => <Chart width={width} api={api} fn={fn}/>)}
  </div>
};
