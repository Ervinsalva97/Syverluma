import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  accentColor?: 'emerald' | 'blue' | 'slate';
}

export default function MetricCard({ label, value, subtext, accentColor = 'emerald' }: MetricCardProps) {
  const accentClasses = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    slate: 'text-slate-400',
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 hover:border-slate-700 transition-all">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      <p className="text-3xl font-extrabold text-white tracking-tight">
        {value}
      </p>
      <span className={`inline-block text-xs font-medium ${accentClasses[accentColor]}`}>
        {subtext}
      </span>
    </div>
  );
}