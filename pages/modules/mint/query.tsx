import { useEffect, useState } from "react"
import { ContractForm } from "components/contracts/ContractLayout"
import { ContractHeader } from "components/contracts/ContractHeader"
import { Dropdown } from "components/Dropdown"
import { DOC_LINKS } from "config/docs"
import {
  MintModuleCollectionAddress,
  MintModuleCollectionInfo,
  MintModuleCollections,
  MintModuleLinkedCollections,
  MintModuleMintLock,
} from "components/forms/query"
import Head from "next/head"
import { useAppStore, useMintModuleStore } from "store"
import { showToast } from "utils/showToast"
import { useKompleClient } from "hooks/kompleClient"

const QUERIES = [
  "get_contract_config",
  "list_collections",
  "get_collection_address",
  "get_collection_info",
  "get_collection_mint_lock",
  "list_linked_collections",
  "list_collection_creators",
  "list_contract_operators",
]

export default function MintModuleQuery() {
  const { kompleClient } = useKompleClient()

  const store = useMintModuleStore((state) => state)
  const setLoading = useAppStore((state) => state.setLoading)
  const setResponseInfoBoxList = useAppStore(
    (state) => state.setResponseInfoBoxList
  )
  const setShowResponse = useAppStore((state) => state.setShowResponse)

  const [queryMsg, setQueryMsg] = useState<string>("")
  const [response, setResponse] = useState<any>({})

  useEffect(() => {
    store.clear()
    setResponseInfoBoxList([])
    setShowResponse(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dropdownOnChange = (index: number) => {
    let value = QUERIES[index]
    setQueryMsg(value)
  }

  const submit = async ({ contract }: { contract: string }) => {
    try {
      setLoading(true)

      if (!kompleClient) {
        throw new Error("Komple client is not initialized")
      }

      const mintModule = await kompleClient.mintModule(contract)
      const queryClient = mintModule.queryClient

      switch (queryMsg) {
        case "get_contract_config":
          setResponse(await queryClient.config())
          break
        case "list_collections":
          const msg = {
            blacklist: store.isBlacklist,
            startAfter: store.startAfter,
            limit: store.limit,
          }

          setResponse(await queryClient.collections(msg))
          break
        case "get_collection_address": {
          const msg = {
            collectionId: store.collectionId,
          }

          setResponse(await queryClient.collectionAddress(msg))
          break
        }
        case "get_collection_info": {
          const msg = {
            collectionId: store.collectionId,
          }

          setResponse(await queryClient.collectionInfo(msg))
          break
        }
        case "list_contract_operators":
          setResponse(await queryClient.operators())
          break
        case "linked_collections": {
          const msg = {
            collectionId: store.collectionId,
          }

          setResponse(await queryClient.linkedCollections(msg))
          break
        }
        case "list_linked_collections": {
          const msg = {
            blacklist: store.isBlacklist,
            startAfter: store.startAfter,
            limit: store.limit,
          }

          setResponse(await queryClient.collections(msg))
          break
        }
        case "list_collection_creators":
          setResponse(await queryClient.creators())
          break
        case "get_collection_mint_lock": {
          const msg = {
            collectionId: store.collectionId,
          }

          setResponse(await queryClient.mintLock(msg))
          break
        }
      }

      setLoading(false)
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Query Mint Module",
        message: error.message,
      })
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full">
      <Head>
        <title>Mint Module | Komple Playground</title>
        <meta
          property="og:title"
          content="Mint Module | Komple Playground"
          key="title"
        />
      </Head>

      <ContractHeader
        title="Mint Module"
        description="Mint Module is used for collection management and token minting."
        documentation={DOC_LINKS.modules.mint}
      />
      <ContractForm
        name="Mint"
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

        {queryMsg === "get_collection_address" && (
          <MintModuleCollectionAddress />
        )}
        {queryMsg === "get_collection_info" && <MintModuleCollectionInfo />}
        {queryMsg === "list_linked_collections" && (
          <MintModuleLinkedCollections />
        )}
        {queryMsg === "list_collections" && <MintModuleCollections />}
        {queryMsg === "get_collection_mint_lock" && <MintModuleMintLock />}
      </ContractForm>
    </div>
  )
}
