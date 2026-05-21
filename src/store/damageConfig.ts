export const DAMAGE_STATUS_FLOW = [
  'reported',
  'maintenance_assigned',
  'in_repair',
  'fixed',
  'closed',
] as const;

export type DamageFlowStatus = typeof DAMAGE_STATUS_FLOW[number];

export const DAMAGE_STATUS_LABELS: Record<string, string> = {
  reported: 'REPORTED',
  maintenance_assigned: 'MAINTENANCE ASSIGNED',
  in_repair: 'IN REPAIR',
  fixed: 'FIXED',
  closed: 'CLOSED',
};

export const DAMAGE_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  reported: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-400' },
  maintenance_assigned: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-l-blue-400' },
  in_repair: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-400' },
  fixed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-l-emerald-400' },
  closed: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-l-slate-300' },
};

export const SEVERITY_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  low: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export const getNextStatus = (current: string): string | null => {
  const idx = DAMAGE_STATUS_FLOW.indexOf(current as DamageFlowStatus);
  if (idx === -1 || idx >= DAMAGE_STATUS_FLOW.length - 1) return null;
  return DAMAGE_STATUS_FLOW[idx + 1];
};

export const getStatusHistory = (report: { status: string; createdAt: string; updatedAt?: string }): { status: string; time: string; label: string }[] => {
  const history: { status: string; time: string; label: string }[] = [];
  const currentIdx = DAMAGE_STATUS_FLOW.indexOf(report.status as DamageFlowStatus);
  
  for (let i = 0; i <= currentIdx && i < DAMAGE_STATUS_FLOW.length; i++) {
    const s = DAMAGE_STATUS_FLOW[i];
    history.push({
      status: s,
      time: i === currentIdx && report.updatedAt ? report.updatedAt : report.createdAt,
      label: DAMAGE_STATUS_LABELS[s],
    });
  }
  return history;
};
