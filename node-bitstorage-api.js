const axios = require('axios');
const crypto = require('crypto');
var config = {
    'key':'',
    'secret':'',
}
let values = [];

const apiMethod = {
    'symbols' : {
        'method' : 'v1/public/symbols',
        'type' : 'public',
    },
    'ticker' : {
        'method' : 'v1/public/ticker',
        'type' : 'public',
        'require' : ['pair']
    },
    'orderbook' : {
        'method' : 'v1/public/book',
        'type' : 'public',
        'require' : ['pair']
    },
    'trades' : {
        'method' : 'v1/public/trades',
        'type' : 'public',
        'require' : ['pair']
    },
    'balances-and-info' : {
        'method' : 'v1/private/balances', 
        'type' : 'private',  
        'require' : ['request_id']      
    },
    'open-orders' : {
        'method' :'v1/private/get-order', 
        'type' : 'private',
        'require' : ['order_id', 'request_id']
    },
    'orders/new' : {
        'method' :'v1/private/create-order', 
        'type' : 'private',
        'require' : ['type_trade','type','rate','stop_rate','volume','stop_rate','pair','request_id']
    },
    'orders/active' : {
        'method' :'v1/private/orders', 
        'type' : 'private',
        'require' : ['request_id']
    },
    'orders/delete' : {
        'method' :'v1/private/delete-order', 
        'type' : 'private',
        'require' : ['request_id', 'order_id']
    },
    'orders/history' : {
        'method' :'v1/private/history', 
        'type' : 'private',
        'require' : ['request_id']
    },
    'balances' : {
        'method' :'v1/private/balances', 
        'type' : 'private',
        'require' : ['request_id']
    },
    'address' : {
        'method' :'v1/private/get-address', 
        'type' : 'private',
        'require' : ['iso','new','request_id']
    },
    'withdrawals/new' : {
        'method' :'v1/withdraw', 
        'type' : 'private',
        'require' : ['iso','amount','to_address','request_id','comment','fee_from_amount']
    },
    'user-transactions' : {
        'method' :'v1/withdraw/confirm-code', 
        'type' : 'private',
        'require' : ['id', 'request_id' , 'google_pin'  ]
    },
    'send-pin' : {
        'method' :'v1/withdraw/send-pin', 
        'type' : 'private',
        'require' : ['id', 'request_id']
    }
}

exports.init_key = function (cfg) {
	config.key = cfg.key;
	config.secret = cfg.secret;
};
function checkParam(name, data, require = []) {
    if('require' in apiMethod[name]) {
        if('orders' in data) {
            data['orders'].forEach(elem => {
                require.forEach(element => {
                    if(!elem[element] && isNaN(elem[element])) {
                        throw new Error(`Method ${name} requires ${element} parameter.`)
                    }
                })    
            })
        } else {
        require.forEach(element => {
            if(!data[element] && isNaN(data[element])) {
                throw new Error(`Method ${name} requires ${element} parameter.`)
            }
        })
        }
    }
    return true
}

function checkKey() {
    if(!config.key)
        throw new Error(`Not found API KEY`)
    if(!config.secret)
        throw new Error(`Not found API SECRET KEY`)
    return true
}

function getUrl(name,data) {    
    var url = apiMethod[name].method
    if('require' in apiMethod[name]) {       
        const queryString =  apiMethod[name].require
            .map(r => `${r}=${encodeURIComponent(data[r])}`)
            .join('&');
        url += `?${queryString}`;
    }
    return url
}

function sortObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(sortObject);
    }
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    sortedKeys.forEach(key => {
      result[key] = sortObject(obj[key]);
    });
    return result;
}
function extractValues(obj) {
   
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      Object.values(obj).forEach(value => extractValues(value));
    } else {
      values.push(obj);
    }
    return values;
  }
function XAuthSign(data) {
    const sortedParams = sortObject(data);
   
    const values = extractValues(sortedParams);
    console.log(values)
    const dataToHash = values.join('') +config.secret;
    console.log(dataToHash)
    return crypto.createHash('sha256').update(dataToHash).digest('hex').toString();
}

exports.queryApi = async function api_query (name, data = {}) { 
    try {
        values = []
        const api = axios.create({
            baseURL: 'https://api.bitstorage.finance/',
            timeout: 5000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        });
        checkParam(name,data,apiMethod[name].require)
        var response = null
        if(apiMethod[name].type == 'public') {
            response =  await api.get(getUrl(name,data));
        } else {
            checkKey()
            var xAuthSing = XAuthSign(data)
            response =  await api.post(apiMethod[name].method, data, {
                headers: {
                    'X-Auth-Sign': xAuthSing,
                    'login-token': config.key
                }
            });       
        }
        let json = await response.data;
        return(json);
    } catch (error) {
        return error
    }   
    
}






 
