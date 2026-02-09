'use client';

import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '#', icon: '📊' },
  { name: 'Files', href: '#', icon: '📁' },
  { name: 'Viewer', href: '#', icon: '🗂️' },
  { name: 'Projects', href: '#', icon: '🏗️' },
  { name: 'Settings', href: '#', icon: '⚙️' },
];

export default function const [activeTab Home() {
 , setActiveTab] = useState('Dashboard');
  const [isConfigured] = useState(
    !!process.env.NEXT_PUBLIC_APS_CLIENT_ID
  );

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🦞 Autodesk APS Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isConfigured
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isConfigured ? '✅ Configured' : '❌ Not Configured'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="mb-6 bg-white shadow rounded-lg">
          <div className="flex space-x-4 px-4 py-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.name
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Files' && <FilesManager />}
          {activeTab === 'Viewer' && <ModelViewer />}
          {activeTab === 'Projects' && <ProjectsBrowser />}
          {activeTab === 'Settings' && <Settings />}
        </div>
      </div>
    </main>
  );
}

// Dashboard Component
function Dashboard() {
  const stats = [
    { name: 'Total Files', value: '0', icon: '📁', color: 'bg-blue-500' },
    { name: 'Models Translated', value: '0', icon: '🗂️', color: 'bg-green-500' },
    { name: 'Active Projects', value: '0', icon: '🏗️', color: 'bg-purple-500' },
    { name: 'API Calls Today', value: '0', icon: '📡', color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg text-white text-xl`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              📤 Upload File
            </button>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              🔄 Translate Model
            </button>
            <button className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              📁 Browse Projects
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 text-gray-600">
            <p className="text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Files Manager Component
function FilesManager() {
  const [files] = useState<any[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">File Manager</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          📤 Upload File
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📁</p>
          <p>No files uploaded yet</p>
          <p className="text-sm">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{file.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Model Viewer Component
function ModelViewer() {
  const [urn, setUrn] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!urn) return;

    setIsLoading(true);
    setStatus('Translating...');

    try {
      // Translate model
      const response = await fetch('/api/autodesk/derivative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urn }),
      });

      if (!response.ok) throw new Error('Translation failed');

      setStatus('Translation started. Polling for completion...');

      // Poll for completion
      const result = await fetch(
        `/api/autodesk/derivative?urn=${encodeURIComponent(urn)}&action=poll`
      );

      if (result.ok) {
        setStatus('✅ Translation complete!');
      }
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Model Viewer</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model URN
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={urn}
            onChange={(e) => setUrn(e.target.value)}
            placeholder="Enter model URN (base64 encoded)"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTranslate}
            disabled={isLoading || !urn}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? 'Processing...' : 'Translate'}
          </button>
        </div>
        {status && (
          <p className={`mt-2 text-sm ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {status}
          </p>
        )}
      </div>

      <div className="viewer-container bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Viewer will appear here after translation</p>
      </div>
    </div>
  );
}

// Projects Browser Component
function ProjectsBrowser() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/autodesk/projects?action=hubs');
      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects Browser</h2>
        <button
          onClick={loadProjects}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">🏗️</p>
          <p>Click Refresh to load your Autodesk projects</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((hub) => (
            <div key={hub.id} className="border rounded-lg p-4 hover:shadow-lg">
              <h3 className="font-semibold text-lg">{hub.attributes?.name}</h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(hub.attributes?.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Component
function Settings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="max-w-xl">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Setup Instructions</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://aps.autodesk.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">APS Dashboard</a></li>
            <li>Create a new application</li>
            <li>Copy your Client ID and Client Secret</li>
            <li>Add them to your .env.local file</li>
          </ol>
        </div>


        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              APS Client ID
            </label>
            <input
              type="text"
              placeholder="Enter your APS Client ID"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              APS Client Secret
            </label>
            <input
              type="password"
              placeholder="Enter your APS Client Secret"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            💾 Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
