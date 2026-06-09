"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  shopCount: number;
}

interface AdminStore {
  id: string;
  shopifyDomain: string;
  createdAt: string;
  userEmail: string;
  productCount: number;
}

interface AdminLog {
  id: string;
  action: string;
  target: string;
  createdAt: string;
  details: string;
}

type Tab = "users" | "stores" | "logs" | "billing";

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [stats, setStats] = useState({ users: 0, stores: 0, products: 0, trends: 0 });

  useEffect(() => {
    loadStats();
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadStats() {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { users: 0, stores: 0, products: 0, trends: 0 });
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  }

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      } else if (response.status === 403) {
        showToast("error", "Admin access required");
        router.push("/dashboard");
      }
    } catch (e) {
      showToast("error", "Failed to load users");
    } finally {
      setLoadingUsers(false);
      setLoading(false);
    }
  }

  async function loadStores() {
    setLoadingStores(true);
    try {
      const response = await fetch("/api/admin/stores");
      if (response.ok) {
        const data = await response.json();
        setStores(data.data || []);
      }
    } catch (e) {
      showToast("error", "Failed to load stores");
    } finally {
      setLoadingStores(false);
    }
  }

  async function loadLogs() {
    setLoadingLogs(true);
    try {
      const response = await fetch("/api/admin/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data.data || []);
      }
    } catch (e) {
      showToast("error", "Failed to load logs");
    } finally {
      setLoadingLogs(false);
    }
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    if (tab === "stores" && stores.length === 0) loadStores();
    if (tab === "logs" && logs.length === 0) loadLogs();
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "users", label: "Users", icon: "👥" },
    { key: "stores", label: "Stores", icon: "🏪" },
    { key: "billing", label: "Billing", icon: "💳" },
    { key: "logs", label: "Activity Logs", icon: "📋" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-red-600/20 border border-red-600/50 rounded text-red-400 text-xs font-semibold">
              ADMIN
            </div>
            <h1 className="text-4xl font-bold text-white">Control Center</h1>
          </div>
          <p className="text-slate-400">System administration and monitoring</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.users} icon="👥" />
          <StatCard label="Connected Stores" value={stats.stores} icon="🏪" />
          <StatCard label="Products Created" value={stats.products} icon="📦" />
          <StatCard label="Trends Scraped" value={stats.trends} icon="📈" />
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700 mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "text-indigo-400 border-b-2 border-indigo-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "users" && (
          <UsersTab users={users} loading={loadingUsers} onRefresh={loadUsers} />
        )}
        {activeTab === "stores" && (
          <StoresTab stores={stores} loading={loadingStores} onRefresh={loadStores} />
        )}
        {activeTab === "billing" && <BillingTab />}
        {activeTab === "logs" && (
          <LogsTab logs={logs} loading={loadingLogs} onRefresh={loadLogs} />
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value.toLocaleString()}</span>
      </div>
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function UsersTab({
  users,
  loading,
  onRefresh,
}: {
  users: AdminUser[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">User Management</h2>
        <button
          onClick={onRefresh}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Stores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-white">{user.email}</td>
                  <td className="px-4 py-3 text-slate-300">{user.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center text-indigo-400">{user.shopCount}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StoresTab({
  stores,
  loading,
  onRefresh,
}: {
  stores: AdminStore[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Store Management</h2>
        <button
          onClick={onRefresh}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading stores...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Domain</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Connected</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-indigo-400">{store.shopifyDomain}</td>
                  <td className="px-4 py-3 text-slate-300">{store.userEmail}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center text-green-400">{store.productCount}</td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No stores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BillingTab() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Billing Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Free Tier Users</p>
          <p className="text-2xl font-bold text-slate-300">—</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Premium (Black-Access)</p>
          <p className="text-2xl font-bold text-indigo-400">—</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-400">—</p>
        </div>
      </div>
      <p className="text-slate-500 text-sm mt-4">
        Billing integration with Shopify Billing API coming soon.
      </p>
    </div>
  );
}

function LogsTab({
  logs,
  loading,
  onRefresh,
}: {
  logs: AdminLog[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Activity Logs</h2>
        <button
          onClick={onRefresh}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading logs...</div>
      ) : (
        <div className="divide-y divide-slate-700">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-700/30">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-1 bg-slate-700 text-indigo-400 text-xs rounded mr-2">
                    {log.action}
                  </span>
                  <span className="text-white">{log.target}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              {log.details && (
                <p className="text-sm text-slate-400 mt-1">{log.details}</p>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-8 text-center text-slate-400">No activity logs found</div>
          )}
        </div>
      )}
    </div>
  );
}
