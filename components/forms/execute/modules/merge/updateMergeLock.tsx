import { Switch } from "components/Switch"
import { useMergeModuleStore } from "store"

export const MergeModuleUpdateMergeLock = () => {
  const store = useMergeModuleStore((state) => state)

  return (
    <div>
      <Switch
        title="Lock Merge Operation"
        initialState={store.lock}
        onChange={store.setLock}
      />
    </div>
  )
}