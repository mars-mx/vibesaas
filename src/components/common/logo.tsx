import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <picture>
        <source 
          srcSet="/logo-small.webp" 
          type="image/webp"
        />
        <Image 
          src="/logo-small.png" 
          alt="VibeSaaS Logo" 
          width={32} 
          height={32}
          className="h-8 w-auto"
          priority
          unoptimized={false}
        />
      </picture>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          VibeSaaS
        </span>
      )}
    </Link>
  );
}