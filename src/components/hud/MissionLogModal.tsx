'use client';

import React from 'react';
import { PILOT_DATA } from '@/lib/constants';
import { spaceAudio } from '@/lib/audio';
import {
  Shield,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Code,
  Terminal,
  Activity,
  Award,
  Layers
} from 'lucide-react';

interface MissionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionLogModal: React.FC<MissionLogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-space-900 border-2 border-hud-cyan/60 rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.3)] overflow-hidden my-8">
        {/* Top Sci-Fi Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-space-800/90 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-hud-cyan animate-pulse" />
            <div>
              <h2 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
                COMMANDER DOSSIER // {PILOT_DATA.callsign}
                <span className="text-[10px] bg-cyan-950 text-hud-cyan px-2 py-0.5 rounded border border-cyan-700">
                  TOP SECRET
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                {PILOT_DATA.commander} · {PILOT_DATA.baseStation}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              spaceAudio.playTelemetryBeep(700);
              onClose();
            }}
            className="px-3 py-1 bg-space-900 hover:bg-space-700 text-gray-300 hover:text-white rounded border border-slate-700 text-xs transition-colors"
          >
            [ CLOSE ESC ]
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Pilot Bio & Mission Brief */}
          <div className="p-4 rounded-lg bg-space-950/70 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold text-[11px] tracking-wider">
                  {PILOT_DATA.stats.status}
                </span>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                {PILOT_DATA.missionStatement}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
              <div className="bg-space-900 p-2.5 rounded border border-slate-800 text-center min-w-[100px]">
                <span className="block text-gray-400 text-[10px]">REPOSITORIES</span>
                <span className="text-hud-cyan font-bold text-base">{PILOT_DATA.stats.repositories}</span>
              </div>
              <div className="bg-space-900 p-2.5 rounded border border-slate-800 text-center min-w-[100px]">
                <span className="block text-gray-400 text-[10px]">LEETCODE</span>
                <span className="text-hud-amber font-bold text-base">{PILOT_DATA.stats.leetCodeSolved}+</span>
              </div>
              <div className="bg-space-900 p-2.5 rounded border border-slate-800 text-center min-w-[100px]">
                <span className="block text-gray-400 text-[10px]">CODEFORCES</span>
                <span className="text-purple-400 font-bold text-base">{PILOT_DATA.stats.codeforcesRating}</span>
              </div>
              <div className="bg-space-900 p-2.5 rounded border border-slate-800 text-center min-w-[100px]">
                <span className="block text-gray-400 text-[10px]">ACTIVE STREAK</span>
                <span className="text-emerald-400 font-bold text-base">{PILOT_DATA.stats.activeStreakDays}d</span>
              </div>
            </div>
          </div>

          {/* Active Missions (Projects) */}
          <div>
            <h3 className="text-xs font-bold text-hud-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> PRIMARY ENGINEERING MISSIONS & PROJECTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PILOT_DATA.missions.map((mission) => (
                <div
                  key={mission.code}
                  className="p-3.5 bg-space-950/70 border border-slate-850 hover:border-hud-cyan/60 rounded-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-hud-cyan font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      {mission.code}
                    </span>
                    <span className="text-[10px] text-gray-400 tracking-wider">
                      {mission.classification}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-hud-cyan transition-colors mb-1">
                    {mission.title}
                  </h4>
                  <p className="text-gray-300 text-[11px] leading-relaxed mb-3">
                    {mission.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {mission.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.5 bg-space-900 text-gray-400 text-[10px] rounded border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px]">
                    <span className="text-gray-400 italic">{mission.metrics}</span>
                    <a
                      href={mission.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-hud-cyan hover:underline font-bold"
                    >
                      VIEW REPO <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Credentials & Skill Radar */}
          <div>
            <h3 className="text-xs font-bold text-hud-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> TECHNICAL FLIGHT CREDENTIALS & RADAR
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PILOT_DATA.credentials.map((cred) => (
                <div key={cred.category} className="bg-space-950/70 p-3 rounded-lg border border-slate-850">
                  <h4 className="text-[11px] text-hud-amber font-bold mb-2 uppercase">
                    {cred.category}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {cred.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-space-900 text-gray-300 text-[10px] rounded border border-slate-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communications Uplink (Socials & Contact) */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-space-900 to-blue-950/40 rounded-lg border border-cyan-800/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-hud-cyan" /> DIRECT COMMS UPLINK
              </h4>
              <p className="text-[11px] text-gray-400">Initiate encrypted handshake or review external profiles.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={PILOT_DATA.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-space-800 hover:bg-space-700 text-white rounded border border-slate-700 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
              <a
                href={PILOT_DATA.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-space-800 hover:bg-space-700 text-white rounded border border-slate-700 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn
              </a>
              <a
                href={PILOT_DATA.links.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-space-800 hover:bg-space-700 text-white rounded border border-slate-700 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-hud-amber" /> LeetCode
              </a>
              <a
                href={PILOT_DATA.links.email}
                className="flex items-center gap-1 px-3 py-1.5 bg-hud-cyan text-space-900 hover:bg-cyan-300 font-bold rounded transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
