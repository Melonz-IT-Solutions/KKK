import { activeManagers } from '@/lib/data/dashboardv2';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ActiveManagersCard() {
  const Icon = activeManagers.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        <h3>{activeManagers.label}</h3>
        <Icon className="size-4" />
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">{activeManagers.value}</div>

        <div className="mt-4 flex -space-x-2">
          {activeManagers.avatars.map((avatar) => (
            <Avatar key={avatar}>
              <AvatarImage src={avatar} />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
