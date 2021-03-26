const Dash = require('dash');
const secrets =require('./secrets.js');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: secrets.mnemonic,
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
    },
  },
    dapiAddresses: [
      '34.220.41.134:3000',
      '18.236.216.191:3000',
      '54.191.227.118:3000'
    ]
};
const client = new Dash.Client(clientOpts);

const topupIdentity = async () => {
  const identityId = '6fUUb7owvygWxaTfzos1wX3na7Mw9TYCYfq6TdTmR8pG';
  const topUpAmount = 1e8; // Number of duffs

  await client.platform.identities.topUp(identityId, topUpAmount);
  return client.platform.identities.get(identityId);
};

topupIdentity()
  .then((d) => console.log('Identity credit balance: ', d.balance))
    .catch((e) => {
        console.error('Something went wrong:\n', e)
        console.dir(e, {depth: 100})
})
  .finally(() => client.disconnect());