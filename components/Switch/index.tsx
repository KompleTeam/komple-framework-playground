import clsx from "clsx"
import { useState } from "react"

export const Switch = ({
  title,
  subtitle,
  initialState,
  isRequired,
  onChange,
}: {
  title?: string
  subtitle?: string
  initialState: boolean
  isRequired?: boolean
  onChange: (value: boolean) => void
}) => {
  const [state, setState] = useState(initialState)

  const switchOnChange = () => {
    setState(!state)
    onChange(!state)
  }

  return (
    <div className="mb-6">
      {title && (
        <div className="flex text-[18px] text-white mb-1 items-center justify-between">
          <div className="flex">
            {title}
            {isRequired && <div className="text-komple-red-400 ml-2">*</div>}
          </div>
          <button
            className={clsx(
              "h-[24px] w-[48px] rounded-3xl p-[2px] flex",
              state ? "bg-komple-red-400" : "bg-komple-black-200",
              state ? "justify-end" : "justify-start"
            )}
            onClick={switchOnChange}
          >
            <div
              className={clsx(
                "h-[20px] w-[20px] rounded-full",
                state ? "bg-white" : "bg-komple-black-100"
              )}
            />
          </button>
        </div>
      )}
      {subtitle && (
        <div className="text-[16px] text-komple-black-100 mb-2">{subtitle}</div>
      )}
    </div>
  )
}
