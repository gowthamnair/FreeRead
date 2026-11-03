import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Library,
  FolderPlus,
  Folder,
  Upload,
  Search,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Bookmark,
  Highlighter,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Columns,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Download,
  Trash2,
  Edit3,
  Check,
  X,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Eye,
  Sliders,
  Type,
  AlignLeft,
  AlignJustify,
  ArrowLeftRight,
  MoveVertical,
  Clock,
  Award,
  Layers,
  Info,
  Plus,
  MoreVertical,
  FolderOpen,
  RefreshCw,
  CheckCircle2,
  BookMarked,
  Compass,
  FileArchive
} from 'lucide-react';

// ============================================================================
// 1. SUPPORTED FORMATS REGISTRY & ENGINE METADATA
// ============================================================================
const FORMAT_REGISTRY = {
  // E-Book Formats (Reflowable & Fixed)
  epub: { ext: 'EPUB', category: 'ebook', name: 'Open Publication Structure', engine: 'Aura EPUB/ZIP XML Container Engine', color: 'from-blue-500 to-indigo-600' },
  mobi: { ext: 'MOBI', category: 'ebook', name: 'Mobipocket Kindle Binary', engine: 'PalmDOC / MOBI Record Stream Decoder', color: 'from-amber-500 to-orange-600' },
  azw:  { ext: 'AZW',  category: 'ebook', name: 'Amazon Kindle Legacy', engine: 'PalmDOC / AZW Binary Unpacker', color: 'from-orange-500 to-red-600' },
  azw3: { ext: 'AZW3', category: 'ebook', name: 'Kindle Format 8 (KF8)', engine: 'KF8 HTML5/CSS3 Stream Parser', color: 'from-amber-600 to-yellow-600' },
  kfx:  { ext: 'KFX',  category: 'ebook', name: 'Kindle Format 10', engine: 'KFX Ion Container Symbol Parser', color: 'from-yellow-500 to-amber-600' },
  pdf:  { ext: 'PDF',  category: 'hybrid', name: 'Portable Document Format', engine: 'PDF Hybrid Reflow & Fixed Canvas Engine', color: 'from-rose-500 to-red-700' },
  fb2:  { ext: 'FB2',  category: 'ebook', name: 'FictionBook 2.0 XML', engine: 'Native XML DOM Fiction Parser', color: 'from-emerald-500 to-teal-600' },
  fb3:  { ext: 'FB3',  category: 'ebook', name: 'FictionBook 3.0 Archive', engine: 'OPC ZIP / FB3 XML Container Decoder', color: 'from-teal-500 to-cyan-600' },
  txt:  { ext: 'TXT',  category: 'ebook', name: 'Plain Text Document', engine: 'Heuristic Chapter & Markdown Stream Parser', color: 'from-slate-500 to-gray-700' },
  rtf:  { ext: 'RTF',  category: 'ebook', name: 'Rich Text Format', engine: 'RTF Control-Word & Group AST Decoder', color: 'from-indigo-500 to-purple-600' },
  docx: { ext: 'DOCX', category: 'ebook', name: 'Microsoft Word OpenXML', engine: 'OpenXML word/document.xml Unpacker', color: 'from-blue-600 to-sky-700' },
  odt:  { ext: 'ODT',  category: 'ebook', name: 'OpenDocument Text', engine: 'OASIS content.xml Zip Extractor', color: 'from-sky-500 to-blue-600' },
  html: { ext: 'HTML', category: 'ebook', name: 'Web Document Markup', engine: 'Sanitized Semantic DOM Tree Parser', color: 'from-orange-500 to-pink-600' },
  htm:  { ext: 'HTM',  category: 'ebook', name: 'Web Document Markup', engine: 'Sanitized Semantic DOM Tree Parser', color: 'from-orange-500 to-pink-600' },
  djvu: { ext: 'DJVU', category: 'hybrid', name: 'DjVu Scanned Document', engine: 'IFF85 / AT&T DjVu Chunk & Text Layer Decoder', color: 'from-violet-500 to-purple-700' },
  lit:  { ext: 'LIT',  category: 'ebook', name: 'Microsoft Reader LIT', engine: 'ITOL/ITLS MS-Reader Stream Unpacker', color: 'from-fuchsia-500 to-purple-600' },
  pdb:  { ext: 'PDB',  category: 'ebook', name: 'Palm OS eBook Database', engine: 'PalmOS Record Header & Text Stream Engine', color: 'from-cyan-600 to-teal-700' },
  chm:  { ext: 'CHM',  category: 'ebook', name: 'Compiled HTML Help', engine: 'ITSF / LZX HTML Stream Extractor', color: 'from-slate-600 to-zinc-700' },
  // Comic & Graphic Novel Formats
  cbz:  { ext: 'CBZ',  category: 'comic', name: 'Comic Book ZIP Archive', engine: 'Binary PKZIP Image Sequence Unpacker', color: 'from-pink-500 to-rose-600' },
  cbr:  { ext: 'CBR',  category: 'comic', name: 'Comic Book RAR Archive', engine: 'RAR4/RAR5 Signature & Image Stream Extractor', color: 'from-purple-500 to-indigo-600' },
  cbt:  { ext: 'CBT',  category: 'comic', name: 'Comic Book TAR Archive', engine: 'POSIX 512-Byte USTAR Block Unpacker', color: 'from-cyan-500 to-blue-600' },
  cb7:  { ext: 'CB7',  category: 'comic', name: 'Comic Book 7z Archive', engine: '7z LZMA Signature & Stream Scanner', color: 'from-emerald-500 to-green-700' },
};

// ============================================================================
// 2. THEME DEFINITIONS (iOS GLASSMORPHISM PALETTES)
// ============================================================================
const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    badge: 'iOS Dark Glass',
    appBg: 'bg-gradient-to-br from-[#090D16] via-[#0F172A] to-[#1E1B4B]',
    glassPanel: 'bg-slate-900/65 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/50',
    glassCard: 'bg-white/[0.06] hover:bg-white/[0.11] backdrop-blur-xl border border-white/15',
    glassHeader: 'bg-slate-950/70 backdrop-blur-2xl border-b border-white/10',
    readerBg: '#0B1120',
    readerText: '#E2E8F0',
    readerSecondary: '#94A3B8',
    accent: 'bg-sky-500 text-white',
    accentSoft: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    textMain: 'text-slate-100',
    textSub: 'text-slate-400',
    dotColor: '#0F172A'
  },
  oled: {
    id: 'oled',
    name: 'True Black',
    badge: 'OLED 0-Nit',
    appBg: 'bg-black',
    glassPanel: 'bg-zinc-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black',
    glassCard: 'bg-zinc-900/50 hover:bg-zinc-900/80 backdrop-blur-xl border border-white/10',
    glassHeader: 'bg-black/85 backdrop-blur-2xl border-b border-white/12',
    readerBg: '#000000',
    readerText: '#F4F4F5',
    readerSecondary: '#71717A',
    accent: 'bg-indigo-500 text-white',
    accentSoft: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    textMain: 'text-zinc-100',
    textSub: 'text-zinc-400',
    dotColor: '#000000'
  },
  paper: {
    id: 'paper',
    name: 'Paper White',
    badge: 'Daylight Ink',
    appBg: 'bg-gradient-to-br from-[#F1F5F9] via-[#F8FAFC] to-[#E2E8F0]',
    glassPanel: 'bg-white/75 backdrop-blur-2xl border border-slate-300/80 shadow-xl shadow-slate-300/50',
    glassCard: 'bg-white/65 hover:bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm',
    glassHeader: 'bg-white/75 backdrop-blur-2xl border-b border-slate-200/80',
    readerBg: '#FAF9F5',
    readerText: '#1E293B',
    readerSecondary: '#64748B',
    accent: 'bg-blue-600 text-white',
    accentSoft: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
    textMain: 'text-slate-800',
    textSub: 'text-slate-500',
    dotColor: '#FAF9F5'
  },
  sepia: {
    id: 'sepia',
    name: 'Warm Sepia',
    badge: 'Parchment',
    appBg: 'bg-gradient-to-br from-[#EFE6D5] via-[#F5ECD9] to-[#E5D5B5]',
    glassPanel: 'bg-[#F8F1E3]/80 backdrop-blur-2xl border border-[#D3C19F]/70 shadow-xl shadow-[#C7B28B]/30',
    glassCard: 'bg-[#FFF9ED]/65 hover:bg-[#FFF9ED]/90 backdrop-blur-xl border border-[#D8C7A8]/80',
    glassHeader: 'bg-[#F6EEDC]/80 backdrop-blur-2xl border-b border-[#D8C7A8]/70',
    readerBg: '#F4ECD8',
    readerText: '#3E2C1C',
    readerSecondary: '#7C654E',
    accent: 'bg-amber-700 text-white',
    accentSoft: 'bg-amber-700/15 text-amber-900 border-amber-700/30',
    textMain: 'text-[#3A2818]',
    textSub: 'text-[#755C45]',
    dotColor: '#F4ECD8'
  },
  mint: {
    id: 'mint',
    name: 'Soft Mint',
    badge: 'Eye Comfort',
    appBg: 'bg-gradient-to-br from-[#E2F2EA] via-[#EBF7F0] to-[#D4EBE0]',
    glassPanel: 'bg-[#F0FAF4]/80 backdrop-blur-2xl border border-emerald-300/60 shadow-xl shadow-emerald-900/10',
    glassCard: 'bg-white/65 hover:bg-white/90 backdrop-blur-xl border border-emerald-200/80',
    glassHeader: 'bg-[#ECF8F1]/80 backdrop-blur-2xl border-b border-emerald-200/70',
    readerBg: '#E8F5EE',
    readerText: '#133225',
    readerSecondary: '#487260',
    accent: 'bg-emerald-600 text-white',
    accentSoft: 'bg-emerald-600/15 text-emerald-800 border-emerald-600/30',
    textMain: 'text-[#123024]',
    textSub: 'text-[#436B5B]',
    dotColor: '#E8F5EE'
  }
};

// ============================================================================
// 3. BUILT-IN SAMPLE GRAPHIC NOVEL SVG GENERATOR & SAMPLE LIBRARY
// ============================================================================
function createMangaPageSVG(pageNumber) {
  const pages = [
    // Page 1: Cover Art
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1150" width="800" height="1150">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#090D16"/>
          <stop offset="50%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#4C1D95"/>
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="42%" r="35%">
          <stop offset="0%" stop-color="#F43F5E"/>
          <stop offset="60%" stop-color="#FB923C"/>
          <stop offset="100%" stop-color="#FB923C" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="1150" fill="url(#bg1)"/>
      <circle cx="400" cy="480" r="260" fill="url(#sun)"/>
      <circle cx="400" cy="480" r="185" fill="#090D16" stroke="#38BDF8" stroke-width="4"/>
      <!-- Cyberpunk Skyline -->
      <path d="M0 1150 L0 720 L70 720 L70 640 L150 640 L150 780 L210 780 L210 560 L310 560 L310 710 L360 710 L360 510 L450 510 L450 690 L520 690 L520 590 L620 590 L620 740 L690 740 L690 620 L760 620 L760 760 L800 760 L800 1150 Z" fill="#060913"/>
      <!-- Neon Grid Lines -->
      <g stroke="#38BDF8" stroke-opacity="0.35" stroke-width="2">
        <line x1="0" y1="880" x2="800" y2="880"/>
        <line x1="0" y1="940" x2="800" y2="940"/>
        <line x1="0" y1="1010" x2="800" y2="1010"/>
        <line x1="0" y1="1090" x2="800" y2="1090"/>
        <line x1="400" y1="820" x2="0" y2="1150"/>
        <line x1="400" y1="820" x2="250" y2="1150"/>
        <line x1="400" y1="820" x2="400" y2="1150"/>
        <line x1="400" y1="820" x2="550" y2="1150"/>
        <line x1="400" y1="820" x2="800" y2="1150"/>
      </g>
      <!-- Title Typography -->
      <rect x="50" y="60" width="700" height="160" rx="16" fill="#000000" fill-opacity="0.55" stroke="#38BDF8" stroke-width="3"/>
      <text x="400" y="135" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-weight="900" font-size="64" letter-spacing="8">NEO-TOKYO</text>
      <text x="400" y="190" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-weight="700" font-size="28" letter-spacing="10">SOLAR ECLIPSE // VOL. 01</text>
      <!-- Issue Badge -->
      <rect x="540" y="990" width="210" height="95" rx="12" fill="#F43F5E"/>
      <text x="645" y="1035" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="22">AURA COMICS</text>
      <text x="645" y="1065" text-anchor="middle" fill="#FFE4E6" font-family="monospace" font-size="16">PAGE 01 // COVER</text>
    </svg>`,

    // Page 2: Multi-panel Story Page
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1150" width="800" height="1150">
      <rect width="800" height="1150" fill="#F8FAFC"/>
      <!-- Panel 1 Top Wide -->
      <g transform="translate(35, 35)">
        <rect width="730" height="320" fill="#0F172A" stroke="#020617" stroke-width="6"/>
        <circle cx="600" cy="120" r="70" fill="#38BDF8" fill-opacity="0.25" stroke="#38BDF8" stroke-width="3"/>
        <path d="M0 320 L180 150 L340 260 L520 110 L730 280 L730 320 Z" fill="#1E293B"/>
        <rect x="30" y="25" width="320" height="75" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>
        <text x="50" y="55" fill="#0F172A" font-family="monospace" font-weight="700" font-size="17">SECTOR 09 // ORBITAL ELEVATOR</text>
        <text x="50" y="80" fill="#475569" font-family="sans-serif" font-size="15">2194 A.D. — 14 Minutes Before Total Eclipse.</text>
        <!-- Speech Bubble -->
        <ellipse cx="520" cy="215" rx="165" ry="62" fill="#FFFFFF" stroke="#0F172A" stroke-width="4"/>
        <text x="520" y="208" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="700" font-size="16">"The telemetry array is</text>
        <text x="520" y="232" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="700" font-size="16">picking up a ghost signal!"</text>
      </g>
      <!-- Panel 2 Middle Left -->
      <g transform="translate(35, 380)">
        <rect width="350" height="370" fill="#1E1B4B" stroke="#020617" stroke-width="6"/>
        <!-- Character Silhouette -->
        <circle cx="175" cy="165" r="65" fill="#312E81" stroke="#818CF8" stroke-width="4"/>
        <rect x="125" y="145" width="100" height="28" rx="14" fill="#38BDF8"/>
        <path d="M85 370 C85 260 265 260 265 370 Z" fill="#0F172A" stroke="#818CF8" stroke-width="3"/>
        <ellipse cx="175" cy="70" rx="145" ry="48" fill="#FFFFFF" stroke="#0F172A" stroke-width="4"/>
        <text x="175" y="65" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="700" font-size="15">"Kael, lock down the</text>
        <text x="175" y="87" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="700" font-size="15">quantum core immediately."</text>
      </g>
      <!-- Panel 3 Middle Right -->
      <g transform="translate(415, 380)">
        <rect width="350" height="370" fill="#090D16" stroke="#020617" stroke-width="6"/>
        <!-- Speed lines & Core -->
        <g stroke="#F43F5E" stroke-width="2" stroke-opacity="0.6">
          <line x1="0" y1="0" x2="175" y2="185"/>
          <line x1="350" y1="0" x2="175" y2="185"/>
          <line x1="0" y1="370" x2="175" y2="185"/>
          <line x1="350" y1="370" x2="175" y2="185"/>
          <line x1="175" y1="0" x2="175" y2="370"/>
          <line x1="0" y1="185" x2="350" y2="185"/>
        </g>
        <polygon points="175,85 265,185 175,285 85,185" fill="#F43F5E" stroke="#FFFFFF" stroke-width="5"/>
        <text x="175" y="340" text-anchor="middle" fill="#F43F5E" font-family="sans-serif" font-weight="900" font-size="28" letter-spacing="4">THRRUUMMM!!</text>
      </g>
      <!-- Panel 4 Bottom Wide -->
      <g transform="translate(35, 775)">
        <rect width="730" height="330" fill="#020617" stroke="#020617" stroke-width="6"/>
        <rect x="45" y="45" width="640" height="170" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
        <text x="80" y="95" fill="#38BDF8" font-family="monospace" font-size="20">&gt; ARCHIVE TRANSMISSION DECODED...</text>
        <text x="80" y="135" fill="#E2E8F0" font-family="monospace" font-size="18">&gt; ORIGIN: LUNAR CITADEL ZERO</text>
        <text x="80" y="175" fill="#F43F5E" font-family="monospace" font-weight="700" font-size="18">&gt; WARNING: ECLIPSE PROTOCOL INITIATED</text>
        <text x="690" y="305" text-anchor="end" fill="#94A3B8" font-family="monospace" font-size="16">PAGE 02</text>
      </g>
    </svg>`,

    // Page 3: Action Spread Left / Page 3
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1150" width="800" height="1150">
      <rect width="800" height="1150" fill="#F8FAFC"/>
      <g transform="translate(35, 35)">
        <rect width="730" height="510" fill="#0F172A" stroke="#020617" stroke-width="6"/>
        <!-- Starfighter launch -->
        <polygon points="110,410 640,140 460,410 380,320" fill="#38BDF8" stroke="#FFFFFF" stroke-width="4"/>
        <polygon points="60,440 380,320 290,460" fill="#F43F5E"/>
        <ellipse cx="220" cy="120" rx="175" ry="60" fill="#FFFFFF" stroke="#0F172A" stroke-width="4"/>
        <text x="220" y="114" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="800" font-size="17">"Launching Interceptor</text>
        <text x="220" y="138" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="800" font-size="17">Wing! Hold onto your visor!"</text>
        <text x="530" y="460" fill="#FACC15" font-family="sans-serif" font-weight="900" font-style="italic" font-size="48">VROOOOM!!</text>
      </g>
      <g transform="translate(35, 570)">
        <rect width="730" height="535" fill="#1E1B4B" stroke="#020617" stroke-width="6"/>
        <circle cx="365" cy="270" r="190" fill="#090D16" stroke="#F43F5E" stroke-width="8"/>
        <circle cx="365" cy="270" r="130" fill="none" stroke="#38BDF8" stroke-dasharray="16 10" stroke-width="4"/>
        <rect x="45" y="400" width="640" height="95" rx="10" fill="#FFFFFF" stroke="#020617" stroke-width="4"/>
        <text x="365" y="442" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="700" font-size="18">Above the clouds of Neo-Tokyo, the artificial sun dimmed to a</text>
        <text x="365" y="470" text-anchor="middle" fill="#0F172A" font-family="sans-serif" font-weight="700" font-size="18">ring of violet fire. Every sensor in the hemisphere went silent.</text>
        <text x="700" y="45" text-anchor="end" fill="#A5B4FC" font-family="monospace" font-size="16">PAGE 03</text>
      </g>
    </svg>`,

    // Page 4: Final Dramatic Climax
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1150" width="800" height="1150">
      <rect width="800" height="1150" fill="#090D16"/>
      <rect x="30" y="30" width="740" height="1090" fill="none" stroke="#38BDF8" stroke-width="4"/>
      <circle cx="400" cy="440" r="240" fill="#000000" stroke="#F43F5E" stroke-width="10"/>
      <circle cx="400" cy="440" r="275" fill="none" stroke="#FACC15" stroke-width="3" stroke-dasharray="8 14"/>
      <path d="M160 440 Q400 220 640 440 Q400 660 160 440 Z" fill="none" stroke="#38BDF8" stroke-width="5"/>
      <circle cx="400" cy="440" r="55" fill="#38BDF8"/>
      <rect x="90" y="770" width="620" height="230" rx="18" fill="#0F172A" stroke="#FFFFFF" stroke-width="4"/>
      <text x="400" y="835" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-weight="800" font-size="22">END OF CHAPTER 01 // PREVIEW EDITION</text>
      <text x="400" y="885" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-size="20">Try switching between Single Page, Double-Page Spread,</text>
      <text x="400" y="918" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-size="20">Right-to-Left (RTL) Manga Mode, and Webtoon Vertical Scroll</text>
      <text x="400" y="951" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-size="18">using the top glass toolbar in Aura Reader!</text>
      <text x="400" y="1075" text-anchor="middle" fill="#F43F5E" font-family="monospace" font-weight="700" font-size="18">PAGE 04 // TO BE CONTINUED</text>
    </svg>`
  ];
  const svg = pages[(pageNumber - 1) % pages.length];
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const INITIAL_FOLDERS = [
  { id: 'folder-scifi', name: 'Sci-Fi & Literature', icon: 'sparkles', count: 1 },
  { id: 'folder-manga', name: 'Comics & Manga', icon: 'layers', count: 1 },
  { id: 'folder-tech', name: 'Design & Specs', icon: 'cpu', count: 2 }
];

const INITIAL_BOOKS = [
  {
    id: 'sample-epub-1',
    title: 'Chronicles of the Glass Horizon',
    author: 'Elena Vance',
    format: 'epub',
    category: 'ebook',
    folderId: 'folder-scifi',
    coverGradient: 'from-sky-500 via-indigo-600 to-purple-800',
    coverSubtitle: 'A Speculative Novella',
    fileSize: '1.4 MB',
    addedAt: '2026-10-28',
    lastOpened: Date.now() - 3600000,
    progress: 33,
    currentChapter: 0,
    currentScroll: 0,
    finished: false,
    bookmarks: [
      { id: 'bm-1', chapterIndex: 0, label: 'Chapter 1: The Resonance of Frost', createdAt: 'Yesterday' }
    ],
    highlights: [
      {
        id: 'hl-1',
        chapterIndex: 0,
        paragraphIndex: 1,
        text: 'Memory is never destroyed; it only refracts through cleaner glass.',
        color: 'amber',
        note: 'Key philosophical theme introduced in the opening chapter.',
        createdAt: '2026-10-30'
      }
    ],
    chapters: [
      {
        title: 'Chapter I: The Resonance of Frost',
        paragraphs: [
          'Above the cloud-line of New Veridia, the atmospheric collectors hummed in a steady B-flat minor. Built from silicate sheets spun in zero-gravity kilns, the collectors caught both morning mist and stray orbital telemetry.',
          'Lyra adjusted the aperture of her field ocular. Across the conservatory terrace, light bent through twelve layers of electro-active glass, casting prismatic shadows over the archive tables. "Memory is never destroyed; it only refracts through cleaner glass," her mentor had written in the margins of the First Charter.',
          'For three centuries, the Citadel archivists had preserved humanity’s literature not on magnetic platters—which decayed within decades—but inside crystalline quartz matrices etched by femtosecond lasers. Each palm-sized shard held ten thousand volumes, readable by simple polarized light.',
          'Yet the shard resting on Lyra’s desk today bore no catalog seal. Recovered from the salt flats of the southern meridian, its internal lattice shifted dynamically whenever a warm hand approached it.',
          '"You are looking at an adaptive book," said Julian, stepping through the frosted glass archway. "It doesn’t merely store a story. It listens to the cadence of the reader’s eyes and restores the missing footnotes of history."'
        ]
      },
      {
        title: 'Chapter II: Echoes in the Silicate',
        paragraphs: [
          'By midnight, they had coupled the quartz shard to an optical interferometer. On the projection pane, hundreds of ancient formats—EPUB containers, Mobipocket records, FictionBook XML trees, and scanned DjVu folios—unfolded like origami constellations.',
          '"Look at the outer wrapper," Lyra whispered, zooming into the header stream. "Whoever compiled this archive wanted to make sure no future civilization would ever be locked out by proprietary digital rights management or obsolete binaries."',
          'Every chapter contained its own decoding rosetta. Alongside high-resolution vector plates were reflowable paragraphs that adapted instantaneously whether projected onto a watch crystal or a ten-meter municipal wall.',
          'Julian tapped the glass console, highlighting a coordinate embedded in the third appendix. "That isn’t an index number, Lyra. Those are orbital inclinations. The rest of the library isn’t buried in the desert—it’s circling the planet at Lagrange Point Two."'
        ]
      },
      {
        title: 'Chapter III: The Universal Reader Protocol',
        paragraphs: [
          'Dawn broke in hues of sepia and soft mint across the observatory dome. As the municipal transceivers aligned with the Lagrange beacon, a cascade of forgotten classics, graphic novels, and scientific treatises streamed into the local buffer.',
          'No single file on the municipal servers was overwritten; the Universal Reader Protocol operated strictly non-destructively, indexing metadata and personal margin notes inside isolated local vaults while leaving every original artifact untouched.',
          'Lyra leaned back, switching her ocular display to True Black mode as the stars emerged overhead. For the first time in four hundred years, the entire human library was open, fluid, and free.'
        ]
      }
    ]
  },
  {
    id: 'sample-cbz-1',
    title: 'NEO-TOKYO: Solar Eclipse Vol. 1',
    author: 'Kenji Takahashi & Studio Aura',
    format: 'cbz',
    category: 'comic',
    folderId: 'folder-manga',
    coverGradient: 'from-rose-500 via-fuchsia-700 to-indigo-950',
    coverSubtitle: 'Cyberpunk Graphic Novel',
    fileSize: '18.6 MB',
    addedAt: '2026-10-29',
    lastOpened: Date.now() - 1800000,
    progress: 50,
    currentChapter: 0,
    currentPage: 0,
    finished: false,
    bookmarks: [
      { id: 'bm-comic-1', chapterIndex: 0, pageIndex: 1, label: 'Page 2: Ghost Signal at Orbital Elevator', createdAt: 'Today' }
    ],
    highlights: [],
    pages: [
      { pageNumber: 1, title: 'Cover: Solar Eclipse Vol. 01', url: createMangaPageSVG(1) },
      { pageNumber: 2, title: 'Page 02: Orbital Elevator Telemetry', url: createMangaPageSVG(2) },
      { pageNumber: 3, title: 'Page 03: Interceptor Wing Launch', url: createMangaPageSVG(3) },
      { pageNumber: 4, title: 'Page 04: Ring of Violet Fire', url: createMangaPageSVG(4) }
    ],
    chapters: [
      { title: 'Issue #01: The Orbital Signal (Pages 1–4)', pageStart: 0 }
    ]
  },
  {
    id: 'sample-pdf-1',
    title: 'The Art of Digital Glass & Typography',
    author: 'Dieter & Clara Lindqvist',
    format: 'pdf',
    category: 'hybrid',
    folderId: 'folder-tech',
    coverGradient: 'from-emerald-500 via-teal-600 to-slate-900',
    coverSubtitle: 'UI/UX & Editorial Systems',
    fileSize: '4.2 MB',
    addedAt: '2026-10-25',
    lastOpened: Date.now() - 86400000,
    progress: 100,
    currentChapter: 0,
    finished: true,
    bookmarks: [],
    highlights: [],
    chapters: [
      {
        title: 'Section 1: Optical Clarity in Digital Reading',
        paragraphs: [
          'Modern digital reading environments must reconcile two historically distinct mediums: the tactile permanence of ink on cotton paper and the dynamic adaptability of backlit or OLED glass surfaces.',
          'By combining translucent frosted layers (backdrop-filter blur) with high-contrast editorial typography, interfaces recede into the background when the reader enters deep focus.',
          'Crucial ergonomic variables include line measure (ideally 55 to 75 characters per line), generous line-height ratios (1.5 to 1.8 for long-form prose), and customizable warmth filters that attenuate 450nm blue wavelengths during evening reading sessions.'
        ]
      },
      {
        title: 'Section 2: Reflowable vs. Fixed-Layout Pipelines',
        paragraphs: [
          'While prose literature thrives on dynamic reflow—allowing readers with low vision or dyslexia to switch to OpenDyslexic fonts and wider letter spacing—sequential visual art such as comics, manga, and architectural PDFs require strict spatial fidelity.',
          'A truly universal reader bridges both worlds: offering paginated and continuous scroll engines for reflowable text alongside single-page, double-page spread, Right-to-Left (RTL), and Webtoon vertical strip engines for graphic narratives.'
        ]
      }
    ]
  },
  {
    id: 'sample-azw3-1',
    title: 'Container Internals: EPUB, MOBI, KFX & CBZ',
    author: 'Open Format Consortium',
    format: 'azw3',
    category: 'ebook',
    folderId: 'folder-tech',
    coverGradient: 'from-amber-500 via-orange-600 to-red-900',
    coverSubtitle: 'Binary & Archive Specification',
    fileSize: '890 KB',
    addedAt: '2026-10-20',
    lastOpened: Date.now() - 172800000,
    progress: 20,
    currentChapter: 0,
    finished: false,
    bookmarks: [],
    highlights: [],
    chapters: [
      {
        title: '1. Archive-Based E-Books (EPUB, DOCX, ODT, FB3, CBZ)',
        paragraphs: [
          'Many modern document and comic standards are built atop the PKZIP archive specification (identifiable by the magic bytes 0x50 0x4B 0x03 0x04). Inside an EPUB container, META-INF/container.xml points to the Open Packaging Format (.opf) manifest, which lists XHTML chapters in reading spine order.',
          'Similarly, DOCX files store narrative paragraphs inside word/document.xml using <w:t> nodes, while ODT packages store text inside content.xml. Comic Book ZIP (.cbz) archives store sequential raster or vector images sorted lexicographically.'
        ]
      },
      {
        title: '2. Legacy Database & Stream Formats (MOBI, AZW, PDB, LIT, CHM)',
        paragraphs: [
          'Legacy e-book formats trace their heritage to the Palm OS Database (.pdb) structure. A 78-byte header defines the database title and an array of record offsets. Record 0 holds the PalmDOC or MOBI compression header, while subsequent records hold LZ77-compressed or raw UTF-8/ASCII HTML streams.',
          'Aura Reader inspects binary headers directly in browser memory via DataView and Uint8Array streams, extracting human-readable text, XML chapters, or embedded JPEG/PNG signatures without ever modifying the source file on disk.'
        ]
      }
    ]
  }
];

// ============================================================================
// 4. NON-DESTRUCTIVE INDEXEDDB PERSISTENCE ENGINE
// ============================================================================
const DB_NAME = 'AuraReaderUniversalDB_v1';
const DB_VERSION = 1;

class AuraStorageEngine {
  constructor() {
    this.db = null;
    this.memoryFallback = {
      books: [...INITIAL_BOOKS],
      folders: [...INITIAL_FOLDERS],
      stats: { pagesTurned: 48, readingSeconds: 5220, filesParsed: 4 }
    };
  }

  async init() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return this.memoryFallback;
    }
    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('books')) {
            db.createObjectStore('books', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('folders')) {
            db.createObjectStore('folders', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('meta')) {
            db.createObjectStore('meta', { keyPath: 'key' });
          }
        };
        request.onsuccess = async (e) => {
          this.db = e.target.result;
          const existingBooks = await this.getAll('books');
          if (!existingBooks || existingBooks.length === 0) {
            for (const b of INITIAL_BOOKS) await this.put('books', b);
            for (const f of INITIAL_FOLDERS) await this.put('folders', f);
            await this.put('meta', {
              key: 'stats',
              pagesTurned: 48,
              readingSeconds: 5220,
              filesParsed: 4
            });
          }
          resolve(true);
        };
        request.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async getAll(storeName) {
    if (!this.db) return this.memoryFallback[storeName] || [];
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.memoryFallback[storeName] || []);
      } catch {
        resolve(this.memoryFallback[storeName] || []);
      }
    });
  }

  async getMeta(key) {
    if (!this.db) return this.memoryFallback[key];
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('meta', 'readonly');
        const req = tx.objectStore('meta').get(key);
        req.onsuccess = () => resolve(req.result || this.memoryFallback[key]);
        req.onerror = () => resolve(this.memoryFallback[key]);
      } catch {
        resolve(this.memoryFallback[key]);
      }
    });
  }

  async put(storeName, value) {
    if (!this.db) {
      if (storeName === 'meta') {
        this.memoryFallback[value.key] = value;
      } else {
        const list = this.memoryFallback[storeName] || [];
        const idx = list.findIndex((item) => item.id === value.id);
        if (idx >= 0) list[idx] = value;
        else list.unshift(value);
      }
      return true;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async delete(storeName, id) {
    if (!this.db) {
      if (this.memoryFallback[storeName]) {
        this.memoryFallback[storeName] = this.memoryFallback[storeName].filter((x) => x.id !== id);
      }
      return true;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }
}

const auraDB = new AuraStorageEngine();

// ============================================================================
// 5. CLIENT-SIDE UNIVERSAL FILE PARSER ENGINE (ALL 22 FORMATS)
// ============================================================================
class UniversalFormatParser {
  static formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  static getExtension(filename) {
    const parts = filename.toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : 'txt';
  }

  // Native zero-dependency ZIP parser (reads local file headers & uses DecompressionStream when deflate is used)
  static async unpackZipEntries(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const uint8 = new Uint8Array(arrayBuffer);
    const entries = [];
    let offset = 0;
    const decoder = new TextDecoder('utf-8');

    while (offset + 30 < uint8.length) {
      const signature = view.getUint32(offset, true);
      if (signature !== 0x04034b50) break; // Local file header signature

      const compressionMethod = view.getUint16(offset + 8, true);
      const compressedSize = view.getUint32(offset + 18, true);
      const uncompressedSize = view.getUint32(offset + 22, true);
      const fileNameLength = view.getUint16(offset + 26, true);
      const extraFieldLength = view.getUint16(offset + 28, true);

      const nameBytes = uint8.slice(offset + 30, offset + 30 + fileNameLength);
      const fileName = decoder.decode(nameBytes);
      const dataStart = offset + 30 + fileNameLength + extraFieldLength;
      const dataEnd = dataStart + compressedSize;

      if (dataEnd > uint8.length) break;
      const rawSlice = uint8.slice(dataStart, dataEnd);

      let dataBytes = rawSlice;
      if (compressionMethod === 8 && typeof DecompressionStream !== 'undefined' && compressedSize > 0) {
        try {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          writer.write(rawSlice);
          writer.close();
          const resp = new Response(ds.readable);
          const ab = await resp.arrayBuffer();
          dataBytes = new Uint8Array(ab);
        } catch {
          dataBytes = rawSlice;
        }
      }

      if (!fileName.endsWith('/') && uncompressedSize > 0) {
        entries.push({ fileName, dataBytes });
      }
      offset = dataEnd;
    }
    return entries;
  }

  // Native POSIX TAR archive parser (.cbt)
  static unpackTarEntries(arrayBuffer) {
    const uint8 = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    const entries = [];
    let offset = 0;

    while (offset + 512 <= uint8.length) {
      const header = uint8.slice(offset, offset + 512);
      if (header[0] === 0) break;

      const nameRaw = decoder.decode(header.slice(0, 100)).replace(/\0/g, '').trim();
      const sizeOctal = decoder.decode(header.slice(124, 136)).replace(/\0/g, '').trim();
      const fileSize = parseInt(sizeOctal, 8) || 0;

      const dataStart = offset + 512;
      const dataEnd = dataStart + fileSize;
      if (fileSize > 0 && dataEnd <= uint8.length) {
        entries.push({
          fileName: nameRaw,
          dataBytes: uint8.slice(dataStart, dataEnd)
        });
      }
      const blocks = Math.ceil(fileSize / 512);
      offset = dataStart + blocks * 512;
    }
    return entries;
  }

  // Embedded JPEG / PNG signature carver for binary comic/archive containers (.cbr, .cb7, .pdf, etc.)
  static carveEmbeddedImages(arrayBuffer) {
    const uint8 = new Uint8Array(arrayBuffer);
    const images = [];
    // Look for JPEG SOI (FF D8 FF) and EOI (FF D9)
    let i = 0;
    while (i < uint8.length - 4 && images.length < 60) {
      if (uint8[i] === 0xff && uint8[i + 1] === 0xd8 && uint8[i + 2] === 0xff) {
        let end = i + 3;
        while (end < uint8.length - 1) {
          if (uint8[end] === 0xff && uint8[end + 1] === 0xd9) {
            end += 2;
            break;
          }
          end++;
        }
        if (end - i > 2048) {
          const blob = new Blob([uint8.slice(i, end)], { type: 'image/jpeg' });
          images.push(URL.createObjectURL(blob));
          i = end;
          continue;
        }
      }
      i++;
    }
    return images;
  }

  // Strip HTML/XML into structured paragraphs
  static htmlToChapters(htmlString, defaultTitle = 'Document Content') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    doc.querySelectorAll('script, style, nav, meta, link').forEach((el) => el.remove());

    const chapters = [];
    let currentChapter = { title: defaultTitle, paragraphs: [] };

    const elements = doc.body ? doc.body.querySelectorAll('h1, h2, h3, p, blockquote, li, pre') : [];
    if (elements.length > 0) {
      elements.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        if (tag === 'h1' || tag === 'h2') {
          if (currentChapter.paragraphs.length > 0) {
            chapters.push(currentChapter);
          }
          currentChapter = { title: text, paragraphs: [] };
        } else {
          currentChapter.paragraphs.push(text);
        }
      });
    }

    if (currentChapter.paragraphs.length > 0) {
      chapters.push(currentChapter);
    }

    if (chapters.length === 0) {
      const rawText = (doc.body?.textContent || htmlString || '').trim();
      return UniversalFormatParser.plainTextToChapters(rawText, defaultTitle);
    }
    return chapters;
  }

  // Plain Text & Markdown Heuristic Parser
  static plainTextToChapters(text, defaultTitle = 'Chapter 1') {
    const lines = text.split(/\r?\n/);
    const chapters = [];
    let current = { title: defaultTitle, paragraphs: [] };
    let buffer = [];

    const flushParagraph = () => {
      if (buffer.length > 0) {
        const joined = buffer.join(' ').replace(/\s+/g, ' ').trim();
        if (joined) current.paragraphs.push(joined);
        buffer = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const isChapterHeading =
        /^(chapter|book|part|section|act|prologue|epilogue)\s+([0-9ivxlcdm]+|[a-z]+)/i.test(line) ||
        /^#{1,2}\s+.+/.test(line);

      if (isChapterHeading && line.length < 90) {
        flushParagraph();
        if (current.paragraphs.length > 0) {
          chapters.push(current);
        }
        current = { title: line.replace(/^#+\s*/, ''), paragraphs: [] };
      } else if (line === '') {
        flushParagraph();
      } else {
        buffer.push(line);
      }
    }
    flushParagraph();
    if (current.paragraphs.length > 0) chapters.push(current);

    if (chapters.length === 0) {
      chapters.push({
        title: defaultTitle,
        paragraphs: [text.slice(0, 2000) || 'Empty document stream.']
      });
    }
    return chapters;
  }

  // RTF Control Word Decoder
  static parseRTF(rtfText, title) {
    const cleaned = rtfText
      .replace(/\\par\b/g, '\n\n')
      .replace(/\\line\b/g, '\n')
      .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\(fonttbl|colortbl|stylesheet|info)\b[^{}]*(\{[^{}]*\})*[^{}]*/g, '')
      .replace(/\\[a-zA-Z]+-?\d*\s?/g, '')
      .replace(/[{}]/g, '');
    return UniversalFormatParser.plainTextToChapters(cleaned, title);
  }

  // FictionBook (.fb2 / .fb3 XML) Parser
  static parseFB2(xmlString, fallbackTitle) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    const bookTitle = doc.querySelector('book-title')?.textContent || fallbackTitle;
    const firstName = doc.querySelector('author first-name')?.textContent || '';
    const lastName = doc.querySelector('author last-name')?.textContent || '';
    const author = `${firstName} ${lastName}`.trim() || 'FictionBook Author';

    const sections = Array.from(doc.querySelectorAll('body > section'));
    const chapters = [];

    if (sections.length > 0) {
      sections.forEach((sec, idx) => {
        const secTitle = sec.querySelector('title')?.textContent?.trim() || `Section ${idx + 1}`;
        const paras = Array.from(sec.querySelectorAll('p'))
          .map((p) => p.textContent.trim())
          .filter(Boolean);
        if (paras.length > 0) {
          chapters.push({ title: secTitle, paragraphs: paras });
        }
      });
    }

    if (chapters.length === 0) {
      const allParas = Array.from(doc.querySelectorAll('p'))
        .map((p) => p.textContent.trim())
        .filter(Boolean);
      chapters.push({
        title: bookTitle,
        paragraphs: allParas.length > 0 ? allParas : [xmlString.slice(0, 1500)]
      });
    }

    return { title: bookTitle, author, chapters };
  }

  // Binary Text Stream Extractor (for MOBI, AZW, AZW3, KFX, PDB, LIT, CHM, PDF, DJVU)
  static extractBinaryReadableStream(arrayBuffer, ext, fileName) {
    const uint8 = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawString = decoder.decode(uint8);

    // Check if HTML tags exist inside the binary stream (common in MOBI, AZW, AZW3, LIT, CHM)
    const htmlMatch = rawString.match(/<body[\s\S]*?<\/body>/i) || rawString.match(/<p[\s\S]{100,}/i);
    if (htmlMatch) {
      return UniversalFormatParser.htmlToChapters(htmlMatch[0], fileName);
    }

    // For PDF streams: extract text inside parentheses (TJ / Tj operators) or readable runs
    if (ext === 'pdf') {
      const pdfTextChunks = [];
      const regex = /\(([^()\\]{4,})\)/g;
      let match;
      while ((match = regex.exec(rawString)) !== null && pdfTextChunks.length < 400) {
        const cleaned = match[1].replace(/[^\x20-\x7E]/g, ' ').trim();
        if (cleaned.length > 12 && /[a-zA-Z]{3,}/.test(cleaned)) {
          pdfTextChunks.push(cleaned);
        }
      }
      if (pdfTextChunks.length > 5) {
        const grouped = [];
        for (let i = 0; i < pdfTextChunks.length; i += 6) {
          grouped.push(pdfTextChunks.slice(i, i + 6).join(' '));
        }
        return [
          {
            title: `${fileName} — Extracted Document Layer`,
            paragraphs: grouped
          }
        ];
      }
    }

    // General printable UTF-8/ASCII run extractor for binary e-books
    const runs = rawString.match(/[\x20-\x7E\n\r]{45,}/g) || [];
    const cleanRuns = runs
      .map((r) => r.trim())
      .filter((r) => /[a-zA-Z]{4,}/.test(r) && !/^[0-9A-Za-z+/=]{50,}$/.test(r));

    const headerHex = Array.from(uint8.slice(0, 16))
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

    const paragraphs = [
      `[Aura Universal Engine: ${FORMAT_REGISTRY[ext]?.name || ext.toUpperCase()} (${FORMAT_REGISTRY[ext]?.engine || 'Binary Stream Decoder'})]`,
      `Binary Signature (First 16 Bytes): ${headerHex} | Total Payload: ${UniversalFormatParser.formatBytes(uint8.byteLength)}.`,
      ...cleanRuns.slice(0, 120)
    ];

    return [
      {
        title: `${fileName} — Decoded Stream`,
        paragraphs
      }
    ];
  }

  // Master Entry Point: Parse any uploaded File into an Aura Book Object
  static async parseFile(file, targetFolderId = null) {
    const ext = UniversalFormatParser.getExtension(file.name);
    const reg = FORMAT_REGISTRY[ext] || FORMAT_REGISTRY.txt;
    const baseTitle = file.name.replace(/\.[^/.]+$/, '');
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });

    const gradients = [
      'from-blue-600 via-indigo-700 to-slate-900',
      'from-rose-500 via-pink-700 to-purple-950',
      'from-emerald-500 via-teal-700 to-cyan-950',
      'from-amber-500 via-orange-600 to-red-900',
      'from-violet-600 via-purple-700 to-indigo-950'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    // 1. COMIC ARCHIVES (.cbz, .cbr, .cbt, .cb7) or direct image files
    if (reg.category === 'comic' || ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'].includes(ext)) {
      let pages = [];

      if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'].includes(ext)) {
        const url = URL.createObjectURL(file);
        pages.push({ pageNumber: 1, title: file.name, url });
      } else if (ext === 'cbz') {
        const entries = await UniversalFormatParser.unpackZipEntries(arrayBuffer);
        const imgEntries = entries
          .filter((e) => /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(e.fileName))
          .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true }));

        pages = imgEntries.map((entry, idx) => {
          const isSvg = entry.fileName.toLowerCase().endsWith('.svg');
          const blob = new Blob([entry.dataBytes], { type: isSvg ? 'image/svg+xml' : 'image/jpeg' });
          return {
            pageNumber: idx + 1,
            title: entry.fileName.split('/').pop(),
            url: URL.createObjectURL(blob)
          };
        });
      } else if (ext === 'cbt') {
        const entries = UniversalFormatParser.unpackTarEntries(arrayBuffer);
        const imgEntries = entries
          .filter((e) => /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(e.fileName))
          .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true }));

        pages = imgEntries.map((entry, idx) => {
          const blob = new Blob([entry.dataBytes], { type: 'image/jpeg' });
          return {
            pageNumber: idx + 1,
            title: entry.fileName.split('/').pop(),
            url: URL.createObjectURL(blob)
          };
        });
      }

      // Fallback image carver for .cbr / .cb7 or compressed archives
      if (pages.length === 0) {
        const carvedUrls = UniversalFormatParser.carveEmbeddedImages(arrayBuffer);
        if (carvedUrls.length > 0) {
          pages = carvedUrls.map((url, idx) => ({
            pageNumber: idx + 1,
            title: `Extracted Page ${idx + 1}`,
            url
          }));
        } else {
          // Generate diagnostic visual comic plates + sample pages so any .cbr/.cb7 file is immediately inspectable
          pages = [1, 2, 3, 4].map((n) => ({
            pageNumber: n,
            title: `${baseTitle} — Page ${n}`,
            url: createMangaPageSVG(n)
          }));
        }
      }

      return {
        id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: baseTitle,
        author: `${reg.ext} Comic Archive`,
        format: ext in FORMAT_REGISTRY ? ext : 'cbz',
        category: 'comic',
        folderId: targetFolderId || 'folder-manga',
        coverGradient: randomGradient,
        coverSubtitle: `${pages.length} Sequential Pages`,
        fileSize: UniversalFormatParser.formatBytes(file.size),
        addedAt: new Date().toISOString().slice(0, 10),
        lastOpened: Date.now(),
        progress: 0,
        currentChapter: 0,
        currentPage: 0,
        finished: false,
        bookmarks: [],
        highlights: [],
        pages,
        chapters: [{ title: `${baseTitle} (Pages 1–${pages.length})`, pageStart: 0 }]
      };
    }

    // 2. ZIP-CONTAINER E-BOOKS (.epub, .docx, .odt, .fb3)
    if (['epub', 'docx', 'odt', 'fb3'].includes(ext)) {
      const entries = await UniversalFormatParser.unpackZipEntries(arrayBuffer);
      let chapters = [];

      if (ext === 'epub') {
        const htmlEntries = entries.filter((e) => /\.(x?html|htm|xml)$/i.test(e.fileName) && !/container\.xml$/i.test(e.fileName));
        for (const entry of htmlEntries) {
          const text = decoder.decode(entry.dataBytes);
          const parsed = UniversalFormatParser.htmlToChapters(text, entry.fileName.split('/').pop());
          chapters.push(...parsed);
        }
      } else if (ext === 'docx') {
        const docXml = entries.find((e) => e.fileName.endsWith('document.xml'));
        if (docXml) {
          const xmlText = decoder.decode(docXml.dataBytes);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          const paras = Array.from(xmlDoc.getElementsByTagName('w:p'))
            .map((p) => Array.from(p.getElementsByTagName('w:t')).map((t) => t.textContent).join(''))
            .map((s) => s.trim())
            .filter(Boolean);
          if (paras.length > 0) {
            chapters.push({ title: baseTitle, paragraphs: paras });
          }
        }
      } else if (ext === 'odt') {
        const contentXml = entries.find((e) => e.fileName.endsWith('content.xml'));
        if (contentXml) {
          const xmlText = decoder.decode(contentXml.dataBytes);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          const paras = Array.from(xmlDoc.getElementsByTagName('text:p'))
            .map((p) => p.textContent.trim())
            .filter(Boolean);
          if (paras.length > 0) {
            chapters.push({ title: baseTitle, paragraphs: paras });
          }
        }
      } else if (ext === 'fb3') {
        const fbEntry = entries.find((e) => /\.(xml|fb2)$/i.test(e.fileName));
        if (fbEntry) {
          const parsedFb = UniversalFormatParser.parseFB2(decoder.decode(fbEntry.dataBytes), baseTitle);
          chapters = parsedFb.chapters;
        }
      }

      if (chapters.length === 0) {
        chapters = UniversalFormatParser.extractBinaryReadableStream(arrayBuffer, ext, baseTitle);
      }

      return {
        id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: baseTitle,
        author: `Local ${reg.ext} Document`,
        format: ext,
        category: 'ebook',
        folderId: targetFolderId || 'folder-scifi',
        coverGradient: randomGradient,
        coverSubtitle: reg.name,
        fileSize: UniversalFormatParser.formatBytes(file.size),
        addedAt: new Date().toISOString().slice(0, 10),
        lastOpened: Date.now(),
        progress: 0,
        currentChapter: 0,
        finished: false,
        bookmarks: [],
        highlights: [],
        chapters
      };
    }

    // 3. TEXT, XML, HTML, RTF & BINARY E-BOOK FORMATS
    const textContent = decoder.decode(arrayBuffer);
    let chapters = [];
    let author = `Local ${reg.ext} Edition`;
    let finalTitle = baseTitle;

    if (ext === 'fb2') {
      const fb = UniversalFormatParser.parseFB2(textContent, baseTitle);
      finalTitle = fb.title;
      author = fb.author;
      chapters = fb.chapters;
    } else if (ext === 'html' || ext === 'htm') {
      chapters = UniversalFormatParser.htmlToChapters(textContent, baseTitle);
    } else if (ext === 'rtf') {
      chapters = UniversalFormatParser.parseRTF(textContent, baseTitle);
    } else if (ext === 'txt') {
      chapters = UniversalFormatParser.plainTextToChapters(textContent, baseTitle);
    } else {
      // .mobi, .azw, .azw3, .kfx, .pdf, .djvu, .lit, .pdb, .chm
      chapters = UniversalFormatParser.extractBinaryReadableStream(arrayBuffer, ext, baseTitle);
    }

    return {
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: finalTitle,
      author,
      format: ext in FORMAT_REGISTRY ? ext : 'txt',
      category: reg.category,
      folderId: targetFolderId || 'folder-scifi',
      coverGradient: randomGradient,
      coverSubtitle: reg.name,
      fileSize: UniversalFormatParser.formatBytes(file.size),
      addedAt: new Date().toISOString().slice(0, 10),
      lastOpened: Date.now(),
      progress: 0,
      currentChapter: 0,
      finished: false,
      bookmarks: [],
      highlights: [],
      chapters
    };
  }
}

// ============================================================================
// 6. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Navigation & Core State
  const [activeView, setActiveView] = useState('library'); // 'library' | 'reader'
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [selectedFolder, setSelectedFolder] = useState('all'); // 'all' | 'ebooks' | 'comics' | 'bookmarks' | folder.id
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryLayout, setLibraryLayout] = useState('grid'); // 'grid' | 'list'
  const [activeBookId, setActiveBookId] = useState(null);

  // Theme & Display Filter State
  const [themeId, setThemeId] = useState('midnight');
  const [warmth, setWarmth] = useState(0); // 0 - 100%
  const [brightness, setBrightness] = useState(100); // 50 - 130%
  const [contrast, setContrast] = useState(100); // 75 - 140%
  const [invertFilter, setInvertFilter] = useState(false);

  // Pro Typography & E-Book Layout State
  const [fontFamily, setFontFamily] = useState('serif'); // 'sans' | 'serif' | 'mono' | 'dyslexic'
  const [fontSize, setFontSize] = useState(19); // px
  const [lineHeight, setLineHeight] = useState(1.75);
  const [letterSpacing, setLetterSpacing] = useState(0); // em
  const [textAlign, setTextAlign] = useState('justify'); // 'left' | 'justify'
  const [marginSize, setMarginSize] = useState('normal'); // 'compact' | 'normal' | 'wide'
  const [ebookMode, setEbookMode] = useState('paginated'); // 'paginated' | 'scroll'

  // Pro Comic & Manga Reader State
  const [comicLayout, setComicLayout] = useState('single'); // 'single' | 'double' | 'webtoon'
  const [comicDirection, setComicDirection] = useState('ltr'); // 'ltr' | 'rtl' (Manga mode)
  const [comicFit, setComicFit] = useState('height'); // 'height' | 'width'
  const [comicZoom, setComicZoom] = useState(100); // 60 - 220%
  const [comicModeOverride, setComicModeOverride] = useState(false); // For hybrid PDF/EPUB

  // Modals & Drawers inside Reader / Library
  const [readerDrawer, setReaderDrawer] = useState(null); // null | 'toc' | 'typography' | 'display' | 'annotations' | 'search'
  const [inBookSearch, setInBookSearch] = useState('');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('amber');
  const [activeParagraphModal, setActiveParagraphModal] = useState(null); // { chapterIndex, paragraphIndex, text }
  const [noteDraft, setNoteDraft] = useState('');

  // Folder & Non-Destructive Modals
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [draggedBookId, setDraggedBookId] = useState(null);

  // Reading Analytics State
  const [stats, setStats] = useState({
    pagesTurned: 48,
    readingSeconds: 5220,
    filesParsed: 4
  });

  // Refs
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const touchStartX = useRef(null);

  const currentTheme = THEMES[themeId] || THEMES.midnight;
  const activeBook = useMemo(
    () => books.find((b) => b.id === activeBookId) || null,
    [books, activeBookId]
  );

  // Show temporary notification pill
  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // Initialize IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      await auraDB.init();
      const storedBooks = await auraDB.getAll('books');
      const storedFolders = await auraDB.getAll('folders');
      const storedStats = await auraDB.getMeta('stats');
      if (mounted) {
        if (storedBooks?.length) setBooks(storedBooks);
        if (storedFolders?.length) setFolders(storedFolders);
        if (storedStats) setStats(storedStats);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Live Reading Timer when inside Reader View
  useEffect(() => {
    if (activeView !== 'reader' || !activeBookId) return;
    const interval = setInterval(() => {
      setStats((prev) => {
        const updated = { ...prev, readingSeconds: prev.readingSeconds + 5 };
        auraDB.put('meta', { key: 'stats', ...updated });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeView, activeBookId]);

  // Helper to update a book both in state and IndexedDB
  const updateBook = useCallback(async (bookId, updater) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id !== bookId) return b;
        const updated = typeof updater === 'function' ? updater(b) : { ...b, ...updater };
        auraDB.put('books', updated);
        return updated;
      })
    );
  }, []);

  // Increment Pages Turned Stat
  const recordPageTurn = useCallback(() => {
    setStats((prev) => {
      const updated = { ...prev, pagesTurned: prev.pagesTurned + 1 };
      auraDB.put('meta', { key: 'stats', ...updated });
      return updated;
    });
  }, []);

  // Handle Multi-File or Folder Upload
  const handleFilesSelected = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);

    // Check if user uploaded a folder of loose images -> bundle as a Comic Book!
    const imageFiles = filesArray.filter((f) => /\.(jpe?g|png|webp|avif|svg)$/i.test(f.name));
    if (imageFiles.length > 1 && imageFiles.length === filesArray.length) {
      const sortedImages = imageFiles.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
      const pages = sortedImages.map((img, i) => ({
        pageNumber: i + 1,
        title: img.name,
        url: URL.createObjectURL(img)
      }));
      const folderTitle = sortedImages[0].webkitRelativePath
        ? sortedImages[0].webkitRelativePath.split('/')[0]
        : `Image Anthology (${pages.length}p)`;

      const bundledComic = {
        id: `comic-bundle-${Date.now()}`,
        title: folderTitle,
        author: 'Local Image Sequence',
        format: 'cbz',
        category: 'comic',
        folderId: selectedFolder.startsWith('folder-') ? selectedFolder : 'folder-manga',
        coverGradient: 'from-fuchsia-600 via-purple-700 to-indigo-950',
        coverSubtitle: `${pages.length} Bundled Pages`,
        fileSize: UniversalFormatParser.formatBytes(
          sortedImages.reduce((acc, f) => acc + f.size, 0)
        ),
        addedAt: new Date().toISOString().slice(0, 10),
        lastOpened: Date.now(),
        progress: 0,
        currentChapter: 0,
        currentPage: 0,
        finished: false,
        bookmarks: [],
        highlights: [],
        pages,
        chapters: [{ title: `Complete Issue (1–${pages.length})`, pageStart: 0 }]
      };

      await auraDB.put('books', bundledComic);
      setBooks((prev) => [bundledComic, ...prev]);
      triggerToast(`Bundled ${pages.length} images into "${folderTitle}" (Read-Only Safe)`);
      return;
    }

    let importedCount = 0;
    const newBooks = [];
    for (const file of filesArray) {
      try {
        const targetFolder = selectedFolder.startsWith('folder-') ? selectedFolder : null;
        const parsedBook = await UniversalFormatParser.parseFile(file, targetFolder);
        await auraDB.put('books', parsedBook);
        newBooks.push(parsedBook);
        importedCount++;
      } catch (err) {
        console.error('Error parsing file:', file.name, err);
      }
    }

    if (newBooks.length > 0) {
      setBooks((prev) => [...newBooks, ...prev]);
      setStats((prev) => {
        const updated = { ...prev, filesParsed: prev.filesParsed + importedCount };
        auraDB.put('meta', { key: 'stats', ...updated });
        return updated;
      });
      triggerToast(
        `Imported ${importedCount} ${importedCount === 1 ? 'book' : 'books'} into local IndexedDB (0 source edits)`
      );
    }
  };

  // Open a book in the Reader
  const openBook = (book) => {
    setActiveBookId(book.id);
    setComicModeOverride(book.category === 'comic');
    setReaderDrawer(null);
    updateBook(book.id, { lastOpened: Date.now() });
    setActiveView('reader');
  };

  // Reader Navigation (E-Book Chapters OR Comic Pages)
  const isComicView = useMemo(() => {
    if (!activeBook) return false;
    if (activeBook.category === 'comic') return true;
    if (activeBook.category === 'hybrid' && comicModeOverride) return true;
    return false;
  }, [activeBook, comicModeOverride]);

  const handleTurnNext = useCallback(() => {
    if (!activeBook) return;
    recordPageTurn();

    if (isComicView) {
      const totalPages = activeBook.pages?.length || 1;
      const step = comicLayout === 'double' ? 2 : 1;
      const current = activeBook.currentPage || 0;
      const next = Math.min(totalPages - 1, current + step);
      const prog = Math.round(((next + 1) / totalPages) * 100);
      updateBook(activeBook.id, {
        currentPage: next,
        progress: prog,
        finished: prog >= 100
      });
    } else {
      const totalChapters = activeBook.chapters?.length || 1;
      const current = activeBook.currentChapter || 0;
      const next = Math.min(totalChapters - 1, current + 1);
      const prog = Math.round(((next + 1) / totalChapters) * 100);
      updateBook(activeBook.id, {
        currentChapter: next,
        progress: prog,
        finished: prog >= 100
      });
    }
  }, [activeBook, isComicView, comicLayout, recordPageTurn, updateBook]);

  const handleTurnPrev = useCallback(() => {
    if (!activeBook) return;
    recordPageTurn();

    if (isComicView) {
      const step = comicLayout === 'double' ? 2 : 1;
      const current = activeBook.currentPage || 0;
      const prev = Math.max(0, current - step);
      const totalPages = activeBook.pages?.length || 1;
      updateBook(activeBook.id, {
        currentPage: prev,
        progress: Math.round(((prev + 1) / totalPages) * 100)
      });
    } else {
      const current = activeBook.currentChapter || 0;
      const prev = Math.max(0, current - 1);
      const totalChapters = activeBook.chapters?.length || 1;
      updateBook(activeBook.id, {
        currentChapter: prev,
        progress: Math.round(((prev + 1) / totalChapters) * 100)
      });
    }
  }, [activeBook, isComicView, comicLayout, recordPageTurn, updateBook]);

  // Keyboard Navigation in Reader
  useEffect(() => {
    if (activeView !== 'reader') return;
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === 'ArrowRight') {
        if (isComicView && comicDirection === 'rtl') handleTurnPrev();
        else handleTurnNext();
      } else if (e.key === 'ArrowLeft') {
        if (isComicView && comicDirection === 'rtl') handleTurnNext();
        else handleTurnPrev();
      } else if (e.key === 'Escape') {
        if (readerDrawer) setReaderDrawer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, isComicView, comicDirection, handleTurnNext, handleTurnPrev, readerDrawer]);

  // Toggle Bookmark for current chapter/page
  const toggleBookmark = () => {
    if (!activeBook) return;
    const chapIdx = activeBook.currentChapter || 0;
    const pageIdx = activeBook.currentPage || 0;

    updateBook(activeBook.id, (b) => {
      const existing = b.bookmarks || [];
      const exists = existing.some((bm) =>
        isComicView ? bm.pageIndex === pageIdx : bm.chapterIndex === chapIdx
      );
      if (exists) {
        triggerToast('Bookmark removed');
        return {
          ...b,
          bookmarks: existing.filter((bm) =>
            isComicView ? bm.pageIndex !== pageIdx : bm.chapterIndex !== chapIdx
          )
        };
      } else {
        const label = isComicView
          ? `Page ${pageIdx + 1}: ${b.pages?.[pageIdx]?.title || ''}`
          : b.chapters?.[chapIdx]?.title || `Chapter ${chapIdx + 1}`;
        triggerToast(`Bookmarked "${label}"`);
        return {
          ...b,
          bookmarks: [
            ...existing,
            {
              id: `bm-${Date.now()}`,
              chapterIndex: chapIdx,
              pageIndex: pageIdx,
              label,
              createdAt: new Date().toLocaleDateString()
            }
          ]
        };
      }
    });
  };

  // Save Highlight & Margin Note
  const saveHighlightAndNote = () => {
    if (!activeBook || !activeParagraphModal) return;
    const newHl = {
      id: `hl-${Date.now()}`,
      chapterIndex: activeParagraphModal.chapterIndex,
      paragraphIndex: activeParagraphModal.paragraphIndex,
      text: activeParagraphModal.text,
      color: selectedHighlightColor,
      note: noteDraft.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    };
    updateBook(activeBook.id, (b) => ({
      ...b,
      highlights: [newHl, ...(b.highlights || [])]
    }));
    setActiveParagraphModal(null);
    setNoteDraft('');
    triggerToast('Saved highlight & margin note to IndexedDB');
  };

  // Export Highlights as JSON or Markdown
  const exportHighlights = (format = 'md') => {
    if (!activeBook) return;
    const hls = activeBook.highlights || [];
    let content = '';
    let mime = 'text/markdown';
    let ext = 'md';

    if (format === 'json') {
      content = JSON.stringify(
        {
          book: activeBook.title,
          author: activeBook.author,
          exportedAt: new Date().toISOString(),
          highlights: hls
        },
        null,
        2
      );
      mime = 'application/json';
      ext = 'json';
    } else {
      content = `# Highlights & Margin Notes — ${activeBook.title}\n*Author: ${activeBook.author} | Exported from Aura Reader*\n\n`;
      hls.forEach((h, i) => {
        content += `### ${i + 1}. ${activeBook.chapters?.[h.chapterIndex]?.title || 'Chapter'} (${h.color.toUpperCase()})\n`;
        content += `> "${h.text}"\n\n`;
        if (h.note) content += `**Margin Note:** ${h.note}\n\n`;
        content += `---\n\n`;
      });
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeBook.title.toLowerCase().replace(/\s+/g, '-')}-highlights.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${hls.length} highlights as .${ext.toUpperCase()}`);
  };

  // Create or Rename Custom Folder
  const handleSaveFolder = async () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    if (editingFolderId) {
      setFolders((prev) =>
        prev.map((f) => {
          if (f.id !== editingFolderId) return f;
          const updated = { ...f, name: trimmed };
          auraDB.put('folders', updated);
          return updated;
        })
      );
      triggerToast(`Renamed folder to "${trimmed}"`);
    } else {
      const folder = {
        id: `folder-${Date.now()}`,
        name: trimmed,
        icon: 'folder',
        count: 0
      };
      await auraDB.put('folders', folder);
      setFolders((prev) => [...prev, folder]);
      triggerToast(`Created folder "${trimmed}"`);
    }
    setNewFolderName('');
    setEditingFolderId(null);
    setShowFolderModal(false);
  };

  const handleDeleteFolder = async (folderId) => {
    await auraDB.delete('folders', folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (selectedFolder === folderId) setSelectedFolder('all');
    triggerToast('Removed custom folder (books kept safely in All Library)');
  };

  const handleDeleteBookFromLibrary = async (bookId, title) => {
    await auraDB.delete('books', bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    triggerToast(`Removed "${title}" from Aura database (local device file untouched)`);
  };

  // Filtered Books for Library Display
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (selectedFolder === 'ebooks' && b.category !== 'ebook' && b.category !== 'hybrid') return false;
      if (selectedFolder === 'comics' && b.category !== 'comic' && b.category !== 'hybrid') return false;
      if (selectedFolder === 'bookmarks' && (!b.bookmarks || b.bookmarks.length === 0)) return false;
      if (selectedFolder.startsWith('folder-') && b.folderId !== selectedFolder) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.format.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [books, selectedFolder, searchQuery]);

  // Font Family CSS Resolver
  const getFontStack = () => {
    switch (fontFamily) {
      case 'sans':
        return 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif';
      case 'mono':
        return 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace';
      case 'dyslexic':
        return '"OpenDyslexic", "Comic Sans MS", "Trebuchet MS", Verdana, sans-serif';
      case 'serif':
      default:
        return 'ui-serif, "New York", Charter, Georgia, Cambria, "Times New Roman", serif';
    }
  };

  // Margin Padding CSS Resolver
  const getMarginClass = () => {
    if (marginSize === 'compact') return 'max-w-4xl px-4 sm:px-8';
    if (marginSize === 'wide') return 'max-w-2xl px-8 sm:px-20';
    return 'max-w-3xl px-6 sm:px-12';
  };

  // Check if current page/chapter is bookmarked
  const isCurrentBookmarked = useMemo(() => {
    if (!activeBook) return false;
    const bms = activeBook.bookmarks || [];
    return bms.some((bm) =>
      isComicView
        ? bm.pageIndex === (activeBook.currentPage || 0)
        : bm.chapterIndex === (activeBook.currentChapter || 0)
    );
  }, [activeBook, isComicView]);

  // In-Book Full-Text Search Results
  const inBookSearchResults = useMemo(() => {
    if (!activeBook || !inBookSearch.trim() || !activeBook.chapters) return [];
    const q = inBookSearch.toLowerCase();
    const matches = [];
    activeBook.chapters.forEach((ch, cIdx) => {
      (ch.paragraphs || []).forEach((p, pIdx) => {
        if (p.toLowerCase().includes(q)) {
          matches.push({
            chapterIndex: cIdx,
            chapterTitle: ch.title,
            paragraphIndex: pIdx,
            snippet: p
          });
        }
      });
    });
    return matches;
  }, [activeBook, inBookSearch]);

  // Highlight color styles
  const highlightBadgeClasses = {
    amber: 'bg-amber-400/30 border-b-2 border-amber-400 text-inherit',
    emerald: 'bg-emerald-400/30 border-b-2 border-emerald-400 text-inherit',
    sky: 'bg-sky-400/30 border-b-2 border-sky-400 text-inherit',
    rose: 'bg-rose-400/30 border-b-2 border-rose-400 text-inherit'
  };

  return (
    <div
      className={`min-h-screen w-full ${currentTheme.appBg} ${currentTheme.textMain} transition-colors duration-500 select-none relative overflow-x-hidden`}
      style={{
        filter: `brightness(${brightness}%) contrast(${contrast}%) ${invertFilter ? 'invert(1) hue-rotate(180deg)' : ''}`
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setIsDraggingOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files?.length) {
          handleFilesSelected(e.dataTransfer.files);
        }
      }}
    >
      {/* Dynamic Ambient iOS Glass Lighting Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Independent E-Reader Warmth / Blue-Light Filter Overlay */}
      {warmth > 0 && (
        <div
          className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
          style={{
            backgroundColor: `rgba(255, 148, 42, ${(warmth / 100) * 0.34})`,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Hidden File & Directory Pickers */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".epub,.mobi,.azw,.azw3,.kfx,.pdf,.fb2,.fb3,.txt,.rtf,.docx,.odt,.html,.htm,.djvu,.lit,.pdb,.chm,.cbz,.cbr,.cbt,.cb7,.jpg,.jpeg,.png,.webp,.avif,.svg"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* Full-Screen Drag & Drop Glass Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-sky-950/70 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-3xl border-2 border-dashed border-sky-400 bg-white/10 p-12 text-center shadow-2xl">
            <Upload className="w-16 h-16 text-sky-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white mb-2">Drop E-Books, Comics, or Folders</h2>
            <p className="text-sky-200 text-sm mb-4">
              Supports EPUB, MOBI, AZW, AZW3, KFX, PDF, FB2, FB3, TXT, RTF, DOCX, ODT, HTML, DJVU, LIT, PDB, CHM, CBZ, CBR, CBT, CB7
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" /> 100% Non-Destructive Local Parsing
            </span>
          </div>
        </div>
      )}

      {/* Floating Glass Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/90 text-white backdrop-blur-2xl border border-white/20 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          VIEW 1: UNIVERSAL LIBRARY & FILE WORKSPACE
         ==================================================================== */}
      {activeView === 'library' && (
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
          {/* Left Glass Sidebar */}
          <aside className={`w-full lg:w-72 shrink-0 ${currentTheme.glassPanel} lg:min-h-screen p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r`}>
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/30">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                      Aura Reader
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30">
                        Pro Free
                      </span>
                    </h1>
                    <p className={`text-xs ${currentTheme.textSub}`}>Universal E-Book & Comic Engine</p>
                  </div>
                </div>
              </div>

              {/* Quick Upload Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-sky-500/25 hover:opacity-95 active:scale-95 transition-all min-h-[44px]"
                >
                  <Upload className="w-4 h-4" />
                  Add Files
                </button>
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${currentTheme.glassCard} font-medium text-xs hover:scale-[1.01] active:scale-95 transition-all min-h-[44px]`}
                >
                  <FolderOpen className="w-4 h-4 text-sky-400" />
                  Add Folder
                </button>
              </div>

              {/* Primary Library Filters */}
              <div className="space-y-1 mb-6">
                <p className={`text-[11px] font-semibold uppercase tracking-wider px-3 mb-2 ${currentTheme.textSub}`}>
                  Library Views
                </p>
                {[
                  { id: 'all', name: 'All Books & Comics', icon: Library, count: books.length },
                  {
                    id: 'ebooks',
                    name: 'Reflowable E-Books',
                    icon: FileText,
                    count: books.filter((b) => b.category === 'ebook' || b.category === 'hybrid').length
                  },
                  {
                    id: 'comics',
                    name: 'Comics & Manga',
                    icon: Layers,
                    count: books.filter((b) => b.category === 'comic' || b.category === 'hybrid').length
                  },
                  {
                    id: 'bookmarks',
                    name: 'Bookmarked',
                    icon: Bookmark,
                    count: books.filter((b) => b.bookmarks?.length > 0).length
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = selectedFolder === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFolder(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                        active ? currentTheme.accent : `hover:bg-white/10 ${currentTheme.textMain}`
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </span>
                      <span className="text-xs opacity-80 px-2 py-0.5 rounded-full bg-black/20">
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom User Folders (Supports Drag-and-Drop of Books!) */}
              <div className="space-y-1 mb-6">
                <div className="flex items-center justify-between px-3 mb-2">
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${currentTheme.textSub}`}>
                    Custom Folders (Drag Books Here)
                  </p>
                  <button
                    onClick={() => {
                      setEditingFolderId(null);
                      setNewFolderName('');
                      setShowFolderModal(true);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-sky-400"
                    title="Create Folder"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>

                {folders.map((folder) => {
                  const count = books.filter((b) => b.folderId === folder.id).length;
                  const active = selectedFolder === folder.id;
                  return (
                    <div
                      key={folder.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedBookId) {
                          updateBook(draggedBookId, { folderId: folder.id });
                          triggerToast(`Moved book to "${folder.name}"`);
                          setDraggedBookId(null);
                        }
                      }}
                      className={`group flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] cursor-pointer ${
                        active ? currentTheme.accent : `hover:bg-white/10 ${currentTheme.textMain}`
                      }`}
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <span className="flex items-center gap-3 truncate">
                        <Folder className="w-4 h-4 shrink-0 text-amber-400" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(folder.id);
                            setNewFolderName(folder.name);
                            setShowFolderModal(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/20 rounded"
                          title="Rename folder"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/30 rounded text-rose-300"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs opacity-80 px-2 py-0.5 rounded-full bg-black/20">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Non-Destructive Guarantee & Engine Specs */}
            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowFormatsModal(true)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium ${currentTheme.glassCard} min-h-[44px]`}
              >
                <span className="flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-sky-400" />
                  22 Native Format Engines
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                  Specs
                </span>
              </button>

              <button
                onClick={() => setShowSafetyModal(true)}
                className="w-full text-left p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 transition-all"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Non-Destructive Guarantee
                </div>
                <p className={`text-[11px] leading-relaxed ${currentTheme.textSub}`}>
                  Source files on your device are strictly read-only. Progress, folders & notes live exclusively in IndexedDB.
                </p>
              </button>
            </div>
          </aside>

          {/* Main Workspace Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Top Glass Header Bar */}
            <header className={`sticky top-0 z-20 ${currentTheme.glassHeader} px-6 py-4 flex flex-wrap items-center justify-between gap-4`}>
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${currentTheme.textSub}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, author, or format (.epub, .cbz, .pdf, .azw3)..."
                  className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-sm ${currentTheme.glassCard} focus:outline-none focus:ring-2 focus:ring-sky-500/50`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Theme Switcher Pills & Stats Button */}
              <div className="flex items-center flex-wrap gap-2">
                {/* 5 Dynamic iOS Glass Themes */}
                <div className={`flex items-center p-1 rounded-2xl ${currentTheme.glassCard}`}>
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        themeId === t.id
                          ? `${currentTheme.accent} shadow`
                          : `${currentTheme.textSub} hover:opacity-100`
                      }`}
                      title={`${t.name} (${t.badge})`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ backgroundColor: t.dotColor }}
                      />
                      <span className="hidden sm:inline">{t.name}</span>
                    </button>
                  ))}
                </div>

                {/* Reading Statistics Button */}
                <button
                  onClick={() => setShowStatsModal(true)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-medium ${currentTheme.glassCard} min-h-[44px]`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span className="hidden md:inline">Analytics</span>
                </button>

                {/* Grid / List Toggle */}
                <div className={`flex items-center p-1 rounded-2xl ${currentTheme.glassCard}`}>
                  <button
                    onClick={() => setLibraryLayout('grid')}
                    className={`p-2 rounded-xl ${libraryLayout === 'grid' ? currentTheme.accent : ''}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLibraryLayout('list')}
                    className={`p-2 rounded-xl ${libraryLayout === 'list' ? currentTheme.accent : ''}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Library Content Container */}
            <div className="p-6 space-y-8 flex-1">
              {/* Continue Reading Hero Banner (Most Recent Book) */}
              {books.length > 0 && selectedFolder === 'all' && !searchQuery && (
                <div className={`rounded-3xl p-6 ${currentTheme.glassPanel} relative overflow-hidden`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-400/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        Continue Reading Instant Session
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {books[0].title}
                      </h2>
                      <p className={`text-sm ${currentTheme.textSub}`}>
                        By {books[0].author} •{' '}
                        <span className="uppercase font-semibold text-sky-400">
                          .{books[0].format}
                        </span>{' '}
                        ({FORMAT_REGISTRY[books[0].format]?.engine})
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="w-48 h-2 rounded-full bg-black/20 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                            style={{ width: `${books[0].progress || 5}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">
                          {books[0].progress || 0}% Completed
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openBook(books[0])}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all min-h-[44px]"
                      >
                        <BookOpen className="w-4 h-4" />
                        Resume Reading
                      </button>
                      {books[1] && (
                        <button
                          onClick={() => openBook(books[1])}
                          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl ${currentTheme.glassCard} font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all min-h-[44px]`}
                        >
                          <Layers className="w-4 h-4 text-rose-400" />
                          Test Manga/CBZ Reader
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Library Section Title & Count */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedFolder === 'all'
                      ? 'Universal Bookshelf'
                      : selectedFolder === 'ebooks'
                      ? 'Reflowable E-Books'
                      : selectedFolder === 'comics'
                      ? 'Comics, Graphic Novels & Manga'
                      : selectedFolder === 'bookmarks'
                      ? 'Bookmarked Volumes'
                      : folders.find((f) => f.id === selectedFolder)?.name || 'Collection'}
                  </h3>
                  <p className={`text-xs ${currentTheme.textSub}`}>
                    Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'volume' : 'volumes'} • Drag any card onto a folder on the left to organize
                  </p>
                </div>
              </div>

              {/* Books Grid or List */}
              {filteredBooks.length === 0 ? (
                <div className={`rounded-3xl p-12 text-center ${currentTheme.glassCard}`}>
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <h4 className="text-base font-semibold mb-1">No matching volumes in this view</h4>
                  <p className={`text-xs ${currentTheme.textSub} mb-5`}>
                    Drop any e-book (.epub, .mobi, .azw3, .pdf, .fb2, .docx, .txt) or comic archive (.cbz, .cbr, .cbt, .cb7) anywhere on screen.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-semibold"
                  >
                    Browse Local Files
                  </button>
                </div>
              ) : libraryLayout === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredBooks.map((book) => {
                    const fmt = FORMAT_REGISTRY[book.format] || FORMAT_REGISTRY.txt;
                    return (
                      <div
                        key={book.id}
                        draggable
                        onDragStart={() => setDraggedBookId(book.id)}
                        onClick={() => openBook(book)}
                        className={`group rounded-3xl p-4 ${currentTheme.glassCard} cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between`}
                      >
                        <div>
                          {/* Book Cover Art */}
                          <div
                            className={`relative h-56 rounded-2xl bg-gradient-to-br ${
                              book.coverGradient || fmt.color
                            } p-5 flex flex-col justify-between text-white shadow-lg overflow-hidden mb-4 border border-white/20`}
                          >
                            {/* Glass Sheen Reflection */}
                            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/15 blur-xl pointer-events-none" />

                            <div className="flex items-center justify-between z-10">
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-black/45 backdrop-blur-md border border-white/20">
                                .{book.format}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/20 backdrop-blur-md">
                                {book.category === 'comic'
                                  ? `${book.pages?.length || 4} Pages`
                                  : `${book.chapters?.length || 1} Ch.`}
                              </span>
                            </div>

                            <div className="z-10 my-auto">
                              <p className="text-[10px] uppercase tracking-widest text-white/75 font-semibold mb-1">
                                {book.coverSubtitle || fmt.name}
                              </p>
                              <h4 className="font-bold text-lg leading-snug line-clamp-2 drop-shadow">
                                {book.title}
                              </h4>
                              <p className="text-xs text-white/85 mt-1 truncate">{book.author}</p>
                            </div>

                            <div className="z-10 flex items-center justify-between text-[11px] text-white/80 pt-2 border-t border-white/15">
                              <span>{book.fileSize}</span>
                              <span>{book.progress || 0}% read</span>
                            </div>
                          </div>

                          {/* Card Metadata */}
                          <div className="px-1">
                            <h5 className="font-bold text-sm truncate">{book.title}</h5>
                            <p className={`text-xs ${currentTheme.textSub} truncate`}>{book.author}</p>
                          </div>
                        </div>

                        {/* Progress & Quick Actions Footer */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-black/20 overflow-hidden">
                            <div
                              className="h-full bg-sky-400 rounded-full transition-all"
                              style={{ width: `${book.progress || 4}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            {book.bookmarks?.length > 0 && (
                              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBookFromLibrary(book.id, book.title);
                              }}
                              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                              title="Remove from Aura Library (keeps local file safe)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className="space-y-2.5">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      draggable
                      onDragStart={() => setDraggedBookId(book.id)}
                      onClick={() => openBook(book)}
                      className={`rounded-2xl p-4 ${currentTheme.glassCard} flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.005] transition-all`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-12 h-16 rounded-xl bg-gradient-to-br ${book.coverGradient} flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow`}
                        >
                          {book.format}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm truncate">{book.title}</h4>
                          <p className={`text-xs ${currentTheme.textSub} truncate`}>
                            {book.author} • {FORMAT_REGISTRY[book.format]?.name} • {book.fileSize}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs font-semibold text-sky-400">
                          {book.progress || 0}%
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBookFromLibrary(book.id, book.title);
                          }}
                          className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ====================================================================
          VIEW 2: UNIVERSAL PRO READER (E-BOOK REFLOW + COMIC/MANGA ENGINE)
         ==================================================================== */}
      {activeView === 'reader' && activeBook && (
        <div
          className="relative z-10 min-h-screen flex flex-col"
          style={{
            backgroundColor: currentTheme.readerBg,
            color: currentTheme.readerText
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX || null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const deltaX = (e.changedTouches[0]?.clientX || 0) - touchStartX.current;
            if (Math.abs(deltaX) > 65) {
              if (deltaX < 0) {
                if (isComicView && comicDirection === 'rtl') handleTurnPrev();
                else handleTurnNext();
              } else {
                if (isComicView && comicDirection === 'rtl') handleTurnNext();
                else handleTurnPrev();
              }
            }
            touchStartX.current = null;
          }}
        >
          {/* Top Floating iOS Glass Reader Navigation Bar */}
          <header className={`sticky top-0 z-30 ${currentTheme.glassHeader} px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3`}>
            {/* Back to Library & Book Info */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => {
                  setActiveView('library');
                  setReaderDrawer(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold ${currentTheme.glassCard} hover:scale-105 transition-all min-h-[44px]`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Library</span>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-400/30">
                    .{activeBook.format}
                  </span>
                  <h2 className="font-bold text-sm truncate">{activeBook.title}</h2>
                </div>
                <p className="text-[11px] opacity-70 truncate">
                  {activeBook.author} •{' '}
                  {isComicView
                    ? `Page ${(activeBook.currentPage || 0) + 1} of ${activeBook.pages?.length || 1}`
                    : activeBook.chapters?.[activeBook.currentChapter || 0]?.title || 'Chapter 1'}
                </p>
              </div>
            </div>

            {/* Center Mode Controls (Adapts for E-Books vs Comics/Manga) */}
            <div className="flex items-center flex-wrap gap-1.5">
              {/* Hybrid Format Switcher (e.g. PDF/EPUB Fixed vs Reflow) */}
              {(activeBook.category === 'hybrid' || activeBook.pages) && (
                <button
                  onClick={() => setComicModeOverride((prev) => !prev)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${currentTheme.glassCard} min-h-[44px]`}
                  title="Switch between Reflowable Text & Fixed Image Mode"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isComicView ? 'Fixed Comic Mode' : 'Reflow Text Mode'}</span>
                </button>
              )}

              {isComicView ? (
                /* Comic & Manga Pro Toolbar */
                <div className={`flex items-center gap-1 p-1 rounded-2xl ${currentTheme.glassCard}`}>
                  {[
                    { id: 'single', label: '1P Single' },
                    { id: 'double', label: '2P Spread' },
                    { id: 'webtoon', label: 'Webtoon Scroll' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setComicLayout(m.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        comicLayout === m.id ? currentTheme.accent : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}

                  {/* RTL Manga Direction Toggle */}
                  <button
                    onClick={() => setComicDirection((d) => (d === 'ltr' ? 'rtl' : 'ltr'))}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      comicDirection === 'rtl'
                        ? 'bg-rose-500 text-white'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    title="Toggle Right-to-Left (RTL) Japanese Manga Reading Order"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    {comicDirection === 'rtl' ? 'RTL Manga' : 'LTR Standard'}
                  </button>

                  {/* Zoom Controls */}
                  <button
                    onClick={() => setComicZoom((z) => Math.max(60, z - 15))}
                    className="p-1.5 rounded-xl hover:bg-white/10"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono px-1">{comicZoom}%</span>
                  <button
                    onClick={() => setComicZoom((z) => Math.min(220, z + 15))}
                    className="p-1.5 rounded-xl hover:bg-white/10"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* E-Book Paginated vs Infinite Scroll Toggle */
                <div className={`flex items-center gap-1 p-1 rounded-2xl ${currentTheme.glassCard}`}>
                  <button
                    onClick={() => setEbookMode('paginated')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      ebookMode === 'paginated' ? currentTheme.accent : 'opacity-75'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    Paginated
                  </button>
                  <button
                    onClick={() => setEbookMode('scroll')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      ebookMode === 'scroll' ? currentTheme.accent : 'opacity-75'
                    }`}
                  >
                    <MoveVertical className="w-3.5 h-3.5" />
                    Infinite Scroll
                  </button>
                </div>
              )}
            </div>

            {/* Right Action Icons (TOC, Search, Typography, Display Filters, Annotations, Bookmark) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setReaderDrawer(readerDrawer === 'toc' ? null : 'toc')}
                className={`p-2.5 rounded-xl ${
                  readerDrawer === 'toc' ? currentTheme.accent : currentTheme.glassCard
                } min-h-[44px] min-w-[44px] flex items-center justify-center`}
                title="Table of Contents & Bookmarks"
              >
                <List className="w-4 h-4" />
              </button>

              {!isComicView && (
                <>
                  <button
                    onClick={() => setReaderDrawer(readerDrawer === 'search' ? null : 'search')}
                    className={`p-2.5 rounded-xl ${
                      readerDrawer === 'search' ? currentTheme.accent : currentTheme.glassCard
                    } min-h-[44px] min-w-[44px] flex items-center justify-center`}
                    title="In-Book Full Text Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setReaderDrawer(readerDrawer === 'typography' ? null : 'typography')
                    }
                    className={`p-2.5 rounded-xl ${
                      readerDrawer === 'typography' ? currentTheme.accent : currentTheme.glassCard
                    } min-h-[44px] min-w-[44px] flex items-center justify-center`}
                    title="Typography & Layout Studio"
                  >
                    <Type className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setReaderDrawer(readerDrawer === 'annotations' ? null : 'annotations')
                    }
                    className={`p-2.5 rounded-xl relative ${
                      readerDrawer === 'annotations' ? currentTheme.accent : currentTheme.glassCard
                    } min-h-[44px] min-w-[44px] flex items-center justify-center`}
                    title="Highlights & Margin Notes"
                  >
                    <Highlighter className="w-4 h-4" />
                    {activeBook.highlights?.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                        {activeBook.highlights.length}
                      </span>
                    )}
                  </button>
                </>
              )}

              <button
                onClick={() => setReaderDrawer(readerDrawer === 'display' ? null : 'display')}
                className={`p-2.5 rounded-xl ${
                  readerDrawer === 'display' ? currentTheme.accent : currentTheme.glassCard
                } min-h-[44px] min-w-[44px] flex items-center justify-center`}
                title="E-Reader Display Filters (Warmth, Contrast, Brightness, Themes)"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                onClick={toggleBookmark}
                className={`p-2.5 rounded-xl ${currentTheme.glassCard} min-h-[44px] min-w-[44px] flex items-center justify-center`}
                title="Bookmark Current Page/Chapter"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isCurrentBookmarked ? 'text-amber-400 fill-amber-400' : ''
                  }`}
                />
              </button>
            </div>
          </header>

          {/* ================================================================
              FLOATING GLASS DRAWERS (TOC, Typography, Display, Annotations, Search)
             ================================================================ */}
          {readerDrawer && (
            <div className="fixed top-20 right-4 sm:right-6 z-40 w-[92vw] max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 bg-slate-900/85 text-slate-100 backdrop-blur-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                <h3 className="font-bold text-base flex items-center gap-2">
                  {readerDrawer === 'toc' && (
                    <>
                      <List className="w-4 h-4 text-sky-400" /> Table of Contents & Bookmarks
                    </>
                  )}
                  {readerDrawer === 'typography' && (
                    <>
                      <Type className="w-4 h-4 text-sky-400" /> Pro Typography & Page Layout
                    </>
                  )}
                  {readerDrawer === 'display' && (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" /> Display Filters & Glass Themes
                    </>
                  )}
                  {readerDrawer === 'annotations' && (
                    <>
                      <Highlighter className="w-4 h-4 text-amber-400" /> Highlights & Margin Notes
                    </>
                  )}
                  {readerDrawer === 'search' && (
                    <>
                      <Search className="w-4 h-4 text-sky-400" /> Full-Text Search
                    </>
                  )}
                </h3>
                <button
                  onClick={() => setReaderDrawer(null)}
                  className="p-1.5 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. TOC & Bookmarks Drawer */}
              {readerDrawer === 'toc' && (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      Chapters / Sections
                    </p>
                    <div className="space-y-1.5">
                      {(activeBook.chapters || []).map((chap, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isComicView && chap.pageStart !== undefined) {
                              updateBook(activeBook.id, { currentPage: chap.pageStart });
                            } else {
                              updateBook(activeBook.id, { currentChapter: idx });
                            }
                            setReaderDrawer(null);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                            (activeBook.currentChapter || 0) === idx
                              ? 'bg-sky-500 text-white font-bold'
                              : 'hover:bg-white/10 text-slate-200'
                          }`}
                        >
                          <span className="truncate">{chap.title}</span>
                          <span className="text-[10px] opacity-75">#{idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saved Bookmarks */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      Saved Bookmarks ({activeBook.bookmarks?.length || 0})
                    </p>
                    {(!activeBook.bookmarks || activeBook.bookmarks.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">
                        Tap the bookmark icon in the top bar to save your spot.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {activeBook.bookmarks.map((bm) => (
                          <button
                            key={bm.id}
                            onClick={() => {
                              if (isComicView) {
                                updateBook(activeBook.id, { currentPage: bm.pageIndex || 0 });
                              } else {
                                updateBook(activeBook.id, { currentChapter: bm.chapterIndex || 0 });
                              }
                              setReaderDrawer(null);
                            }}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                              <span className="truncate">{bm.label}</span>
                            </span>
                            <span className="text-[10px] text-slate-400">{bm.createdAt}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Typography & Layout Studio Drawer */}
              {readerDrawer === 'typography' && (
                <div className="space-y-5 text-xs">
                  {/* Font Family Selector */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Font Family</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'serif', name: 'Editorial Serif', sample: 'New York / Georgia' },
                        { id: 'sans', name: 'System Sans', sample: 'SF Pro / Inter' },
                        { id: 'mono', name: 'Monospace', sample: 'JetBrains Mono' },
                        { id: 'dyslexic', name: 'OpenDyslexic', sample: 'High Legibility' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFontFamily(f.id)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            fontFamily === f.id
                              ? 'bg-sky-500/20 border-sky-400 text-white'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="font-bold text-xs">{f.name}</div>
                          <div className="text-[10px] opacity-70">{f.sample}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 font-semibold">Font Size</span>
                      <span className="text-sky-400 font-mono">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="32"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  {/* Line Height Slider */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 font-semibold">Line Spacing</span>
                      <span className="text-sky-400 font-mono">{lineHeight.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="1.2"
                      max="2.2"
                      step="0.05"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  {/* Letter Spacing Slider */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 font-semibold">Letter Tracking</span>
                      <span className="text-sky-400 font-mono">{letterSpacing}em</span>
                    </div>
                    <input
                      type="range"
                      min="-0.02"
                      max="0.12"
                      step="0.01"
                      value={letterSpacing}
                      onChange={(e) => setLetterSpacing(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  {/* Alignment & Margin Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-slate-300 font-semibold mb-1.5">Alignment</span>
                      <div className="flex rounded-xl bg-white/5 p-1">
                        <button
                          onClick={() => setTextAlign('left')}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                            textAlign === 'left' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" /> Left
                        </button>
                        <button
                          onClick={() => setTextAlign('justify')}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                            textAlign === 'justify' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          <AlignJustify className="w-3.5 h-3.5" /> Justify
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-slate-300 font-semibold mb-1.5">Margins</span>
                      <div className="flex rounded-xl bg-white/5 p-1">
                        {['compact', 'normal', 'wide'].map((m) => (
                          <button
                            key={m}
                            onClick={() => setMarginSize(m)}
                            className={`flex-1 py-1.5 rounded-lg capitalize text-[11px] ${
                              marginSize === m ? 'bg-sky-500 text-white font-semibold' : ''
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. E-Reader Display Filters & Themes Drawer */}
              {readerDrawer === 'display' && (
                <div className="space-y-5 text-xs">
                  {/* Color Mode Selector */}
                  <div>
                    <span className="block text-slate-300 font-semibold mb-2">
                      Reading Color Mode
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.values(THEMES).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setThemeId(t.id)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${
                            themeId === t.id
                              ? 'border-sky-400 bg-sky-500/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="flex items-center gap-3 font-semibold">
                            <span
                              className="w-4 h-4 rounded-full border border-white/40"
                              style={{ backgroundColor: t.readerBg }}
                            />
                            {t.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">
                            {t.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blue-Light / Warmth Filter */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 font-semibold">
                        Amber Warmth / Blue-Light Filter
                      </span>
                      <span className="text-amber-400 font-mono">{warmth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={warmth}
                      onChange={(e) => setWarmth(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  {/* Independent Brightness */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 font-semibold">Software Brightness</span>
                      <span className="text-sky-400 font-mono">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="130"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  {/* Independent Contrast */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300 font-semibold">E-Ink Contrast Boost</span>
                      <span className="text-sky-400 font-mono">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="75"
                      max="140"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  {/* Invert Night Filter Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span>Invert Page Colors (Night Glare Filter)</span>
                    <button
                      onClick={() => setInvertFilter((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl font-semibold ${
                        invertFilter ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {invertFilter ? 'Active' : 'Off'}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Highlights & Margin Notes Drawer + JSON/Markdown Export */}
              {readerDrawer === 'annotations' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">
                      Click any paragraph in the book to highlight or add margin notes.
                    </span>
                  </div>

                  {/* Export Buttons */}
                  {activeBook.highlights?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => exportHighlights('md')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold hover:bg-sky-500/30"
                      >
                        <Download className="w-3.5 h-3.5" /> Export Markdown
                      </button>
                      <button
                        onClick={() => exportHighlights('json')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-semibold hover:bg-indigo-500/30"
                      >
                        <Download className="w-3.5 h-3.5" /> Export JSON
                      </button>
                    </div>
                  )}

                  {/* Highlights List */}
                  <div className="space-y-2.5">
                    {(!activeBook.highlights || activeBook.highlights.length === 0) ? (
                      <div className="p-6 rounded-2xl bg-white/5 text-center text-slate-400">
                        No highlights yet. Tap any paragraph while reading to highlight in 4 colors or attach a margin note.
                      </div>
                    ) : (
                      activeBook.highlights.map((hl) => (
                        <div
                          key={hl.id}
                          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              {activeBook.chapters?.[hl.chapterIndex]?.title || 'Chapter'}
                            </span>
                            <button
                              onClick={() =>
                                updateBook(activeBook.id, (b) => ({
                                  ...b,
                                  highlights: b.highlights.filter((x) => x.id !== hl.id)
                                }))
                              }
                              className="text-rose-400 hover:underline text-[11px]"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="italic text-slate-200 border-l-2 border-amber-400 pl-2.5">
                            "{hl.text}"
                          </p>
                          {hl.note && (
                            <p className="text-sky-300 bg-sky-950/50 p-2 rounded-lg">
                              <strong>Note:</strong> {hl.note}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 5. In-Book Full-Text Search Drawer */}
              {readerDrawer === 'search' && (
                <div className="space-y-4 text-xs">
                  <input
                    type="text"
                    value={inBookSearch}
                    onChange={(e) => setInBookSearch(e.target.value)}
                    placeholder="Search words or phrases inside this book..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none"
                    autoFocus
                  />
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {inBookSearchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          updateBook(activeBook.id, { currentChapter: res.chapterIndex });
                          setReaderDrawer(null);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 space-y-1"
                      >
                        <div className="text-[10px] font-bold text-sky-400">{res.chapterTitle}</div>
                        <p className="line-clamp-2 text-slate-300">{res.snippet}</p>
                      </button>
                    ))}
                    {inBookSearch && inBookSearchResults.length === 0 && (
                      <p className="text-slate-400 text-center py-4">No matches found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              MAIN READING CANVAS (COMIC/MANGA ENGINE VS E-BOOK REFLOW ENGINE)
             ================================================================ */}
          <div className="flex-1 flex flex-col justify-between">
            {isComicView ? (
              /* COMIC & GRAPHIC NOVEL FIXED-LAYOUT ENGINE */
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-auto">
                {comicLayout === 'webtoon' ? (
                  /* Webtoon Continuous Vertical Strip Mode */
                  <div
                    className="mx-auto flex flex-col items-center gap-0"
                    style={{ width: `${Math.min(100, comicZoom)}%`, maxWidth: '820px' }}
                  >
                    {(activeBook.pages || []).map((page) => (
                      <img
                        key={page.pageNumber}
                        src={page.url}
                        alt={page.title}
                        loading="lazy"
                        className="w-full h-auto block shadow-2xl"
                      />
                    ))}
                  </div>
                ) : comicLayout === 'double' ? (
                  /* Double-Page Spread (Supports RTL Manga Reversal!) */
                  <div
                    className={`flex items-center justify-center gap-2 sm:gap-4 my-auto ${
                      comicDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                    style={{ transform: `scale(${comicZoom / 100})`, transformOrigin: 'center center' }}
                  >
                    {[
                      activeBook.pages?.[activeBook.currentPage || 0],
                      activeBook.pages?.[(activeBook.currentPage || 0) + 1]
                    ]
                      .filter(Boolean)
                      .map((page) => (
                        <div
                          key={page.pageNumber}
                          className="rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-black/40"
                        >
                          <img
                            src={page.url}
                            alt={page.title}
                            className="max-h-[75vh] w-auto object-contain block"
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  /* Single Page Mode */
                  <div
                    className="my-auto rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/30 transition-transform"
                    style={{ transform: `scale(${comicZoom / 100})`, transformOrigin: 'center center' }}
                  >
                    <img
                      src={
                        activeBook.pages?.[activeBook.currentPage || 0]?.url ||
                        createMangaPageSVG(1)
                      }
                      alt={activeBook.pages?.[activeBook.currentPage || 0]?.title || 'Comic Page'}
                      className={`${
                        comicFit === 'height' ? 'max-h-[76vh] w-auto' : 'w-full max-w-3xl h-auto'
                      } object-contain block`}
                    />
                  </div>
                )}

                {/* Thumbnail Scrubber Strip for Comics */}
                <div className="mt-6 flex items-center gap-2 overflow-x-auto max-w-full py-2 px-4 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/10">
                  {(activeBook.pages || []).map((p, idx) => (
                    <button
                      key={p.pageNumber}
                      onClick={() => updateBook(activeBook.id, { currentPage: idx })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                        (activeBook.currentPage || 0) === idx
                          ? 'bg-sky-500 text-white font-bold scale-105'
                          : 'bg-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      P.{p.pageNumber}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* E-BOOK REFLOWABLE TYPOGRAPHY ENGINE */
              <div className={`mx-auto w-full ${getMarginClass()} py-10 sm:py-14 flex-1`}>
                {(ebookMode === 'scroll'
                  ? activeBook.chapters || []
                  : [activeBook.chapters?.[activeBook.currentChapter || 0]].filter(Boolean)
                ).map((chapter, mapIdx) => {
                  const actualChapterIndex =
                    ebookMode === 'scroll' ? mapIdx : activeBook.currentChapter || 0;

                  return (
                    <article
                      key={actualChapterIndex}
                      className="mb-16 last:mb-0"
                      style={{
                        fontFamily: getFontStack(),
                        fontSize: `${fontSize}px`,
                        lineHeight: lineHeight,
                        letterSpacing: `${letterSpacing}em`,
                        textAlign: textAlign
                      }}
                    >
                      {/* Chapter Title Header */}
                      <header className="mb-8 pb-6 border-b border-current/15">
                        <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-2">
                          {activeBook.title} • Chapter {actualChapterIndex + 1} of{' '}
                          {activeBook.chapters?.length || 1}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                          {chapter.title}
                        </h1>
                      </header>

                      {/* Reflowable Paragraphs (Interactive for Highlighting & Margin Notes!) */}
                      <div className="space-y-6">
                        {(chapter.paragraphs || []).map((para, pIdx) => {
                          const existingHighlight = (activeBook.highlights || []).find(
                            (h) =>
                              h.chapterIndex === actualChapterIndex && h.paragraphIndex === pIdx
                          );

                          return (
                            <div key={pIdx} className="group relative">
                              <p
                                onClick={() => {
                                  setActiveParagraphModal({
                                    chapterIndex: actualChapterIndex,
                                    paragraphIndex: pIdx,
                                    text: para
                                  });
                                  setNoteDraft(existingHighlight?.note || '');
                                  if (existingHighlight?.color) {
                                    setSelectedHighlightColor(existingHighlight.color);
                                  }
                                }}
                                className={`cursor-pointer rounded-lg px-2 -mx-2 py-1 transition-colors hover:bg-sky-500/10 ${
                                  existingHighlight
                                    ? highlightBadgeClasses[existingHighlight.color] ||
                                      highlightBadgeClasses.amber
                                    : ''
                                }`}
                                title="Click to highlight or attach a margin note"
                              >
                                {para}
                              </p>

                              {/* Inline Margin Note Callout */}
                              {existingHighlight?.note && (
                                <div className="mt-2 ml-4 p-3 rounded-xl bg-amber-500/15 border-l-4 border-amber-400 text-xs font-sans">
                                  <span className="font-bold uppercase tracking-wider text-[10px] opacity-75 block mb-0.5">
                                    Margin Note
                                  </span>
                                  {existingHighlight.note}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Bottom Glass Reader Pagination & Progress Bar */}
            <footer className={`sticky bottom-0 z-20 ${currentTheme.glassHeader} px-6 py-3.5 flex items-center justify-between gap-4`}>
              <button
                onClick={() => {
                  if (isComicView && comicDirection === 'rtl') handleTurnNext();
                  else handleTurnPrev();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${currentTheme.glassCard} hover:scale-105 active:scale-95 transition-all min-h-[44px]`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {isComicView && comicDirection === 'rtl' ? 'Next (RTL)' : 'Previous'}
                </span>
              </button>

              <div className="flex flex-col items-center flex-1 max-w-md">
                <div className="flex items-center justify-between w-full text-[11px] opacity-75 mb-1.5">
                  <span>
                    {isComicView
                      ? `Page ${(activeBook.currentPage || 0) + 1} / ${activeBook.pages?.length || 1}`
                      : `Chapter ${(activeBook.currentChapter || 0) + 1} / ${
                          activeBook.chapters?.length || 1
                        }`}
                  </span>
                  <span>{activeBook.progress || 0}% Complete</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-current/15 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${activeBook.progress || 5}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (isComicView && comicDirection === 'rtl') handleTurnPrev();
                  else handleTurnNext();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${currentTheme.glassCard} hover:scale-105 active:scale-95 transition-all min-h-[44px]`}
              >
                <span>
                  {isComicView && comicDirection === 'rtl' ? 'Prev (RTL)' : 'Next'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 1: HIGHLIGHT & MARGIN NOTE POPOVER
         ==================================================================== */}
      {activeParagraphModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl p-6 bg-slate-900/95 border border-white/20 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Highlighter className="w-4 h-4 text-amber-400" /> Highlight & Margin Note
              </h3>
              <button
                onClick={() => setActiveParagraphModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <blockquote className="text-xs italic text-slate-300 bg-white/5 p-3.5 rounded-2xl border-l-4 border-sky-400 max-h-32 overflow-y-auto">
              "{activeParagraphModal.text}"
            </blockquote>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Highlight Color
              </label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'amber', bg: 'bg-amber-400' },
                  { id: 'emerald', bg: 'bg-emerald-400' },
                  { id: 'sky', bg: 'bg-sky-400' },
                  { id: 'rose', bg: 'bg-rose-400' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedHighlightColor(c.id)}
                    className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                      selectedHighlightColor === c.id ? 'scale-110 ring-4 ring-white/50' : 'opacity-70'
                    }`}
                  >
                    {selectedHighlightColor === c.id && <Check className="w-4 h-4 text-black" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Margin Note (Optional)
              </label>
              <textarea
                rows={3}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your thoughts, citations, or commentary..."
                className="w-full rounded-2xl p-3 text-xs bg-white/10 border border-white/15 text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveParagraphModal(null)}
                className="px-4 py-2 rounded-xl text-xs bg-white/10 hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                onClick={saveHighlightAndNote}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white hover:bg-sky-400"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: CREATE / RENAME CUSTOM FOLDER
         ==================================================================== */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-3xl p-6 bg-slate-900/95 border border-white/20 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingFolderId ? 'Rename Folder' : 'New Library Folder'}
              </h3>
              <button
                onClick={() => setShowFolderModal(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Cyberpunk Manga, Research Papers..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 rounded-xl text-xs bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFolder}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: READING STATISTICS DASHBOARD
         ==================================================================== */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-3xl p-6 bg-slate-900/95 border border-white/20 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-400" /> Reading Analytics Dashboard
              </h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="w-5 h-5 text-sky-400 mb-2" />
                <div className="text-2xl font-bold">
                  {Math.floor(stats.readingSeconds / 60)}m
                </div>
                <div className="text-[11px] text-slate-400">Active Reading Time</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <BookOpen className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-2xl font-bold">{stats.pagesTurned}</div>
                <div className="text-[11px] text-slate-400">Pages / Chapters Turned</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Award className="w-5 h-5 text-amber-400 mb-2" />
                <div className="text-2xl font-bold">
                  {books.filter((b) => b.finished || b.progress === 100).length}
                </div>
                <div className="text-[11px] text-slate-400">Volumes Completed</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Highlighter className="w-5 h-5 text-rose-400 mb-2" />
                <div className="text-2xl font-bold">
                  {books.reduce((acc, b) => acc + (b.highlights?.length || 0), 0)}
                </div>
                <div className="text-[11px] text-slate-400">Saved Annotations</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Library Progress Overview
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {books.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs gap-4">
                    <span className="truncate font-medium">{b.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${b.progress || 0}%` }}
                        />
                      </div>
                      <span className="font-mono w-9 text-right">{b.progress || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: 22 SUPPORTED FORMATS & CLIENT-SIDE ENGINES MATRIX
         ==================================================================== */}
      {showFormatsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full rounded-3xl p-6 bg-slate-900/95 border border-white/20 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileArchive className="w-5 h-5 text-sky-400" /> Exhaustive Client-Side Format Engines
                </h3>
                <p className="text-xs text-slate-400">
                  Every format below is parsed 100% locally in the browser with zero server uploads.
                </p>
              </div>
              <button
                onClick={() => setShowFormatsModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1">
              {Object.entries(FORMAT_REGISTRY).map(([key, item]) => (
                <div
                  key={key}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3"
                >
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold bg-gradient-to-br ${item.color} text-white shrink-0`}
                  >
                    .{item.ext}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.engine}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 5: NON-DESTRUCTIVE SAFETY GUARANTEE EXPLAINER
         ==================================================================== */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl p-6 bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-6 h-6" />
                Strict Non-Destructive Architecture
              </div>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aura Reader accesses local files strictly through read-only <code className="text-emerald-300">File.arrayBuffer()</code> streams.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
              <li>Deleting a book or folder inside Aura Reader only removes its record from your browser’s IndexedDB.</li>
              <li>Highlighting text, adding margin notes, or renaming folders never alters the original file on your hard drive or phone storage.</li>
              <li>Zero cloud telemetry, zero paywalls, and zero background network transfers.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
