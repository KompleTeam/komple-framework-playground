import Link from "next/link"

export const SectionBox = ({
  title,
  description,
  link,
}: {
  title: string
  description: string
  link: string
}) => {
  return (
    <Link href={link}>
      <div className="h-[120px] w-[270px] p-4 border-[1px] border-komple-black-300 rounded-lg mx-4 hover:border-white hover:bg-white/5">
        <div className="text-[24px] font-semibold">{title}</div>
        <div className="text-komple-black-100">{description}</div>
      </div>
    </Link>
  )
}
