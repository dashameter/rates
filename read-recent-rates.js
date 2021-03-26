const Dash = require('dash');

const clientOpts = {
  apps: {
      ratesContract: {
        contractId: 'r2bSyugQdpebc8vRPF1oLaCdoJgxYF3zqp6GyEGBqHh'
      }
    },
    dapiAddresses: [
      '34.220.41.134:3000',
      '18.236.216.191:3000',
      '54.191.227.118:3000'
    ]
};
const client = new Dash.Client(clientOpts);

const getDocuments = async () => {
  return client.platform.documents.get(
    'ratesContract.rate',
    {
      limit: 10,
      orderBy: [['retrieved', 'desc']],

    },
  );
};

getDocuments()
  .then((d) => console.log(d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());