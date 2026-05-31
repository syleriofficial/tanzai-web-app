'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User, Bell, Shield, Brain, Palette, Globe2,
  CreditCard, Trash2, ChevronRight, ArrowLeft, Check
} from 'lucide-react'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'memory', icon: Brain, label: 'Memory & Data' },
  { id: 'language', icon: Globe2, label: 'Language & Region' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
]

const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese (Simplified)', 'Arabic', 'Portuguese']

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ email: true, product: true, tips: false, digest: true })
  const [memoryOn, setMemoryOn] = useState(true)
  const [language, setLanguage] = useState('English')
  const [theme, setTheme] = useState('dark')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Back to chat">
            <ArrowLeft size={18} />
          </Link>
          <TanzaiLogo size={22} textSize="text-base" />
          <div className="flex-1" />
          <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to chat
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Sidebar nav */}
          <nav className="md:w-56 flex-shrink-0" aria-label="Settings sections">
            <ul className="space-y-1">
              {sections.map((s) => {
                const Icon = s.icon
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveSection(s.id)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all',
                        activeSection === s.id
                          ? 'bg-accent text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      <Icon size={15} />
                      {s.label}
                      {activeSection === s.id && <ChevronRight size={13} className="ml-auto text-muted-foreground" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Content panel */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 glass rounded-2xl border border-border/50 p-6 space-y-6"
          >
            {/* Account */}
            {activeSection === 'account' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Account</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent border border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tanzai User</p>
                    <p className="text-sm text-muted-foreground">Free plan</p>
                    <button className="text-xs text-primary hover:underline mt-1">Change avatar</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                    <input
                      defaultValue="Tanzai User"
                      className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                    <input
                      defaultValue="user@tanzai.ai"
                      type="email"
                      className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                    <textarea
                      defaultValue="Researcher, builder, and curious mind."
                      rows={3}
                      className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Danger zone</h3>
                  <button className="flex items-center gap-2 text-sm text-destructive hover:underline">
                    <Trash2 size={14} /> Delete my account
                  </button>
                </div>
              </>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                  <div className="flex gap-3">
                    {['dark', 'light', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          'flex-1 py-3 rounded-xl border text-sm capitalize transition-all',
                          theme === t
                            ? 'border-primary bg-accent text-foreground font-medium'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Font size</label>
                  <div className="flex gap-2">
                    {['Small', 'Default', 'Large'].map((s) => (
                      <button
                        key={s}
                        className={cn(
                          'px-4 py-2 rounded-xl border text-sm transition-all',
                          s === 'Default'
                            ? 'border-primary bg-accent text-foreground'
                            : 'border-border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Chat width</label>
                  <input type="range" min={60} max={100} defaultValue={75} className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Compact</span>
                    <span>Full width</span>
                  </div>
                </div>
              </>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email notifications', desc: 'Receive account updates and alerts by email' },
                    { key: 'product', label: 'Product updates', desc: 'New features, improvements, and changelog' },
                    { key: 'tips', label: 'Tips & tutorials', desc: 'Occasional tips to get more from Tanzai' },
                    { key: 'digest', label: 'Weekly digest', desc: 'A summary of your usage and insights' },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                        className={cn(
                          'relative w-10 h-5.5 rounded-full border transition-colors flex-shrink-0',
                          notifs[n.key as keyof typeof notifs] ? 'bg-primary border-primary' : 'bg-muted border-border'
                        )}
                        style={{ height: '22px' }}
                        role="switch"
                        aria-checked={notifs[n.key as keyof typeof notifs]}
                        aria-label={n.label}
                      >
                        <div
                          className={cn(
                            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                            notifs[n.key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Memory */}
            {activeSection === 'memory' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Memory &amp; Data</h2>
                <div className="flex items-center justify-between py-4 border-b border-border/40">
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable memory</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Tanzai will remember context across sessions</p>
                  </div>
                  <button
                    onClick={() => setMemoryOn(!memoryOn)}
                    className={cn('relative w-10 rounded-full border transition-colors', memoryOn ? 'bg-primary border-primary' : 'bg-muted border-border')}
                    style={{ height: '22px' }}
                    role="switch"
                    aria-checked={memoryOn}
                    aria-label="Enable memory"
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform', memoryOn ? 'translate-x-5' : 'translate-x-0.5')} />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1.5">Stored memories</p>
                  <p className="text-xs text-muted-foreground mb-3">12 items stored</p>
                  <div className="space-y-2">
                    {['Prefers concise explanations', 'Working on a React SaaS app', 'Background in physics research'].map((m) => (
                      <div key={m} className="flex items-center justify-between px-3 py-2.5 bg-muted/50 rounded-xl border border-border/40">
                        <span className="text-xs text-foreground">{m}</span>
                        <button className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-sm text-destructive hover:underline">Clear all memories</button>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Data export</p>
                  <button className="text-sm text-primary hover:underline">Export all conversation history</button>
                </div>
              </>
            )}

            {/* Language */}
            {activeSection === 'language' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Language &amp; Region</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Display language</label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm text-left transition-all',
                          language === l
                            ? 'border-primary bg-accent text-foreground'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                        )}
                      >
                        {l}
                        {language === l && <Check size={13} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Time zone</label>
                  <select className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>UTC-8 — Pacific Time</option>
                    <option>UTC-5 — Eastern Time</option>
                    <option>UTC+0 — London</option>
                    <option>UTC+1 — Paris / Berlin</option>
                    <option>UTC+5:30 — India</option>
                    <option>UTC+8 — Singapore / Beijing</option>
                    <option>UTC+9 — Tokyo</option>
                  </select>
                </div>
              </>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Current password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Confirm new password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all" />
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security</p>
                    </div>
                    <button className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Active sessions</p>
                  {[
                    { device: 'MacBook Pro — Chrome', location: 'San Francisco, US', active: true },
                    { device: 'iPhone 15 — Safari', location: 'San Francisco, US', active: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-xs font-medium text-foreground">{s.device}</p>
                        <p className="text-[10px] text-muted-foreground">{s.location}</p>
                      </div>
                      {s.active ? (
                        <span className="text-[10px] text-primary bg-accent px-2 py-0.5 rounded-full">Current</span>
                      ) : (
                        <button className="text-[10px] text-destructive hover:underline">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Billing */}
            {activeSection === 'billing' && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Billing</h2>
                <div className="glass rounded-xl border border-border/50 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Free plan</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">50 messages / day. Upgrade for unlimited access.</p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-accent transition-colors"
                  >
                    <CreditCard size={13} /> Upgrade to Pro
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Payment method</p>
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border/40">
                    <div className="w-9 h-6 bg-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">VISA</div>
                    <span className="text-sm text-foreground">•••• •••• •••• 4242</span>
                    <span className="text-xs text-muted-foreground ml-auto">Expires 09/27</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Invoice history</p>
                  <p className="text-xs text-muted-foreground">No invoices yet. Upgrade to Pro to start billing.</p>
                </div>
              </>
            )}

            {/* Save button */}
            {['account', 'appearance', 'notifications', 'memory', 'language', 'security'].includes(activeSection) && (
              <div className="pt-4 border-t border-border/50">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                >
                  {saved ? <><Check size={14} /> Saved!</> : 'Save changes'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
