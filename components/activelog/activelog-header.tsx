interface Props {
  title: string;
  description: string;
  buttonText?: string;
}

export default function ActiveLogHeader({
  title,
  description,
  buttonText,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div>
        <h2 className="font-semibold text-base">{title}</h2>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <button className="px-4 py-2 text-sm font-medium text-emerald-600 rounded-md hover:bg-emerald-700 transition-colors">
        {buttonText}
      </button>
    </div>
  );
}
