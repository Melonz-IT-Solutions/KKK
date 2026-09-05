'use client'

import ClustersTable from './components/clusters-table'
import { useClustersAdmin } from './hooks/use-clusters-admin'

export default function ClustersModule() {
  const { clusters, loading, addCluster, updateCluster } = useClustersAdmin()

  return (
    <div className="mx-auto w-full p-4">
      <ClustersTable
        data={clusters}
        loading={loading}
        onAdd={addCluster}
        onUpdate={updateCluster}
      />
    </div>
  )
}
