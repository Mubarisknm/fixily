import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Camera,
  Layers,
  Sparkles,
  ExternalLink,
  Award,
  Wallet,
  Radio,
  Siren,
  Activity,
  RefreshCw
} from 'lucide-react';
import { GigPartner, BookingJob, AdminStats, KochiLocation, DEFAULT_BLANK_AVATAR } from '../types';
import { LiveMap } from '../components/LiveMap';
import { api } from '../services/api';
import { sound } from '../utils/soundEffects';

interface AdminConsoleProps {
  partners: GigPartner[];
  jobs: BookingJob[];
  locations: KochiLocation[];
  onRefreshData: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  partners,
  jobs,
  locations,
  onRefreshData
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'disputes' | 'jobs'>('overview');
  const [kycSearch, setKycSearch] = useState<string>('');
  const [selectedDisputeJob, setSelectedDisputeJob] = useState<BookingJob | null>(jobs[0] || null);
  const [commandToast, setCommandToast] = useState<{ message: string; type: 'sos' | 'radar' | 'audit' | 'sync' } | null>(null);

  useEffect(() => {
    loadStats();
  }, [jobs, partners]);

  const loadStats = async () => {
    const data = await api.getAdminStats();
    setStats(data);
  };

  const handleDrillSos = () => {
    sound.playSosAlert();
    setCommandToast({
      message: '🚨 Emergency SOS broadcast simulated across 18 patrol units in Kochi & Kakkanad corridors.',
      type: 'sos'
    });
    setTimeout(() => setCommandToast(null), 6000);
  };

  const handleFleetPing = () => {
    sound.playRadarPing();
    setCommandToast({
      message: '📡 Fleet radar telemetry pinged 42 active vehicles across Ernakulam, Kozhikode & TVM. Latency: 14ms.',
      type: 'radar'
    });
    setTimeout(() => setCommandToast(null), 6000);
  };

  const handleEscrowAudit = () => {
    sound.playChime();
    setCommandToast({
      message: '⚖️ Zero-Advance Escrow Audit: 100% compliant. ₹0 unauthorized holds detected. DPDP tokens verified.',
      type: 'audit'
    });
    setTimeout(() => setCommandToast(null), 6000);
  };

  const handleApprovePCC = async (partnerId: string) => {
    try {
      sound.playChime();
      const refNo = `THUNA-PCC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      await api.approvePartnerKYC(partnerId, 'VERIFIED', refNo);
      onRefreshData();
      alert(`✅ PCC Approved! Kerala Police Thuna reference generated: ${refNo}`);
    } catch (err) {
      alert('Failed to approve PCC');
    }
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(kycSearch.toLowerCase()) ||
    p.role.toLowerCase().includes(kycSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Widget with Quick Operations Toolbar */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/60 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Operations Central Command</span>
            </span>
            <span className="text-xs text-slate-400">Multi-District Kerala Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
            Fykzi Dispatch & Compliance Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl">
            Real-time provider dispatch radar, Kerala Police Thuna PCC repository, & escrow safety audit.
          </p>
        </div>

        {/* Quick Operations Simulators */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFleetPing}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-teal-500/40 hover:border-teal-400 text-teal-300 text-xs font-bold transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title="Ping Kerala Fleet Radar"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-teal-400" />
            <span>Ping Fleet Radar</span>
          </button>

          <button
            onClick={handleDrillSos}
            className="px-3.5 py-2 rounded-xl bg-red-950/70 border border-red-500/50 hover:border-red-400 text-rose-200 text-xs font-bold transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title="Simulate 24/7 Roadside SOS Broadcast"
          >
            <Siren className="w-3.5 h-3.5 text-rose-400" />
            <span>SOS Drill</span>
          </button>

          <button
            onClick={handleEscrowAudit}
            className="px-3.5 py-2 rounded-xl bg-amber-950/70 border border-amber-500/50 hover:border-amber-400 text-amber-200 text-xs font-bold transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title="Verify Escrow & Damage Guarantee"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit Escrow</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRefreshData();
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:brightness-110 transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Live Command Notification Banner */}
      {commandToast && (
        <div className={`p-4 rounded-2xl border text-xs font-bold animate-in fade-in slide-in-from-top-2 flex items-center justify-between shadow-xl ${
          commandToast.type === 'sos'
            ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-rose-950/40'
            : commandToast.type === 'radar'
            ? 'bg-teal-950/90 border-teal-500 text-teal-200 shadow-teal-950/40'
            : 'bg-amber-950/90 border-amber-500 text-amber-200 shadow-amber-950/40'
        }`}>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 animate-spin shrink-0" />
            <span>{commandToast.message}</span>
          </div>
          <button
            onClick={() => setCommandToast(null)}
            className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Kerala District Micro-market Operations Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { district: 'Kochi (Ernakulam)', active: 18, sla: '99.4%', status: 'Normal Operations', color: 'emerald' },
          { district: 'Kozhikode (Calicut)', active: 12, sla: '98.8%', status: 'High Demand', color: 'teal' },
          { district: 'Thiruvananthapuram', active: 15, sla: '99.1%', status: 'Normal Operations', color: 'blue' },
          { district: 'Thrissur & Palakkad', active: 9, sla: '97.9%', status: 'Monsoon Alert', color: 'amber' }
        ].map((d, i) => (
          <div
            key={i}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-1 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">{d.district}</span>
              <span className={`w-2 h-2 rounded-full ${
                d.color === 'emerald' ? 'bg-emerald-400' : d.color === 'teal' ? 'bg-teal-400' : d.color === 'blue' ? 'bg-blue-400' : 'bg-amber-400'
              } animate-ping`} />
            </div>
            <div className="text-base font-black text-white">{d.active} Units Live</div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
              <span>SLA: <strong className="text-teal-400">{d.sla}</strong></span>
              <span className="text-[9px] text-slate-500 font-semibold">{d.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Stats Cards Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Widget 1 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-emerald-700/60 p-5 shadow-xl space-y-1 text-white">
          <div className="text-[10px] uppercase font-black tracking-wider text-emerald-400">Gross Platform Volume (GMV)</div>
          <div className="text-2xl font-black text-white">₹{stats?.gmv || 0}</div>
          <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kochi Micro-markets</span>
          </div>
        </div>

        {/* Stat Widget 2 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-amber-700/60 p-5 shadow-xl space-y-1 text-white">
          <div className="text-[10px] uppercase font-black tracking-wider text-amber-400">Net Platform Revenue (15% + Fees)</div>
          <div className="text-2xl font-black text-amber-300">₹{stats?.platformRevenue || 0}</div>
          <div className="text-xs text-slate-400">Avg Take Rate: <strong className="text-amber-400">{stats?.averageTakeRate}</strong></div>
        </div>

        {/* Stat Widget 3 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-cyan-700/60 p-5 shadow-xl space-y-1 text-white">
          <div className="text-[10px] uppercase font-black tracking-wider text-cyan-400">Active Duty Partners</div>
          <div className="text-2xl font-black text-white">{stats?.activePartnersCount || 0} Online</div>
          <div className="text-xs text-cyan-400 font-semibold">Ready for immediate dispatch</div>
        </div>

        {/* Stat Widget 4 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-teal-700/60 p-5 shadow-xl space-y-1 text-white">
          <div className="text-[10px] uppercase font-black tracking-wider text-teal-400">Police Verified (Thuna PCC)</div>
          <div className="text-2xl font-black text-teal-300">{stats?.verifiedPccCount || 0} Partners</div>
          <div className="text-xs text-slate-400">100% Background checked</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('overview');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Dispatch Radar & Map
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('kyc');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'kyc'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Kerala Police Thuna PCC Repository
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('disputes');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'disputes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dispute & Inspection Gallery Hub
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('jobs');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Master Jobs Ledger
        </button>
      </div>

      {/* Tab 1: Overview & Live Map */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              <span>Live Provider & Booking Dispatch Map</span>
            </h3>

            <LiveMap
              center={{ lat: 10.0159, lng: 76.3419 }}
              zoom={12}
              markers={[
                ...partners.map(p => ({
                  id: p.id,
                  lat: p.currentLocation.lat,
                  lng: p.currentLocation.lng,
                  title: p.name,
                  subtitle: `${p.role} • ${p.isOnline ? 'ONLINE' : 'OFFLINE'}`,
                  type: 'partner' as const
                })),
                ...jobs.map(j => ({
                  id: j.id,
                  lat: j.location.lat,
                  lng: j.location.lng,
                  title: `${j.serviceTitle} (${j.id})`,
                  subtitle: `${j.customerName} - ${j.status}`,
                  type: 'customer' as const
                }))
              ]}
              height="400px"
            />

            {/* Live Telemetry Incident Feed */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span>Real-Time Incident & Dispatch Stream</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Kerala Corridors • Zero Advance Verified</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white truncate max-w-[170px]">{job.serviceTitle}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : job.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                      <span className="truncate">{job.location?.address || job.location?.microMarket || 'Kerala Corridor'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900 text-slate-500">
                      <span>Customer: <strong className="text-slate-300">{job.customerName}</strong></span>
                      <span className="text-teal-400 font-bold">₹{job.pricing?.totalPaid || job.pricing?.baseFare || 299}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Kerala Police Thuna PCC Repository */}
      {activeTab === 'kyc' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span>Kerala Police Thuna PCC Document Verification</span>
              </h3>
              <p className="text-xs text-slate-400">
                Mandatory onboarding gate for gig partners and acting drivers in Kerala.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={kycSearch}
                onChange={(e) => setKycSearch(e.target.value)}
                placeholder="Search partner or role..."
                className="pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Partner Name</th>
                  <th className="p-3">Role & Experience</th>
                  <th className="p-3">Aadhaar</th>
                  <th className="p-3">Thuna PCC Status</th>
                  <th className="p-3">PCC Reference No</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPartners.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center space-x-2">
                      <img
                        src={p.photoUrl}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_BLANK_AVATAR;
                        }}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <span>{p.name}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-300">{p.role}</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Aadhaar Verified</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.kyc.pccStatus === 'VERIFIED'
                          ? 'bg-teal-950 text-teal-300 border border-teal-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {p.kyc.pccStatus}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      {p.kyc.pccRefNo || 'Pending Submission'}
                    </td>
                    <td className="p-3 text-right">
                      {p.kyc.pccStatus !== 'VERIFIED' ? (
                        <button
                          onClick={() => handleApprovePCC(p.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold shadow transition-all"
                        >
                          Approve PCC
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Dispute & Pre-Service Inspection Hub */}
      {activeTab === 'disputes' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6 text-white">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Pre-Service Inspection Photo Gallery & Damage Dispute Audit</span>
            </h3>
            <p className="text-xs text-slate-400">
              Audit mandatory 4-angle vehicle/appliance condition photos recorded by partners before starting jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-slate-800 pr-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Active Job
              </div>
              {jobs.map(j => (
                <div
                  key={j.id}
                  onClick={() => setSelectedDisputeJob(j)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    selectedDisputeJob?.id === j.id
                      ? 'border-amber-400 bg-amber-950/40 text-white font-bold shadow-sm'
                      : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-[10px] text-amber-400 font-mono">{j.id}</span>
                    <span className="text-[10px] text-slate-400">{j.status}</span>
                  </div>
                  <div className="font-bold text-white mt-0.5">{j.serviceTitle}</div>
                  <div className="text-[11px] text-slate-400">{j.customerName}</div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedDisputeJob ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{selectedDisputeJob.serviceTitle} ({selectedDisputeJob.id})</div>
                      <div className="text-slate-400">Customer: {selectedDisputeJob.customerName} • Partner: {selectedDisputeJob.assignedPartnerName || 'Unassigned'}</div>
                    </div>
                    <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[10px] px-2.5 py-1 rounded-full font-bold">
                      Acko Cover Active (₹19)
                    </span>
                  </div>

                  {selectedDisputeJob.preServiceChecklist ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedDisputeJob.preServiceChecklist.photos.map((ph, idx) => (
                        <div key={idx} className="bg-slate-950 text-white rounded-2xl p-3 space-y-2 border border-slate-800">
                          <img
                            src={ph.url}
                            alt={ph.angle}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-full h-36 object-cover rounded-xl"
                          />
                          <div className="font-bold text-xs text-amber-400">{ph.angle}</div>
                          <div className="text-[11px] text-slate-300 italic">{ph.notes}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-8 rounded-2xl text-center text-xs text-slate-400 italic border border-dashed border-slate-800">
                      No pre-service inspection photos uploaded for this job yet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-xs text-slate-400">Select a job from the list</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Master Jobs Ledger */}
      {activeTab === 'jobs' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6 text-white">
          <h3 className="text-lg font-bold text-white">Master Orders Ledger</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Service & Tier</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Assigned Partner</th>
                  <th className="p-3">Fare Breakdown</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-amber-400">{j.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{j.serviceTitle}</div>
                      <div className="text-slate-400 text-[11px]">{j.tierName}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{j.customerName}</div>
                      <div className="text-slate-400 text-[11px]">{j.location.microMarket}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-300">
                      {j.assignedPartnerName || 'Unassigned'}
                    </td>
                    <td className="p-3 font-mono">
                      <div>Total Paid: <strong className="text-white">₹{j.pricing.totalPaid}</strong></div>
                      <div className="text-[10px] text-teal-400">Commission: ₹{j.pricing.platformCommission}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
