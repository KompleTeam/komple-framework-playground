import { TextInput } from "components/TextInput"
import useTokenModuleStore from "store/modules/token"

export const TokenModuleTokenLocks = () => {
  const store = useTokenModuleStore((state) => state)

  return (
    <div>
      <TextInput
        title="Token ID"
        onChange={store.setTokenId}
        isRequired
        value={store.tokenId}
      />
    </div>
  )
}
