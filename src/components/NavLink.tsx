'use client';

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps {
  className?: string | ((props: { isActive: boolean }) => string);
  activeClassName?: string;
  children?: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === props.href;

    const classNameValue =
      typeof className === "function"
        ? className({ isActive })
        : cn(className, isActive && activeClassName);

    return (
      <Link
        ref={ref}
        className={classNameValue}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };

