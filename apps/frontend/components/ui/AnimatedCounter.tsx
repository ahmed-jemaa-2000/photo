'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    formatOptions?: Intl.NumberFormatOptions;
    suffix?: string;
    prefix?: string;
    className?: string;
}

/**
 * AnimatedCounter - Counts up from 0 to the target value with smooth animation
 * Triggers when the component comes into view
 */
export default function AnimatedCounter({
    value,
    duration = 2,
    formatOptions,
    suffix = '',
    prefix = '',
    className = '',
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [hasAnimated, setHasAnimated] = useState(false);

    // Spring animation for smooth counting
    const spring = useSpring(0, {
        stiffness: 50,
        damping: 30,
        duration: duration * 1000,
    });

    // Transform the spring value to display
    const display = useTransform(spring, (latest) => {
        const rounded = Math.round(latest);
        if (formatOptions) {
            return prefix + new Intl.NumberFormat('en-US', formatOptions).format(rounded) + suffix;
        }
        return prefix + rounded.toLocaleString() + suffix;
    });

    useEffect(() => {
        if (isInView && !hasAnimated) {
            spring.set(value);
            setHasAnimated(true);
        }
    }, [isInView, value, spring, hasAnimated]);

    return (
        <motion.span ref={ref} className={className}>
            {display}
        </motion.span>
    );
}

/**
 * AnimatedNumber - Simpler version that doesn't use springs
 * Good for smaller numbers or when springs cause issues
 */
export function AnimatedNumber({
    value,
    duration = 2,
    className = '',
}: {
    value: number;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * value);

            setCount(current);

            if (now < endTime) {
                requestAnimationFrame(updateCount);
            } else {
                setCount(value);
            }
        };

        requestAnimationFrame(updateCount);
    }, [isInView, value, duration]);

    return (
        <span ref={ref} className={className}>
            {count.toLocaleString()}
        </span>
    );
}
