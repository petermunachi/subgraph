#!/bin/bash
network=$1
subgraph=$2
token=ce8088e05fe2de69a161d2a4675e19de
networks='mainnet goerli optimism kovan optimism-kovan'

GRAPH=${GRAPH:-graph}

if [ "all" == $network ]; then
    for i in $networks; do
        echo "deploying subgraph: $subgraph, to network: $i"
        SNX_NETWORK=$i $GRAPH deploy --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ --access-token $THEGRAPH_SNX_ACCESS_TOKEN petermunachi/subgraph subgraphs/$subgraph.js
    done
else
    SNX_NETWORK=$network $GRAPH deploy  --debug --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ --access-token $token petermunachi/subgraph subgraphs/$subgraph.js
fi
