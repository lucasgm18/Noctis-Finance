export function NoctisLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} fill="none">
      <defs>
        <linearGradient id="noctisPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#835FFF" />
          <stop offset="100%" stopColor="#6E44FF" />
        </linearGradient>
        <linearGradient id="noctisBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2D2054" />
          <stop offset="100%" stopColor="#231942" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="120" fill="url(#noctisBg)" />
      <rect x="16" y="16" width="480" height="480" rx="106" fill="none" stroke="#6E44FF" strokeWidth="4" strokeOpacity="0.3" />
      <path d="M116 124 L256 188 L396 124 L380 300 C380 385 325 436 256 436 C187 436 132 385 132 300 Z" fill="url(#noctisPurple)" />
      <path d="M116 124 L256 204 L396 124 L388 164 L256 236 L124 164 Z" fill="#E5DEFF" />
      <circle cx="192" cy="248" r="68" fill="#EDE5D5" />
      <circle cx="320" cy="248" r="68" fill="#EDE5D5" />
      <circle cx="192" cy="248" r="54" fill="#F7F2E7" />
      <circle cx="320" cy="248" r="54" fill="#F7F2E7" />
      <circle cx="192" cy="248" r="30" fill="#231942" />
      <circle cx="320" cy="248" r="30" fill="#231942" />
      <circle cx="192" cy="248" r="14" fill="#6E44FF" />
      <circle cx="320" cy="248" r="14" fill="#6E44FF" />
      <circle cx="204" cy="234" r="8" fill="#F7F2E7" />
      <circle cx="332" cy="234" r="8" fill="#F7F2E7" />
      <polygon points="256,264 282,304 256,348 230,304" fill="#F7F2E7" />
      <polygon points="256,264 282,304 256,348" fill="#EDE5D5" />
      <rect x="212" y="376" width="18" height="28" rx="9" fill="#E5DEFF" opacity="0.9" />
      <rect x="247" y="362" width="18" height="42" rx="9" fill="#F7F2E7" />
      <rect x="282" y="348" width="18" height="56" rx="9" fill="#E5DEFF" opacity="0.9" />
    </svg>
  );
}

export default NoctisLogo;
