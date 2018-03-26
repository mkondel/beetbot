/**
*
* ChartComponent
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import CandleStickChart from './CandleStickChart';
import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";
const parseDate = timeParse("%Y-%m-%d");

class ChartComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(){
        super();
        this.state = {
            price: -1,
            timeout: 1000,
            ws: new WebSocket('wss://ws-feed.gdax.com'),
            params: {
                'type': 'subscribe',
                'channels': [{'name': 'matches', product_ids: ['BTC-USD']}]
            },
            data: null,
            joinedData: null,
            product: 'BTC-USD',
            granularity: 60,
        };
    }
    componentDidMount(){
        this.state.ws.onopen = () => this.state.ws.send(JSON.stringify(this.state.params));
        this.state.ws.onmessage = (msg) => {
            var data = JSON.parse(msg.data);
            // console.log(data)
            const product = data.product_id;
            const price = parseFloat(data.price);
            const date = data.time;
            const side = data.side;
            const size = parseFloat(data.size);
            const usd = price * size;
            switch(data.type) {
                case 'match':
                    switch(product) {
                        case 'BTC-USD':
                            this.addTrade({price, date, size});
                            // // update the page title
                            // this.updateTitle({price, side})
                            break;
                        default:
                            break;
                    }
                    break;
                case 'last_match':
                    console.log(`last candle... ${price} ${date} ${data.size} $${usd}`);
                    break;
                default:
                    break;
            }
            return null;
        }
        // this.getData()
        this.getHistoricalCandles(this.state.product, this.state.granularity)
        .then(data => {
            console.log(`data`);
            this.setState({data}, ()=>{
                // console.log('state')
                // console.log(`state ${JSON.stringify(this.state.data[0])}`)
                this.joinData()
            });
        });
    }
    addTrade({price, date, size}){
        // console.log(`${date} ${price} ${size}`);
        const product = this.state.product;
        const candle = [new Date(date).getTime(), price, price, price, price, size];
        const parsedCandle = this.parseDataArray({candle, product});
        console.log(candle);
        const joinedData = [...this.state.joinedData, parsedCandle];
        // joinedData.push(parsedCandle);
        this.setState({joinedData, price});
    }
    // this is for parsing candle data from GDAX
    parseDataArray({candle, product}){
        return {
            date: new Date(candle[0]*1000),
            open: candle[3],
            high: candle[2],
            low: candle[1],
            close: candle[4],
            volume: candle[5],
            split: '',
            dividend: '',
            // product,
        };
    }
    getHistoricalCandles(product, granularity){
        const url = `https://api.gdax.com/products/${product}/candles?granularity=${granularity}`;
        console.log(granularity, product, url)
        return fetch(url)
        .then(res=>res.json())
        // .then(json=>{
        //  console.log(`${JSON.stringify(json)}`)
        // })
        .then(json=>{
            if(json && json[0] && json[0][0]){
                console.log('testing')
                const lastDate = new Date(json[0][0]*1000)
                const firstDate = new Date(json[json.length-1][0]*1000)
                console.log(firstDate, lastDate)
                return json
            }
        })
        .then(
            candles=>candles ? candles.reverse().map(
                candle=>this.parseDataArray({candle, product})
            ) : null
        )
    }
    joinData(){
        console.log(`saved candles to state`);
        // console.log(`saved candles to state ${JSON.stringify(this.state, null, 1)}`);
        this.setState({joinedData: this.state.data});
    }
    render() {
        if( this.state === null || this.state.joinedData === null ){
            return <div>loading...</div>
        }
        return (
            <div>
                {this.state.price > 0 ? this.state.price.toFixed(2) : `connecting...`}
                {/*this.state.price.toFixed(2)*/}
                {/*<CandleStickChart type='hybrid' data={this.state && this.state.data ? this.state.data : null} />*/}
                {<CandleStickChart type='hybrid' data={this.state.joinedData} />}
            </div>
        );
    }
}

ChartComponent.propTypes = {

};

export default ChartComponent;



    // componentDidMount() {
    //     console.log(`ChartComponent mounted`)
    //     this.getData()
    // }
    // getData() {
    //     // const url = `https://api.gdax.com/products/${this.state.product}/candles?granularity=${this.state.granularity}`;
    //     // fetch(url)

    //     fetch("http://rrag.github.io/react-stockcharts/data/MSFT.tsv")
    //     .then(response => response.text())
    //     .then(data => tsvParse(data, this.parseData(parseDate)))
    //     .then(data => {
    //         console.log(`received ${data.length} candles ${JSON.stringify(data[0])}`)
    //         this.setState({ data }, ()=>console.log('tsv') )
    //     })
    //     .catch(error=>console.log(`ERROR: ${error}`))
    // }
    // parseData(parse) {
    //     return function(d) {
    //         d.date = parse(d.date);
    //         d.open = +d.open;
    //         d.high = +d.high;
    //         d.low = +d.low;
    //         d.close = +d.close;
    //         d.volume = +d.volume;
    //         return d;
    //     };
    // }