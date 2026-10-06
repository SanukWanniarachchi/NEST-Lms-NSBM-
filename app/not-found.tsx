import Link from "next/link";
import Image from "next/image";
import nestMark from "@/public/images/brand/nest-mark-160.webp";
import { ArrowLeftIcon } from "@/components/icons";

export default function NotFound() { return <main id="main-content" tabIndex={-1} className="not-found"><Image src={nestMark} alt="" width={120} height={114}/><p className="eyebrow">404 · Page not found</p><h1>This learning path ends here.</h1><p>The page may have moved, or the address may be incorrect.</p><Link href="/" className="button button--primary"><ArrowLeftIcon /> Return home</Link></main> }
