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
            price: 0,
            timeout: 1000,
            wsUrl: 'wss://ws-feed.gdax.com',
            ws: null,
            params: {
                'type': 'subscribe',
                'channels': [{'name': 'matches', product_ids: ['BTC-USD']}]
            },
            data: null,
        };
    }
    // componentDidMount(){
    //     const ws = new WebSocket(this.state.wsUrl);
    //     ws.onopen = () => ws.send(JSON.stringify(this.state.params));
    //     ws.onmessage = (msg) => {
    //         var data = JSON.parse(msg.data);
    //         const product = data.product_id;
    //         const price = parseFloat(data.price);
    //         const date = data.date;
    //         const side = data.side;
    //         const size = parseFloat(data.size);
    //         const usd = price * size;
    //         switch(data.type) {
    //             case 'match':
    //                 switch(product) {
    //                     case 'BTC-USD':
    //                         this.addTrade({price, date, size});
    //                         // // update the page title
    //                         // this.updateTitle({price, side})
    //                         break;
    //                     default:
    //                         break;
    //                 }
    //                 break;
    //             case 'last_match':
    //                 console.log(`handle last match to set the last candle... ${price} ${date} ${data.size} $${usd}`);
    //                 break;
    //             default:
    //                 break;
    //         }
    //         return null;
    //     }
    //     this.setState({ws});
    // }
    // addTrade({price, date, size}){
    //     // console.log(`${price} ${size}`);
    //     this.setState({price});
    // }
    parseData(parse) {
        return function(d) {
            d.date = parse(d.date);
            d.open = +d.open;
            d.high = +d.high;
            d.low = +d.low;
            d.close = +d.close;
            d.volume = +d.volume;
            return d;
        };
    }
    getData() {
        fetch("http://rrag.github.io/react-stockcharts/data/MSFT.tsv")
        .then(response => response.text())
        .then(data => tsvParse(data, this.parseData(parseDate)))
        .then(data => {
            console.log(`received ${data.length} candles`)
            this.setState({ data }, ()=>console.log(`saved candles to state`))
        })
        .catch(error=>console.log(`ERROR: ${error}`))
    }
    componentDidMount() {
        console.log(`ChartComponent mounted`)
        this.getData()
    }
    render() {
        if( this.state === null || this.state.data === null ){
            return <div>loading...</div>
        }
        return (
            <div>
            {/*<CandleStickChart type='hybrid' data={this.state && this.state.data ? this.state.data : null} />*/}
            {<CandleStickChart type='hybrid' data={this.state.data} />}
            </div>
        );
    }
}

ChartComponent.propTypes = {

};

export default ChartComponent;
