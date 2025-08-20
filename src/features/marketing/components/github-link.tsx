import Link from "next/link";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

interface GitHubLinkProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function GitHubLink({ 
  className, 
  children = "Star on GitHub",
  variant = "outline",
  size = "lg",
  showIcon = true
}: GitHubLinkProps) {
  return (
    <Button size={size} variant={variant} asChild className={cn(className)}>
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        {showIcon && <Code className="mr-2 h-5 w-5" />}
        {children}
      </Link>
    </Button>
  );
}