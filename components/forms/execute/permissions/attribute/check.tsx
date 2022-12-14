import { JsonTextArea } from "components/JsonTextArea"
import { useAttributePermissionStore } from "store"

export const AttributePermissionCheck = () => {
  const store = useAttributePermissionStore((state) => state)

  const parseMsg = (value: string) => {
    try {
      store.setData(JSON.parse(value))
    } catch (error: any) {
      store.setData(undefined)
    }
  }

  return (
    <div>
      <JsonTextArea
        title="Permission Check Message"
        subtitle="List of permission check messages"
        onChange={parseMsg}
      />
    </div>
  )
}
