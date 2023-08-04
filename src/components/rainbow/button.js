import React, { useEffect } from 'react'
import { CButton } from '@coreui/react'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { configureChains, useAccount, useNetwork } from 'wagmi'
import { goerli, polygon, polygonMumbai } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { useGetNonce } from '../../redux/modules/userNonce'
import { useUserSign } from '../../redux/modules/userSign'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css'

const apiKey = process.env.REACT_APP_ALCHEMY_ID
const supportedChains = [goerli, polygon, polygonMumbai]
const providers = [alchemyProvider({ apiKey }), publicProvider()]
const { chains } = configureChains(supportedChains, providers)

const RainbowButton = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { dispatchGetNonce, loading: userNonceLoading } = useGetNonce()
  const { dispatchRemoveToken, userSign, loading: userSignLoading } = useUserSign()
  const userToken = userSign?.access_token
  const isLoading = userNonceLoading || userSignLoading

  useEffect(() => {
    if (chain) {
      dispatchRemoveToken()
    }
  }, [chain, dispatchRemoveToken])

  const handleSignInWallet = async () => {
    try {
      await dispatchGetNonce(address)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const showSignInWalletButton = !userToken && address && !chain.unsupported
  return (
    <>
      {showSignInWalletButton && (
        <CButton color="light" className="mx-2" onClick={handleSignInWallet} disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In Wallet'}
        </CButton>
      )}
      <RainbowKitProvider chains={chains} initialChain={process.env.REACT_APP_DEFAULT_CHAIN_ID}>
        <ConnectButton label="Connect Wallet" />
      </RainbowKitProvider>
    </>
  )
}

export default RainbowButton
