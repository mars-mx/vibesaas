import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { siteConfig } from "@/lib/constants/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <Container>
        <div className="py-12 md:py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Logo />
            
            <p className="text-sm text-muted-foreground text-center">
              Built with ❤️ and a healthy dose of frustration at expensive boilerplates
            </p>
            
            <div className="flex space-x-6">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} VibeSaaS.{" "}
              <Link
                href="https://github.com/mars-mx/vibesaas/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                MIT Licensed
              </Link>
              . Free forever.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}