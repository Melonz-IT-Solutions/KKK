export default function DepartmentBadge({ value }: { value: string }) {
  return (
    <span className='inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700'>
      {value}
    </span>
  );
}
