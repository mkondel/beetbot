const log = msg => console.log(`[${new Date()}] ${msg}`)
log(`start`)
const Sequelize = require('sequelize')
const request = require('request')
// randInt() returns a random integer in the given min/max range
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
// poll() repeats the cb() every 'timer' milliseconds
const poll = (timer, cb) => {
    const timeout = setTimeout(()=>{
        clearTimeout(timeout)
        cb()
        poll(timer, cb)
    }, timer)
}
// getNowRounded returns the start of the current candle given a time interval
const getNowRounded = ({interval}) => new Date( Math.round( (new Date().getTime() )/interval )*interval)
// maxTimeBefore() returns the candle start time for the maximum time back (300 candles API limit)
const maxTimeBefore = ({interval, end}) => new Date(end.getTime() - interval*300)
// getCandles() receives candle data as csv from GET API
const getCandles = ({ url }) => new Promise((resolve, reject) => {
    // log(`getting candles from: ${url}`)
    // resolve([])
    request(
        { url, headers: {'User-Agent': 'request'} }, 
        function(err, res, data){
            if (err) {
                log(`ERROR from ${url}`)
                reject(err)
                return
            }
            log(`getCandles(): ${res && res.statusCode}`)
            // NOT A JSON, TEXT<--
            const json = JSON.parse(data)
            // json is an array of candles, in the form as above
            resolve(json)
        }
    )
})
// const config = require('./config-sample').config
const config = {
    exchanges: {
        gdax: {
            import: {
                // start: new Date('May 1, 2017 00:00'),
                start: null,
                // end: new Date('May 1, 2017 03:00'),
                end: null,
                // granularity can be [60,300,900,3600,21600,86400]
                granularity: 3600,
                // products can be ['BTC-USD','LTC-USD','ETH-USD','BCH-USD']
                products: ['BTC-USD'],
                // milliseconds to wait before making next API request
                timer: 2000,
            },
            api: {
                rest: 'https://api.gdax.com',
                ws: 'wss://ws-feed.gdax.com',
                key: { pass: '', public: '', secret: '' },
            },
        }
    },
    db: {
        sqlite: {
            options: { 
                user: 'username', 
                pass: 'password', 
                host: 'localhost', 
                dialect: 'sqlite', 
                storage: 'candles.db',
                logging: false, 
            },
        }
    },
}
const db = config.db['sqlite']
// log(`database config: ${JSON.stringify(db)}`)
// dbErrorCheck() handles errors with min/max value checking
const dbErrorCheck = error => {
    switch(error.name){
        case `SequelizeDatabaseError`:
            log(`ERROR: ${error.original}. Probably no such table yet.`)
            return {minTime: null, maxTime: null}
            break
        default:
            log(`ERROR: ${error.original}`)
            break
    }
}
// return a promise to resolve with the start and end dates for this db table
// asset = {product, table}
const getDateLimits = (asset) => {
    const table = asset.table
    return table.min('time')
    .then(minTime => {
        return table.max('time')
        .then(maxTime => {
            log(`minTime: ${new Date(minTime*1000)} \nmaxTime: ${new Date(maxTime*1000)}`)
            return ({
                minTime: isNaN(minTime) ? null : new Date(minTime*1000), 
                maxTime: isNaN(maxTime) ? null : new Date(maxTime*1000),
            })
        })
        .catch(dbErrorCheck)
    })
    .catch(dbErrorCheck)
}

const exchangeNames = Object.keys(config.exchanges)
log(`initializing exchanges: ${exchangeNames}`)
exchangeNames.map(exchangeName => {
    const conf = config.exchanges[exchangeName]
    const products = conf.import.products
    const host = conf.api.rest

    // create a db for each exchange
    const sequelize = new Sequelize(exchangeName, db.user, db.pass, {...db.options})

    // create a table for each product
    // [ time, low, high, open, close, volume ]
    const exchangeAssets = products.map(product=>
        ({
            product,
            table: sequelize.define(product, {
                id: {
                    primaryKey: true,
                    type: Sequelize.TEXT,
                },

                time: Sequelize.INTEGER,
                low: Sequelize.FLOAT,
                high: Sequelize.FLOAT,
                open: Sequelize.FLOAT,
                close: Sequelize.FLOAT,
                volume: Sequelize.FLOAT,

                product: Sequelize.TEXT,
                granularity: Sequelize.INTEGER,
                exchangeName: Sequelize.TEXT,
            }),
        })
    )

    log(`connecting to the database: ${exchangeName}`)
    sequelize.sync()
    .then(() => {
        // loop through all products on this exchange
        exchangeAssets.map(asset=>{
            // product name like BTC-USD
            const product = asset.product

            // check first and last dates in the db, and decide what to load
            log(`checking existing data`)
            getDateLimits(asset)
            .then(dateLimits => {
        console.dir(dateLimits)
                // granularity in gdax api is the size of candles
                const granularity = conf.import.granularity
                // interval is granularity in milliseconds
                const interval = granularity * 1000
                // set the end to the earliest candle, or set to now
                dateLimits.end = dateLimits.minTime ? dateLimits.minTime : getNowRounded({interval})
                // set the start to the maximum amount of time before the end candle
                dateLimits.start = maxTimeBefore({interval, end: dateLimits.end})
                // insertCandles() inserts new candles into the database
                const insertCandles = ({candles}) => {
                    console.log(`insertCandles(): candle granularity: ${granularity}, product: ${product}`)
                    // parse csv into json objects
                    return Promise.all(candles.map(csv => 
                        asset.table.create({
                            id: `${product}-${csv[0]}`,
                            product, 
                            granularity, 
                            exchangeName,
                            time: parseInt(csv[0]), 
                            low: parseFloat(csv[1]), 
                            high: parseFloat(csv[2]), 
                            open: parseFloat(csv[3]), 
                            close: parseFloat(csv[4]), 
                            volume: parseFloat(csv[5]),
                        })
                        .catch(error => log(`ERROR insertCandles(): ${error}`))
                    ))
                }
                // moveDates() moves the start and end date back by the maximum amount
                const moveDates = (end, interval, product) => {
                    dateLimits.start = maxTimeBefore({interval, end})
                    dateLimits.end = end
                }

                log(`start polling ${product}`)
                poll(conf.import.timer, cb=>{
                    // either use the end data from the config, or use the current time, rounded down to the last interval
                    const lastTimestamp = getNowRounded({interval})
                    const end = dateLimits.end ? dateLimits.end : lastTimestamp
                    // either use the start data from the config, or calculate the maximum distance back from the end date
                    const firstTimestamp = maxTimeBefore({interval, end})
                    const start = dateLimits.start ? dateLimits.start : firstTimestamp
                    // build the url to get candles from
                    const url=`${host}/products/${product}/candles?granularity=${granularity}&start=${start}&end=${end}`
                    // receive candles via GET api
                    getCandles({ url })
                    // // insert the data into db
                    .then(candles => insertCandles({candles}))
                    // // move the start and end dates
                    .then(() => moveDates(start, interval, product))
                    .catch(error => log(`ERROR main(): ${error}`))
                })
            })
        })
    })
})