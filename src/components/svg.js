import React from 'react'

// ICONS
// -----

export const ExternalLinkIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 11V17C16 17.5304 15.7893 18.0391 15.4142 18.4142C15.0391 18.7893 14.5304 19 14 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V6C1 5.46957 1.21071 4.96086 1.58579 4.58579C1.96086 4.21071 2.46957 4 3 4H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M13 1H19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M8 12L19 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

// PROJECT INDICATORS
// ------------------

export const ActiveIndicator = () => <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M4.2996 0.000706934C5.54667 0.0206046 6.80501 0.466749 7.52618 1.45844C8.20854 2.39677 8.03575 3.61792 7.73967 4.73121C7.4575 5.79221 6.93453 6.7802 5.9637 7.33358C4.88405 7.94899 3.57456 8.23971 2.42426 7.76106C1.21805 7.25914 0.399445 6.14458 0.11023 4.89788C-0.178232 3.65442 0.100099 2.33251 0.937764 1.35332C1.75453 0.398555 3.02425 -0.0196419 4.2996 0.000706934Z" fill="url(#active_background)"/>
  <g filter="url(#active_shadows)">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.30002 1.00026C5.1929 0.989476 6.09814 1.31013 6.62764 2.02174C7.13724 2.7066 7.02911 3.60311 6.8568 4.43638C6.67754 5.3033 6.44129 6.22562 5.6669 6.66793C4.83458 7.14332 3.80247 7.07272 2.92673 6.68111C2.02183 6.27646 1.21996 5.56193 1.03456 4.59646C0.855275 3.6629 1.40078 2.78393 2.04258 2.07713C2.63002 1.43019 3.42124 1.01088 4.30002 1.00026Z" fill="url(#active_foreground)"/>
  </g>
  <defs>
    <filter id="active_shadows" x="0" y="1" width="8" height="8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    <linearGradient id="active_background" x1="4" y1="0" x2="4" y2="8" gradientUnits="userSpaceOnUse">
      <stop stopColor="#38A169"/>
      <stop offset="1" stopColor="#2F855A"/>
    </linearGradient>
    <linearGradient id="active_foreground" x1="4" y1="1" x2="4" y2="7" gradientUnits="userSpaceOnUse">
      <stop stopColor="#9AE6B4"/>
      <stop offset="1" stopColor="#68D391"/>
    </linearGradient>
  </defs>
</svg>

export const IdleIndicator = () => <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M3.99794 0.00366085C5.33029 -0.0628191 6.49426 0.785611 7.2699 1.77731C7.99345 2.7024 8.13879 3.85789 7.88263 4.97045C7.61987 6.11172 7.04729 7.25632 5.89343 7.75569C4.74629 8.25214 3.42291 7.92226 2.29625 7.38811C1.21874 6.87725 0.28353 6.07186 0.0475941 4.98414C-0.181461 3.92813 0.454035 2.95468 1.14551 2.0829C1.89638 1.13622 2.71999 0.0674262 3.99794 0.00366085Z" fill="url(#idle_background)"/>
  <g filter="url(#idle_shadows)">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.28342 1.02171C5.11885 1.07195 5.96333 1.28185 6.49094 1.93986C7.02374 2.60435 7.06579 3.49079 6.94219 4.33762C6.80126 5.30324 6.64083 6.43149 5.77333 6.85661C4.90498 7.28214 3.95381 6.6675 3.09475 6.22305C2.27274 5.79776 1.39582 5.34705 1.12692 4.45268C0.838085 3.49199 1.0448 2.38768 1.72074 1.65297C2.35129 0.967582 3.36012 0.966176 4.28342 1.02171Z" fill="url(#idle_foreground)"/>
  </g>
  <defs>
    <filter id="idle_shadows" x="0" y="1" width="8" height="8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    <linearGradient id="idle_background" x1="4" y1="0" x2="4" y2="8" gradientUnits="userSpaceOnUse">
      <stop stopColor="#C4C4C4"/>
      <stop offset="0.0001" stopColor="#D69E2E"/>
      <stop offset="1" stopColor="#B7791F"/>
    </linearGradient>
    <linearGradient id="idle_foreground" x1="4" y1="1" x2="4" y2="7" gradientUnits="userSpaceOnUse">
      <stop stopColor="#FAF089"/>
      <stop offset="1" stopColor="#F6E05E"/>
    </linearGradient>
  </defs>
</svg>

export const FutureIndicator = () => <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M4.21678 0.00187134C5.45273 0.0470264 6.35499 1.01206 7.07736 1.96981C7.74421 2.85395 8.13583 3.88454 7.95656 4.96023C7.75999 6.13974 7.24971 7.40501 6.09473 7.86596C4.97915 8.31119 3.84187 7.54717 2.75841 7.0348C1.69943 6.53401 0.461318 6.11718 0.116272 5.03877C-0.249849 3.8945 0.298327 2.69516 1.06757 1.75024C1.85135 0.787485 2.93987 -0.0447798 4.21678 0.00187134Z" fill="url(#future_background)"/>
  <g filter="url(#future_shadows)">
    <path fill-rule="evenodd" clipRule="evenodd" d="M4.11999 1.01287C4.96367 1.08361 5.62761 1.65002 6.15536 2.31306C6.68297 2.97592 7.12696 3.75714 6.96684 4.58955C6.80107 5.4513 6.12567 6.08876 5.35039 6.49771C4.53211 6.92936 3.58002 7.19535 2.73331 6.82274C1.85646 6.43687 1.31799 5.56322 1.10278 4.6285C0.886901 3.6909 0.991086 2.67001 1.60719 1.93172C2.20881 1.21077 3.18513 0.93449 4.11999 1.01287Z" fill="url(#future_foreground)"/>
  </g>
  <defs>
    <filter id="future_shadows" x="0" y="1" width="8" height="8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    <linearGradient id="future_background" x1="4" y1="0" x2="4" y2="8" gradientUnits="userSpaceOnUse">
      <stop stopColor="#805AD5"/>
      <stop offset="1" stopColor="#6B46C1"/>
    </linearGradient>
    <linearGradient id="future_foreground" x1="4" y1="1" x2="4" y2="7" gradientUnits="userSpaceOnUse">
      <stop stopColor="#D6BCFA"/>
      <stop offset="1" stopColor="#B794F4"/>
    </linearGradient>
  </defs>
</svg>

export const PastIndicator = () => <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M4.10198 0.0108017C5.17118 0.103043 5.90988 1.05773 6.59675 1.97031C7.3123 2.92099 8.16325 3.93396 7.97294 5.15377C7.77471 6.42434 6.77055 7.35279 5.68468 7.81639C4.6997 8.2369 3.6686 7.86483 2.69767 7.40594C1.64249 6.90724 0.448946 6.39906 0.113757 5.18343C-0.241218 3.89603 0.278226 2.51676 1.06736 1.49328C1.82285 0.513429 2.94241 -0.0892369 4.10198 0.0108017Z" fill="url(#past_background)"/>
  <g filter="url(#past_shadows)">
    <path fillRule="evenodd" clipRule="evenodd" d="M3.94806 1.03679C4.77628 1.0794 5.62147 1.20033 6.18597 1.83806C6.80362 2.53584 7.12687 3.49704 6.95344 4.43207C6.77355 5.40199 6.13949 6.21225 5.29411 6.64653C4.44207 7.08422 3.42751 7.14039 2.58948 6.67385C1.78527 6.22615 1.41819 5.29832 1.20388 4.36947C0.984812 3.41998 0.808596 2.33179 1.41715 1.59274C2.0102 0.872494 3.04234 0.990196 3.94806 1.03679Z" fill="url(#past_foreground)"/>
  </g>
  <defs>
    <filter id="past_shadows" x="0" y="1" width="8" height="8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    <linearGradient id="past_background" x1="4" y1="0" x2="4" y2="8" gradientUnits="userSpaceOnUse">
      <stop stopColor="#718096"/>
      <stop offset="1" stopColor="#4A5568"/>
    </linearGradient>
    <linearGradient id="past_foreground" x1="4" y1="1" x2="4" y2="7" gradientUnits="userSpaceOnUse">
      <stop stopColor="#E2E8F0"/>
      <stop offset="1" stopColor="#CBD5E0"/>
    </linearGradient>
  </defs>
</svg>
