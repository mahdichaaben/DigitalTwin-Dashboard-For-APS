interface Props {
  title?: string
  locked: boolean
  children: React.ReactNode
}

export default function Card({ title, locked, children }: Props) {
  return (
    <div className="h-full w-full flex flex-col">
      {title && (
        <div className="bg-gray-50 px-3 py-1 flex justify-between items-center">
          <h2 className="font-semibold text-xs">{title}</h2>
        </div>
      )}
      <div className="flex-1 overflow-hidden p-0">{children}</div>
    </div>
  )
}
