'use client'

import BranchesTable from './components/branches-table'
import { useClustersAdmin } from './hooks/use-clusters-admin'
import { useBranches } from './hooks/use-branches'

export default function BranchesModule() {
  const { clusters, loading: clustersLoading } = useClustersAdmin()
  const { branches, loading: branchesLoading, addBranch, updateBranch } = useBranches()

  return (
    <div className="mx-auto w-full p-4">
      <BranchesTable
        data={branches}
        loading={branchesLoading || clustersLoading}
        clusters={clusters}
        onAdd={addBranch}
        onUpdate={updateBranch}
      />
    </div>
  )
}
