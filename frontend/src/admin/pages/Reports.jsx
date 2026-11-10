import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Check,
  Download, 
  FileText, 
  IndianRupee, 
  Search, 
  Users, 
  Filter, 
  ChevronDown,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { DataTable, Pill, Dot } from '../components/DataTable';
import { Button } from '../components/Controls';
import { useAdmin } from '../AdminContext';
import { api } from '../../utils/api';

const STATUS_OPTIONS = ['All', 'Success', 'Pending', 'Failed'];

const getStatusTone = (status) => {
  const norm = String(status || '').toLowerCase();
  if (norm === 'success' || norm === 'paid') return 'emerald';
  if (norm === 'pending') return 'amber';
  if (norm === 'failed' || norm === 'expired') return 'rose';
  return 'stone';
};

export default function Reports() {
  const { temple } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isDipping, setIsDipping] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [timeAgoText, setTimeAgoText] = useState('Updated just now');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const formatLastUpdated = (date) => {
    if (!date) return 'Updated just now';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 15) return 'Updated just now';
    if (seconds < 60) return `Updated ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return 'Updated 1 min ago';
    if (minutes < 60) return `Updated ${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'Updated 1 hour ago';
    return `Updated ${hours} hours ago`;
  };

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.getAdminDashboard({
        status: statusFilter,
        q: searchQuery,
        startDate,
        endDate,
      });

      if (res && res.success) {
        setData(res);
        const updateTimestamp = new Date();
        setLastUpdated(updateTimestamp);
        setTimeAgoText(formatLastUpdated(updateTimestamp));

        // When manually refreshed, pulse opacity right as data arrives
        if (isRefresh) {
          setIsDipping(true);
          setTimeout(() => setIsDipping(false), 220);

          setJustCompleted(true);
          setTimeout(() => setJustCompleted(false), 1000);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Keep "Updated X ago" counter fresh every 10 seconds
  useEffect(() => {
    const updateText = () => setTimeAgoText(formatLastUpdated(lastUpdated));
    const interval = setInterval(updateText, 10000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery, startDate, endDate]);

  const metrics = data?.metrics || {
    total_amount: 0,
    total_count: 0,
    today_amount: 0,
    today_count: 0,
    unique_donors: 0,
    tax_exempt_80g_amount: 0,
    average_offering: 0,
  };

  const weekChart = data?.week_chart || [];
  const peakWeekValue = useMemo(() => {
    if (!weekChart.length) return 1;
    const maxVal = Math.max(...weekChart.map((d) => d.value));
    return maxVal > 0 ? maxVal : 1;
  }, [weekChart]);

  const denominations = data?.denominations || [];

  const statusCounts = data?.status_counts || {
    All: 0,
    Success: 0,
    Pending: 0,
    Failed: 0,
  };

  const offerings = data?.offerings || [];

  // Client-side pagination
  const totalOfferings = offerings.length;
  const paginatedOfferings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return offerings.slice(start, start + pageSize);
  }, [offerings, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(totalOfferings / pageSize));

  const handleExportCSV = () => {
    if (!offerings.length) return;

    const headers = ['Receipt Ref', 'Order ID', 'Amount (INR)', 'Method', 'Donor', 'Timestamp', 'Status'];
    const rowsData = offerings.map((item) => [
      item.ref,
      item.order_id,
      item.amount,
      item.method || 'Online',
      `"${(item.donor_name || 'Devotee').replace(/"/g, '""')}"`,
      `"${item.timestamp || item.date}"`,
      item.status,
    ]);

    const csvString = [headers.join(','), ...rowsData.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${(temple?.short_name || temple?.name || 'temple').replace(/\s+/g, '_')}_offerings_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Dashboard Overview"
        subtitle={`Real-time offerings, analytics, and kiosk collection summaries for ${temple?.name || 'Temple'}.`}
        actions={
          <div className="flex items-center gap-2 sm:gap-2.5">
            {timeAgoText && (
              <span className="text-[11px] font-medium text-stone-500 mr-0.5 select-none hidden sm:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                {timeAgoText}
              </span>
            )}
            <Button
              variant={justCompleted ? 'outline' : 'ghost'}
              icon={justCompleted ? Check : RefreshCw}
              className={`transition-all select-none ${
                refreshing ? '[&>svg]:animate-spin' : ''
              } ${
                justCompleted ? '!text-emerald-700 !border-emerald-300 !bg-emerald-50 shadow-2xs' : ''
              }`}
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
            >
              {justCompleted ? 'Updated' : 'Refresh'}
            </Button>
            <Button variant="primary" icon={Download} onClick={handleExportCSV} disabled={!offerings.length}>
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Content Area with Soft Opacity Dip Pulse on Refresh */}
      <div
        className={`space-y-3 transition-opacity duration-200 ease-in-out ${
          isDipping ? 'opacity-65' : 'opacity-100'
        }`}
      >
        {/* Temple status strip */}
      {temple && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-stone-800">
              {temple.name}
            </span>
            {temple.city && (
              <span className="text-[11px] text-stone-500">
                · {temple.city}, {temple.state}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-600">
            <span className="font-medium text-stone-700">{temple.bank_name || 'ICICI Bank'}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-bold text-[10px]">
              {temple.cashfree_status === 'ACTIVE' ? 'Cashfree Split Active' : (temple.cashfree_status || 'Active Console')}
            </span>
          </div>
        </div>
      )}

      {/* Live Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard
          label="Today's offerings"
          value={`₹${metrics.today_amount.toLocaleString('en-IN')}`}
          sub={`${metrics.today_count} offerings today`}
          trend="+18%"
          icon={IndianRupee}
        />
        <StatCard
          label="Total offerings"
          value={`₹${metrics.total_amount.toLocaleString('en-IN')}`}
          sub={`${metrics.total_count} total offerings`}
          icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          label="Unique donors"
          value={`${metrics.unique_donors.toLocaleString('en-IN')}`}
          sub="devotees contributing"
          icon={Users}
          tone="emerald"
        />
        <StatCard
          label="Average per offering"
          value={`₹${Math.round(metrics.average_offering).toLocaleString('en-IN')}`}
          sub={`80G exempt: ₹${Math.round(metrics.tax_exempt_80g_amount).toLocaleString('en-IN')}`}
          icon={FileText}
          tone="stone"
        />
      </div>

      {/* 7-Day Trend Chart & Denomination Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <SectionCard
          className="lg:col-span-2"
          title="Offerings this week"
          description="Total value received per day across temple offerings."
          icon={TrendingUp}
        >
          {weekChart.length > 0 ? (
            <div className="h-44 flex flex-col justify-between pt-2">
              <div className="flex-1 flex items-end gap-2 sm:gap-3 pb-1">
                {weekChart.map((d, i) => {
                  const heightPct = peakWeekValue > 0 ? Math.max(12, Math.round((d.value / peakWeekValue) * 100)) : 12;
                  const isHighest = d.value === peakWeekValue && d.value > 0;
                  return (
                    <div key={d.day + i} className="h-full flex-1 flex flex-col items-center justify-end gap-1.5 group cursor-default">
                      <span className="text-[10px] font-semibold text-amber-900 group-hover:scale-105 transition-all tabular-nums">
                        {d.value > 0 ? `₹${Math.round(d.value).toLocaleString('en-IN')}` : '₹0'}
                      </span>
                      <div className="w-full flex-1 flex items-end justify-center min-h-[40px]">
                        <div
                          className={`w-full max-w-[42px] rounded-t-md transition-all duration-300 ${
                            isHighest
                              ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.45)]'
                              : d.value > 0
                              ? 'bg-gradient-to-t from-amber-600/80 to-amber-400 group-hover:from-amber-600 group-hover:to-amber-300 shadow-2xs'
                              : 'bg-stone-200 h-2'
                          }`}
                          style={{ height: d.value > 0 ? `${heightPct}%` : '8px' }}
                        />
                      </div>
                      <span className={`text-[10.5px] font-bold uppercase tracking-wider ${isHighest ? 'text-amber-800' : 'text-stone-500'}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-stone-400 text-xs">
              No trend data available for this period.
            </div>
          )}
        </SectionCard>

        {/* By Denomination Distribution */}
        <SectionCard title="By denomination" description="Which notes and coins devotees offer most." icon={BarChart3}>
          <div className="space-y-2">
            {denominations.length > 0 ? (
              denominations.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-stone-700">{d.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-400">({d.count})</span>
                      <span className="text-[11px] font-bold text-amber-800 tabular-nums">{d.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(d.pct, d.count > 0 ? 5 : 0))}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-stone-400 text-xs">
                Awaiting offering denomination data.
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Main Transactions Stream (Full width) */}
      <div className="pt-0.5">
        <SectionCard
          title="All recent offerings"
          description="Real-time transaction stream from temple kiosks and portal."
          icon={Calendar}
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Status Filter Dropdown */}
              <div className="relative flex items-center">
                <Filter className="w-3 h-3 text-stone-400 absolute left-2 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-6 pr-6 py-0.5 text-[10.5px] font-medium rounded-md bg-white border border-stone-200 focus:outline-none focus:border-amber-500 text-stone-800 shadow-2xs appearance-none cursor-pointer"
                  aria-label="Filter offerings by status"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === 'All' ? 'All Status' : s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 pointer-events-none" />
              </div>

              {/* Search by receipt */}
              <div className="relative">
                <Search className="w-3 h-3 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search receipt / donor..."
                  className="pl-6 pr-2 py-0.5 text-[10.5px] rounded-md bg-white border border-stone-200 focus:outline-none focus:border-amber-500 w-28 sm:w-36 text-stone-800 placeholder:text-stone-400 shadow-2xs"
                />
              </div>

              {/* Date pickers */}
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="py-0.5 px-1 text-[10px] rounded-md bg-white border border-stone-200 text-stone-700 shadow-2xs"
                  aria-label="Start Date"
                />
                <span className="text-[10px] text-stone-400">–</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="py-0.5 px-1 text-[10px] rounded-md bg-white border border-stone-200 text-stone-700 shadow-2xs"
                  aria-label="End Date"
                />
              </div>
            </div>
          }
          footer={
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10.5px] text-stone-500 font-medium">
                Showing {totalOfferings > 0 ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, totalOfferings)} of {totalOfferings} offerings {statusFilter !== 'All' ? `(${statusFilter})` : ''}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border border-stone-200 transition-colors shadow-2xs ${
                    page <= 1
                      ? 'bg-stone-50 text-stone-400 cursor-not-allowed'
                      : 'bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                <span className="text-[10.5px] font-semibold text-stone-600 px-1">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors shadow-2xs ${
                    page >= totalPages
                      ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                      : 'border-amber-300 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          }
        >
          {/* Status Quick Filter Tabs */}
          <div className="flex items-center gap-1 pb-2 mb-1.5 overflow-x-auto border-b border-stone-200/70 [scrollbar-width:none]">
            {STATUS_OPTIONS.map((status) => {
              const isSelected = statusFilter === status;
              const count = statusCounts[status] ?? 0;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[10.5px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-400 text-amber-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      isSelected
                        ? 'bg-amber-500/30 text-amber-950 font-bold'
                        : 'bg-stone-200/80 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <span className="w-5 h-5 rounded-full border-2 border-amber-500/25 border-t-amber-500 animate-spin" />
              <p className="text-[11px] text-stone-500 font-medium">Loading live transactions…</p>
            </div>
          ) : paginatedOfferings.length > 0 ? (
            <DataTable
              head={['Receipt Ref', 'Amount', 'Donor / Method', 'Timestamp', 'Status']}
              colWidths={['w-[22%]', 'w-[18%]', 'w-[28%]', 'w-[20%]', 'w-[12%]']}
              rows={paginatedOfferings.map((row) => [
                <span key={row.id} className="font-mono font-medium text-stone-800 text-[11px]">
                  {row.ref}
                </span>,
                <span key={`amt-${row.id}`} className="font-semibold text-stone-900 tabular-nums">
                  {row.amount_formatted}
                </span>,
                <div key={`donor-${row.id}`} className="truncate">
                  <span className="text-stone-800 font-medium text-[11px]">{row.donor_name}</span>
                  <span className="text-stone-400 text-[10px] ml-1.5">· {row.method || 'Online'}</span>
                </div>,
                <span key={`time-${row.id}`} className="text-stone-600 text-[11px]">
                  {row.timestamp || row.date}
                </span>,
                <Pill key={`pill-${row.id}`} tone={getStatusTone(row.status)}>
                  <Dot tone={getStatusTone(row.status)} />
                  {row.status}
                </Pill>,
              ])}
            />
          ) : (
            <div className="py-10 text-center text-stone-500 text-xs">
              No transactions match the selected filter &ldquo;{statusFilter}&rdquo;.
            </div>
          )}
        </SectionCard>
      </div>
      </div>
    </div>
  );
}
