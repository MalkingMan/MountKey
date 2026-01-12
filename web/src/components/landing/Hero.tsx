"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Animated Counter Component
interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    duration?: number;
}

function AnimatedCounter({ target, suffix = "", duration = 2000 }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * target);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, target, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

// Typewriter Text Component - types text letter by letter (one-time, no cursor after complete)
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsTyping(true);
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsComplete(true);
                    setIsTyping(false);
                    clearInterval(interval);
                }
            }, 80);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay]);

    // After complete, just show the text without any cursor
    if (isComplete) {
        return <span>{text}</span>;
    }

    return (
        <span className="relative inline-block">
            {/* Invisible placeholder to reserve space */}
            <span className="invisible">{text}</span>
            {/* Visible typing text overlaid on top */}
            <span className="absolute left-0 top-0">
                {displayText}
                {isTyping && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-[3px] h-[1em] bg-gray-900 ml-1 align-middle"
                    />
                )}
            </span>
        </span>
    );
}

// Typewriter Cycle Component - types, deletes, and cycles through multiple texts
function TypewriterCycle({ texts, delay = 0 }: { texts: string[]; delay?: number }) {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [phase, setPhase] = useState<"waiting" | "typing" | "pausing" | "deleting">("waiting");

    // Find the longest text for placeholder
    const longestText = texts.reduce((a, b) => a.length > b.length ? a : b, "");

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let interval: NodeJS.Timeout;

        if (phase === "waiting") {
            timeout = setTimeout(() => {
                setPhase("typing");
            }, delay);
        } else if (phase === "typing") {
            const currentText = texts[textIndex];
            let charIndex = 0;

            interval = setInterval(() => {
                if (charIndex <= currentText.length) {
                    setDisplayText(currentText.slice(0, charIndex));
                    charIndex++;
                } else {
                    clearInterval(interval);
                    setPhase("pausing");
                }
            }, 80);
        } else if (phase === "pausing") {
            timeout = setTimeout(() => {
                setPhase("deleting");
            }, 2000);
        } else if (phase === "deleting") {
            const currentText = texts[textIndex];
            let charIndex = currentText.length;

            interval = setInterval(() => {
                if (charIndex > 0) {
                    charIndex--;
                    setDisplayText(currentText.slice(0, charIndex));
                } else {
                    clearInterval(interval);
                    setTextIndex((prev) => (prev + 1) % texts.length);
                    setPhase("typing");
                }
            }, 50);
        }

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [phase, textIndex, texts, delay]);

    return (
        <span className="relative inline-flex justify-center">
            <span className="invisible">{longestText}</span>
            <span className="absolute left-0 right-0 top-0 flex justify-center items-center h-full">
                <span className="whitespace-nowrap">
                    {displayText}
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-[3px] h-[0.8em] bg-gray-900 ml-1 align-baseline"
                    />
                </span>
            </span>
        </span>
    );
}


export default function Hero() {
    // Scroll parallax setup
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Different scroll speeds for each mountain layer (parallax effect)
    const farMountainY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const midMountainY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const nearMountainY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const mistY = useTransform(scrollYProgress, [0, 1], [0, 80]);

    // Content parallax - elements move at different speeds for depth effect
    const badgeY = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const headingY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const subheadingY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const ctaY = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const statsY = useTransform(scrollYProgress, [0, 1], [0, -20]);

    // Opacity fade on scroll
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />

            {/* Atmospheric fog effect - very subtle */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-0 w-full h-96 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent blur-3xl" />
                <div className="absolute bottom-1/3 right-0 w-2/3 h-64 bg-gradient-to-l from-transparent via-gray-100/50 to-transparent blur-3xl" />
            </div>

            {/* Floating Clouds */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Cloud 1 - Large, slow, left to right */}
                <motion.div
                    className="absolute top-[15%] left-0 opacity-20"
                    animate={{ x: ["0vw", "100vw"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                >
                    <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
                        <ellipse cx="60" cy="50" rx="50" ry="25" fill="#94a3b8" />
                        <ellipse cx="100" cy="40" rx="60" ry="30" fill="#94a3b8" />
                        <ellipse cx="150" cy="50" rx="45" ry="22" fill="#94a3b8" />
                        <ellipse cx="80" cy="55" rx="40" ry="20" fill="#94a3b8" />
                    </svg>
                </motion.div>

                {/* Cloud 2 - Medium, right to left */}
                <motion.div
                    className="absolute top-[25%] right-0 opacity-15"
                    animate={{ x: ["0vw", "-100vw"] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                >
                    <svg width="150" height="60" viewBox="0 0 150 60" fill="none">
                        <ellipse cx="45" cy="35" rx="35" ry="18" fill="#cbd5e1" />
                        <ellipse cx="75" cy="28" rx="45" ry="22" fill="#cbd5e1" />
                        <ellipse cx="110" cy="35" rx="32" ry="16" fill="#cbd5e1" />
                    </svg>
                </motion.div>

                {/* Cloud 3 - Small, fast, left to right */}
                <motion.div
                    className="absolute top-[8%] left-[20%] opacity-10"
                    animate={{ x: ["0vw", "80vw"] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                >
                    <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
                        <ellipse cx="30" cy="25" rx="25" ry="12" fill="#e2e8f0" />
                        <ellipse cx="55" cy="20" rx="30" ry="15" fill="#e2e8f0" />
                        <ellipse cx="75" cy="25" rx="20" ry="10" fill="#e2e8f0" />
                    </svg>
                </motion.div>

                {/* Cloud 4 - Large, very slow, right to left */}
                <motion.div
                    className="absolute top-[18%] right-[10%] opacity-15"
                    animate={{ x: ["0vw", "-90vw"] }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                >
                    <svg width="180" height="70" viewBox="0 0 180 70" fill="none">
                        <ellipse cx="50" cy="45" rx="40" ry="20" fill="#94a3b8" />
                        <ellipse cx="90" cy="35" rx="55" ry="28" fill="#94a3b8" />
                        <ellipse cx="140" cy="45" rx="38" ry="19" fill="#94a3b8" />
                    </svg>
                </motion.div>
            </div>

            {/* Animated Mountain Silhouettes */}
            {/* Far mountains - slowest parallax */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-0"
                style={{ y: farMountainY }}
            >
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: [20, 0, 20] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
                        <path
                            fill="#94a3b8"
                            fillOpacity="0.15"
                            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Mid mountains - medium parallax */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-1"
                style={{ y: midMountainY }}
            >
                <motion.div
                    initial={{ y: 15 }}
                    animate={{ y: [15, -5, 15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
                        <path
                            fill="#64748b"
                            fillOpacity="0.12"
                            d="M0,288L60,272C120,256,240,224,360,213.3C480,203,600,213,720,229.3C840,245,960,267,1080,261.3C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Near mountains - fastest parallax */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-2"
                style={{ y: nearMountainY }}
            >
                <motion.div
                    initial={{ y: 10 }}
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
                        <path
                            fill="#475569"
                            fillOpacity="0.08"
                            d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,229.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Rising mist effect */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-32 z-3 bg-linear-to-t from-white via-white/80 to-transparent"
                style={{ y: mistY }}
            >
                <motion.div
                    className="w-full h-full"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Content */}
            <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24"
            >
                {/* Badge - moves slowest */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    style={{ y: badgeY, opacity: contentOpacity }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gray-100 text-gray-600 text-sm"
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Free API Access
                </motion.div>

                {/* Headline - moves fastest with typewriter effect */}
                <motion.h1
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    style={{ y: headingY, opacity: contentOpacity }}
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.1] mb-6"
                >
                    <TypewriterText text="Weather-aware" delay={500} />
                    <br />
                    <TypewriterCycle
                        texts={["Mountain Data API", "1000+ Mountains"]}
                        delay={1800}
                    />
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    style={{ y: subheadingY, opacity: contentOpacity }}
                    className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Real-time weather risk insights for safer mountain expeditions.
                    <br className="hidden md:block" />
                    Curated data. Developer-first.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    style={{ y: ctaY, opacity: contentOpacity }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/register">
                        <Button size="lg">Get Free API Key</Button>
                    </Link>
                    <Link href="/docs">
                        <Button variant="secondary" size="lg">
                            View Docs
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats - moves slowest, stays visible longer */}
                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ y: statsY }}
                    className="mt-20 flex items-center justify-center gap-12 text-sm text-gray-400"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-gray-900">
                            <AnimatedCounter target={1000} suffix="+" />
                        </span>
                        <span>Mountains</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-gray-900">Free</span>
                        <span>Forever</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-gray-900">Real-time</span>
                        <span>Weather Data</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
