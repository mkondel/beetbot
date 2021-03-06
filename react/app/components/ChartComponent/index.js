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

import styled from 'styled-components';
const ChartWrapper = styled.div`
    text-align: initial;
`;

class ChartComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props){
        super(props);
        this.state = {
            price: -1,
            ws: new WebSocket('wss://ws-feed.gdax.com'),
            params: {'type': 'subscribe','channels': [{'name': 'matches', product_ids: [props.product]}]},
            data: null,
            product: props.product,
            granularity: 60,
            ticksPerCandle: 20,
            uiUpdateInterval: 200,
        };
        this.ticksLeft = this.state.ticksPerCandle;
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
                        case this.props.product:
                            this.addTrade({price, date, size});
                            break;
                        default:
                            break;
                    }
                    break;
                case 'last_match':
                    console.log(`last candle... ${price} ${date} ${data.size} $${usd}`);
                    this.setState({data: [this.parseDataArray({
                        candle: [new Date().getTime()/1000, price, price, price, price, size], 
                        product: this.state.product,
                    })]});
                    break;
                default:
                    break;
            }
            return null;
        }

        // update tick counter
        this.updateTicksEvery(this.state.uiUpdateInterval)
    }
    updateTicksEvery(interval){
        const timer = setInterval(()=>{
            clearInterval(timer);
            // do the thing
            this.setState(
                { ticksLeft: this.ticksLeft }, 
                // call itself
                ()=>this.updateTicksEvery(interval)
            )
        }, interval);
    }
    // add trade price(OHLC) and volume to the current "candle"
    addTrade({price, date, size}){
        // console.log(`${date} ${price} ${size}`);

        const product = this.state.product;

        if(this.currentCandle){
            // console.log(`currentCandle exists`);
            price > this.currentCandle.high ? this.currentCandle.high = price : null;
            price < this.currentCandle.low ? this.currentCandle.low = price : null;
            this.currentCandle.close = price;
            this.currentCandle.volume += size;
            this.ticksLeft--;
            if(this.ticksLeft <= 0){
                this.makeNewCandle();
            }
        }else{
            this.currentCandle = this.parseDataArray({
                candle: [new Date().getTime()/1000, price, price, price, price, size], 
                product,
            });
        }

    }
    makeNewCandle(){
        // console.log(`makeNewCandle`);
        // get all candles
        const data = this.state.data ? this.state.data : [];
        // append current candle to data
        data.push(this.currentCandle);
        // clear current candle
        this.currentCandle = null;
        // reset tick counter
        this.ticksLeft = this.state.ticksPerCandle;
        // save new data, an empty current candle, and a reset tick counter to state
        // this.setState({data, currentCandle, ticksLeft}, ()=>this.joinData());
        this.setState({data});

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
        };
    }
    render() {
        const candle = this.currentCandle;
        let data = this.state.data;

        if(data && candle){
            // both data and candle, combine together
            // console.log(`both data and candle, combine together`)
            data = [...data, candle];
        }else if(data){
            // data only, do nothing
            // console.log(`data only, do nothing`)
        }else if(candle){
            // candle only, turn into data
            // console.log(`candle only, turn into data`)
            data = [candle];
        }
        // console.dir(data);
        if( data && data.length > 1 ){
            return (
                <ChartWrapper>
                    {/*<div>data: {JSON.stringify(this.state.data)}</div>*/}
                    {/*<div>{JSON.stringify(this.state.currentCandle)}</div>*/}
                    {<div>ticksLeft: {this.state.ticksLeft}</div>}
                    {<CandleStickChart 
                        type='hybrid' 
                        data={data} 
                        height={window.innerHeight - 200}
                        width={window.innerWidth - 20}
                        candleCount={100}
                    />}
                </ChartWrapper>
            );
        }else{
            return <ChartWrapper>loading first candle... ticksLeft: {this.state.ticksLeft}</ChartWrapper>
        }
    }
}

ChartComponent.propTypes = {

};

export default ChartComponent;