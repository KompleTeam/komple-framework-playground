import { useState } from "react"
import { ContractForm } from "components/contracts/ContractLayout"
import { ContractHeader } from "components/contracts/ContractHeader"
import { Dropdown } from "components/Dropdown"
import { useWallet } from "@cosmos-kit/react"
import { DOC_LINKS } from "config/docs"
import { KompleClient } from "komplejs"
import Head from "next/head"
import {
  TokenModuleMintedTokensPerAddress,
  TokenModuleTokenLocks,
} from "components/forms/query"
import { useAppStore, useTokenModuleStore } from "store"

const QUERIES = [
  "get_contract_config",
  "get_owner_of_NFT",
  "list_contract_locks",
  "list_NFT_locks",
  "get_total_minted_tokens_per_address",
  "list_sub_modules",
  "list_contract_operators",
]

export default function FeeModuleQuery() {
  const { getSigningCosmWasmClient, offlineSigner } = useWallet()

  const store = useTokenModuleStore((state) => state)
  const setLoading = useAppStore((state) => state.setLoading)

  const [queryMsg, setQueryMsg] = useState<string>("")
  const [response, setResponse] = useState<any>({})

  const dropdownOnChange = (index: number) => {
    let value = QUERIES[index]
    setQueryMsg(value)
  }

  const submit = async ({ contract }: { contract: string }) => {
    try {
      setLoading(true)

      const signingClient = await getSigningCosmWasmClient()
      if (signingClient === undefined || offlineSigner === undefined) {
        throw new Error("client or signer is not ready")
      }

      const kompleClient = new KompleClient(signingClient, offlineSigner)
      const tokenModule = await kompleClient.tokenModule(contract)
      const client = tokenModule.queryClient.client

      switch (queryMsg) {
        case "get_contract_config":
          setResponse(
            await client.queryContractSmart(contract, {
              extension: {
                msg: {
                  config: {},
                },
              },
            })
          )
          break
        case "list_contract_locks":
          setResponse(
            await client.queryContractSmart(contract, {
              extension: {
                msg: {
                  locks: {},
                },
              },
            })
          )
          break
        case "list_NFT_locks": {
          const msg = {
            token_id: store.tokenId,
          }

          setResponse(
            await client.queryContractSmart(contract, {
              extension: {
                msg: {
                  token_locks: msg,
                },
              },
            })
          )
          break
        }
        case "get_total_minted_tokens_per_address": {
          const msg = {
            address: store.recipient,
          }

          setResponse(
            await client.queryContractSmart(contract, {
              extension: {
                msg: {
                  minted_tokens_per_address: msg,
                },
              },
            })
          )
          break
        }
        case "list_sub_modules":
          setResponse(
            await client.queryContractSmart(contract, {
              extension: {
                msg: {
                  sub_modules: {},
                },
              },
            })
          )
          break
        case "list_contract_operators":
          setResponse(
            await client.queryContractSmart(contract, {
              extension: {
                msg: {
                  module_operators: {},
                },
              },
            })
          )
          break
      }

      setLoading(false)
    } catch (error: any) {
      setResponse(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full">
      <Head>
        <title>Token Module | Komple Framework Playground</title>
        <meta
          property="og:title"
          content="Token Module | Komple Framework Playground"
          key="title"
        />
      </Head>

      <ContractHeader
        title="Token Module"
        description="Token Module is used collection configuration and token management."
        documentation={DOC_LINKS.modules.token}
      />
      <ContractForm
        name="Token"
        isModule={true}
        response={response}
        action="query"
        submit={submit}
        hidden={["create"]}
      >
        <Dropdown
          items={QUERIES}
          title="Select Query Messages"
          onChange={dropdownOnChange}
          placeholder="Select query message"
        />

        {queryMsg === "list_NFT_locks" && <TokenModuleTokenLocks />}
        {queryMsg === "get_total_minted_tokens_per_address" && (
          <TokenModuleMintedTokensPerAddress />
        )}
      </ContractForm>
    </div>
  )
}
