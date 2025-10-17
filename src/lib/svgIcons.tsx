import React from 'react';

export const TerminalSvg = (
  <svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
    <rect width="64" height="64" rx="8" fill="#0a0a0a" />
    <path d="M18 24l6 4-6 4" stroke="#33FF99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="30" y1="32" x2="44" y2="32" stroke="#33FFCC" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="6" y="6" width="52" height="52" rx="6" stroke="#00ffe0" strokeWidth="1.5" />
    <g opacity="0.3">
      <path d="M58 6v52M6 6v52" stroke="#00ffe0" strokeDasharray="2 2" />
    </g>
  </svg>
);

export const LogSvg = (
  <svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
    <rect width="64" height="64" rx="8" fill="#0a0a0a" />
    <path d="M20 20h24v24H20z" stroke="#FF3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20l-4-4M44 20l4-4M20 44l-4 4M44 44l4 4" stroke="#FF3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="6" width="52" height="52" rx="6" stroke="#00ffe0" strokeWidth="1.5" />
    <g opacity="0.3">
      <path d="M58 6v52M6 6v52" stroke="#00ffe0" strokeDasharray="2 2" />
    </g>
  </svg>
);

export const KernelSvg = (
  <svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
    <rect width="64" height="64" rx="8" fill="#0a0a0a" />
    <circle cx="32" cy="32" r="12" stroke="#00FFCC" strokeWidth="2" />
    <path d="M32 8v6M32 56v-6M8 32h6M56 32h-6" stroke="#00FFCC" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 20l4 4M44 44l-4-4M20 44l4-4M44 20l-4 4" stroke="#00FFCC" strokeWidth="2" strokeLinecap="round" />
    <rect x="6" y="6" width="52" height="52" rx="6" stroke="#00ffe0" strokeWidth="1.5" />
    <g opacity="0.3">
      <path d="M58 6v52M6 6v52" stroke="#00ffe0" strokeDasharray="2 2" />
    </g>
  </svg>
);

export const FileExplorerSvg = (
  <svg
    className="w-24 h-24"
    width="96"
    height="96"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="title desc"
  >
    <title id="title">Cyberpunk File Explorer Icon</title>
    <desc id="desc">Neon window with sidebar, tabs, and files, glowing edges and grid accents</desc>

    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <style>
        {`
        :root {
          --bg: #0a0a0a;
          --accent: #00ffe0;   /* cyan */
          --accent2: #33ff99;  /* neon green */
          --accent3: #33ffcc;  /* teal */
        }
      `}
      </style>
    </defs>

    <rect x="2" y="2" width="60" height="60" rx="8" fill="var(--bg)" />
    <rect x="2" y="2" width="60" height="60" rx="8" stroke="var(--accent)" strokeWidth="1.5" />

    <g opacity="0.25">
      <path d="M10 2v60M54 2v60" stroke="var(--accent)" strokeDasharray="2 2" />
    </g>

    <g filter="url(#glow)">
      <rect x="8" y="10" width="48" height="44" rx="6" fill="#0f0f10" stroke="var(--accent)" strokeWidth="1.5" />

      <rect x="8" y="10" width="48" height="8" rx="6" fill="#0c0c0d" />
      <circle cx="14" cy="14" r="1.2" fill="var(--accent2)" />
      <circle cx="18" cy="14" r="1.2" fill="var(--accent3)" />
      <circle cx="22" cy="14" r="1.2" fill="var(--accent)" />

      <line x1="26" y1="14" x2="50" y2="14" stroke="var(--accent3)" strokeWidth="1.25" strokeLinecap="round" />

      <rect x="10.5" y="20" width="10" height="32" rx="3" fill="#0d1111" stroke="var(--accent3)" strokeWidth="1" />

      <g opacity="0.9" stroke="var(--accent2)" strokeWidth="1" strokeLinecap="round">
        <line x1="13" y1="24" x2="18" y2="24" />
        <line x1="13" y1="28" x2="18" y2="28" />
        <line x1="13" y1="32" x2="18" y2="32" />
        <line x1="13" y1="36" x2="18" y2="36" />
        <line x1="13" y1="40" x2="18" y2="40" />
        <line x1="13" y1="44" x2="18" y2="44" />
      </g>

      <rect x="22.5" y="20" width="31" height="32" rx="3" fill="#0b0f0f" stroke="var(--accent3)" strokeWidth="1" />

      <g transform="translate(26,24)">
        <path d="M2 4h6.5l1.8-2H16a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          fill="none" stroke="var(--accent2)" strokeWidth="1.25" strokeLinejoin="round" />
      </g>

      <g opacity="0.95" strokeLinecap="round">
        <path d="M26 34h18" stroke="var(--accent)" strokeWidth="1.25" />
        <circle cx="46" cy="34" r="1.2" fill="var(--accent2)" />
        <path d="M26 38h16" stroke="var(--accent)" strokeWidth="1.25" />
        <circle cx="44" cy="38" r="1.2" fill="var(--accent3)" />
        <path d="M26 42h20" stroke="var(--accent)" strokeWidth="1.25" />
        <circle cx="48" cy="42" r="1.2" fill="var(--accent2)" />
      </g>

      <g opacity="0.9" stroke="var(--accent2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 54l3-2-3-2" />
        <path d="M18 54l3-2-3-2" />
      </g>
    </g>
  </svg>

);


export const NotesSvg = (
  <svg
    className="w-24 h-24"
    width="96"
    height="96"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="title desc"
  >
    <title id="title">Cyberpunk Notes Icon</title>
    <desc id="desc">Neon notes window with dog-eared page, ruled lines, and a glowing pen</desc>
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <style>
        {`
        :root {
          --bg: #0a0a0a;
          --accent: #00ffe0;
          --accent2: #33ff99;
          --accent3: #33ffcc;
        }
      `}
      </style>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="8" fill="var(--bg)" />
    <rect x="2" y="2" width="60" height="60" rx="8" stroke="var(--accent)" strokeWidth="1.5" />
    <g opacity="0.25">
      <path d="M10 2v60M54 2v60" stroke="var(--accent)" strokeDasharray="2 2" />
    </g>
    <g filter="url(#glow)">
      <rect x="8" y="10" width="48" height="44" rx="6" fill="#0f1011" stroke="var(--accent)" strokeWidth="1.5" />
      <rect x="8" y="10" width="48" height="8" rx="6" fill="#0c0d0e" />
      <circle cx="14" cy="14" r="1.2" fill="var(--accent2)" />
      <circle cx="18" cy="14" r="1.2" fill="var(--accent3)" />
      <circle cx="22" cy="14" r="1.2" fill="var(--accent)" />
      <line x1="26" y1="14" x2="50" y2="14" stroke="var(--accent3)" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M14 20h29c1.7 0 3 1.3 3 3v22l-6 6H14c-1.7 0-3-1.3-3-3V23c0-1.7 1.3-3 3-3z"
        fill="#0b0f0f"
        stroke="var(--accent3)"
        strokeWidth="1"
      />
      <path d="M46 45v-9l9 9h-7a2 2 0 0 1-2-2z" fill="#0b1212" stroke="var(--accent)" strokeWidth="1" />
      <g fill="var(--accent2)" opacity="0.9">
        <circle cx="16" cy="24" r="0.9" />
        <circle cx="16" cy="28" r="0.9" />
        <circle cx="16" cy="32" r="0.9" />
        <circle cx="16" cy="36" r="0.9" />
        <circle cx="16" cy="40" r="0.9" />
      </g>
      <g stroke="var(--accent)" strokeWidth="1.1" strokeLinecap="round" opacity="0.95">
        <line x1="19" y1="24" x2="40" y2="24" />
        <line x1="19" y1="28" x2="44" y2="28" />
        <line x1="19" y1="32" x2="42" y2="32" />
        <line x1="19" y1="36" x2="46" y2="36" />
        <line x1="19" y1="40" x2="41" y2="40" />
      </g>
      <g transform="translate(34,42) rotate(-18)">
        <rect x="0" y="0" width="14" height="3" rx="1.5" fill="#0c1212" stroke="var(--accent2)" strokeWidth="1" />
        <rect x="2" y="-1" width="10" height="1" rx="0.5" fill="var(--accent)" />
        <path d="M14 1.5 L17 0 L17 3 L14 1.5 Z" fill="var(--accent3)" stroke="var(--accent2)" strokeWidth="0.8" />
      </g>
      <g opacity="0.9" stroke="var(--accent2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 54l3-2-3-2" />
        <path d="M18 54l3-2-3-2" />
      </g>
    </g>
  </svg>

);

export const MusicSvg = (
	<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect width="64" height="64" rx="8" fill="#09090f" />
		<rect x="2" y="2" width="60" height="60" rx="8" stroke="#00ffe0" strokeWidth="1.5" />
		<path d="M22 20v24" stroke="#33ffcc" strokeWidth="2" strokeLinecap="round" />
		<path d="M42 16v22" stroke="#ff3df5" strokeWidth="2" strokeLinecap="round" />
		<circle cx="22" cy="44" r="6" fill="#0f1022" stroke="#33ffcc" strokeWidth="2" />
		<circle cx="42" cy="40" r="6" fill="#150f22" stroke="#ff3df5" strokeWidth="2" />
		<path d="M20 28h8" stroke="#00ffe0" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M40 22h8" stroke="#ff3df5" strokeWidth="1.5" strokeLinecap="round" />
		<g opacity="0.3" stroke="#00ffe0" strokeDasharray="2 2">
			<path d="M10 2v60" />
			<path d="M54 2v60" />
		</g>
	</svg>
);

export const DataSvg = (
	<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect width="64" height="64" rx="8" fill="#0a0a12" />
		<rect x="2" y="2" width="60" height="60" rx="8" stroke="#7b5bff" strokeWidth="1.5" />
		<rect x="12" y="16" width="40" height="32" rx="4" fill="#0c0d1f" stroke="#7b5bff" strokeWidth="1.5" />
		<path d="M16 22h12" stroke="#33ffcc" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M16 28h24" stroke="#33ffcc" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M16 34h20" stroke="#33ffcc" strokeWidth="1.5" strokeLinecap="round" />
		<rect x="30" y="40" width="18" height="6" rx="2" fill="#16172f" stroke="#ff3df5" strokeWidth="1.2" />
		<path d="M34 42h6" stroke="#ff3df5" strokeWidth="1.2" strokeLinecap="round" />
		<g opacity="0.3" stroke="#7b5bff" strokeDasharray="2 2">
			<path d="M12 10h40" />
			<path d="M12 50h40" />
		</g>
	</svg>
);

export const LockSvg = (
	<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect width="64" height="64" rx="8" fill="#0a0a0a" />
		<rect x="2" y="2" width="60" height="60" rx="8" stroke="#00ffe0" strokeWidth="1.5" />
		<rect x="20" y="28" width="24" height="18" rx="2" fill="#0f0f10" stroke="#33ff99" strokeWidth="1.5" />
		<path d="M24 28v-6a8 8 0 0 1 16 0v6" stroke="#33ff99" strokeWidth="1.5" strokeLinecap="round" />
		<circle cx="32" cy="37" r="2" fill="#33ff99" />
		<g opacity="0.3" stroke="#00ffe0" strokeDasharray="2 2">
			<path d="M10 2v60" />
			<path d="M54 2v60" />
		</g>
	</svg>
);

export const MiraSvg = (
	<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect width="64" height="64" rx="8" fill="#0a0a0a" />
		<rect x="2" y="2" width="60" height="60" rx="8" stroke="#BC13FE" strokeWidth="1.5" />
		<circle cx="32" cy="24" r="10" fill="#1a0a1a" stroke="#FF073A" strokeWidth="2" />
		<path d="M32 34c-6 0-10 4-10 8s4 8 10 8 10-4 10-8-4-8-10-8z" fill="#1a0a1a" stroke="#BC13FE" strokeWidth="2" />
		<circle cx="28" cy="22" r="1.5" fill="#BC13FE" />
		<circle cx="36" cy="22" r="1.5" fill="#BC13FE" />
		<path d="M28 30c2 2 4 2 6 0" stroke="#FF073A" strokeWidth="1.5" strokeLinecap="round" />
		<g opacity="0.3" stroke="#BC13FE" strokeDasharray="2 2">
			<path d="M10 2v60" />
			<path d="M54 2v60" />
		</g>
	</svg>
);
