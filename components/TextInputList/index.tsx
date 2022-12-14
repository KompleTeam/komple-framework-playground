import { Button } from "components/Button"
import { TextInput } from "components/TextInput"
import Image from "next/image"
import { useState } from "react"

export const TextInputList = ({
  title,
  subtitle,
  placeholder,
  onChange,
  isRequired,
  value,
}: {
  title?: string
  subtitle?: string
  placeholder?: string
  onChange: (list: string[]) => void
  isRequired?: boolean
  value?: string[]
}) => {
  const [text, setText] = useState("")
  const [list, setList] = useState<string[]>(value || [])

  const add = () => {
    if (text === "") return
    setText("")
    let newList = [...list, text]
    setList(newList)
    onChange(newList)
  }

  const remove = (idx: number) => {
    const newList = list.filter((_, i) => i !== idx)
    setList(newList)
    onChange(newList)
  }

  return (
    <div className="">
      {title && (
        <div className="flex text-[18px] text-white mb-1">
          {title}
          {isRequired && <div className="text-komple-red-400 ml-2">*</div>}
        </div>
      )}
      {subtitle && (
        <div className="text-[16px] text-komple-black-100 mb-2">{subtitle}</div>
      )}
      <div className="flex justify-between">
        <TextInput
          placeholder={placeholder}
          onChange={(value) => setText(value)}
          value={text}
          className="w-[280px]"
        />
        <Button
          text="Add"
          onClick={add}
          className="w-[90px] mb-3 bg-komple-green text-black"
          disabled={text === ""}
        />
      </div>
      {list.map((item, idx) => {
        return (
          <div
            key={idx.toString()}
            className="flex items-center text-white mb-2"
          >
            <div className="font-bold">{idx + 1}.</div>
            <div className="w-full py-2 px-4 bg-komple-black-300 rounded-md mx-3 max-w-[325px] overflow-scroll">
              {item}
            </div>
            <button onClick={() => remove(idx)}>
              <Image
                src="/icons/remove.svg"
                alt="Remove Icon"
                height={24}
                width={24}
                style={{
                  filter:
                    "invert(50%) sepia(88%) saturate(5305%) hue-rotate(349deg) brightness(98%) contrast(94%)",
                }}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}
