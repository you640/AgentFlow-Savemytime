import React from 'react';
import { LeafIcon } from 'lucide-react';

const clsx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
export interface LogoProps {
  className?: string;
  showIcon?: boolean;
}
export const Logo = ({ className, showIcon = true }: LogoProps) => {
  return (
    <a
      href="/"
      aria-label="GrowMedica — domov"
      className={clsx(
        'inline-flex items-center gap-2 gm-focus-ring rounded-gm-sm',
        className
      )}>
      
      {showIcon &&
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gm-primary/15 text-gm-primary">
          <LeafIcon className="w-4 h-4" />
        </span>
      }
      <span className="font-heading text-xl tracking-tight text-gm-text">
        GrowMedica
      </span>
    </a>);

};