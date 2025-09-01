"use client";

import { motion } from "framer-motion";
import {
    Clock,
    MapPin,
    Phone,
    Star,
    Scissors,
    Sparkles,
    Users,
    Award,
    Heart,
    ChevronRight,
    Instagram,
    Facebook,
    Mail,
    Sun,
    Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
};

export default function LandingPage() {
    const { theme, setTheme } = useTheme();
    const { userProfile, user, logout, isLoading } = useAuth();

    const branches = [
        {
            name: "Main Branch - Muscat",
            address: "Al Khuwair, Muscat, Oman",
            phone: "+968 2234 5678",
            hours: "9:00 AM - 9:00 PM",
            isMain: true
        },
        {
            name: "Sohar Branch",
            address: "Sohar Industrial Area, Sohar",
            phone: "+968 2634 1234",
            hours: "9:00 AM - 8:00 PM",
            isMain: false
        },
        {
            name: "Salalah Branch",
            address: "Al Dahariz, Salalah",
            phone: "+968 2329 5678",
            hours: "9:00 AM - 8:00 PM",
            isMain: false
        }
    ];

    const services = [
        {
            title: "Custom Tailoring",
            description: "Bespoke ladies clothing tailored to perfection",
            icon: Scissors,
            color: "from-pink-500 to-rose-500"
        },
        {
            title: "Premium Ornas",
            description: "Beautiful collection of traditional and modern ornas",
            icon: Sparkles,
            color: "from-purple-500 to-indigo-500"
        },
        {
            title: "Alterations",
            description: "Expert alterations and fitting services",
            icon: Award,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Bridal Wear",
            description: "Exquisite bridal and special occasion dresses",
            icon: Heart,
            color: "from-emerald-500 to-teal-500"
        }
    ];

    const stats = [
        { number: "15+", label: "Years Experience", icon: Award },
        { number: "5000+", label: "Happy Customers", icon: Users },
        { number: "3", label: "Branches", icon: MapPin },
        { number: "4.9", label: "Customer Rating", icon: Star }
    ];

    const toggleTheme = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const isDark = theme === "dark";

        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                setTheme(isDark ? "light" : "dark");
            });

            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ];
                document.documentElement.animate(
                    {
                        clipPath: isDark ? [...clipPath].reverse() : clipPath,
                    },
                    {
                        duration: 400,
                        easing: "ease-in",
                        pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
                    }
                );
            });
        } else {
            setTheme(isDark ? "light" : "dark");
        }
    };

    const navAction = userProfile && userProfile.role && userProfile.role !== 'user' ? (
        <Link href="/dashboard">
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
    ) : userProfile ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Link href="/login">
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Log In
                <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
    );

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl"
                    animate={{
                        x: [-100, 100, -100],
                        y: [-50, 50, -50],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Header - Mobile Responsive Changes */}
            <motion.header
                className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border/80"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Scissors className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div>
                            {/* Simplified text for smaller screens */}
                            <h1 className="text-sm md:text-xl font-bold text-gray-800 dark:text-gray-100">
                                <span className="hidden md:inline">Mohol Abdur Rahim</span>
                                <span className="md:hidden">Mohol AR</span>
                            </h1>
                            <p className="text-xs text-muted-foreground">Premium Ladies Fashion</p>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button variant="outline" size="sm" className="hidden md:inline-flex">
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            {navAction}
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content Container */}
            <main className="pt-16 md:pt-20">
                {/* Hero Section */}
                <section className="relative z-10 px-4 py-8 md:py-20">
                    <div className="container mx-auto text-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-4 md:space-y-8"
                        >
                            <motion.div variants={fadeInUp}>
                                <Badge className="mb-4 bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 border-0">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Premium Ladies Fashion in Oman
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">
                                    <span className="text-gray-800 dark:text-white">
                                        MOHOL ABDUR RAHIM
                                    </span>
                                    <br />
                                    <span className="text-muted-foreground">
                                        Tailoring & Ornas
                                    </span>
                                </h1>
                                <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Experience the finest in ladies tailoring and premium orna collections across Oman.
                                    Where tradition meets modern elegance.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                <Button
                                    size="lg"
                                    className="bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 px-8 py-6 text-lg"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Book Appointment
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-6 text-lg border-2 hover:bg-card hover:border-gray-200 dark:hover:border-gray-800"
                                >
                                    View Collection
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative z-10 py-8 md:py-16 px-4">
                    <div className="container mx-auto">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                        >
                            {stats.map((stat) => (
                                <motion.div key={stat.label} variants={scaleIn}>
                                    <Card className="text-center p-4 md:p-6 bg-card/60 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-0">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 dark:bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-gray-900" />
                                            </div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                                className="text-xl md:text-2xl font-bold text-foreground"
                                            >
                                                {stat.number}
                                            </motion.div>
                                            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="relative z-10 py-12 md:py-20 px-4">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-8 md:mb-16"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                                <span className="text-gray-800 dark:text-white">
                                    Our Services
                                </span>
                            </h2>
                            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                                From custom tailoring to premium orna collections, we offer comprehensive fashion solutions
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                        >
                            {services.map((service) => (
                                <motion.div key={service.title} variants={scaleIn}>
                                    <Card className="group h-full bg-card/60 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                        <CardContent className="p-4 md:p-6 text-center">
                                            <motion.div
                                                className={`w-14 h-14 md:w-16 md:h-16 bg-gray-800 dark:bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <service.icon className="w-7 h-7 md:w-8 md:h-8 text-white dark:text-gray-900" />
                                            </motion.div>
                                            <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                                {service.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Branches Section */}
                <section className="relative z-10 py-12 md:py-20 px-4 bg-secondary">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-8 md:mb-16"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                                <span className="text-gray-800 dark:text-white">
                                    Our Locations
                                </span>
                            </h2>
                            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                                Visit us at any of our convenient locations across Oman
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-6 md:gap-8"
                        >
                            {branches.map((branch) => (
                                <motion.div key={branch.name} variants={fadeInUp}>
                                    <Card className={`group h-full bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                                        branch.isMain ? 'ring-2 ring-gray-500/50' : ''
                                    }`}>
                                        <CardContent className="p-4 md:p-6">
                                            {branch.isMain && (
                                                <Badge className="mb-2 md:mb-4 bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 border-0">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    Main Branch
                                                </Badge>
                                            )}

                                            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-foreground group-hover:text-gray-600 transition-colors">
                                                {branch.name}
                                            </h3>

                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                                        {branch.address}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                                                    <p className="text-muted-foreground text-xs md:text-sm font-medium">
                                                        {branch.phone}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                                                    <p className="text-muted-foreground text-xs md:text-sm">
                                                        {branch.hours}
                                                    </p>
                                                </div>
                                            </div>

                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="mt-4 md:mt-6"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full group-hover:bg-accent group-hover:border-gray-200 dark:group-hover:border-gray-800"
                                                >
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    Get Directions
                                                </Button>
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="relative z-10 py-12 md:py-20 px-4">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-8 md:mb-16"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                                <span className="text-gray-800 dark:text-white">
                                    What Our Customers Say
                                </span>
                            </h2>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-6 md:gap-8"
                        >
                            {[
                                {
                                    name: "Fatima Al-Zahra",
                                    text: "Absolutely beautiful work! The attention to detail in my wedding dress was incredible.",
                                    rating: 5,
                                    location: "Muscat"
                                },
                                {
                                    name: "Aisha Mohammed",
                                    text: "Best orna collection in Oman. Quality fabrics and excellent customer service.",
                                    rating: 5,
                                    location: "Sohar"
                                },
                                {
                                    name: "Mariam Hassan",
                                    text: "Professional tailoring with perfect fitting. Highly recommend for special occasions.",
                                    rating: 5,
                                    location: "Salalah"
                                }
                            ].map((testimonial) => (
                                <motion.div key={testimonial.name} variants={scaleIn}>
                                    <Card className="h-full bg-card/60 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex items-center gap-1 mb-2 md:mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-4 italic leading-relaxed">
                                                "{testimonial.text}"
                                            </p>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-xs md:text-sm">
                                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground text-sm md:text-base">
                                                        {testimonial.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {testimonial.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-10 py-12 md:py-20 px-4 bg-gray-800 dark:bg-gray-100">
                    <div className="container mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4 md:space-y-8"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold text-white dark:text-gray-900 mb-2 md:mb-4">
                                Ready to Experience Premium Fashion?
                            </h2>
                            <p className="text-sm md:text-xl text-gray-300 dark:text-gray-600 max-w-2xl mx-auto">
                                Visit any of our branches or call us to schedule your consultation today
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-white text-gray-800 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    +968 2234 5678
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white dark:text-black hover:bg-white hover:text-gray-800 px-8 py-6 text-lg"
                                >
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Find Us
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-card text-foreground py-8 md:py-12 px-4">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid md:grid-cols-4 gap-6 md:gap-8"
                    >
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-800 dark:bg-gray-100 rounded-full flex items-center justify-center">
                                    <Scissors className="w-3 h-3 md:w-4 md:h-4 text-white dark:text-gray-900" />
                                </div>
                                <h3 className="text-md md:text-xl font-bold">Mohol Abdur Rahim</h3>
                            </div>
                            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4">
                                Premium ladies tailoring and orna collections serving Oman with excellence for over 15 years.
                                Where every stitch tells a story of elegance and tradition.
                            </p>
                            <div className="flex items-center gap-3 md:gap-4">
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-gray-400">
                                        <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-gray-400">
                                        <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-gray-400">
                                        <Mail className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2 md:mb-4 text-gray-400">Quick Links</h4>
                            <ul className="space-y-1 md:space-y-2 text-muted-foreground text-sm md:text-base">
                                <li><a href="#" className="hover:text-gray-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-gray-400 transition-colors">Services</a></li>
                                <li><a href="#" className="hover:text-gray-400 transition-colors">Collection</a></li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}