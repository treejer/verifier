const blockChainConfig = {
  137: {
    contracts: {
      TreeFactory: {
        address: process.env.REACT_APP_POLYGON_CONTRACT_TREE_FACTORY_ADDRESS,
        abi: require('../abis/TreeFactory.json'),
      },
      AR: {
        address: process.env.REACT_APP_POLYGON_CONTRACT_AR_ADDRESS,
        abi: require('../abis/AccessRestriction.json'),
      },
      Planter: {
        address: process.env.REACT_APP_POLYGON_CONTRACT_PLANTER_ADDRESS,
        abi: require('../abis/Planter.json'),
      },
    },
    exp_url: process.env.REACT_APP_POLYGON_EXPLORER_URL,
    base_url: process.env.REACT_APP_POLYGON_API_BASE_URL,
    multiSign: process.env.REACT_APP_POLYGON_MULTISIGN,
    safeAddress: process.env.REACT_APP_POLYGON_SAFE_ADDRESS,
    safeServiceUrl: process.env.REACT_APP_POLYGON_SAFE_SERVICE_URL,
    safeTxUrl: process.env.REACT_APP_POLYGON_SAFE_TX_URL,
  },
  5: {
    contracts: {
      TreeFactory: {
        address: process.env.REACT_APP_GOERLI_CONTRACT_TREE_FACTORY_ADDRESS,
        abi: require('../abis/TreeFactory.json'),
      },
      AR: {
        address: process.env.REACT_APP_GOERLI_CONTRACT_AR_ADDRESS,
        abi: require('../abis/AccessRestriction.json'),
      },
      Planter: {
        address: process.env.REACT_APP_GOERLI_CONTRACT_PLANTER_ADDRESS,
        abi: require('../abis/Planter.json'),
      },
    },
    exp_url: process.env.REACT_APP_GOERLI_EXPLORER_URL,
    base_url: process.env.REACT_APP_MAIN_GOERLI_BASE_URL,
    multiSign: process.env.REACT_APP_GOERLI_MULTISIGN,
    safeAddress: process.env.REACT_APP_GOERLI_SAFE_ADDRESS,
    safeServiceUrl: process.env.REACT_APP_GOERLI_SAFE_SERVICE_URL,
    safeTxUrl: process.env.REACT_APP_GOERLI_SAFE_TX_URL,
  },
  80001: {
    contracts: {
      TreeFactory: {
        address: '',
        abi: require('../abis/TreeFactory.json'),
      },
      AR: {
        address: '',
        abi: require('../abis/AccessRestriction.json'),
      },
      Planter: {
        address: '',
        abi: require('../abis/Planter.json'),
      },
    },
    exp_url: process.env.REACT_APP_MUMBAI_EXPLORER_URL,
    base_url: process.env.REACT_APP_MUMBAI_API_BASE_URL,
    multiSign: process.env.REACT_APP_MUMBAI_MULTISIGN,
    safeAddress: process.env.REACT_APP_MUMBAI_SAFE_ADDRESS,
    safeServiceUrl: process.env.REACT_APP_MUMBAI_SAFE_SERVICE_URL,
    safeTxUrl: process.env.REACT_APP_MUMBAI_SAFE_TX_URL,
  },
}

export default blockChainConfig
