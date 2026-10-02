import { BarChart3, Calendar, Download, FileText, Filter, IndianRupee, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { DataTable, Pill, Dot } from '../components/DataTable';
import { Button } from '../components/Controls';
import { Select, TextInput } from '../components/Field';

const ROWS = [
  ['#4821', 'Ramesh Pillai', '₹500', 'UPI', '02 Oct, 10:42', 'Success'],
  ['#4820', 'Anjali Nair', '₹200', 'UPI', '02 Oct, 10:31', 'Success'],
  ['#4819', 'Suresh Menon', '₹1,000', 'UPI', '02 Oct, 10:18', 'Success'],
  ['#4818', 'Lakshmi Iyer', '₹100', 'Cash', '02 Oct, 09:57', 'Success'],
  ['#4817', 'Vinod Kumar', '₹2,000', 'UPI', '02 Oct, 09:44', 'Pending'],
  ['#4816', 'Krishna Das', '₹50', 'UPI', '02 Oct, 09:12', 'Success'],
  ['#4815', 'Meera Krishnan', '₹500', 'UPI', '02 Oct, 08:50', 'Success'],
  ['#4814', 'Ravi Shankar', '₹250', 'UPI', '02 Oct, 08:22', 'Refunded'],
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
    <div>
      <PageHeader
        title="Donations & Reports"
        subtitle="Every offering recorded by your kiosk, filterable and exportable with complete audit details."
        actions={
          <>
            <Button variant="ghost" icon={FileText}>
              Tax report
            </Button>
            <Button variant="primary" icon={Download}>
              Export CSV
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="rounded-xl bg-stone-900/90 border border-amber-500/20 shadow-md p-3.5 sm:p-4 mb-4 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-stone-800">
          <Filter className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200/90">Filter Donations</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <TextInput
            label="From date"
            type="date"
            defaultValue="2026-09-01"
            className="[&_input]:[color-scheme:dark]"
          />
          <TextInput
            label="To date"
            type="date"
            defaultValue="2026-10-02"
            className="[&_input]:[color-scheme:dark]"
          />
          <Select
            label="Payment method"
            options={[
              { value: 'all', label: 'All methods' },
              { value: 'upi', label: 'UPI only' },
              { value: 'cash', label: 'Cash only' },
            ]}
          />
          <Select
            label="Kiosk device"
            options={[
              { value: 'all', label: 'All kiosks' },
              { value: 'k1', label: 'Hundi Kiosk 01 (Main)' },
              { value: 'k2', label: 'Hundi Kiosk 02 (Mandapam)' },
            ]}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5 mb-4">
        <StatCard label="Total offerings" value="₹96,420" sub="Sep 01 – Oct 02" trend="+12%" icon={IndianRupee} />
        <StatCard label="Offerings count" value="2,418" sub="across 31 days" icon={BarChart3} tone="stone" />
        <StatCard label="Unique donors" value="1,284" trend="+6%" icon={Users} tone="emerald" />
        <StatCard label="80G Tax exempt" value="₹72,315" sub="75% of total value" icon={FileText} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          className="lg:col-span-2"
          title="All recent offerings"
          description="Real-time transaction stream from temple kiosks."
          icon={Calendar}
          footer={
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11.5px] text-stone-300 font-medium">Showing 8 of 2,418 records</p>
              <div className="flex items-center gap-1.5">
                <button className="px-2.5 py-1 rounded-md text-xs font-medium border border-stone-600 bg-stone-800 text-stone-200 hover:border-amber-400 hover:text-amber-200 transition-colors cursor-pointer shadow-sm">
                  Previous
                </button>
                <button className="px-2.5 py-1 rounded-md text-xs font-semibold border border-amber-400/50 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25 transition-colors cursor-pointer shadow-sm">
                  Next
                </button>
              </div>
            </div>
          }
        >
          <DataTable
            head={['Receipt Ref', 'Donor Name', 'Amount', 'Method', 'Timestamp', 'Status']}
            rows={ROWS.map((row) => [
              row[0],
              row[1],
              row[2],
              row[3],
              row[4],
              <Pill
                key={row[0]}
                tone={row[5] === 'Success' ? 'emerald' : row[5] === 'Pending' ? 'amber' : 'rose'}
              >
                <Dot tone={row[5] === 'Success' ? 'emerald' : row[5] === 'Pending' ? 'amber' : 'rose'} />
                {row[5]}
              </Pill>,
            ])}
          />
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="By denomination" description="Which notes and coins donors reach for most." icon={BarChart3}>
            <div className="space-y-2.5">
              {DENOM.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-stone-100">{d.label}</span>
                    <span className="text-xs font-bold text-amber-300 tabular-nums">{d.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden border border-stone-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Payment methods" description="Share of total collection value." icon={IndianRupee}>
            <div className="space-y-2.5">
              {[
                { label: 'UPI / QR Code', pct: 88, tone: 'from-amber-600 via-amber-400 to-amber-300' },
                { label: 'Cash at counter', pct: 12, tone: 'from-stone-500 to-stone-300' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-stone-100">{m.label}</span>
                    <span className="text-xs font-bold text-amber-300 tabular-nums">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden border border-stone-700/50">
                    <div className={`h-full rounded-full bg-gradient-to-r ${m.tone}`} style={{ width: `${m.pct}%` }} />
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
