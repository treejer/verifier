import _ from 'lodash'
import { useState } from 'react'
import { writeContract, prepareWriteContract, readContract, waitForTransaction } from '@wagmi/core'
import { ethers } from 'ethers'
import { useWeb3 } from '../../redux/modules/web3/slice'
import contryCodes from '../contryCodes.json'

const useContract = () => {
  const { web3 } = useWeb3()
  const [adminRole, setAdminRole] = useState(false)
  const [roleGranted, setRoleGranted] = useState(false)
  const [planterGrant, setPlanterGrant] = useState({ error: null, success: null, hash: null })
  const [joinAdminData, setJoinAdminData] = useState({ error: null, success: null, hash: null })

  const checkPlanterRoleGranted = async (Address) => {
    try {
      const text = ethers.toUtf8Bytes('PLANTER_ROLE')
      const roleHash = ethers.keccak256(text)
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
    } catch (error) {
      console.log('error', error)
    }
  }

  // handle grant planter role //
  const handleGrantPlanterRole = async (Address) => {
    const text = ethers.toUtf8Bytes('PLANTER_ROLE')
    const roleHash = ethers.keccak256(text)
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
      console.log('err', error)
      setPlanterGrant({
        hash: null,
        success: null,
        error: error,
      })
    }
  }

  // handle grant planter role //
  const handleJoinPlanter = async (data) => {
    const mob = findCountryCode(data.user.mobileCountry)
    const lat = Math.trunc(data.application.latitude * Math.pow(10, 6))
    const lng = Math.trunc(data.application.longitude * Math.pow(10, 6))
    const reff = data.application.Referrer
      ? data.application.Referrer
      : '0x0000000000000000000000000000000000000000'
    const OgAdd = data.application.organizationAddress
      ? data.application.organizationAddress
      : '0x0000000000000000000000000000000000000000'
    let config = null
    try {
      if (data.application.type !== 2) {
        config = await prepareWriteContract({
          address: web3.config.contracts.Planter.address,
          abi: web3.config.contracts.Planter.abi,
          functionName: 'joinByAdmin',
          args: [data.user.walletAddress, data.application.type, lng, lat, mob, reff, OgAdd],
        })
      } else if (data.application.type === 2) {
        const capacity = data.application.type === 2 ? 500 : 100
        config = await prepareWriteContract({
          address: web3.config.contracts.Planter.address,
          abi: web3.config.contracts.Planter.abi,
          functionName: 'joinOrganization',
          args: [data.user.walletAddress, lng, lat, data.user.mobileContry, capacity, reff],
        })
      }

      const { hash } = await writeContract(config)
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
      console.log('erro', error)
      const errors = { detail: error, message: 'This Planter Exist or not planter.' }
      setJoinAdminData({
        hash: null,
        success: null,
        error: errors,
      })
    }
  }

  const findCountryCode = (name) => {
    const selectedContry = contryCodes.filter((item) => item.alpha2 === name)
    return selectedContry ? selectedContry[0].numeric : 0
  }

  return {
    roleGranted,
    adminRole,
    planterGrant,
    joinAdminData,
    checkAdminRole,
    handleJoinPlanter,
    checkPlanterRoleGranted,
    handleGrantPlanterRole,
  }
}

export default useContract
