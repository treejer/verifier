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
  const [contractResponse, setContractResponse] = useState({
    error: null,
    success: null,
    hash: null,
  })

  const checkPlanterRoleGranted = async (Address) => {
    try {
      if (!roleGranted) {
        const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLANTER_ROLE'))
        const hasRole = await readContract({
          address: web3.config.contracts.AR.address,
          abi: web3.config.contracts.AR.abi,
          functionName: 'hasRole',
          args: [roleHash, Address],
        })
        setRoleGranted(hasRole)
      } else {
        return
      }
    } catch (error) {
      console.error('Transaction error:', error)
    }
  }

  // Check Admin Role //
  const checkAdminRole = async (Address) => {
    try {
      if (!adminRole) {
        const hasRole = await readContract({
          address: web3.config.contracts.AR.address,
          abi: web3.config.contracts.AR.abi,
          functionName: 'hasRole',
          args: [emptyHash(64), Address],
        })
        setAdminRole(hasRole)
      } else {
        return
      }
    } catch (error) {
      console.log('err', error)
    }
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
      setContractResponse({
        hash: null,
        success: { detail: 'Planter Submitted.', message: 'Planter Role granted successfully.' },
        error: null,
      })
      const tx = await waitForTransaction({
        hash: hash,
      })
      setContractResponse({
        hash: { detail: tx, message: 'Planter Role granted successfully.' },
        success: null,
        error: null,
      })
    } catch (error) {
      setContractResponse({
        hash: null,
        success: null,
        error: { detail: error, message: error.details },
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
      setContractResponse({
        hash: null,
        success: { detail: 'Planter Joined.', message: 'Planter join submitted successfully.' },
        error: null,
      })
      const tx = await waitForTransaction({
        hash: hash,
      })
      setContractResponse({
        hash: { detail: tx, message: 'Planter joined successfully.' },
        success: null,
        error: null,
      })
    } catch (error) {
      setContractResponse({
        hash: null,
        success: null,
        error: { detail: error, message: 'This Planter Exist or not planter.' },
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
      setContractResponse({
        hash: { detail: safeTxHash, message: 'Transaction submitted successfully.' },
        success: null,
        error: null,
      })
    } catch (error) {
      setContractResponse({
        hash: null,
        success: null,
        error: { detail: error, message: error.message },
      })
    }
  }

  // Create Zero Hash //
  const emptyHash = (zeroCount) => {
    return `0x${new Array(zeroCount).fill('0').join('')}`
  }

  // Grant high Level Role //
  const handleGrantHighLevel = async (role, address) => {
    let roleHash = null
    if (role === 'verifier') {
      roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('VERIFIER_ROLE'))
    } else if (role === 'admin') {
      roleHash = emptyHash(64)
    } else if (role === 'datamanager') {
      roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('DATA_MANAGER_ROLE'))
    }

    try {
      const config = await prepareWriteContract({
        address: web3.config.contracts.AR.address,
        abi: web3.config.contracts.AR.abi,
        functionName: 'grantRole',
        args: [roleHash, address],
      })
      const { hash } = await writeContract(config)
      setContractResponse({
        hash: null,
        success: { detail: 'Planter Submitted.', message: 'Role submitted successfully.' },
        error: null,
      })
      const tx = await waitForTransaction({
        hash: hash,
      })
      setContractResponse({
        hash: { detail: tx, message: 'Transaction submitted successfully.' },
        success: null,
        error: null,
      })
    } catch (error) {
      setContractResponse({
        hash: null,
        success: null,
        error: { detail: error, message: error.details },
      })
    }
  }

  const prepareData = (data) => {
    const contryCode = findCountryCode(data.user.mobileCountry)
    const lat = Math.trunc(data.application.latitude * Math.pow(10, 6))
    const lng = Math.trunc(data.application.longitude * Math.pow(10, 6))
    const reff = data.application.Referrer
      ? data.application.Referrer
      : process.env.REACT_APP_ZERO_ADDRESS
    const OgAdd = data.application.organizationAddress
      ? data.application.organizationAddress
      : process.env.REACT_APP_ZERO_ADDRESS
    return { lng, lat, contryCode, reff, OgAdd }
  }

  const findCountryCode = (name) => {
    const selectedCountry = contryCodes.filter((item) => item.alpha2 === name)
    return selectedCountry && selectedCountry[0] ? selectedCountry[0].numeric : 0
  }

  return {
    roleGranted,
    adminRole,
    contractResponse,
    checkAdminRole,
    handleJoinPlanter,
    handleGrantHighLevel,
    handleJoinPlanterWithSafe,
    checkPlanterRoleGranted,
    handleGrantPlanterRole,
  }
}

export default useContract
