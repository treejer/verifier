const blockChainConfig = {
  137: {
    contracts: {
      TreeFactory: {
        address: 'a',
        abi: '',
      },
      Paymaster: {
        address: '',
        abi: '',
      },
      Planter: {
        address: '',
        abi: '',
      },
    },
    base_url: process.env.REACT_APP_MAIN_MATIC_BASE_URL,
  },
  1: {
    contracts: {
      TreeFactory: {
        address: 'b',
        abi: '',
      },
      Paymaster: {
        address: '',
        abi: '',
      },
      Planter: {
        address: '',
        abi: '',
      },
    },
    base_url: process.env.REACT_APP_MAIN_ETHERIUM_BASE_URL,
  },
  800001: {
    contracts: {
      TreeFactory: {
        address: 'b',
        abi: '',
      },
      Paymaster: {
        address: '',
        abi: '',
      },
      Planter: {
        address: '',
        abi: '',
      },
    },
    base_url: process.env.REACT_APP_TEST_MATIC_BASE_URL,
  },
}

export default blockChainConfig
