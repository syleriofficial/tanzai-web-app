'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, MessageSquare, TrendingUp, DollarSign,
  Activity, Settings, Shield, FileText, Bell,
  ChevronDown, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, CreditCard, Flag, Search, ArrowLeft
} from 'lucide-react'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { cn } from '@/lib/utils'

const kpis = [
  { label: 'Total users', value: '52,814', change: '+12.4%', up: true, icon: Users, color: 'oklch(0.72 0.18 210)' },
  { label: 'Messages today', value: '1.2M', change: '+8.1%', up: true, icon: MessageSquare, color: 'oklch(0.68 0.19 180)' },
  { label: 'Monthly revenue', value: '$218K', change: '+22.7%', up: true, icon: DollarSign, color: 'oklch(0.70 0.17 160)' },
  { label: 'Avg. latency', value: '187ms', change: '-14ms', up: true, icon: Activity, color: 'oklch(0.65 0.20 240)' },
]

const navItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'usage', icon: Activity, label: 'Usage' },
  { id: 'revenue', icon: CreditCard, label: 'Revenue' },
  { id: 'moderation', icon: Flag, label: 'Moderation' },
  { id: 'settings', icon: Settings, label: 'System' },
]

const recentUsers = [
  { name: 'Sarah Mitchell', email: 'sarah@example.com', plan: 'Pro', status: 'active', joined: 'Jun 1', msgs: 248 },
  { name: 'David Kim', email: 'david@example.com', plan: 'Free', status: 'active', joined: 'Jun 1', msgs: 41 },
  { name: 'Priya Sharma', email: 'priya@example.com', plan: 'Team', status: 'active', joined: 'May 31', msgs: 892 },
  { name: 'James Carter', email: 'james@example.com', plan: 'Pro', status: 'inactive', joined: 'May 30', msgs: 12 },
  { name: 'Ana Rodrigues', email: 'ana@example.com', plan: 'Free', status: 'active', joined: 'May 30', msgs: 66 },
  { name: 'Wei Zhang', email: 'wei@example.com', plan: 'Pro', status: 'active', joined: 'May 29', msgs: 347 },
]

const systemHealth = [
  { label: 'API Gateway', status: 'operational', uptime: '99.98%' },
  { label: 'Inference Engine', status: 'operational', uptime: '99.95%' },
  { label: 'Storage Layer', status: 'operational', uptime: '100%' },
  { label: 'Auth Service', status: 'degraded', uptime: '98.2%' },
  { label: 'CDN', status: 'operational', uptime: '100%' },
]

// Simple inline sparkline component
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 80
  const h = 32
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  return (
    <svg width={w} height={h} aria-hidden="true">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  )
}

const sparkData = {
  users: [420, 512, 480, 560, 590, 640, 620, 700, 750, 840],
  messages: [8200, 9100, 8800, 9600, 10200, 11000, 10400, 12100, 11800, 13200],
  revenue: [15000, 16200, 15800, 17100, 18400, 19200, 18700, 20400, 21800, 23100],
  latency: [210, 205, 198, 203, 195, 191, 188, 185, 190, 187],
}

const sparkKeys = ['users', 'messages', 'revenue', 'latency'] as const

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filteredUsers = recentUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Admin sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200',
          sidebarOpen ? 'w-56' : 'w-14'
        )}
        aria-label="Admin navigation"
      >
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border flex-shrink-0">
          {sidebarOpen ? (
            <TanzaiLogo size={22} textSize="text-base" />
          ) : (
            <TanzaiLogo size={22} showText={false} />
          )}
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm transition-all',
                  isActive
                    ? 'bg-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-accent/50'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={15} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border px-2 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Shield size={14} />
            {sidebarOpen && 'Admin Panel'}
          </button>
          <Link
            href="/chat"
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft size={14} />
            {sidebarOpen && 'Back to app'}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn('flex-1 flex flex-col transition-all duration-200', sidebarOpen ? 'ml-56' : 'ml-14')}>
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0 sticky top-0 z-20">
          <h1 className="text-sm font-semibold text-foreground capitalize">{activeNav === 'overview' ? 'Dashboard' : activeNav}</h1>
          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search users, chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border border-border/60 rounded-xl pl-8 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-52"
            />
          </div>

          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors" aria-label="Notifications">
            <Bell size={16} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent border border-border/40 flex items-center justify-center text-xs font-semibold text-primary">
              A
            </div>
            <ChevronDown size={13} className="text-muted-foreground" />
          </div>
        </header>

        {/* Dashboard body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon
              const spark = sparkData[sparkKeys[i]]
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl border border-border/50 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}
                    >
                      <Icon size={16} style={{ color: kpi.color }} />
                    </div>
                    <Sparkline values={spark} color={kpi.color} />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-0.5">{kpi.value}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{kpi.label}</span>
                    <span
                      className={cn(
                        'flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                        kpi.up ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                      )}
                    >
                      {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {kpi.change}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Users table */}
            <div className="xl:col-span-2 glass rounded-2xl border border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <h2 className="font-semibold text-foreground text-sm">Recent users</h2>
                <button className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="text-left border-b border-border/30">
                      <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">User</th>
                      <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Plan</th>
                      <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Messages</th>
                      <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Status</th>
                      <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Joined</th>
                      <th className="px-3 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.email}
                        className="border-b border-border/20 last:border-0 hover:bg-accent/20 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-accent border border-border/40 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{user.name}</p>
                              <p className="text-[10px] text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-medium',
                            user.plan === 'Pro' ? 'bg-primary/15 text-primary' :
                            user.plan === 'Team' ? 'bg-blue-500/15 text-blue-400' :
                            'bg-muted text-muted-foreground'
                          )}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-foreground">{user.msgs.toLocaleString()}</td>
                        <td className="px-3 py-3">
                          <span className={cn(
                            'flex items-center gap-1 text-[10px] font-medium',
                            user.status === 'active' ? 'text-green-400' : 'text-muted-foreground'
                          )}>
                            <div className={cn('w-1.5 h-1.5 rounded-full', user.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground')} />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[10px] text-muted-foreground">{user.joined}</td>
                        <td className="px-3 py-3">
                          <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors" aria-label="User options">
                            <MoreHorizontal size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* System health */}
              <div className="glass rounded-2xl border border-border/50 p-5">
                <h2 className="font-semibold text-foreground text-sm mb-4">System health</h2>
                <ul className="space-y-2.5">
                  {systemHealth.map((s) => (
                    <li key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full flex-shrink-0',
                          s.status === 'operational' ? 'bg-green-400' :
                          s.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                        )} />
                        <span className="text-xs text-foreground">{s.label}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{s.uptime}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-[10px] text-muted-foreground">1 service degraded</span>
                </div>
              </div>

              {/* Revenue breakdown */}
              <div className="glass rounded-2xl border border-border/50 p-5">
                <h2 className="font-semibold text-foreground text-sm mb-4">Plan distribution</h2>
                <div className="space-y-2.5">
                  {[
                    { plan: 'Free', count: '38,240', pct: 72, color: 'bg-muted' },
                    { plan: 'Pro', count: '11,420', pct: 22, color: 'bg-primary' },
                    { plan: 'Team', count: '3,154', pct: 6, color: 'bg-blue-500' },
                  ].map((p) => (
                    <div key={p.plan}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground">{p.plan}</span>
                        <span className="text-muted-foreground">{p.count} ({p.pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="glass rounded-2xl border border-border/50 p-5">
                <h2 className="font-semibold text-foreground text-sm mb-3">Quick actions</h2>
                <div className="space-y-1.5">
                  {[
                    { label: 'Export user report', icon: FileText },
                    { label: 'Send announcement', icon: Bell },
                    { label: 'System settings', icon: Settings },
                  ].map((a) => {
                    const Icon = a.icon
                    return (
                      <button
                        key={a.label}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left"
                      >
                        <Icon size={13} className="flex-shrink-0 text-primary/60" />
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="glass rounded-2xl border border-border/50 p-5">
            <h2 className="font-semibold text-foreground text-sm mb-4">Recent activity</h2>
            <ul className="space-y-3">
              {[
                { msg: 'New Pro subscription — Sarah Mitchell', time: '2 min ago', type: 'revenue' },
                { msg: '38 new users registered today', time: '14 min ago', type: 'users' },
                { msg: 'Auth service latency spike detected (resolved)', time: '1 hr ago', type: 'alert' },
                { msg: 'Team plan upgrade — Nexus Technologies (12 seats)', time: '2 hr ago', type: 'revenue' },
                { msg: 'Inference engine deployed v3.1.2', time: '4 hr ago', type: 'system' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                    item.type === 'revenue' ? 'bg-green-400' :
                    item.type === 'users' ? 'bg-primary' :
                    item.type === 'alert' ? 'bg-yellow-400' : 'bg-muted-foreground'
                  )} />
                  <div className="flex-1">
                    <span className="text-foreground">{item.msg}</span>
                  </div>
                  <span className="text-muted-foreground/60 flex-shrink-0">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}
