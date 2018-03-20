exports.config = {
    exchanges: {
        gdax: {
            import: {
                start: new Date('May 1, 2017 00:00'),
                end: null,
                // end: new Date('May 1, 2018 03:00'),
                // granularity: [60,300,900,3600,21600,86400],
                granularity: null,
                products: ['BTC-USD','LTC-USD','ETH-USD'],
                // products: ['BTC-USD'],
                timer: 2000,
            },
            api: {
                rest: 'https://api.gdax.com',
                ws: 'wss://ws-feed.gdax.com',
                key: {
                    pass: '',
                    public: '',
                    secret: '',
                }
            },
        }
    },
}