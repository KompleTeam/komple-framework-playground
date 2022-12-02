import { useState } from "react"
import { ContractForm } from "components/contracts/ContractLayout"
import { ContractHeader } from "components/contracts/ContractHeader"
import { Dropdown } from "components/Dropdown"
import { useWallet } from "@cosmos-kit/react"
import { DOC_LINKS } from "config/docs"

import { KompleClient } from "komplejs"
import Head from "next/head"
import { useMarketplaceModuleStore, useAppStore } from "store"
import {
  MarketplaceModuleFixedListing,
  MarketplaceModuleFixedListings,
} from "components/forms/query"

const QUERIES = [
  "contract_config",
  "fixed_NFT_listing",
  "fixed_NFT_listings",
  "contract_operators",
]

export default function FeeModuleQuery() {
  const { getSigningCosmWasmClient, offlineSigner } = useWallet()

  const store = useMarketplaceModuleStore((state) => state)
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
      const marketplaceModule = await kompleClient.marketplaceModule(contract)
      const queryClient = marketplaceModule.queryClient

      switch (queryMsg) {
        case "contract_config":
          setResponse(await queryClient.config())
          break
        case "fixed_NFT_listing": {
          const msg = {
            collectionId: store.collectionId,
            tokenId: store.tokenId,
          }

          setResponse(await queryClient.fixedListing(msg))
          break
        }
        case "fixed_NFT_listings": {
          const msg = {
            collectionId: store.collectionId,
            startAfter: store.startAfter === 0 ? undefined : store.startAfter,
            limit: store.limit === 0 ? undefined : store.limit,
          }

          setResponse(await queryClient.fixedListings(msg))
          break
        }
        case "contract_operators":
          setResponse(await queryClient.operators())
          break
      }

      setLoading(false)
    } catch (error: any) {
      setResponse(error.message)
      setLoading(true)
    }
  }

  return (
    <div className="h-full w-full">
      <Head>
        <title>Marketplace Module | Komple Framework Playground</title>
        <meta
          property="og:title"
          content="Marketplace Module | Komple Framework Playground"
          key="title"
        />
      </Head>

      <ContractHeader
        title="Marketplace Module"
        description="Marketplace Module is used for the second hand sale of tokens."
        documentation={DOC_LINKS.modules.marketplace}
      />
      <ContractForm
        name="Marketplace"
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

        {queryMsg === "fixed_NFT_listing" && <MarketplaceModuleFixedListing />}
        {queryMsg === "fixed_NFT_listings" && (
          <MarketplaceModuleFixedListings />
        )}
      </ContractForm>
    </div>
  )
}
