import { useState } from 'react'
import { writeContract, prepareWriteContract, readContract, waitForTransaction } from '@wagmi/core'
import { ethers } from 'ethers'
import { useWeb3 } from '../../redux/modules/web3/slice'
import contryCodes from '../contryCodes.json'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { OperationType } from '@safe-global/safe-core-sdk-types'
import { encodeFunctionData } from 'viem'

const useContract = () => {
  const { web3 } = useWeb3()
  const [adminRole, setAdminRole] = useState(false)
  const [roleGranted, setRoleGranted] = useState(false)
  const [planterGrant, setPlanterGrant] = useState({ error: null, success: null, hash: null })
  const [joinAdminData, setJoinAdminData] = useState({ error: null, success: null, hash: null })
  const [joinAdminDataWithSafe, setJoinAdminDataWithSafe] = useState({
    error: null,
    success: null,
    hash: null,
  })

  const checkPlanterRoleGranted = async (Address) => {
    try {
      const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLANTER_ROLE'))
      const hasRole = await readContract({
        address: web3.config.contracts.AR.address,
        abi: web3.config.contracts.AR.abi,
        functionName: 'hasRole',
        args: [roleHash, Address],
      })
      setRoleGranted(hasRole)
    } catch (error) {
      console.error('Transaction error:', error)
    }
  }

  // Check Admin Role //
  const checkAdminRole = async (Address) => {
    try {
      const hasRole = await readContract({
        address: web3.config.contracts.AR.address,
        abi: web3.config.contracts.AR.abi,
        functionName: 'hasRole',
        args: ['0x0000000000000000000000000000000000000000000000000000000000000000', Address],
      })
      setAdminRole(hasRole)
    } catch (error) {}
  }

  // handle grant planter role //
  const handleGrantPlanterRole = async (Address) => {
    const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLANTER_ROLE'))
    try {
      const config = await prepareWriteContract({
        address: web3.config.contracts.AR.address,
        abi: web3.config.contracts.AR.abi,
        functionName: 'grantRole',
        args: [roleHash, Address],
      })
      const { hash } = await writeContract(config)
      setPlanterGrant({
        hash: null,
        success: true,
        error: null,
      })
      const tx = await waitForTransaction({
        hash: hash,
      })
      setPlanterGrant({
        hash: tx,
        success: null,
        error: null,
      })
    } catch (error) {
      setPlanterGrant({
        hash: null,
        success: null,
        error: error,
      })
    }
  }

  const handleJoinPlanter = async (data) => {
    const { lng, lat, contryCode, reff, OgAdd } = prepareData(data)
    let joinPlanterTx = null

    try {
      if (data.application.type !== 2) {
        joinPlanterTx = await prepareWriteContract({
          address: web3.config.contracts.Planter.address,
          abi: web3.config.contracts.Planter.abi,
          functionName: 'joinByAdmin',
          args: [data.user.walletAddress, data.application.type, lng, lat, contryCode, reff, OgAdd],
        })
      } else if (data.application.type === 2) {
        const capacity = data.application.type === 2 ? 500 : 100
        joinPlanterTx = await prepareWriteContract({
          address: web3.config.contracts.Planter.address,
          abi: web3.config.contracts.Planter.abi,
          functionName: 'joinOrganization',
          args: [data.user.walletAddress, lng, lat, contryCode, capacity, reff],
        })
      }

      const { hash } = await writeContract(joinPlanterTx)
      setJoinAdminData({
        hash: null,
        success: true,
        error: null,
      })
      const tx = await waitForTransaction({
        hash: hash,
      })
      setJoinAdminData({
        hash: tx,
        success: null,
        error: null,
      })
    } catch (error) {
      const errors = { detail: error, message: 'This Planter Exist or not planter.' }
      setJoinAdminData({
        hash: null,
        success: null,
        error: errors,
      })
    }
  }

  const handleJoinPlanterWithSafe = async (data) => {
    const { lng, lat, contryCode, reff, OgAdd } = prepareData(data)

    try {
      let joinPlanterData = null
      if (data.application.type !== 2) {
        joinPlanterData = encodeFunctionData({
          abi: web3.config.contracts.Planter.abi,
          functionName: 'joinByAdmin',
          args: [data.user.walletAddress, data.application.type, lng, lat, contryCode, reff, OgAdd],
        })
      } else if (data.application.type === 2) {
        const capacity = 500
        joinPlanterData = encodeFunctionData({
          abi: web3.config.contracts.Planter.abi,
          functionName: 'joinOrganization',
          args: [data.user.walletAddress, lng, lat, contryCode, capacity, reff],
        })
      }

      const grantRoleData = encodeFunctionData({
        abi: web3.config.contracts.AR.abi,
        functionName: 'grantRole',
        args: [
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLANTER_ROLE')),
          data.user.walletAddress,
        ],
      })

      const ethereum = window.ethereum

      const provider = new ethers.providers.Web3Provider(ethereum)

      const safeOwner = provider.getSigner(0)

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: safeOwner,
      })

      const safeApiKit = new SafeApiKit({
        txServiceUrl: web3.config.safeServiceUrl,
        ethAdapter,
      })

      const safeAddress = web3.config.safeAddress

      // Create Safe instance
      const safe = await Safe.create({
        ethAdapter,
        safeAddress: safeAddress,
      })

      const safeTransactionData = [
        {
          to: web3.config.contracts.AR.address,
          data: grantRoleData,
          value: 0,
          operation: OperationType.Call,
        },
        {
          to: web3.config.contracts.Planter.address,
          data: joinPlanterData,
          value: 0,
          operation: OperationType.Call,
        },
      ]

      const nextNonce = await safeApiKit.getNextNonce(safeAddress)

      const safeTransaction = await safe.createTransaction({
        safeTransactionData,
        options: { nonce: nextNonce },
      })

      const senderAddress = await safeOwner.getAddress()

      const safeTxHash = await safe.getTransactionHash(safeTransaction)

      const signature = await safe.signTransactionHash(safeTxHash)

      // Propose transaction to the service
      await safeApiKit.proposeTransaction({
        safeAddress: await safe.getAddress(),
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      })

      setJoinAdminDataWithSafe({
        hash: safeTxHash,
        success: true,
        error: null,
      })
    } catch (error) {
      setJoinAdminDataWithSafe({
        hash: null,
        success: null,
        error: { detail: error, message: error.message },
      })
    }
  }

  const prepareData = (data) => {
    const contryCode = findCountryCode(data.user.mobileCountry)
    const lat = Math.trunc(data.application.latitude * Math.pow(10, 6))
    const lng = Math.trunc(data.application.longitude * Math.pow(10, 6))
    const reff = data.application.Referrer
      ? data.application.Referrer
      : '0x0000000000000000000000000000000000000000'
    const OgAdd = data.application.organizationAddress
      ? data.application.organizationAddress
      : '0x0000000000000000000000000000000000000000'
    return { lng, lat, contryCode, reff, OgAdd }
  }

  const findCountryCode = (name) => {
    const selectedCountry = contryCodes.filter((item) => item.alpha2 === name)
    return selectedCountry && selectedCountry[0] ? selectedCountry[0].numeric : 0
  }

  return {
    roleGranted,
    adminRole,
    planterGrant,
    joinAdminData,
    joinAdminDataWithSafe,
    checkAdminRole,
    handleJoinPlanter,
    handleJoinPlanterWithSafe,
    checkPlanterRoleGranted,
    handleGrantPlanterRole,
  }
}

export default useContract
