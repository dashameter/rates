const Dash = require('dash');
const axios = require('axios')
const secrets = require('./secrets.js');

const clientOpts = {
    network: 'testnet',
    apps: {
      ratesContract: {
        contractId: 'r2bSyugQdpebc8vRPF1oLaCdoJgxYF3zqp6GyEGBqHh'
      }
    },
    wallet: {
      mnemonic: secrets.mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
      }
    },
    dapiAddresses: [
      '34.220.41.134:3000',
      '18.236.216.191:3000',
      '54.191.227.118:3000'
    ]
};

console.log(clientOpts); 
const client = new Dash.Client(clientOpts);


let identity;

const submitRateDocument = async function () {
  const platform = client.platform;


  try {

    // client.account = await client.getWalletAccount();
    // const identityId = client.account.identities.getIdentityIds()[0];
    // console.log('identityId :>> ', identityId);
    
    const identityId = "6fUUb7owvygWxaTfzos1wX3na7Mw9TYCYfq6TdTmR8pG"
    
    identity = await platform.identities.get(identityId);

    let response = await axios.get('https://rates2.dashretail.org/rates?source=dashretail&symbol=dashbtc,dashusd,dasheur,dashgbp,dashves,dashngn,dashthb')
    //console.log('got api response:', response);

    /*
    // sample data  
    const docProperties = {
      "baseCurrency": "DASH",
      "price": 91.0243,
      "quoteCurrency": "USD",
      "retrieved": "2020-08-19T13:24:37.433863587Z",
      "source": "dashretail-average",
      "symbol": "DASHUSD"
    }
    */

    const asyncRes = await Promise.all(response.data.map(async (i) => {
      i.price = parseFloat(i.price);
      // Create the rate document
      const rateDocument = await platform.documents.create(
        'ratesContract.rate',
        identity,
        //docProperties,
        i,
      );

     
      return rateDocument;
    }));

    console.log('results:', asyncRes);

    const documentBatch = {
      create: asyncRes,
      replace: [],
      delete: [],
    }
    await platform.documents.broadcast(documentBatch, identity);
  } catch (e) {
    console.error('Something went wrong:', e);
    console.dir(e, {depth: 100})
  } finally {
    client.disconnect();
  }
};

submitRateDocument();