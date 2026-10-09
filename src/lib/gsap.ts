import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, Flip, DrawSVGPlugin);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Animation length that collapses to zero when the user asks for reduced motion.
export const motion = (seconds: number) => (reducedMotion.matches ? 0 : seconds);

export { gsap, Flip, useGSAP };
