import { Input } from '@/components/ui/input';

interface InfoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function InfoField({ label, value, onChange }: InfoFieldProps) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">
        {label}
      </p>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2"
      />
    </div>
  );
}
