const { getContractDeployments } = require('./utils/network');
const { getCurrentNetwork } = require('./utils/network');

const manifest = [];

const OVERWRITE_HISTORICAL_BLOCK = 5873222;
const HISTORICAL_PROXY_SYNTHETIX = '0xc011a72400e58ecd99ee497cf89e3775d4bd732f';

for (const contractName of ['Synthetix', 'ERC20']) {
  getContractDeployments('Proxy' + contractName).forEach((a, i) => {
    manifest.push({
      kind: 'ethereum/contract',
      name: `issuance_${contractName}_${i}`,
      network: getCurrentNetwork(),
      source: {
        address: a.address,
        startBlock: a.address.toLowerCase() === HISTORICAL_PROXY_SYNTHETIX ? OVERWRITE_HISTORICAL_BLOCK : a.startBlock,
        abi: 'Synthetix',
      },
      mapping: {
        kind: 'ethereum/events',
        apiVersion: '0.0.4',
        language: 'wasm/assemblyscript',
        file: '../src/issuance.ts',
        entities: ['SNXTransfer'],
        abis: [
          {
            name: 'Synthetix',
            file: '../abis/Synthetix.json',
          },
          {
            name: 'Synthetix4',
            file: '../abis/Synthetix_bytes4.json',
          },
          {
            name: 'Synthetix32',
            file: '../abis/Synthetix_bytes32.json',
          },
          {
            name: 'AddressResolver',
            file: '../abis/AddressResolver.json',
          },
          {
            name: 'SynthetixState',
            file: '../abis/SynthetixState.json',
          },
        ],
        eventHandlers: [
          {
            event: 'Transfer(indexed address,indexed address,uint256)',
            handler: 'handleTransferSNX',
          },
        ],
      },
    });
  });
}

getContractDeployments('ProxyFeePool').forEach((a, i) => {
  manifest.push({
    kind: 'ethereum/contract',
    name: `issuance_FeePool_${i}`,
    network: getCurrentNetwork(),
    source: {
      address: a.address,
      startBlock: a.startBlock,
      abi: 'FeePool',
    },
    mapping: {
      kind: 'ethereum/events',
      apiVersion: '0.0.4',
      language: 'wasm/assemblyscript',
      file: '../src/issuance.ts',
      entities: ['FeesClaimed', 'SNXHolder'],
      abis: [
        {
          name: 'FeePool',
          file: '../abis/FeePool.json',
        },
        {
          name: 'FeePoolv217',
          file: '../abis/FeePool_v2.17.json',
        },
        {
          name: 'Synthetix4',
          file: '../abis/Synthetix_bytes4.json',
        },
        {
          name: 'Synthetix32',
          file: '../abis/Synthetix_bytes32.json',
        },
      ],
      eventHandlers: [
        {
          event: 'FeesClaimed(address,uint256,uint256)',
          handler: 'handleFeesClaimed',
        },
      ],
    },
  });
});

getContractDeployments('RewardEscrow').forEach((a, i) => {
  manifest.push({
    kind: 'ethereum/contract',
    name: `issuance_RewardEscrow_${i}`,
    network: getCurrentNetwork(),
    source: {
      address: a.address,
      startBlock: a.startBlock,
      abi: 'RewardEscrow',
    },
    mapping: {
      kind: 'ethereum/events',
      apiVersion: '0.0.4',
      language: 'wasm/assemblyscript',
      file: '../src/issuance.ts',
      entities: ['RewardEscrowHolder', 'SNXHolder'],
      abis: [
        {
          name: 'RewardEscrow',
          file: '../abis/RewardEscrow.json',
        },
        {
          name: 'Synthetix',
          file: '../abis/Synthetix.json',
        },
        {
          name: 'Synthetix4',
          file: '../abis/Synthetix_bytes4.json',
        },
        {
          name: 'Synthetix32',
          file: '../abis/Synthetix_bytes32.json',
        },
        {
          name: 'Synthetix32',
          file: '../abis/Synthetix_bytes32.json',
        },
        {
          name: 'AddressResolver',
          file: '../abis/AddressResolver.json',
        },
        {
          name: 'SynthetixState',
          file: '../abis/SynthetixState.json',
        },
      ],
      eventHandlers: [
        {
          event: 'VestingEntryCreated(indexed address,uint256,uint256)',
          handler: 'handleRewardVestEvent',
        },
        {
          event: 'Vested(indexed address,uint256,uint256)',
          handler: 'handleRewardVestEvent',
        },
      ],
    },
  });
});

for (const token of ['sUSD', 'ERC20sUSD']) {
  getContractDeployments('Proxy' + token).forEach((a, i) => {
    manifest.push({
      kind: 'ethereum/contract',
      name: `issuance_Synth${token}_${i}`,
      network: getCurrentNetwork(),
      source: {
        address: a.address,
        startBlock: a.startBlock,
        abi: 'Synth',
      },
      mapping: {
        kind: 'ethereum/events',
        apiVersion: '0.0.4',
        language: 'wasm/assemblyscript',
        file: '../src/issuance.ts',
        entities: ['Transfer', 'Issued', 'Burned'],
        abis: [
          {
            name: 'Synth',
            file: '../abis/Synth.json',
          },
          {
            name: 'Synthetix',
            file: '../abis/Synthetix.json',
          },
          {
            name: 'Synthetix4',
            file: '../abis/Synthetix_bytes4.json',
          },
          {
            name: 'Synthetix32',
            file: '../abis/Synthetix_bytes32.json',
          },
          {
            name: 'AddressResolver',
            file: '../abis/AddressResolver.json',
          },
          {
            name: 'SynthetixState',
            file: '../abis/SynthetixState.json',
          },
        ],
        eventHandlers: [
          {
            event: 'Transfer(indexed address,indexed address,uint256)',
            handler: 'handleTransferSynth',
          },
          {
            event: 'Issued(indexed address,uint256)',
            handler: 'handleIssuedSynths',
          },
          {
            event: 'Burned(indexed address,uint256)',
            handler: 'handleBurnedSynths',
          },
        ],
      },
    });
  });
}

module.exports = {
  specVersion: '0.0.2',
  description: 'Synthetix API',
  repository: 'https://github.com/Synthetixio/synthetix-subgraph',
  schema: {
    file: './issuance.graphql',
  },
  dataSources: manifest,
};
