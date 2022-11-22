import { Dropdown } from "components/Dropdown"
import { DOC_LINKS } from "config/docs"
import { useState } from "react"
import { ContractForm } from "components/contracts/ContractLayout"
import { ContractHeader } from "components/contracts/ContractHeader"
import { KompleClient } from "komplejs"
import Head from "next/head"
import { useWallet } from "@cosmos-kit/react"
import { MintModuleCreateCollection } from "components/forms/execute/mint/createCollection"
import useMintModuleStore from "store/modules/mint"
import { MintModuleMint } from "components/forms/execute/mint/mint"
import { MintModuleUpdateCollectionMintLock } from "components/forms/execute/mint/updateCollectionMintLock"

const EXECUTES = [
  "create_collection",
  "update_public_collection_creation",
  "update_collection_mint_lock",
  "mint",
  "admin_mint",
  "permission_mint",
  "update_operators",
  "update_linked_collections",
  "update_collection_status",
  "lock_execute",
  "update_creators",
]

export default function FeeModuleExecute() {
  const { getSigningCosmWasmClient, offlineSigner } = useWallet()

  const store = useMintModuleStore((state) => state)

  const [executeMsg, setExecuteMsg] = useState<string>("")
  const [response, setResponse] = useState<any>({})

  const dropdownOnChange = (index: number) => {
    let value = EXECUTES[index]
    setExecuteMsg(value)
  }

  const submit = async ({ contract }: { contract: string }) => {
    try {
      const signingClient = await getSigningCosmWasmClient()
      if (signingClient === undefined || offlineSigner === undefined) {
        throw new Error("client or signer is not ready")
      }

      const kompleClient = new KompleClient(signingClient, offlineSigner)
      const mintModule = await kompleClient.mintModule(contract)
      const executeClient = mintModule.client

      switch (executeMsg) {
        case "create_collection": {
          const msg = {
            codeId: store.codeId,
            collectionInfo: store.collectionInfo,
            collectionConfig: {
              per_address_limit:
                store.collectionConfig.per_address_limit === 0
                  ? undefined
                  : store.collectionConfig.per_address_limit,
              start_time:
                store.collectionConfig.start_time === ""
                  ? undefined
                  : store.collectionConfig.start_time,
              max_token_limit:
                store.collectionConfig.max_token_limit === 0
                  ? undefined
                  : store.collectionConfig.max_token_limit,
              ipfs_link:
                store.collectionConfig.ipfs_link === ""
                  ? undefined
                  : store.collectionConfig.ipfs_link,
            },
            tokenInfo: store.tokenInfo,
            metadataInfo: store.metadataInfo,
            fundInfo: {
              ...store.fundInfo,
              cw20_address:
                store.fundInfo.cw20_address === ""
                  ? undefined
                  : store.fundInfo.cw20_address,
            },
            linkedCollections: store.collectionsIds,
          }

          return setResponse(await executeClient.createCollection(msg))
        }
        case "update_collection_mint_lock": {
          const msg = {
            collectionId: store.collectionId,
            lock: store.lock,
          }

          return setResponse(await executeClient.updateCollectionMintLock(msg))
        }
        case "mint": {
          const msg = {
            collectionId: store.collectionId,
            metadataId: store.metadataId === 0 ? undefined : store.metadataId,
          }

          return setResponse(await executeClient.mint(msg))
        }
      }
    } catch (error: any) {
      console.log(error)
      setResponse(error.message)
    }
  }

  return (
    <div className="h-full w-full">
      <Head>
        <title>Execute Mint Module</title>
        <meta property="og:title" content="Execute Mint Module" key="title" />
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
        action="execute"
        submit={submit}
      >
        <Dropdown
          items={EXECUTES}
          title="Select Execute Messages"
          onChange={dropdownOnChange}
          placeholder="Select execute message"
        />

        {executeMsg === "create_collection" && <MintModuleCreateCollection />}
        {executeMsg === "update_collection_mint_lock" && (
          <MintModuleUpdateCollectionMintLock />
        )}
        {executeMsg === "mint" && <MintModuleMint />}
      </ContractForm>
    </div>
  )
}
