const { clone } = require('lodash');
const latestRates = require('./fragments/latest-rates');
const fs = require('fs');

const manifest = []; //clone(latestRates.dataSources);

// for exchange rates, modify so we can capture the snx price
for (const lrm of clone(latestRates.dataSources)) {
  if (lrm.name !== 'ChainlinkMultisig') {
    lrm.mapping.file = '../src/rates.ts';
  }
  manifest.push(lrm);
}

const templates = clone(latestRates.templates);

// handle SNX price and rate updates by overriding template
templates.find((v) => v.name == 'Aggregator').mapping.file = '../src/rates.ts';
templates.find((v) => v.name == 'InverseAggregator').mapping.file = '../src/rates.ts';
templates.find((v) => v.name == 'SynthAggregator').mapping.file = '../src/rates.ts';

let b = {
  specVersion: '0.0.2',
  description: 'Synthetix Rates API',
  repository: 'https://github.com/Synthetixio/synthetix-subgraph',
  schema: {
    file: './rates.graphql',
  },
  dataSources: manifest,
  templates: templates,
}

console.dir(b)

const data = JSON.stringify(b, null, 4);
fs.writeFile('info.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});


module.exports = {
  specVersion: '0.0.2',
  description: 'Synthetix Rates API',
  repository: 'https://github.com/Synthetixio/synthetix-subgraph',
  schema: {
    file: './rates.graphql',
  },
  dataSources: manifest,
  templates: templates,
};
