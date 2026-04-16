import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-snapgain-purple/30',
				destructive:
          'bg-snapgain-pink text-white hover:bg-snapgain-pink/90 shadow-lg shadow-snapgain-pink/30',
				outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary/10',
				secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-snapgain-pink/30',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-11 px-6 py-3',
				sm: 'h-9 rounded-lg px-4',
				lg: 'h-12 rounded-xl px-8 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };