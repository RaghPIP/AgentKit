import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  number: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badgeColor?: 'rose' | 'amber' | 'cyan' | 'purple' | 'emerald';
  children: React.ReactNode;
}

const COLOR_MAP = {
  rose: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    glow: 'group-hover:border-rose-500/30',
  },
  amber: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    glow: 'group-hover:border-amber-500/30',
  },
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    glow: 'group-hover:border-cyan-500/30',
  },
  purple: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    glow: 'group-hover:border-purple-500/30',
  },
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    glow: 'group-hover:border-emerald-500/30',
  },
};

export function SectionCard({
  number,
  title,
  subtitle,
  icon: Icon,
  badgeColor = 'emerald',
  children,
}: SectionCardProps) {
  const styles = COLOR_MAP[badgeColor];

  return (
    <div
      className={`group relative rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl ${styles.glow}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${styles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500">#{number}</span>
              <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${styles.badge}`}
        >
          Section {number}
        </span>
      </div>

      {/* Content */}
      <div className="text-neutral-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
