import { useState } from 'react'
import { writeContract, prepareWriteContract, waitForTransaction } from '@wagmi/core'
import { useWeb3 } from '../../redux/modules/web3/slice'
import { ethers } from 'ethers'
import contryCodes from '../contryCodes.json'
import { useGetVerifyList } from '../../redux/modules/verifyList'

const useTreeFactoryContract = () => {
  const { web3 } = useWeb3()
  const { listData } = useGetVerifyList()
  const [contractResponse, setContractResponse] = useState({
    error: null,
    success: null,
    hash: null,
  })

  const dispatchVerifyList = (action) => {
    if (listData && listData.length > 1) {
      const grouped = listData.reduce((acc, obj) => {
        const signer = obj.request.signer
        if (!acc[signer]) {
          acc[signer] = []
        }
        acc[signer].push(obj)
        return acc
      }, {})

      const input = Object.keys(grouped).map((signer) => {
        const sorted = grouped[signer].sort((a, b) => a.request.nonce - b.request.nonce)

        return [
          signer,
          sorted.map((obj) => {
            const data = prepareInputData(obj, 'verifyTreeBatch')
            return data
          }),
        ]
      })
      verifyTreeDispatch(input, 'verifyTreeBatch')
    } else if (listData.length === 1) {
      const data = prepareInputData(listData[0], 'verifyTree')
      verifyTreeDispatch(data, 'verifyTree')
    }
  }

  const verifyTreeDispatch = async (data, action) => {
    let verifyTreeTX = null
    try {
      if (action === 'verifyTreeBatch') {
        verifyTreeTX = await prepareWriteContract({
          address: web3.config.contracts.TreeFactory.address,
          abi: web3.config.contracts.TreeFactory.abi,
          functionName: 'verifyTreeBatch',
          args: [data],
        })
      } else if (action === 'verifyTree') {
        verifyTreeTX = await prepareWriteContract({
          address: web3.config.contracts.TreeFactory.address,
          abi: web3.config.contracts.TreeFactory.abi,
          functionName: 'verifyTree',
          args: data,
        })
      }

      console.log(verifyTreeTX)

      const { hash } = await writeContract(verifyTreeTX)
      setContractResponse({
        hash: null,
        success: { detail: 'Requests Submitted.', message: 'Requests submitted successfully.' },
        error: null,
      })
      const tx = await waitForTransaction({
        hash: hash,
      })
      setContractResponse({
        hash: { detail: tx, message: 'Requests updated successfully.' },
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

  const findCountryCode = (name) => {
    const selectedCountry = contryCodes.filter((item) => item.alpha2 === name)
    return selectedCountry && selectedCountry[0] ? selectedCountry[0].numeric : 0
  }

  const prepareInputData = (data, method) => {
    const signature = data.request.signature
    const nonce = data.request.nonce
    const signer = data.request.signer
    const treeSpecs = data.request.treeSpecs ?? ''
    const birthDate = data.request.birthDate ?? 0
    const countryCode = findCountryCode(data.request.countryCode)
    const { r, s, v } = ethers.utils.splitSignature(signature)
    if (method === 'verifyTree') {
      return [nonce, signer, treeSpecs, birthDate, countryCode, v, r, s]
    } else if (method === 'verifyTreeBatch') {
      return [nonce, treeSpecs, birthDate, countryCode, v, r, s]
    }
  }

  return {
    contractResponse,
    dispatchVerifyList,
  }
}

export default useTreeFactoryContract
