import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export function ArrowRightIcon(props: IconProps) { return <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>; }
export function ArrowLeftIcon(props: IconProps) { return <svg {...base} {...props}><path d="M19 12H5m6 6-6-6 6-6" /></svg>; }
export function BookIcon(props: IconProps) { return <svg {...base} {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></svg>; }
export function ClockIcon(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>; }
export function PlayIcon(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>; }
export function DocumentIcon(props: IconProps) { return <svg {...base} {...props}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>; }
export function CheckIcon(props: IconProps) { return <svg {...base} {...props}><path d="m5 12 4 4L19 6"/></svg>; }
export function ShieldIcon(props: IconProps) { return <svg {...base} {...props}><path d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-5"/></svg>; }
export function NetworkIcon(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m10.8 7.2-4.6 8.6m7-8.6 4.6 8.6M7.5 18h9"/></svg>; }
export function RobotIcon(props: IconProps) { return <svg {...base} {...props}><rect x="5" y="7" width="14" height="12" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"/></svg>; }
export function UsersIcon(props: IconProps) { return <svg {...base} {...props}><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75"/></svg>; }
export function ChartIcon(props: IconProps) { return <svg {...base} {...props}><path d="M4 20V10m6 10V4m6 16v-7m5 7H2"/></svg>; }
export function MenuIcon(props: IconProps) { return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>; }
export function CloseIcon(props: IconProps) { return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>; }
export function SunIcon(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>; }
export function MoonIcon(props: IconProps) { return <svg {...base} {...props}><path d="M20 15.3A8.5 8.5 0 0 1 8.7 4 8.5 8.5 0 1 0 20 15.3"/></svg>; }
export function MailIcon(props: IconProps) { return <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>; }
export function LocationIcon(props: IconProps) { return <svg {...base} {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0"/><circle cx="12" cy="10" r="2.5"/></svg>; }
export function ArduinoIcon(props: IconProps) { return <svg {...base} {...props}><path d="M8.3 8.2c-3.4 0-5.5 1.7-5.5 3.8s2.1 3.8 5.5 3.8c4 0 6.2-7.6 10.1-7.6 1.7 0 2.8 1.7 2.8 3.8s-1.1 3.8-2.8 3.8c-3.9 0-6.1-7.6-10.1-7.6Z"/><path d="M5.7 12h5.1m6.1 0h3m-1.5-1.5v3"/></svg>; }
export function PacketTracerIcon(props: IconProps) { return <svg {...base} {...props}><circle cx="5" cy="12" r="2.4"/><circle cx="19" cy="6" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="m7.4 11 9.2-4m-9.2 6 9.2 4M12 8.9v6.2"/></svg>; }
export function WifiIcon(props: IconProps) { return <svg {...base} {...props}><path d="M3 9a14 14 0 0 1 18 0M6.2 12.2a9 9 0 0 1 11.6 0M9.3 15.4a4.3 4.3 0 0 1 5.4 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>; }
export function BluetoothIcon(props: IconProps) { return <svg {...base} {...props}><path d="m7 7 10 10-5 4V3l5 4L7 17"/></svg>; }
export function IotIcon(props: IconProps) { return <svg {...base} {...props}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="3.5" r="1.7"/><circle cx="4.5" cy="17" r="1.7"/><circle cx="19.5" cy="17" r="1.7"/><path d="M12 5.2V9m-2.5 4.8-3.6 2.3m8.6-2.3 3.6 2.3"/></svg>; }
export function CloudIcon(props: IconProps) { return <svg {...base} {...props}><path d="M6.5 18.5h11a4 4 0 0 0 .6-8 6.2 6.2 0 0 0-11.8-1.2A4.7 4.7 0 0 0 6.5 18.5Z"/></svg>; }
export function HttpsIcon(props: IconProps) { return <svg {...base} {...props}><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14v3"/></svg>; }
export function VpnIcon(props: IconProps) { return <svg {...base} {...props}><path d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6Z"/><path d="M9 12h6m-3-3v6"/></svg>; }
