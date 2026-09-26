import { SVGProps } from "react";

// Inline stroke icons (Lucide-style geometry) so color follows `currentColor`
// and nothing depends on the bootstrap-icons font.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const CubeIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.3 7 12 12l8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export const SearchIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const ExternalLinkIcon = ({ size = 12, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const ChevronDownIcon = ({ size = 12, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronUpIcon = ({ size = 12, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ArrowRightIcon = ({ size = 12, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const MenuIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const CloseIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

export const MoreIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size, props)} fill="currentColor" stroke="none">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export const GlobeIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
  </svg>
);

export const CopyIcon = ({ size = 13, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const CheckIcon = ({ size = 13, ...props }: IconProps) => (
  <svg {...base(size, props)} strokeWidth={2.5}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
