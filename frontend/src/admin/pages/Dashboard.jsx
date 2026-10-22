import {
  AlertCircle,
  Clock,
  Download,
  IndianRupee,
  RefreshCw,
  Smartphone,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { DataTable, Pill, Dot } from '../components/DataTable';
import { Button } from '../components/Controls';

const WEEK = [
  { day: 'Mon', value: 1240 },
  { day: 'Tue', value: 2180 },
  { day: 'Wed', value: 1650 },
  { day: 'Thu', value: 3420 },
  { day: 'Fri', value: 4860 },
  { day: 'Sat', value: 6240 },
  { day: 'Sun', value: 5310 },
];

const DONATIONS = [
  ['#4821', '₹500', 'UPI', '10:42', 'Success'],
  ['#4820', '₹200', 'UPI', '10:31', 'Success'],
  ['#4819', '₹1,000', 'UPI', '10:18', 'Success'],
  ['#4818', '₹100', 'Cash', '09:57', 'Success'],
  ['#4817', '₹2,000', 'UPI', '09:44', 'Pending'],
  ['#4816', '₹50', 'UPI', '09:12', 'Success'],
  ['#4815', '₹500', 'UPI', '08:50', 'Success'],
];

const PEAK = Math.max(...WEEK.map((d) => d.value));

const KIOSK = [
  { label: 'Device', value: 'Hundi Kiosk 01', icon: Smartphone },
  { label: 'Last heartbeat', value: '12 seconds ago', icon: Clock },
  { label: 'Connection', value: 'Online · 4G', icon: Wifi },
  { label: 'App version', value: '1.0.0', icon: RefreshCw },
];

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of today's offerings and the health of your temple kiosk."
        actions={
          <>
            <Button variant="ghost" icon={RefreshCw}>
              Refresh
            </Button>
            <Button variant="primary" icon={Download}>
              Export
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <StatCard label="Today" value="₹4,860" sub="112 offerings" trend="+18%" icon={IndianRupee} />
        <StatCard label="This month" value="₹96,420" sub="2,418 offerings" trend="+12%" icon={TrendingUp} tone="emerald" />
        <StatCard label="Donors" value="1,284" sub="unique this month" trend="+6%" icon={Users} tone="emerald" />
        <StatCard label="Average" value="₹401" sub="per offering" icon={Clock} tone="stone" />
      </div>

      {/* Chart + kiosk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 sm:mb-5">
        <SectionCard
          className="lg:col-span-2"
          title="Offerings this week"
          description="Total value received per day, all payment methods."
          icon={TrendingUp}
        >
          <div className="flex items-end gap-2 sm:gap-3 h-40 sm:h-48 pt-2">
            {WEEK.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[9.5px] text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  ₹{d.value.toLocaleString('en-IN')}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      i === 5
                        ? 'bg-gradient-to-t from-amber-600 to-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.35)]'
                        : 'bg-gradient-to-t from-amber-900/60 to-amber-600/40 group-hover:from-amber-800/70 group-hover:to-amber-500/50'
                    }`}
                    style={{ height: `${(d.value / PEAK) * 100}%` }}
                  />
                </div>
                <span className="text-[9.5px] text-stone-500 uppercase tracking-wider">{d.day}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Kiosk status" description="Your live donation device." icon={Smartphone}>
          <div className="space-y-3">
            {KIOSK.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9.5px] uppercase tracking-[0.16em] text-stone-600">{label}</p>
                  <p className="text-[12px] text-stone-200 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-amber-400/10 flex items-center gap-2">
            <Pill tone="emerald">
              <Dot tone="emerald" />
              Accepting donations
            </Pill>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 px-3 py-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-px" />
            <p className="text-[10px] text-amber-200/60 leading-relaxed">
              One pending settlement from 09:44. It usually clears within a few minutes.
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Recent donations */}
      <SectionCard
        title="Recent donations"
        description="Last 7 offerings across all kiosks."
        icon={IndianRupee}
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] text-stone-600">Showing 7 of 2,418 this month</p>
            <button className="text-[11px] text-amber-300 hover:text-amber-200 transition-colors cursor-pointer">
              View all →
            </button>
          </div>
        }
      >
        <DataTable
          head={['Ref', 'Amount', 'Method', 'Time', 'Status']}
          rows={DONATIONS.map(([ref, amt, method, time, status]) => [
            ref,
            amt,
            method,
            time,
            <Pill key={ref} tone={status === 'Success' ? 'emerald' : 'amber'}>
              <Dot tone={status === 'Success' ? 'emerald' : 'amber'} />
              {status}
            </Pill>,
          ])}
        />
      </SectionCard>
    </div>
  );
}
