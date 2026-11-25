import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Atribut dasar semua ikon: garis 24px, warna mengikuti teks */
const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

/* ---------- Navigasi ---------- */
export const HomeIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2.8 1.8 11.6a.8.8 0 0 0 .5 1.4H4.5V21h5v-5.5h5V21h5v-8h2.2a.8.8 0 0 0 .5-1.4L12 2.8Z" />
  </svg>
);
export const CalendarIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="M7 13.5h2M11 13.5h2M15 13.5h2M7 17h2M11 17h2M15 17h2" strokeWidth={2.4} />
  </svg>
);
export const TasksIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <rect x="4.5" y="4.5" width="15" height="17" rx="2" />
    <path d="M9 4.5V3h6v1.5M9 3.8h6v2.4H9z" />
    <path d="m7.5 11 1 1 1.6-1.8M12 11h5M7.5 15l1 1 1.6-1.8M12 15h5M7.5 19h2.6M12 19h5" />
  </svg>
);
export const DocIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.9} {...p}>
    <path d="M6 3h8l5 5v13H6z" />
    <path d="M14 3v5h5M9 12h7M9 15h7M9 18h7" />
  </svg>
);
export const WalletIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.9} {...p}>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
    <path d="M4 7.5V18a2 2 0 0 0 2 2h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 19 8H6.5A2.5 2.5 0 0 1 4 5.5" />
    <circle cx="16.5" cy="14" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);
export const MegaphoneIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <path d="M3.5 10v4a1 1 0 0 0 1 1H7l9 4.5v-15L7 9H4.5a1 1 0 0 0-1 1Z" />
    <path d="M7 15l1.3 4.5a1 1 0 0 0 1 .7h1.2a.8.8 0 0 0 .8-1L10.7 16.5" />
    <path d="M19.5 9.5a3.5 3.5 0 0 1 0 5" />
  </svg>
);
export const UserIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
    <circle cx="12" cy="7.5" r="4.5" />
    <path d="M3 21.5c0-5 4-8 9-8s9 3 9 8z" />
  </svg>
);

/* ---------- Topbar & akun ---------- */
export const UserOutlineIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="8" r="3.8" />
    <path d="M5 20.5c0-3.6 3-5.8 7-5.8s7 2.2 7 5.8z" />
  </svg>
);
export const UserCircleIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3.2" fill="currentColor" />
    <path d="M6 18.5c1.2-2.6 3.4-3.8 6-3.8s4.8 1.2 6 3.8" fill="currentColor" />
  </svg>
);
export const GearIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M10.3 2.8h3.4l.5 2.4 1.7.7 2-1.4 2.4 2.4-1.4 2 .7 1.7 2.4.5v3.4l-2.4.5-.7 1.7 1.4 2-2.4 2.4-2-1.4-1.7.7-.5 2.4h-3.4l-.5-2.4-1.7-.7-2 1.4-2.4-2.4 1.4-2-.7-1.7-2.4-.5v-3.4l2.4-.5.7-1.7-1.4-2 2.4-2.4 2 1.4 1.7-.7z" />
  </svg>
);
export const BellIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 2H4.2z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);

/* ---------- Umum ---------- */
export const ClockIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </svg>
);
export const SearchIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="10.5" cy="10.5" r="6.8" />
    <path d="m15.8 15.8 5 5" />
  </svg>
);
export const ChevronRightIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <path d="m9 4 8 8-8 8" />
  </svg>
);
export const ChevronLeftIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <path d="m15 4-8 8 8 8" />
  </svg>
);
export const ChevronDownIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="m4 9 8 8 8-8" />
  </svg>
);
export const ArrowLeftIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);
export const PlusIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const CheckIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.4} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const CrossIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.4} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const DotsIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
    <circle cx="4" cy="12" r="2.2" />
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="20" cy="12" r="2.2" />
  </svg>
);
export const PinIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
    <path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Zm0-9.3a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z" />
  </svg>
);
export const PushPinIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <path d="M9 3.5h6l-1 6 3 3.5H7l3-3.5z" />
    <path d="M12 13v7.5" />
  </svg>
);
export const BookIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
    <path d="M5 17h14" />
  </svg>
);

/* ---------- Login ---------- */
export const LockIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <rect x="5" y="10.5" width="14" height="10.5" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 15v1.5" strokeWidth={2.2} />
  </svg>
);
export const EyeIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);
export const EyeOffIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="m3 3 18 18" />
  </svg>
);
export const MoonIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
    <path d="M20.5 14.5A9 9 0 0 1 9.5 3.5a9 9 0 1 0 11 11Z" />
  </svg>
);

/* ---------- Brand ---------- */
export const CapIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} viewBox="0 0 48 40" strokeWidth={1.8} {...p}>
    <path d="m2 14 22-8 22 8-22 9z" />
    <circle cx="24" cy="14.5" r="1.7" />
    <path d="M10 20v7c0 3 7 6 14 6s14-3 14-6v-7" />
    <path d="M38 15.5v14" />
    <circle cx="38" cy="19" r="1.5" />
    <path d="M36.2 31h3.6l-.4-5h-2.8z" fill="currentColor" />
  </svg>
);

/** Blob di belakang logo topi toga. Warna diatur lewat CSS (`.blob .bg path`) */
export const BrandBlob = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 370 340" aria-hidden>
    <path d="M105 12C45 12 5 70 35 125c25 38 35 55 28 85-9 55 38 125 100 118 45-5 62-40 85-58 15-11 35-9 55-8 70 2 112-54 108-120-4-62-60-103-115-96-35 5-55-8-75-27C200 22 160 8 105 12Z" />
  </svg>
);

/* ---------- Berkas ---------- */
export const FolderOpenIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 7.5V19h15.5l2.5-8H8.5L6 19M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2.5h6.5V11" />
  </svg>
);
export const FilePdfIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.7} {...p}>
    <path d="M6 3h8l5 5v13H6z" />
    <path d="M14 3v5h5" />
    <path d="M9 12.5h6M9 16h6M9 19h4" />
  </svg>
);
export const FileImageIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.8" />
    <path d="m5 18 4.5-4.5 3 3 3-3L20 18" />
  </svg>
);
export const FileArchiveIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.7} {...p}>
    <path d="M6 3h8l5 5v13H6z" />
    <path d="M14 3v5h5" />
    <path d="M11 12.5v1M11 15.5v1M11 18.5v1" />
  </svg>
);
export const DownloadIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5v11M8 11l4 4 4-4" />
    <path d="M4.5 17v2.5h15V17" />
  </svg>
);
export const UploadIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 15V3.5M8 7l4-4 4 4" />
    <path d="M4.5 17v2.5h15V17" />
  </svg>
);
export const GridIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1.6" />
    <rect x="13" y="4" width="7" height="7" rx="1.6" />
    <rect x="4" y="13" width="7" height="7" rx="1.6" />
    <rect x="13" y="13" width="7" height="7" rx="1.6" />
  </svg>
);
export const ListIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8} {...p}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

/* ---------- Profil ---------- */
export const MailIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const PhoneIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);
export const MapPinIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);
export const EditIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 20h4l11-11-4-4L4 16v4Z" />
    <path d="m13.5 6.5 4 4" />
  </svg>
);
export const IdIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 14h4" />
  </svg>
);

/* ---------- Pengaturan & notifikasi ---------- */
export const SunIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </svg>
);
export const MonitorIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);
export const PaletteIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 1.6-2.1-.4-1.1.3-2.4 1.6-2.4H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5Z" />
    <circle cx="7.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="10" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
export const AccessibilityIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="4.5" r="1.8" />
    <path d="M4.5 8.5 12 10l7.5-1.5M12 10v4.5M12 14.5l-3 6M12 14.5l3 6" />
  </svg>
);
export const InfoIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const LogoutIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9" />
  </svg>
);
export const PrinterIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M7 9V3.5h10V9M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2" />
    <path d="M7 14h10v6.5H7z" />
  </svg>
);
export const CameraIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);