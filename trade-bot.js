require('dotenv').config();
const bitstorage = require('./node-bitstorage-api');
const tax_cex = 0.2; //0.2%
let per_profit = 10; //10%
let priceStartBuy = 0.0100000;
let priceStartSell = 0.100000;
let lestPrice = 0.000000;
let sell = 0.000000;
const trade = async () => {
    const request_id = Date.now() + Math.floor(Math.random() * 1000)
    bitstorage.init_key({'key':process.env.API_KEY,'secret':process.env.SECRET});
    const assets = await bitstorage.queryApi('ticker',{'pair':'LUNESUSDT'})
    const balances = await bitstorage.queryApi('balances-and-info',{'request_id':request_id})
    if(!balances?.data?.list) return
    const balance_lunes = balances.data.list.find(balance => balance.currency.iso3 === 'LUNES')?.balance_available
    const balance_usdt = balances.data.list.find(balance => balance.currency.iso3 === 'USDT')?.balance_available
    const bookOrders = await bitstorage.queryApi('orderbook',{'pair':'LUNESUSDT'})
    if(!bookOrders?.data) return
    const first_buy = bookOrders?.data?.buy[0]
    const first_sell = bookOrders?.data?.sell[0]
    
    //create order buy
    if(Number(first_buy.rate) < priceStartBuy){
      if(Number(balance_usdt) > 0){        
        let amount = Math.round((balance_usdt * 10) / 100) 
        
        await bitstorage.queryApi('orders/new', {
          type_trade:1,
          type:0,
          rate: 1,
          stop_rate:0,
          volume: amount,
          pair:'LUNESUSDT',
          request_id:request_id
        })
        priceStartBuy =  Number(first_buy.rate)
        priceStartSell = Number(first_buy.rate) + Math.round(((Number(first_buy.rate) * per_profit)/100))
      }
    }
    //create order sell
    if(Number(first_sell.rate) > priceStartSell){
      if(Number(balance_lunes) > 0){        
        let amount = 5000000000 
        if(amount > balance_lunes){
          amount = balance_lunes
        }
        await bitstorage.queryApi('orders/new', {
          type_trade:1,
          type:1,//sell
          rate: 1,
          stop_rate:0,
          volume: amount,
          pair:'LUNESUSDT',
          request_id:request_id
        })
        priceStartSell =  Number(first_sell.rate)
        priceStartBuy = Number(first_sell.rate) - Math.round(((Number(first_sell.rate) * per_profit)/100))
      }
    }
    
    if(lestPrice != Number(first_sell.rate)){
      lestPrice = Number(first_sell.rate)
      sell =+ Math.round( Number(first_sell.rate) + ((Number(first_sell.rate) * per_profit)/100))
      if(Number(balance_lunes) > 0){        
        let amount = 5000000000 + Math.round((balance_usdt * 10) / 100)
        if(amount > balance_lunes){
          amount = balance_lunes
        }
       await bitstorage.queryApi('orders/new', {
          type_trade:1,
          type:0,//Buy
          rate: 0,
          stop_rate:0,
          volume: amount,
          pair:'LUNESUSDT',
          request_id:request_id
        })
        priceStartBuy =  Number(first_buy.rate)
        priceStartSell = Number(sell) + Math.round(((Number(sell) * per_profit)/100))
      }

    }
    /**
     *  Trade Bot 
     */
    console.log(assets)
    console.log(balance_lunes)
    console.log(balance_usdt)
    console.log(first_buy)
    console.log(first_sell)
}
setInterval( async () => {
  await trade()
}, 1000 * 10)
