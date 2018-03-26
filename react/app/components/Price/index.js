/**
*
* Price
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

const PriceWrapper = styled.div`
    text-align: center;
    display: inline-block;
`;

class Price extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
        };
    }
    componentDidMount(){
        const ws = new WebSocket(this.state.wsUrl);
        ws.onopen = () => ws.send(JSON.stringify(this.state.params));
        ws.onmessage = (msg) => {
            var data = JSON.parse(msg.data);
            const product = data.product_id;
            const price = parseFloat(data.price);
            const date = data.date;
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
                    console.log(`handle last match to set the last candle... ${price} ${date} ${data.size} $${usd}`);
                    break;
                default:
                    break;
            }
            return null;
        }
        this.setState({ws});
    }
    addTrade({price, date, size}){
        // console.log(`${price} ${size}`);
        this.setState({price});
    }
    render() {
        return (
            <PriceWrapper>
                {this.state.price > 0 ? `$${this.state.price.toFixed(2)}` : null}
            </PriceWrapper>
        );
    }
}

Price.propTypes = {

};

export default Price;
