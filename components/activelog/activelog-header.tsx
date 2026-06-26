interface Props {
  title: string
  description: string
  buttonText?: string
}

export default function ActiveLogHeader({ title, description, buttonText }: Props) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>

        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <button className="rounded-md px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-700">
        {buttonText}
      </button>
    </div>
  )
}
