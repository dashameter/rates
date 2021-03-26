//v0.18 = r2bSyugQdpebc8vRPF1oLaCdoJgxYF3zqp6GyEGBqHh

const Dash = require('dash');
const secrets =require('./secrets.js');

const clientOpts = {
    network: 'testnet',
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

const client = new Dash.Client(clientOpts);

const registerContract = async function () {
  try {
    client.account = await client.getWalletAccount();
    let identity
    let identityId = client.account.identities.getIdentityIds()[0];
    console.log('identityId :>> ', identityId);
    
    if (!identityId)
      identity = await client.platform.identities.register();
    else 
     identity = await client.platform.identities.get(identityId) 
   console.log(identity) 

    const contractDocuments = {
      rate: {
        properties: {
          baseCurrency: {
            type: "string"
          },
          price: {
            type: "number"
          },
          quoteCurrency: {
            type: "string"
          },
          retrieved: {
            type: "string",
            maxLength: 30
          },
          source: {
            type: "string",
            maxLength: 20
          },
          symbol: {
            type: "string",
            maxLength: 10
          }  
        },
        additionalProperties: false,
        required: [
          "baseCurrency",
          "price",
          "quoteCurrency",
          "retrieved",
          "source",
          "symbol"
        ],
        "indices": [ 
          {
            "properties": [
              { "source": "asc" }
            ], 
            "unique": false
          },
          {
            "properties": [
              { "symbol": "asc" }
            ], 
            "unique": false
          },
          {
            "properties": [
              { "retrieved": "desc" }
            ], 
            "unique": false
          }
        ]
      }};
    
    const contract = await client.platform.contracts.create(contractDocuments, identity);
    console.dir({contract});
    // Sign and submit the data contract
    await client.platform.contracts.broadcast(contract, identity);
    console.log('contract id:', contract.getId().toString());
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
}

registerContract();