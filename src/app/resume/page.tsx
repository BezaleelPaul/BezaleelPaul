'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileCode2,
  FolderGit2,
  Printer,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Award,
  Terminal,
  Code2,
  Cpu,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import resumeJsonData from '@/data/resume.json';
import { ResumeData } from '@/types/resume';

const initialResume = resumeJsonData as unknown as ResumeData;

const toHref = (value: string) => {
  if (value.includes('@')) return `mailto:${value}`;
  if (/^https?:\/\//.test(value)) return value;
  if (/^[+\d][\d\s-]+$/.test(value)) return `tel:${value.replace(/\s/g, '')}`;
  return `https://${value}`;
};

const getContactIcon = (key: string) => {
  const lower = key.toLowerCase();
  if (lower.includes('email')) return Mail;
  if (lower.includes('phone')) return Phone;
  if (lower.includes('location')) return MapPin;
  if (lower.includes('github')) return Github;
  if (lower.includes('linkedin')) return Linkedin;
  return Globe;
};

const DossierSectionHeading: React.FC<{ children: React.ReactNode; badge?: string }> = ({
  children,
  badge,
}) => (
  <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 mb-3">
    <h3 className="flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
      {children}
    </h3>
    {badge && (
      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted)]">
        {badge}
      </span>
    )}
  </div>
);

const QRCodeSvg: React.FC<{ className?: string }> = ({ className = 'h-16 w-16 text-black' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 33 33"
    shapeRendering="crispEdges"
    className={className}
    aria-label="Scan to view project archive"
  >
    <path
      d="M0,0h1v1h-1zM1,0h1v1h-1zM2,0h1v1h-1zM3,0h1v1h-1zM4,0h1v1h-1zM5,0h1v1h-1zM6,0h1v1h-1zM9,0h1v1h-1zM13,0h1v1h-1zM16,0h1v1h-1zM17,0h1v1h-1zM18,0h1v1h-1zM19,0h1v1h-1zM20,0h1v1h-1zM23,0h1v1h-1zM26,0h1v1h-1zM27,0h1v1h-1zM28,0h1v1h-1zM29,0h1v1h-1zM30,0h1v1h-1zM31,0h1v1h-1zM32,0h1v1h-1zM0,1h1v1h-1zM6,1h1v1h-1zM9,1h1v1h-1zM11,1h1v1h-1zM12,1h1v1h-1zM13,1h1v1h-1zM14,1h1v1h-1zM15,1h1v1h-1zM16,1h1v1h-1zM17,1h1v1h-1zM22,1h1v1h-1zM24,1h1v1h-1zM26,1h1v1h-1zM32,1h1v1h-1zM0,2h1v1h-1zM2,2h1v1h-1zM3,2h1v1h-1zM4,2h1v1h-1zM6,2h1v1h-1zM8,2h1v1h-1zM10,2h1v1h-1zM11,2h1v1h-1zM13,2h1v1h-1zM15,2h1v1h-1zM17,2h1v1h-1zM18,2h1v1h-1zM19,2h1v1h-1zM20,2h1v1h-1zM26,2h1v1h-1zM28,2h1v1h-1zM29,2h1v1h-1zM30,2h1v1h-1zM32,2h1v1h-1zM0,3h1v1h-1zM2,3h1v1h-1zM3,3h1v1h-1zM4,3h1v1h-1zM6,3h1v1h-1zM8,3h1v1h-1zM10,3h1v1h-1zM12,3h1v1h-1zM14,3h1v1h-1zM16,3h1v1h-1zM19,3h1v1h-1zM20,3h1v1h-1zM21,3h1v1h-1zM22,3h1v1h-1zM23,3h1v1h-1zM26,3h1v1h-1zM28,3h1v1h-1zM29,3h1v1h-1zM30,3h1v1h-1zM32,3h1v1h-1zM0,4h1v1h-1zM2,4h1v1h-1zM3,4h1v1h-1zM4,4h1v1h-1zM6,4h1v1h-1zM8,4h1v1h-1zM9,4h1v1h-1zM10,4h1v1h-1zM12,4h1v1h-1zM13,4h1v1h-1zM15,4h1v1h-1zM18,4h1v1h-1zM21,4h1v1h-1zM24,4h1v1h-1zM26,4h1v1h-1zM28,4h1v1h-1zM29,4h1v1h-1zM30,4h1v1h-1zM32,4h1v1h-1zM0,5h1v1h-1zM6,5h1v1h-1zM8,5h1v1h-1zM10,5h1v1h-1zM11,5h1v1h-1zM12,5h1v1h-1zM13,5h1v1h-1zM14,5h1v1h-1zM15,5h1v1h-1zM16,5h1v1h-1zM17,5h1v1h-1zM20,5h1v1h-1zM21,5h1v1h-1zM22,5h1v1h-1zM26,5h1v1h-1zM32,5h1v1h-1zM0,6h1v1h-1zM1,6h1v1h-1zM2,6h1v1h-1zM3,6h1v1h-1zM4,6h1v1h-1zM5,6h1v1h-1zM6,6h1v1h-1zM8,6h1v1h-1zM10,6h1v1h-1zM12,6h1v1h-1zM14,6h1v1h-1zM16,6h1v1h-1zM18,6h1v1h-1zM20,6h1v1h-1zM22,6h1v1h-1zM24,6h1v1h-1zM26,6h1v1h-1zM27,6h1v1h-1zM28,6h1v1h-1zM29,6h1v1h-1zM30,6h1v1h-1zM31,6h1v1h-1zM32,6h1v1h-1zM8,7h1v1h-1zM10,7h1v1h-1zM12,7h1v1h-1zM14,7h1v1h-1zM15,7h1v1h-1zM21,7h1v1h-1zM22,7h1v1h-1zM24,7h1v1h-1zM0,8h1v1h-1zM2,8h1v1h-1zM3,8h1v1h-1zM4,8h1v1h-1zM5,8h1v1h-1zM6,8h1v1h-1zM10,8h1v1h-1zM11,8h1v1h-1zM12,8h1v1h-1zM13,8h1v1h-1zM15,8h1v1h-1zM17,8h1v1h-1zM22,8h1v1h-1zM24,8h1v1h-1zM26,8h1v1h-1zM27,8h1v1h-1zM28,8h1v1h-1zM29,8h1v1h-1zM30,8h1v1h-1zM0,9h1v1h-1zM2,9h1v1h-1zM5,9h1v1h-1zM7,9h1v1h-1zM8,9h1v1h-1zM10,9h1v1h-1zM16,9h1v1h-1zM18,9h1v1h-1zM19,9h1v1h-1zM21,9h1v1h-1zM23,9h1v1h-1zM26,9h1v1h-1zM27,9h1v1h-1zM29,9h1v1h-1zM30,9h1v1h-1zM32,9h1v1h-1zM3,10h1v1h-1zM4,10h1v1h-1zM5,10h1v1h-1zM6,10h1v1h-1zM7,10h1v1h-1zM9,10h1v1h-1zM10,10h1v1h-1zM12,10h1v1h-1zM15,10h1v1h-1zM18,10h1v1h-1zM21,10h1v1h-1zM28,10h1v1h-1zM30,10h1v1h-1zM31,10h1v1h-1zM0,11h1v1h-1zM1,11h1v1h-1zM3,11h1v1h-1zM5,11h1v1h-1zM7,11h1v1h-1zM8,11h1v1h-1zM9,11h1v1h-1zM10,11h1v1h-1zM12,11h1v1h-1zM14,11h1v1h-1zM16,11h1v1h-1zM20,11h1v1h-1zM21,11h1v1h-1zM22,11h1v1h-1zM24,11h1v1h-1zM25,11h1v1h-1zM26,11h1v1h-1zM28,11h1v1h-1zM29,11h1v1h-1zM30,11h1v1h-1zM32,11h1v1h-1zM0,12h1v1h-1zM4,12h1v1h-1zM6,12h1v1h-1zM10,12h1v1h-1zM18,12h1v1h-1zM19,12h1v1h-1zM21,12h1v1h-1zM24,12h1v1h-1zM28,12h1v1h-1zM29,12h1v1h-1zM1,13h1v1h-1zM9,13h1v1h-1zM13,13h1v1h-1zM14,13h1v1h-1zM15,13h1v1h-1zM16,13h1v1h-1zM17,13h1v1h-1zM20,13h1v1h-1zM21,13h1v1h-1zM22,13h1v1h-1zM26,13h1v1h-1zM29,13h1v1h-1zM31,13h1v1h-1zM32,13h1v1h-1zM1,14h1v1h-1zM2,14h1v1h-1zM4,14h1v1h-1zM6,14h1v1h-1zM9,14h1v1h-1zM10,14h1v1h-1zM14,14h1v1h-1zM18,14h1v1h-1zM19,14h1v1h-1zM21,14h1v1h-1zM22,14h1v1h-1zM23,14h1v1h-1zM24,14h1v1h-1zM25,14h1v1h-1zM26,14h1v1h-1zM27,14h1v1h-1zM29,14h1v1h-1zM31,14h1v1h-1zM0,15h1v1h-1zM1,15h1v1h-1zM2,15h1v1h-1zM3,15h1v1h-1zM5,15h1v1h-1zM10,15h1v1h-1zM13,15h1v1h-1zM16,15h1v1h-1zM19,15h1v1h-1zM20,15h1v1h-1zM21,15h1v1h-1zM22,15h1v1h-1zM23,15h1v1h-1zM25,15h1v1h-1zM26,15h1v1h-1zM29,15h1v1h-1zM30,15h1v1h-1zM1,16h1v1h-1zM2,16h1v1h-1zM3,16h1v1h-1zM4,16h1v1h-1zM6,16h1v1h-1zM7,16h1v1h-1zM8,16h1v1h-1zM11,16h1v1h-1zM12,16h1v1h-1zM13,16h1v1h-1zM14,16h1v1h-1zM17,16h1v1h-1zM19,16h1v1h-1zM22,16h1v1h-1zM23,16h1v1h-1zM24,16h1v1h-1zM25,16h1v1h-1zM27,16h1v1h-1zM28,16h1v1h-1zM32,16h1v1h-1zM5,17h1v1h-1zM7,17h1v1h-1zM8,17h1v1h-1zM14,17h1v1h-1zM17,17h1v1h-1zM19,17h1v1h-1zM20,17h1v1h-1zM23,17h1v1h-1zM26,17h1v1h-1zM27,17h1v1h-1zM29,17h1v1h-1zM30,17h1v1h-1zM31,17h1v1h-1zM32,17h1v1h-1zM2,18h1v1h-1zM3,18h1v1h-1zM5,18h1v1h-1zM6,18h1v1h-1zM7,18h1v1h-1zM8,18h1v1h-1zM10,18h1v1h-1zM13,18h1v1h-1zM15,18h1v1h-1zM17,18h1v1h-1zM20,18h1v1h-1zM22,18h1v1h-1zM24,18h1v1h-1zM25,18h1v1h-1zM26,18h1v1h-1zM27,18h1v1h-1zM28,18h1v1h-1zM30,18h1v1h-1zM31,18h1v1h-1zM0,19h1v1h-1zM7,19h1v1h-1zM9,19h1v1h-1zM10,19h1v1h-1zM11,19h1v1h-1zM14,19h1v1h-1zM17,19h1v1h-1zM18,19h1v1h-1zM20,19h1v1h-1zM23,19h1v1h-1zM24,19h1v1h-1zM25,19h1v1h-1zM26,19h1v1h-1zM27,19h1v1h-1zM28,19h1v1h-1zM29,19h1v1h-1zM30,19h1v1h-1zM0,20h1v1h-1zM1,20h1v1h-1zM4,20h1v1h-1zM5,20h1v1h-1zM6,20h1v1h-1zM7,20h1v1h-1zM8,20h1v1h-1zM12,20h1v1h-1zM15,20h1v1h-1zM16,20h1v1h-1zM20,20h1v1h-1zM21,20h1v1h-1zM22,20h1v1h-1zM23,20h1v1h-1zM28,20h1v1h-1zM29,20h1v1h-1zM0,21h1v1h-1zM3,21h1v1h-1zM7,21h1v1h-1zM10,21h1v1h-1zM11,21h1v1h-1zM12,21h1v1h-1zM13,21h1v1h-1zM14,21h1v1h-1zM15,21h1v1h-1zM18,21h1v1h-1zM24,21h1v1h-1zM32,21h1v1h-1zM0,22h1v1h-1zM2,22h1v1h-1zM3,22h1v1h-1zM4,22h1v1h-1zM6,22h1v1h-1zM9,22h1v1h-1zM15,22h1v1h-1zM16,22h1v1h-1zM20,22h1v1h-1zM21,22h1v1h-1zM22,22h1v1h-1zM28,22h1v1h-1zM31,22h1v1h-1zM0,23h1v1h-1zM3,23h1v1h-1zM5,23h1v1h-1zM9,23h1v1h-1zM11,23h1v1h-1zM14,23h1v1h-1zM15,23h1v1h-1zM18,23h1v1h-1zM21,23h1v1h-1zM24,23h1v1h-1zM26,23h1v1h-1zM27,23h1v1h-1zM29,23h1v1h-1zM30,23h1v1h-1zM0,24h1v1h-1zM2,24h1v1h-1zM3,24h1v1h-1zM4,24h1v1h-1zM5,24h1v1h-1zM6,24h1v1h-1zM7,24h1v1h-1zM8,24h1v1h-1zM9,24h1v1h-1zM12,24h1v1h-1zM14,24h1v1h-1zM15,24h1v1h-1zM17,24h1v1h-1zM20,24h1v1h-1zM22,24h1v1h-1zM24,24h1v1h-1zM25,24h1v1h-1zM26,24h1v1h-1zM27,24h1v1h-1zM28,24h1v1h-1zM32,24h1v1h-1zM8,25h1v1h-1zM16,25h1v1h-1zM18,25h1v1h-1zM19,25h1v1h-1zM20,25h1v1h-1zM21,25h1v1h-1zM22,25h1v1h-1zM23,25h1v1h-1zM24,25h1v1h-1zM28,25h1v1h-1zM30,25h1v1h-1zM31,25h1v1h-1zM32,25h1v1h-1zM0,26h1v1h-1zM1,26h1v1h-1zM2,26h1v1h-1zM3,26h1v1h-1zM4,26h1v1h-1zM5,26h1v1h-1zM6,26h1v1h-1zM12,26h1v1h-1zM15,26h1v1h-1zM16,26h1v1h-1zM18,26h1v1h-1zM20,26h1v1h-1zM21,26h1v1h-1zM23,26h1v1h-1zM24,26h1v1h-1zM26,26h1v1h-1zM28,26h1v1h-1zM30,26h1v1h-1zM31,26h1v1h-1zM0,27h1v1h-1zM6,27h1v1h-1zM8,27h1v1h-1zM10,27h1v1h-1zM14,27h1v1h-1zM15,27h1v1h-1zM16,27h1v1h-1zM21,27h1v1h-1zM22,27h1v1h-1zM23,27h1v1h-1zM24,27h1v1h-1zM28,27h1v1h-1zM29,27h1v1h-1zM30,27h1v1h-1zM31,27h1v1h-1zM32,27h1v1h-1zM0,28h1v1h-1zM2,28h1v1h-1zM3,28h1v1h-1zM4,28h1v1h-1zM6,28h1v1h-1zM8,28h1v1h-1zM9,28h1v1h-1zM10,28h1v1h-1zM11,28h1v1h-1zM12,28h1v1h-1zM13,28h1v1h-1zM15,28h1v1h-1zM18,28h1v1h-1zM21,28h1v1h-1zM24,28h1v1h-1zM25,28h1v1h-1zM26,28h1v1h-1zM27,28h1v1h-1zM28,28h1v1h-1zM29,28h1v1h-1zM31,28h1v1h-1zM32,28h1v1h-1zM0,29h1v1h-1zM2,29h1v1h-1zM3,29h1v1h-1zM4,29h1v1h-1zM6,29h1v1h-1zM8,29h1v1h-1zM10,29h1v1h-1zM11,29h1v1h-1zM12,29h1v1h-1zM15,29h1v1h-1zM16,29h1v1h-1zM17,29h1v1h-1zM20,29h1v1h-1zM21,29h1v1h-1zM22,29h1v1h-1zM23,29h1v1h-1zM24,29h1v1h-1zM25,29h1v1h-1zM28,29h1v1h-1zM29,29h1v1h-1zM30,29h1v1h-1zM32,29h1v1h-1zM0,30h1v1h-1zM2,30h1v1h-1zM3,30h1v1h-1zM4,30h1v1h-1zM6,30h1v1h-1zM8,30h1v1h-1zM10,30h1v1h-1zM12,30h1v1h-1zM18,30h1v1h-1zM19,30h1v1h-1zM21,30h1v1h-1zM23,30h1v1h-1zM24,30h1v1h-1zM26,30h1v1h-1zM27,30h1v1h-1zM29,30h1v1h-1zM30,30h1v1h-1zM0,31h1v1h-1zM6,31h1v1h-1zM9,31h1v1h-1zM12,31h1v1h-1zM13,31h1v1h-1zM16,31h1v1h-1zM18,31h1v1h-1zM19,31h1v1h-1zM20,31h1v1h-1zM21,31h1v1h-1zM24,31h1v1h-1zM25,31h1v1h-1zM26,31h1v1h-1zM28,31h1v1h-1zM29,31h1v1h-1zM30,31h1v1h-1zM0,32h1v1h-1zM1,32h1v1h-1zM2,32h1v1h-1zM3,32h1v1h-1zM4,32h1v1h-1zM5,32h1v1h-1zM6,32h1v1h-1zM8,32h1v1h-1zM9,32h1v1h-1zM11,32h1v1h-1zM12,32h1v1h-1zM13,32h1v1h-1zM16,32h1v1h-1zM17,32h1v1h-1zM19,32h1v1h-1zM22,32h1v1h-1zM23,32h1v1h-1zM26,32h1v1h-1zM27,32h1v1h-1zM31,32h1v1h-1z"
      fill="currentColor"
    />
  </svg>
);

export default function ResumePage() {
  const [data] = useState<ResumeData>(initialResume);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showJsonModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowJsonModal(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showJsonModal]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] space-texture selection:bg-[var(--accent)] selection:text-[var(--bg)]">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="pb-24 pt-28 print:p-0">
        <div className="site-shell print:hidden">
          {/* Back navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          {/* Editorial Header */}
          <header className="mt-8 grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="orbital-eyebrow text-[var(--accent)]">
                <span>01</span> / FLIGHT DOSSIER // CURRICULUM VITAE
              </p>
              <h1 className="display mt-4 text-[clamp(54px,9vw,110px)] leading-[0.84] text-[var(--text)]">
                <span>BEZALEEL</span> <span className="outline-text">PAUL.</span>
              </h1>
              <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                A structured, synchronized record of my engineering education, practical experience,
                and technical toolkit across mobile, web, and applied machine learning.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
                <span className="flex items-center gap-1.5 text-[var(--accent)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse" />
                  SYS VERIFIED // PILOT 01
                </span>
                <span>BENGALURU, INDIA · 12°58&apos; N / 77°36&apos; E</span>
                <span>OPEN TO SWE INTERNSHIPS</span>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-4">
              <a
                href="/resume/"
                className="action-button primary w-full !justify-between"
              >
                <span>OPEN PRINTABLE RÉSUMÉ</span>
                <Download className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={handlePrint}
                className="action-button secondary w-full !justify-between text-[var(--text)]"
              >
                <span>PRINT / SAVE PDF</span>
                <Printer className="h-4 w-4 text-[var(--accent)]" />
              </button>
              <button
                type="button"
                onClick={() => setShowJsonModal(true)}
                className="action-button secondary w-full !justify-between text-[var(--text)]"
              >
                <span>DATA MANIFEST (JSON)</span>
                <FileCode2 className="h-4 w-4 text-[var(--accent)]" />
              </button>
              <Link
                href="/projects"
                className="action-button secondary w-full !justify-between text-[var(--text)]"
              >
                <span>PROJECT ARCHIVE</span>
                <FolderGit2 className="h-4 w-4 text-[var(--accent)]" />
              </Link>
            </div>
          </header>
        </div>

        {/* The Dossier Sheet */}
        <div className="mt-12 flex justify-center px-3 sm:px-6 print:m-0 print:p-0">
          <article
            id="resume-canvas"
            className="resume-dossier w-full max-w-[1200px] overflow-hidden"
          >
            {/* Top Targeting Markers */}
            <div className="resume-dossier-topline print:hidden">
              <div className="flex items-center gap-3">
                <span className="text-[var(--accent)]">+</span>
                <span>DOSSIER // PILOT-01-BP</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">AUTHENTICATION: BEZALEEL PAUL N</span>
                <span className="rounded bg-[var(--accent-soft)] px-2 py-0.5 text-[8px] text-[var(--accent)] border border-[rgba(215,255,0,0.3)]">
                  ACTIVE MANIFEST
                </span>
                <span className="text-[var(--accent)]">+</span>
              </div>
            </div>

            <div className="resume-dossier-grid">
              {/* ── Left Aside: Pilot Credentials & Telemetry ── */}
              <aside className="resume-dossier-aside flex flex-col gap-6 text-[10px] leading-relaxed">
                {/* Profile Card */}
                <div className="flex items-center gap-4 border-b border-[var(--line)] pb-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--accent)] bg-[var(--surface-raised)] shadow-[0_0_15px_rgba(215,255,0,0.15)]">
                    <img
                      src="/assets/portrait-processed.webp"
                      alt={data.name}
                      className="h-full w-full object-cover object-top filter brightness-[1.03] contrast-[1.05]"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="flex h-full w-full items-center justify-center bg-[var(--surface-raised)] font-mono text-xl font-bold text-[var(--accent)]">
                      BP
                    </div>
                  </div>
                  <div>
                    <h2 className="font-mono text-sm font-bold tracking-tight text-[var(--text)]">
                      {data.name} <span className="text-[var(--accent)]">{data.nameAccent}</span>
                    </h2>
                    <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {data.tagline}
                    </p>
                    <span className="mt-1.5 inline-block font-mono text-[7.5px] text-[var(--accent)]">
                      CALLSIGN: BEZALEEL // 01
                    </span>
                  </div>
                </div>

                {/* Terminal Commands */}
                <div className="flex flex-col gap-1.5 rounded border border-[var(--line)] bg-[rgba(10,10,15,0.7)] p-2.5 font-mono text-[8px]">
                  {data.terminal.map((line) => (
                    <span
                      key={line}
                      className={
                        line.startsWith('$')
                          ? 'text-[var(--accent)] font-semibold'
                          : 'text-[var(--muted)] pl-2'
                      }
                    >
                      {line}
                    </span>
                  ))}
                </div>

                {/* Contact Telemetry */}
                <section>
                  <DossierSectionHeading badge="CHANNELS">CONTACT</DossierSectionHeading>
                  <div className="space-y-2">
                    {data.contact.map(([key, value]) => {
                      const Icon = getContactIcon(key);
                      return (
                        <div key={key} className="flex items-start gap-2.5">
                          <Icon className="h-3 w-3 mt-0.5 text-[var(--accent)] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-[7px] uppercase tracking-[0.14em] text-[var(--muted)]">
                              {key}
                            </div>
                            <a
                              href={toHref(value)}
                              target={toHref(value).startsWith('http') ? '_blank' : undefined}
                              rel={toHref(value).startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="break-all font-mono text-[9px] font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                            >
                              {value}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Education Orbit */}
                <section>
                  <DossierSectionHeading badge="01 — 02">EDUCATION</DossierSectionHeading>
                  <div className="space-y-3">
                    {data.education.map(([degree, institution, timeline], idx) => (
                      <div
                        key={degree}
                        className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.4)] p-2.5"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-mono text-[7.5px] text-[var(--accent)] font-bold">
                            // 0{idx + 1}
                          </span>
                          <span className="font-mono text-[7px] text-[var(--muted)] uppercase">
                            {timeline}
                          </span>
                        </div>
                        <b className="mt-1 block font-mono text-[10px] font-bold text-[var(--text)]">
                          {institution}
                        </b>
                        <span className="block text-[9px] text-[var(--muted)]">{degree}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills Toolkit */}
                <section>
                  <DossierSectionHeading badge="STACK">ENGINEERING TOOLKIT</DossierSectionHeading>
                  <div className="space-y-3">
                    {data.skills.map(([category, items]) => (
                      <div key={category}>
                        <div className="mb-1.5 font-mono text-[7.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                          {category}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {items.map((skill) => (
                            <span
                              key={skill}
                              className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-2 py-0.5 font-mono text-[8px] font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Certifications */}
                <section>
                  <DossierSectionHeading badge="TRAINING">CERTIFICATIONS</DossierSectionHeading>
                  <ul className="space-y-1.5 text-[8.5px] text-[var(--muted)]">
                    {data.certifications.map((certification) => (
                      <li key={certification} className="flex gap-2 items-start">
                        <Award className="h-3 w-3 mt-0.5 text-[var(--accent)] shrink-0" />
                        <span>{certification}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Languages */}
                <section>
                  <DossierSectionHeading badge="COMMUNICATION">LANGUAGES</DossierSectionHeading>
                  <div className="space-y-1">
                    {data.languages.map(([language, level]) => (
                      <div
                        key={language}
                        className="flex items-baseline justify-between gap-2 font-mono text-[8.5px]"
                      >
                        <span className="font-semibold text-[var(--text)]">{language}</span>
                        <span className="text-[var(--muted)]">{level}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Coursework */}
                <section>
                  <DossierSectionHeading badge="CURRICULUM">CORE COURSEWORK</DossierSectionHeading>
                  <ul className="space-y-1 text-[8px] text-[var(--muted)]">
                    {data.coursework.map((course) => (
                      <li key={course} className="flex gap-1.5 items-center">
                        <span className="h-1 w-1 rounded-full bg-[var(--accent)] shrink-0" />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>

              {/* ── Right Main: Field Experience & Mission Log ── */}
              <div className="resume-dossier-main flex flex-col gap-7">
                <header className="border-b border-[var(--line)] pb-5">
                  <p className="orbital-eyebrow text-[var(--accent)]">
                    ENGINEERING MANIFEST // MISSION SUMMARY
                  </p>
                  <h2 className="display mt-2 text-[clamp(26px,4vw,40px)] leading-[0.98] text-[var(--text)]">
                    {data.title}
                  </h2>
                </header>

                {/* Executive Summary */}
                <section>
                  <DossierSectionHeading badge="ORIENTATION">EXECUTIVE SUMMARY</DossierSectionHeading>
                  <p className="font-sans text-[11px] sm:text-[12px] leading-relaxed text-[rgba(255,255,255,0.85)]">
                    {data.summary}
                  </p>
                </section>

                {/* Experience & Leadership */}
                <section>
                  <DossierSectionHeading badge="CHRONOLOGY">
                    EXPERIENCE &amp; LEADERSHIP
                  </DossierSectionHeading>
                  <div className="mt-3 space-y-5">
                    {data.experience.map((experience) => (
                      <div
                        key={`${experience.role}-${experience.org}`}
                        className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-4 transition-colors hover:border-[rgba(215,255,0,0.35)]"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <b className="font-mono text-[12px] font-bold text-[var(--accent)]">
                            {experience.role}
                          </b>
                          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--muted)]">
                            {experience.place}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] font-semibold text-[var(--text)]">
                          {experience.org}
                        </p>
                        <ul className="mt-2.5 space-y-1.5 text-[10px] leading-relaxed text-[var(--muted)]">
                          {experience.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2.5 items-start">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Competitive Problem Solving & Proof Metrics */}
                <section>
                  <DossierSectionHeading badge="VERIFIABLE SIGNALS">
                    COMPETITIVE PROBLEM SOLVING
                  </DossierSectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://leetcode.com/u/BezaleelPaulN/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3 transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="flex justify-between items-center text-[var(--muted)] font-mono text-[8px]">
                        <span>LEETCODE</span>
                        <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" />
                      </div>
                      <strong className="display mt-1 block text-3xl text-[var(--accent)]">135</strong>
                      <span className="font-mono text-[8px] text-[var(--muted)]">
                        116 Easy · 17 Med · 2 Hard
                      </span>
                    </a>

                    <a
                      href="https://codeforces.com/profile/BezaleelPaulN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3 transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="flex justify-between items-center text-[var(--muted)] font-mono text-[8px]">
                        <span>CODEFORCES</span>
                        <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" />
                      </div>
                      <strong className="display mt-1 block text-3xl text-[var(--accent)]">959</strong>
                      <span className="font-mono text-[8px] text-[var(--muted)]">
                        Continuous rated practice
                      </span>
                    </a>

                    <a
                      href="https://github.com/BezaleelPaul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-[var(--line)] bg-[rgba(10,10,15,0.45)] p-3 transition-colors hover:border-[var(--accent)]"
                    >
                      <div className="flex justify-between items-center text-[var(--muted)] font-mono text-[8px]">
                        <span>GITHUB</span>
                        <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" />
                      </div>
                      <strong className="display mt-1 block text-3xl text-[var(--accent)]">34</strong>
                      <span className="font-mono text-[8px] text-[var(--muted)]">
                        Public repositories &amp; CI
                      </span>
                    </a>
                  </div>
                </section>

                {/* Software Archive QR Signal */}
                <section>
                  <DossierSectionHeading badge="SIGNAL ARCHIVE">
                    PROJECT ARCHIVE &amp; SOURCE REPOSITORIES
                  </DossierSectionHeading>
                  <a
                    href={data.projectsQR.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col sm:flex-row items-center gap-5 rounded border border-[var(--line)] bg-[rgba(10,10,15,0.6)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[rgba(16,16,22,0.8)]"
                  >
                    <div className="shrink-0 rounded bg-white p-2.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      <QRCodeSvg className="h-20 w-20 text-black" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <b className="font-mono text-[12px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                          {data.projectsQR.label}
                        </b>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <span className="mt-1 block font-mono text-[10px] font-semibold text-[var(--accent)]">
                        {data.projectsQR.display}
                      </span>
                      {data.projectsQR.note && (
                        <p className="mt-1.5 font-sans text-[10px] leading-relaxed text-[var(--muted)]">
                          {data.projectsQR.note}
                        </p>
                      )}
                    </div>
                  </a>
                </section>

                {/* Dossier Bottom Mark */}
                <footer className="mt-auto border-t border-[var(--line)] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span>BEZALEEL PAUL N. // BUILD WITH INTENT</span>
                  <span className="text-[var(--accent)]">
                    END OF TRANSMISSION // ALL SIGNALS VERIFIED
                  </span>
                </footer>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* JSON Modal */}
      {showJsonModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md print:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-json-title"
          onClick={() => setShowJsonModal(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-[var(--accent)]" />
                <h3 id="resume-json-title" className="font-mono text-sm font-bold text-[var(--text)]">
                  Resume Data Manifest (resume.json)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="rounded p-1 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <pre className="max-h-[60vh] overflow-auto rounded border border-[var(--line)] bg-[var(--bg)] p-4 font-mono text-xs leading-relaxed text-[var(--text)]">
              {JSON.stringify(data, null, 2)}
            </pre>

            <div className="flex justify-between items-center pt-2">
              <span className="font-mono text-[9px] text-[var(--muted)]">
                SOURCE: /src/data/resume.json
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="action-button primary !min-h-[38px] !px-4"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'COPIED TO CLIPBOARD' : 'COPY JSON'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
