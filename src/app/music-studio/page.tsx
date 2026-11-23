'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AudioLines, Guitar, Headphones, Music2, SlidersHorizontal, Upload, Waves } from 'lucide-react';
import Link from 'next/link';
import './music-studio.css';

export default function MusicStudioPage() {
  const [audioUrl, setAudioUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [activeLane, setActiveLane] = useState('all');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith('audio/')) return;
    setAudioUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  };

  const lanes = [
    { id: 'electric', title: 'Electric guitar', detail: 'Riffs · leads · tone experiments', icon: Guitar, number: '01' },
    { id: 'acoustic', title: 'Acoustic guitar', detail: 'Fingerstyle · progressions · covers', icon: Music2, number: '02' },
    { id: 'production', title: 'Production', detail: 'Original compositions · beats · scores', icon: AudioLines, number: '03' },
    { id: 'post', title: 'Post-production', detail: 'Raw vs processed · mix decisions · mastering', icon: SlidersHorizontal, number: '04' },
  ];

  return (
    <main className="studio-page">
      <div className="studio-topbar">
        <Link href="/" className="studio-back"><ArrowLeft size={16} /> Back to portfolio</Link>
        <span className="studio-status"><span /> PERSONAL AUDIO ARCHIVE / 001</span>
      </div>

      <section className="studio-hero">
        <p className="studio-kicker">OFF THE CLOCK / ON THE FREQUENCY</p>
        <h1>THE<br /><span>SOUND</span> ROOM<span className="studio-period">.</span></h1>
        <div className="studio-intro">
          <p>A space for guitar recordings, musical ideas and the craft behind the sound. Separate from the code, but built with the same curiosity.</p>
          <span className="studio-index">AUDIO / VISUAL JOURNAL<br />EST. 2026</span>
        </div>
        <div className="studio-rule"><span>LISTEN CLOSELY</span><span>01 — 04</span></div>
      </section>

      <section className="studio-releases" aria-labelledby="studio-releases-title">
        <div className="studio-section-head studio-releases-head">
          <div><p className="studio-kicker">MELODIC SANCTUM / THE CHANNEL</p><h2 id="studio-releases-title">The most-played frequencies.</h2></div>
          <a className="studio-channel-link" href="https://youtube.com/@melodicsanctum" target="_blank" rel="noreferrer">VISIT THE CHANNEL ↗</a>
        </div>
        <p className="studio-releases-intro">A selection of the channel’s five most-viewed releases, ranked by lifetime views. Tap any cover to listen on YouTube.</p>
        <div className="studio-featured-release">
          <a className="studio-featured-art" href="https://www.youtube.com/watch?v=XH3-JvBUtcE" target="_blank" rel="noreferrer" aria-label="Listen to 10,000 Reasons metal cover on YouTube">
            <img src="https://i.ytimg.com/vi/XH3-JvBUtcE/hqdefault.jpg" alt="10,000 Reasons metal cover video thumbnail" loading="lazy" />
            <span className="studio-play-mark">▶</span>
          </a>
          <div className="studio-featured-copy">
            <span className="studio-featured-rank">01 / MOST VIEWED RELEASE</span>
            <h3>10,000 Reasons</h3>
            <p>Metal Cover of Bless the Lord, Oh My Soul</p>
            <div className="studio-release-metrics"><span>556 VIEWS</span><span>8H 20M WATCH TIME</span><span>0:54 AVG. VIEW</span></div>
            <a href="https://www.youtube.com/watch?v=XH3-JvBUtcE" target="_blank" rel="noreferrer" className="studio-listen-link">LISTEN TO THE RELEASE ↗</a>
          </div>
        </div>
        <div className="studio-release-grid">
          <article className="studio-release-card">
            <a href="https://www.youtube.com/watch?v=TgFkFfM2Fpc" target="_blank" rel="noreferrer" aria-label="Listen to Echoes of the Wild West on YouTube"><img src="https://i.ytimg.com/vi/TgFkFfM2Fpc/hqdefault.jpg" alt="Echoes of the Wild West video thumbnail" loading="lazy" /><span>02</span></a>
            <h3>Echoes of the Wild West</h3><p>144 views · 1h 02m watch time</p>
          </article>
          <article className="studio-release-card">
            <a href="https://www.youtube.com/watch?v=nGXxcG_KQow" target="_blank" rel="noreferrer" aria-label="Listen to LoFi Worship: Peace in Jerusalem on YouTube"><img src="https://i.ytimg.com/vi/nGXxcG_KQow/hqdefault.jpg" alt="LoFi Worship Peace in Jerusalem video thumbnail" loading="lazy" /><span>03</span></a>
            <h3>LoFi Worship — Peace in Jerusalem</h3><p>124 views · 55m watch time</p>
          </article>
          <article className="studio-release-card">
            <a href="https://www.youtube.com/watch?v=C5tUH-B8Bwo" target="_blank" rel="noreferrer" aria-label="Listen to Neon Eclipse on YouTube"><img src="https://i.ytimg.com/vi/C5tUH-B8Bwo/hqdefault.jpg" alt="Neon Eclipse video thumbnail" loading="lazy" /><span>04</span></a>
            <h3>Neon Eclipse</h3><p>118 views · 1h 22m watch time</p>
          </article>
          <article className="studio-release-card">
            <a href="https://www.youtube.com/watch?v=Bm0WmvoHzGE" target="_blank" rel="noreferrer" aria-label="Listen to Echoes of the Storm on YouTube"><img src="https://i.ytimg.com/vi/Bm0WmvoHzGE/hqdefault.jpg" alt="Echoes of the Storm video thumbnail" loading="lazy" /><span>05</span></a>
            <h3>Echoes of the Storm</h3><p>106 views · 1h 17m watch time</p>
          </article>
        </div>
        <p className="studio-metrics-note">Channel analytics supplied by the creator · lifetime views · snapshot provided November 2026</p>
      </section>

      <section className="studio-player" aria-labelledby="studio-player-title">
        <div className="studio-player-heading">
          <div><p className="studio-kicker">LISTENING DECK / LOCAL PREVIEW</p><h2 id="studio-player-title">Your listening session</h2></div>
          <Headphones size={26} strokeWidth={1.2} />
        </div>
        <div className="studio-player-body">
          <div className="studio-disc" aria-hidden="true"><div><Waves size={32} /></div></div>
          <div className="studio-audio-controls">
            <p className="studio-track-label">CURRENT FILE</p>
            <h3>{fileName || 'No recording loaded yet'}</h3>
            <p className="studio-muted">{fileName ? 'Playing from your device — nothing is uploaded.' : 'Choose an audio file to preview it here. Your file stays in this browser session.'}</p>
            {audioUrl ? <audio controls preload="metadata" src={audioUrl} className="studio-audio" /> : <button className="studio-upload" type="button" onClick={() => fileInput.current?.click()}><Upload size={17} /> Load a recording</button>}
            <input ref={fileInput} className="studio-file-input" type="file" accept="audio/*" aria-label="Choose an audio recording" onChange={(event) => handleFile(event.target.files?.[0])} />
            {audioUrl && <button className="studio-change-file" type="button" onClick={() => fileInput.current?.click()}>Choose another file</button>}
          </div>
        </div>
        <p className="studio-privacy">LOCAL PREVIEW ONLY <span>·</span> NO FILES ARE SENT TO A SERVER</p>
      </section>

      <section className="studio-lanes" aria-labelledby="studio-lanes-title">
        <div className="studio-section-head"><div><p className="studio-kicker">THE COLLECTION</p><h2 id="studio-lanes-title">Four ways into sound.</h2></div><p>Choose a lane to explore. Recordings and production breakdowns will appear here as they are added.</p></div>
        <div className="studio-filter" role="group" aria-label="Filter music categories">
          {['all', 'electric', 'acoustic', 'production', 'post'].map((lane) => <button key={lane} type="button" aria-pressed={activeLane === lane} onClick={() => setActiveLane(lane)}>{lane === 'all' ? 'All' : lane === 'post' ? 'Post-production' : lane}</button>)}
        </div>
        <div className="studio-lane-grid">
          {lanes.filter((lane) => activeLane === 'all' || lane.id === activeLane).map((lane) => {
            const Icon = lane.icon;
            return <article className="studio-lane" key={lane.id}><div className="studio-lane-top"><span>{lane.number} / 04</span><Icon size={25} strokeWidth={1.3} /></div><h3>{lane.title}</h3><p>{lane.detail}</p><span className="studio-coming">RECORDINGS TO BE ADDED</span></article>;
          })}
        </div>
      </section>

      <section className="studio-process" aria-labelledby="studio-process-title">
        <div><p className="studio-kicker">THE WORKFLOW / 05</p><h2 id="studio-process-title">Behind the<br /><span className="studio-process-accent">Sound.</span></h2><p className="studio-process-subtitle">Physical roots. Digital finish.</p></div>
        <p>The sound starts in the physical world: playing electric and acoustic guitar, shaping performances and capturing real instruments. Then it moves into the digital studio for arranging, editing, tone design, mixing and final processing. It is a hands-on and in-the-box workflow — not one or the other.</p>
      </section>

      <section className="studio-workflow" aria-label="Physical and digital music workflow">
        <article className="studio-workflow-card">
          <span className="studio-workflow-number">01 / THE PHYSICAL SIDE</span>
          <h3>Play. Capture. Perform.</h3>
          <p>Guitars, hands-on playing, recorded takes and the small details of performance that give a track its character.</p>
          <div className="studio-workflow-tags"><span>Electric guitar</span><span>Acoustic guitar</span><span>Recorded performances</span></div>
        </article>
        <article className="studio-workflow-card studio-workflow-digital">
          <span className="studio-workflow-number">02 / THE DIGITAL SIDE</span>
          <h3>Arrange. Shape. Refine.</h3>
          <p>Digital audio workstations and VST plugins bring the recordings together — from virtual instruments and amp tones to effects, mixing and post-production.</p>
          <div className="studio-daw-list" aria-label="Digital audio workstations used">
            <span>LMMS</span><span>Tracktion Waveform</span><span>REAPER</span>
          </div>
          <p className="studio-vst-note">VST PLUGINS / INSTRUMENTS · EFFECTS · TONE DESIGN · MIXING</p>
        </article>
      </section>

      <footer className="studio-footer"><span>BP / SOUND ROOM</span><Link href="/">RETURN TO ORBIT <span aria-hidden="true">↗</span></Link><span>MADE BETWEEN TAKES.</span></footer>
    </main>
  );
}
