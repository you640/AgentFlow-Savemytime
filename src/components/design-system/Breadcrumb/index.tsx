import React from 'react';
import { ChevronRightIcon } from 'lucide-react';

const clsx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}
export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="Navigačná cesta" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ?
              <a
                href={item.href}
                className="text-gm-text-muted hover:text-gm-primary transition-colors gm-focus-ring rounded-gm-sm">
                
                  {item.label}
                </a> :

              <span
                className={clsx(last ? 'text-gm-text' : 'text-gm-text-muted')}
                aria-current={last ? 'page' : undefined}>
                
                  {item.label}
                </span>
              }
              {!last &&
              <ChevronRightIcon className="w-3.5 h-3.5 text-gm-text-muted/60" />
              }
            </li>);

        })}
      </ol>
    </nav>);

};