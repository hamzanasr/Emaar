import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Cinematic ambient lighting layer.
 * Place at the top of a section to add a subtle radial glow.
 */
export interface CinemaLightProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'subtle' | 'medium' | 'strong';
  color?: 'gold' | 'blue' | 'crimson' | 'mesh';
  position?: 'top' | 'center' | 'bottom';
}

export const CinemaLight: React.FC<CinemaLightProps> = ({
  intensity = 'medium',
  color = 'gold',
  position = 'top',
  className,
  ...props
}) => {
  const intensityMap = {
    subtle: 'opacity-40',
    medium: 'opacity-60',
    strong: 'opacity-90',
  };

  const positionMap = {
    top: 'top-0',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-0',
  };

  const colorMap = {
    gold: 'bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,169,97,0.35)_0%,transparent_70%)]',
    blue: 'bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(60,101,167,0.35)_0%,transparent_70%)]',
    crimson:
      'bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(200,16,46,0.25)_0%,transparent_70%)]',
    mesh: 'bg-mesh-luxury',
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 h-[50%]',
        positionMap[position],
        intensityMap[intensity],
        colorMap[color],
        className,
      )}
      {...props}
    />
  );
};

CinemaLight.displayName = 'CinemaLight';
