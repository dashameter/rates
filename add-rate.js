const Dash = require('dash');
const axios = require('axios')
const secrets = require('./secrets.js');

const clientOpts = {
  network: 'evonet',
  apps: {
    ratesContract: {
      contractId: 'Ceam5k4H9g9zTt1Xn7gzhhKbvoWnNVZMY7N2Ym69RZVQ'
    }
  },
  wallet: {
    mnemonic: secrets.mnemonic
  }
};
console.log(clientOpts); 
const client = new Dash.Client(clientOpts);
let identity;

const submitRateDocument = async function () {
  const platform = client.platform;

  try {
    identity = await platform.identities.get('4R6odQPEFrJDt74Jwn7gB67hVCyqQK78fQvY8w8Q3UKg');

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
    // Sign and submit the document(s)
    await platform.documents.broadcast(documentBatch, identity);


  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
};

submitRateDocument();