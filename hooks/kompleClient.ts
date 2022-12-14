import { useWallet } from "@cosmos-kit/react"
import { KompleClient } from "komplejs"
import { useEffect, useState } from "react"

export const useKompleClient = () => {
  const {
    getSigningCosmWasmClient,
    offlineSigner,
    isWalletConnected,
    address,
  } = useWallet()

  const [kompleClient, setKompleClient] = useState<KompleClient | undefined>(
    undefined
  )

  useEffect(() => {
    const getClient = async () => {
      if (isWalletConnected) {
        const signingClient = await getSigningCosmWasmClient()

        if (signingClient === undefined || offlineSigner === undefined) return

        const komple = new KompleClient(signingClient, offlineSigner)
        setKompleClient(komple)
      } else setKompleClient(undefined)
    }

    getClient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletConnected])

  return {
    kompleClient,
    address,
  }
}
