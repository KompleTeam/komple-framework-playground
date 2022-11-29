import { TextInputList } from "components/TextInputList"
import { useHubModuleStore } from "store"

export const HubModuleUpdateOperators = () => {
  const store = useHubModuleStore((state) => state)

  return (
    <div>
      <TextInputList
        title="Operators"
        onChange={(value) => store.setAddresses(value)}
        value={store.addresses}
      />
    </div>
  )
}
