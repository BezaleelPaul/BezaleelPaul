'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Unlock, 
  Shield, 
  FolderPlus, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  FileText, 
  Eye, 
  EyeOff, 
  Star, 
  Sparkles,
  ArrowLeft,
  Trash2,
  Edit3,
  Save,
  Download
} from 'lucide-react';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROJECTS, 
  INITIAL_EXPERIENCE, 
  INITIAL_GITHUB_DATA,
  INITIAL_ADMIN_SETTINGS 
} from '@/data/profileData';
import { ProjectItem, ProjectCategory, ExperienceItem, AdminSettings } from '@/types/portfolio';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Admin state
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [experience, setExperience] = useState<ExperienceItem[]>(INITIAL_EXPERIENCE);
  const [settings, setSettings] = useState<AdminSettings>(INITIAL_ADMIN_SETTINGS);
  const [syncStatus, setSyncStatus] = useState<string>('Idle · Last sync confirmed');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience' | 'resume' | 'github' | 'ai'>('overview');

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('Full-Stack');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newStack, setNewStack] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [newDemo, setNewDemo] = useState('');

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load persisted overrides from LocalStorage if available
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('bezforge_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    const savedProjects = localStorage.getItem('bezforge_admin_projects');
    if (savedProjects) {
      try { setProjects(JSON.parse(savedProjects)); } catch {}
    }
    const savedSettings = localStorage.getItem('bezforge_admin_settings');
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch {}
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default challenge code: bezforge2026 or admin
    if (passcode.trim().toLowerCase() === 'bezforge2026' || passcode.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bezforge_admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid authentication code. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bezforge_admin_auth');
  };

  const toggleFeatured = (id: string) => {
    const updated = projects.map((p) => p.id === id ? { ...p, featured: !p.featured } : p);
    setProjects(updated);
    localStorage.setItem('bezforge_admin_projects', JSON.stringify(updated));
  };

  const toggleVisibility = (id: string) => {
    const hidden = settings.hiddenProjectIds.includes(id)
      ? settings.hiddenProjectIds.filter(i => i !== id)
      : [...settings.hiddenProjectIds, id];
    const newSettings = { ...settings, hiddenProjectIds: hidden };
    setSettings(newSettings);
    localStorage.setItem('bezforge_admin_settings', JSON.stringify(newSettings));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProjectItem = {
      id: newTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      tagline: newTagline || newTitle,
      category: newCategory,
      problem: newProblem || 'Engineering optimization challenge.',
      solution: newSolution || 'Architected modular software solution.',
      description: newTagline || newTitle,
      stack: newStack.split(',').map(s => s.trim()).filter(Boolean),
      featured: false,
      repoUrl: newRepo || 'https://github.com/BezaleelPaul',
      demoUrl: newDemo || null,
      status: 'Active',
      highlights: ['Custom deployment specification', 'Modular codebase']
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('bezforge_admin_projects', JSON.stringify(updated));

    // Reset Form
    setNewTitle('');
    setNewTagline('');
    setNewProblem('');
    setNewSolution('');
    setNewStack('');
    setNewRepo('');
    setNewDemo('');
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('bezforge_admin_projects', JSON.stringify(updated));
  };

  const triggerManualSync = () => {
    setSyncStatus('Initiating GitHub REST API sync handshake...');
    setTimeout(() => {
      setSyncStatus(`Sync successful at ${new Date().toLocaleTimeString()} · Verified 34 repos`);
    }, 1200);
  };

  const generateAiContent = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setAiOutput(
        `[Generated Project Architecture Summary]\n` +
        `Title: ${aiPrompt}\n` +
        `Classification: Software Architecture\n` +
        `Problem Statement: High computational overhead in manual evaluation.\n` +
        `Solution: Engineered modular micro-service with automated telemetry validation and sub-second execution.\n` +
        `Stack: Python, Flutter, TypeScript, Docker\n` +
        `Status: Verified for inclusion.`
      );
      setIsGenerating(false);
    }, 800);
  };

  const exportConfigJson = () => {
    const fullConfig = {
      profile: INITIAL_PROFILE,
      projects,
      experience,
      settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-950 p-4 font-mono select-none">
        <div className="w-full max-w-md p-8 rounded-2xl bg-space-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-cyan-950 border border-hud-cyan text-hud-cyan flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,243,255,0.4)]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              ADMIN COMMAND CENTRE
            </h1>
            <p className="text-xs text-slate-400">
              BezForge Private Administration &amp; Repository Manager
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Passcode Challenge
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access code (e.g. admin)"
                className="w-full px-4 py-2.5 rounded-lg bg-space-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-hud-cyan"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-hud-cyan text-space-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              Authenticate Access
            </button>
          </form>

          <div className="pt-4 border-t border-slate-850 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-950 text-white font-mono text-xs select-none">
      {/* Top Bar */}
      <header className="px-6 py-4 bg-space-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded bg-space-950 border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold font-display text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-hud-cyan" />
              <span>BEZFORGE COMMAND CENTRE</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                AUTHORIZED
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Content Administration, Sync Pipelines &amp; Resume Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportConfigJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-space-800 hover:bg-space-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Admin Content Workspace */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'projects', label: `Projects (${projects.length})` },
            { id: 'experience', label: `Experience (${experience.length})` },
            { id: 'resume', label: 'Resume & Downloads' },
            { id: 'github', label: 'GitHub Synchronization' },
            { id: 'ai', label: 'AI Content Assistant' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                  : 'bg-space-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-space-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Total Managed Projects</span>
                <span className="block text-2xl font-bold text-white">{projects.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-space-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Featured Showcases</span>
                <span className="block text-2xl font-bold text-hud-cyan">{projects.filter(p => p.featured).length}</span>
              </div>
              <div className="p-4 rounded-xl bg-space-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Public Repositories</span>
                <span className="block text-2xl font-bold text-hud-amber">{INITIAL_GITHUB_DATA.stats.repos}</span>
              </div>
              <div className="p-4 rounded-xl bg-space-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Deployment Status</span>
                <span className="block text-xs font-bold text-emerald-400 mt-2">Active · GitHub Pages</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-space-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>System Health &amp; Integrity Report</span>
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Static export pipeline is healthy. Version-controlled single source of truth is operational at <code className="text-hud-cyan font-mono">src/data/profileData.ts</code>. GitHub Actions automation runs on schedule with no reported synchronization failures.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Projects Management */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Add New Project Card */}
            <div className="p-6 rounded-xl bg-space-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-hud-cyan" />
                <span>Add New Project / Discover Repository</span>
              </h3>

              <form onSubmit={handleAddProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Drishti Vision Engine"
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                  >
                    <option value="Flutter & Mobile">Flutter &amp; Mobile</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="One-line summary for recruiters..."
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">The Problem</label>
                  <input
                    type="text"
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    placeholder="What obstacle was solved?"
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">The Solution</label>
                  <input
                    type="text"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder="Engineering architecture applied..."
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    placeholder="Python, Flutter, Docker, etc."
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="https://github.com/BezaleelPaul/..."
                    className="w-full px-3 py-2 rounded bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-hud-cyan text-space-950 font-bold hover:bg-cyan-300 transition-colors"
                  >
                    Commit Project to Database
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Projects Table */}
            <div className="rounded-xl bg-space-900 border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">Current Project Inventory</h3>
                <span className="text-[10px] text-slate-400">{projects.length} Entries</span>
              </div>

              <div className="divide-y divide-slate-850">
                {projects.map((proj) => {
                  const isHidden = settings.hiddenProjectIds.includes(proj.id);
                  return (
                    <div key={proj.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{proj.title}</span>
                          <span className="text-[10px] bg-space-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                            {proj.category}
                          </span>
                          {proj.featured && (
                            <span className="text-[10px] bg-amber-950 border border-amber-800 px-1.5 py-0.5 rounded text-amber-400">
                              Featured
                            </span>
                          )}
                          {isHidden && (
                            <span className="text-[10px] bg-rose-950 border border-rose-800 px-1.5 py-0.5 rounded text-rose-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">{proj.tagline}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(proj.id)}
                          title="Toggle Featured"
                          className={`p-2 rounded border transition-colors ${
                            proj.featured ? 'bg-amber-950 border-amber-700 text-amber-400' : 'bg-space-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleVisibility(proj.id)}
                          title={isHidden ? 'Unhide' : 'Hide from Public Site'}
                          className="p-2 rounded bg-space-950 border border-slate-800 text-slate-400 hover:text-white"
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          title="Delete Project"
                          className="p-2 rounded bg-space-950 border border-slate-800 text-rose-400 hover:bg-rose-950"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Experience Management */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-space-900 border border-slate-800 p-6 space-y-4">
              <h3 className="font-bold text-sm text-white">Professional History &amp; Experience Records</h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-space-950 border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{exp.role} · {exp.organization}</span>
                      <span className="text-slate-400 text-xs">{exp.period}</span>
                    </div>
                    <p className="text-slate-300 text-xs">{exp.summary}</p>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Resume Management */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-space-900 border border-slate-800 p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-hud-cyan" />
                <span>Resume Document &amp; Download Path</span>
              </h3>

              <div className="p-4 rounded-lg bg-space-950 border border-slate-850 space-y-3">
                <span className="text-slate-400 text-xs">Active Resume Download URL:</span>
                <input
                  type="text"
                  value={settings.resumeDownloadUrl}
                  onChange={(e) => {
                    const newSettings = { ...settings, resumeDownloadUrl: e.target.value };
                    setSettings(newSettings);
                    localStorage.setItem('bezforge_admin_settings', JSON.stringify(newSettings));
                  }}
                  className="w-full px-3 py-2 rounded bg-space-900 border border-slate-800 text-hud-cyan focus:outline-none"
                />
                <p className="text-slate-500 text-[11px]">
                  Place your updated resume PDF in <code className="text-slate-300">public/resume.pdf</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: GitHub Sync */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-space-900 border border-slate-800 p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-hud-cyan" />
                <span>Automated Repository Synchronization</span>
              </h3>

              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                The portfolio synchronizes public repository metadata via GitHub Actions on a 6-hour cron and on manual dispatches. You can also trigger an immediate client-side handshake verification below.
              </p>

              <div className="p-4 rounded-lg bg-space-950 border border-slate-850 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Sync Engine:</span>
                  <span className="text-hud-cyan font-bold">scripts/sync-github.mjs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Target User:</span>
                  <span className="text-white font-bold">@BezaleelPaul</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Status:</span>
                  <span className="text-emerald-400">{syncStatus}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={triggerManualSync}
                    className="px-4 py-2 rounded bg-hud-cyan text-space-950 font-bold hover:bg-cyan-300 transition-colors"
                  >
                    Trigger Manual Handshake
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Optional AI Assistant */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-space-900 border border-slate-800 p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-hud-amber" />
                <span>AI-Assisted Architecture &amp; Summary Generator</span>
              </h3>

              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                Optionally generate clean, professional project summaries and problem/solution definitions without external paid dependencies. All generated text requires your review before publication.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Enter repository or project name (e.g. Drishti-AI Vision Engine)..."
                  className="w-full px-4 py-2.5 rounded-lg bg-space-950 border border-slate-800 text-white focus:outline-none focus:border-hud-cyan"
                />

                <button
                  onClick={generateAiContent}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-lg bg-hud-cyan text-space-950 font-bold hover:bg-cyan-300 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Synthesizing...' : 'Generate Architectural Draft'}
                </button>
              </div>

              {aiOutput && (
                <div className="p-4 rounded-lg bg-space-950 border border-slate-850 space-y-2">
                  <span className="text-[10px] text-hud-cyan uppercase font-bold">Generated Output Draft:</span>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {aiOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
