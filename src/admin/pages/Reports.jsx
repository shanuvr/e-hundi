import { BarChart3, Calendar, Download, FileText, IndianRupee, Search, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { DataTable, Pill, Dot } from '../components/DataTable';
import { Button } from '../components/Controls';

const ROWS = [
  ['#4821', 'Ramesh Pillai', '₹500', '02 Oct, 10:42', 'Success'],
  ['#4820', 'Anjali Nair', '₹200', '02 Oct, 10:31', 'Success'],
  ['#4819', 'Suresh Menon', '₹1,000', '02 Oct, 10:18', 'Success'],
  ['#4818', 'Lakshmi Iyer', '₹100', '02 Oct, 09:57', 'Success'],
  ['#4817', 'Vinod Kumar', '₹2,000', '02 Oct, 09:44', 'Pending'],
  ['#4816', 'Krishna Das', '₹50', '02 Oct, 09:12', 'Success'],
  ['#4815', 'Meera Krishnan', '₹500', '02 Oct, 08:50', 'Success'],
  ['#4814', 'Ravi Shankar', '₹250', '02 Oct, 08:22', 'Refunded'],
];

const DENOM = [
  { label: '₹10', pct: 82 },
  { label: '₹20', pct: 61 },
  { label: '₹50', pct: 74 },
  { label: '₹100', pct: 55 },
  { label: '₹200', pct: 38 },
  { label: '₹500', pct: 22 },
];

export default function Reports() {
  return (
    <div className="space-y-3">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time transaction stream, analytics, and kiosk collection summaries."
        actions={
          <Button variant="primary" icon={Download}>
            Export CSV
          </Button>
        }
      />

      {/* Ultra-Compact Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard label="Total offerings" value="₹96,420" sub="Sep 01 – Oct 02" trend="+12%" icon={IndianRupee} />
        <StatCard label="Offerings count" value="2,418" sub="across 31 days" icon={BarChart3} tone="stone" />
        <StatCard label="Unique donors" value="1,284" trend="+6%" icon={Users} tone="emerald" />
        <StatCard label="80G Tax exempt" value="₹72,315" sub="75% of total" icon={FileText} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-0.5">
        <SectionCard
          className="lg:col-span-2"
          title="All recent offerings"
          description="Real-time UPI transaction stream from temple kiosks."
          icon={Calendar}
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="relative">
                <Search className="w-3 h-3 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search donor / #..."
                  className="pl-6 pr-2 py-0.5 text-[10.5px] rounded-md bg-white border border-stone-200 focus:outline-none focus:border-amber-500 w-32 sm:w-40 text-stone-800 placeholder:text-stone-400 shadow-2xs"
                />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  defaultValue="2026-09-01"
                  className="py-0.5 px-1 text-[10px] rounded-md bg-white border border-stone-200 text-stone-700 shadow-2xs"
                />
                <span className="text-[10px] text-stone-400">–</span>
                <input
                  type="date"
                  defaultValue="2026-10-02"
                  className="py-0.5 px-1 text-[10px] rounded-md bg-white border border-stone-200 text-stone-700 shadow-2xs"
                />
              </div>
            </div>
          }
          footer={
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10.5px] text-stone-500 font-medium">Showing 8 of 2,418 records</p>
              <div className="flex items-center gap-1.5">
                <button className="px-2 py-0.5 rounded text-[11px] font-medium border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs">
                  Previous
                </button>
                <button className="px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-300 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 transition-colors cursor-pointer shadow-2xs">
                  Next
                </button>
              </div>
            </div>
          }
        >
          <DataTable
            head={['Receipt Ref', 'Donor Name', 'Amount', 'Timestamp', 'Status']}
            rows={ROWS.map((row) => [
              row[0],
              row[1],
              row[2],
              row[3],
              <Pill
                key={row[0]}
                tone={row[4] === 'Success' ? 'emerald' : row[4] === 'Pending' ? 'amber' : 'rose'}
              >
                <Dot tone={row[4] === 'Success' ? 'emerald' : row[4] === 'Pending' ? 'amber' : 'rose'} />
                {row[4]}
              </Pill>,
            ])}
          />
        </SectionCard>

        <div className="space-y-3">
          <SectionCard title="By denomination" description="Which notes and coins donors reach for most." icon={BarChart3}>
            <div className="space-y-2">
              {DENOM.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-stone-700">{d.label}</span>
                    <span className="text-[11px] font-bold text-amber-800 tabular-nums">{d.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
