import { useLocation } from "wouter";
import { AnchorHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ViewTransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  transitionName?: string;
}

const isBrowser = typeof window !== "undefined";

function startViewTransition(callback: () => void) {
  if (!isBrowser) {
    callback();
    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}

export const ViewTransitionLink = forwardRef<HTMLAnchorElement, ViewTransitionLinkProps>(
  ({ href, transitionName, className, children, ...props }, ref) => {
    const [, setLocation] = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (props.onClick) {
        props.onClick(e);
      }
      
      if (e.defaultPrevented) return;
      
      e.preventDefault();
      
      startViewTransition(() => {
        setLocation(href);
      });
    };

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn(className)}
        style={
          transitionName
            ? ({ viewTransitionName: transitionName } as React.CSSProperties)
            : undefined
        }
        {...props}
      >
        {children}
      </a>
    );
  }
);

ViewTransitionLink.displayName = "ViewTransitionLink";
