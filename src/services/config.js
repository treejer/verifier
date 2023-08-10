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
  5: {
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
    base_url: process.env.REACT_APP_MAIN_GOERLI_BASE_URL,
  },
  80001: {
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
