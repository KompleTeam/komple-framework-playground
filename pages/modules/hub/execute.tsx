import { Dropdown } from "components/Dropdown"
import { DOC_LINKS } from "config/docs"
import { useState } from "react"
import { ContractForm } from "components/contracts/ContractLayout"
import { ContractHeader } from "components/contracts/ContractHeader"
import { KompleClient } from "komplejs"
import { toBinary } from "@cosmjs/cosmwasm-stargate"
import Head from "next/head"
import { useWallet } from "@cosmos-kit/react"
import useHubModuleStore from "store/modules/hub"
import {
  HubModuleDeregisterModule,
  HubModuleMigrateContracts,
  HubModuleRegisterModule,
  HubModuleUpdateHubInfo,
  HubModuleUpdateOperators,
} from "components/forms/execute/modules"

const EXECUTES = [
  "register_module",
  "deregister_module",
  "update_hub_info",
  "update_operators",
  "migrate_contracts",
]

export default function HubModuleExecute() {
  const { getSigningCosmWasmClient, offlineSigner } = useWallet()

  const store = useHubModuleStore((state) => state)

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
      const hubModule = await kompleClient.hubModule(contract)
      const executeClient = hubModule.client

      switch (executeMsg) {
        case "register_module": {
          const msg = {
            codeId: Number(store.codeId),
            module: store.module,
            msg: store.msg !== undefined ? toBinary(store.msg) : undefined,
          }

          return setResponse(await executeClient.registerModule(msg))
        }
        case "deregister_module": {
          const msg = {
            module: store.module,
          }

          return setResponse(await executeClient.deregisterModule(msg))
        }
        case "update_hub_info": {
          const msg = {
            name: store.hubInfo.name,
            description: store.hubInfo.description,
            image: store.hubInfo.image,
            external_link:
              store.hubInfo.external_link === ""
                ? undefined
                : store.hubInfo.external_link,
          }

          return setResponse(await executeClient.updateHubInfo(msg))
        }
        case "update_operators": {
          const msg = {
            addrs: store.addresses,
          }

          return setResponse(await executeClient.updateOperators(msg))
        }
        case "migrate_contracts": {
          if (store.msg === undefined) {
            throw new Error("msg is undefined")
          }

          const msg = {
            codeId: Number(store.codeId),
            contractAddress: store.contractAddress,
            msg: toBinary(store.msg),
          }

          return setResponse(await executeClient.migrateContracts(msg))
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
        <title>Execute Hub Module</title>
        <meta property="og:title" content="Execute Hub Module" key="title" />
      </Head>

      <ContractHeader
        title="Hub Module"
        description="Hub module is the centre piece of the Komple Framework."
        documentation={DOC_LINKS.modules.hub}
      />
      <ContractForm
        name="Hub"
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

        {executeMsg === "register_module" && <HubModuleRegisterModule />}
        {executeMsg === "deregister_module" && <HubModuleDeregisterModule />}
        {executeMsg === "update_hub_info" && <HubModuleUpdateHubInfo />}
        {executeMsg === "migrate_contracts" && <HubModuleMigrateContracts />}
        {executeMsg === "update_operators" && <HubModuleUpdateOperators />}
      </ContractForm>
    </div>
  )
}
