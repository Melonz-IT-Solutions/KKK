import ActivityLogsPage from '@/modules/activity-log/components/activitylog-v2-view-page';
import { currentUser, isBranchManager } from '@/lib/data/current-user';

const page = () => {
  if (isBranchManager(currentUser)) {
    return (
      <div className='p-6'>
        <h1 className='text-xl font-semibold'>Activity Logs</h1>
        <p className='mt-2 text-sm text-slate-500'>
          Branch managers do not have access to activity logs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ActivityLogsPage />
    </div>
  );
};
export default page;
