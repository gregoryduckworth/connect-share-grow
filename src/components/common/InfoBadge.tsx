import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export type InfoBadgeType = 'skill' | 'tag' | 'category' | 'connection' | 'default' | string;

const infoBadgeColorMap: Record<string, string> = {
  skill: 'bg-blue-100 text-blue-800',
  tag: 'bg-purple-100 text-purple-800',
  category: 'bg-green-100 text-green-800',
  connection: 'bg-yellow-100 text-yellow-800',
  default: 'bg-gray-200 text-gray-700',
};

export interface InfoBadgeProps {
  type?: InfoBadgeType;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({
  type = 'default',
  children,
  className,
  icon,
  loading = false,
}) => {
  if (loading) {
    return <Skeleton className="h-6 w-16" />;
  }
  return (
    <Badge
      className={`${infoBadgeColorMap[type] || infoBadgeColorMap.default} ${
        className || ''
      }`.trim()}
    >
      {icon && <span className="mr-1 inline-block align-middle">{icon}</span>}
      {children}
    </Badge>
  );
};

export default InfoBadge;
