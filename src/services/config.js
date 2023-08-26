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
    base_url: process.env.REACT_APP_MAIN_MATIC_BASE_URL,
    multiSign: process.env.REACT_APP_POLYGON_MULTISIGN,
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
    exp_url: process.env.REACT_APP_POLYGON_EXPLORER_URL,
    base_url: process.env.REACT_APP_TEST_MATIC_BASE_URL,
    multiSign: false,
  },
}

export default blockChainConfig
