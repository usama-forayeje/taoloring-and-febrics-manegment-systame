"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Crown,
  Sparkles,
  Eye,
  Star,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  ArrowRight,
  Check,
  Shield,
  Zap,
  Award,
  Scissors,
  Menu,
  X,
  Heart,
  Users,
  Clock,
  Palette,
  Gift,
  Sun,
  Moon,
  ChevronDown,
  Store,
  MessageCircle,
  Play,
  Quote,
  TrendingUp,
  Calendar,
  Truck,
  CreditCard,
  Headphones,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function LadiesTailoringLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = ['home', 'services', 'collections', 'gallery', 'branches', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const logout = () => {
    setUser(null)
  }

  // Enhanced services data
  const services = [
    {
      title: "تفصيل البُرقع الفاخر",
      titleEn: "Premium Burqa Tailoring",
      description: "نقدم خدمات تفصيل البُرقع العُماني التقليدي بتصاميم عصرية ومبتكرة، مع الحفاظ على الأصالة والتراث العريق.",
      features: ["تصميم حسب الطلب", "خامات فاخرة مستوردة", "تطريز يدوي احترافي", "ضمان الجودة"],
      icon: Shield,
      gradient: "from-blue-500 to-purple-600",
      price: "من 150 ر.ع",
    },
    {
      title: "تطريز يدوي فني",
      titleEn: "Artistic Hand Embroidery",
      description: "فريقنا المتخصص في التطريز اليدوي يحول كل قطعة إلى عمل فني فريد باستخدام خيوط ذهبية وفضية وأحجار كريمة.",
      features: ["تطريز ذهبي وفضي", "تصميمات شخصية", "أحجار كريمة", "فن تراثي أصيل"],
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
      price: "من 80 ر.ع",
    },
    {
      title: "تصميم الأورنا الحريرية",
      titleEn: "Premium Silk Orna Design",
      description: "نقدم تصاميم حصرية للأورنا الحريرية بألوان متدرجة وأنماط فنية راقية تناسب جميع المناسبات والأذواق.",
      features: ["حرير طبيعي 100%", "ألوان متناسقة", "تصاميم حصرية", "نعومة فائقة"],
      icon: Heart,
      gradient: "from-pink-500 to-rose-600",
      price: "من 60 ر.ع",
    },
    {
      title: "إعادة تأهيل وتجديد",
      titleEn: "Restoration & Renovation",
      description: "نقوم بإعادة تأهيل وتجديد القطع القديمة لتستعيد جمالها وبريقها مع إضافة لمسات عصرية حديثة.",
      features: ["إصلاح الأضرار", "تجديد التصميم", "تغيير الألوان", "ضمان النتيجة"],
      icon: Palette,
      gradient: "from-green-500 to-teal-600",
      price: "من 40 ر.ع",
    }
  ]

  const branches = [
    {
      id: 1,
      name: "الفرع الرئيسي - مسقط",
      nameEn: "Main Branch - Muscat",
      address: "شارع السلطان قابوس، الخوير",
      addressEn: "Sultan Qaboos Street, Al Khuwair",
      phone: "+968 2244 5566",
      whatsapp: "+968 9988 7766",
      hours: "السبت - الخميس: 9:00 ص - 10:00 م",
      hoursEn: "Sat - Thu: 9:00 AM - 10:00 PM",
      image: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تصاميم VIP وخدمة شخصية",
      rating: 4.9,
      reviews: 1250
    },
    {
      id: 2,
      name: "فرع صلالة",
      nameEn: "Salalah Branch",
      address: "منطقة الحافة، بجانب مول صلالة",
      addressEn: "Al Hafah, Next to Salalah Mall",
      phone: "+968 2377 8899",
      whatsapp: "+968 9955 4433",
      hours: "السبت - الخميس: 9:30 ص - 9:30 م",
      hoursEn: "Sat - Thu: 9:30 AM - 9:30 PM",
      image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تطريز تراثي ظفاري",
      rating: 4.8,
      reviews: 890
    },
    {
      id: 3,
      name: "فرع نزوى",
      nameEn: "Nizwa Branch",
      address: "سوق نزوى التقليدي",
      addressEn: "Nizwa Traditional Souq",
      phone: "+968 2544 3322",
      whatsapp: "+968 9922 1199",
      hours: "السبت - الخميس: 8:00 ص - 8:00 م",
      hoursEn: "Sat - Thu: 8:00 AM - 8:00 PM",
      image: "https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تراث الداخلية الأصيل",
      rating: 4.9,
      reviews: 670
    },
    {
      id: 4,
      name: "فرع صور",
      nameEn: "Sur Branch",
      address: "الكورنيش، مقابل فندق صور بلازا",
      addressEn: "Corniche, Opposite Sur Plaza Hotel",
      phone: "+968 2566 7788",
      whatsapp: "+968 9977 5544",
      hours: "السبت - الخميس: 9:00 ص - 9:00 م",
      hoursEn: "Sat - Thu: 9:00 AM - 9:00 PM",
      image: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تصاميم بحرية عصرية",
      rating: 4.7,
      reviews: 540
    }
  ]

  const collections = [
    {
      name: "مجموعة الأناقة الملكية",
      nameEn: "Royal Elegance Collection",
      image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 250 ر.ع",
      priceEn: "From 250 OMR",
      description: "تصاميم مستوحاة من القصور الملكية بتطريز ذهبي فاخر وأحجار كريمة",
      items: 25,
      badge: "الأكثر طلباً",
      gradient: "from-amber-400 to-orange-600"
    },
    {
      name: "مجموعة العروس الماسية",
      nameEn: "Diamond Bridal Collection",
      image: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 500 ر.ع",
      priceEn: "From 500 OMR",
      description: "تصاميم حصرية للعرائس بأحجار كريمة ولؤلؤ طبيعي",
      items: 15,
      badge: "حصري",
      gradient: "from-pink-400 to-purple-600"
    },
    {
      name: "مجموعة الشباب العصرية",
      nameEn: "Modern Youth Collection",
      image: "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 120 ر.ع",
      priceEn: "From 120 OMR",
      description: "تصاميم عصرية للشابات بألوان جريئة وأنماط حديثة",
      items: 40,
      badge: "جديد",
      gradient: "from-blue-400 to-cyan-600"
    }
  ]

  const testimonials = [
    {
      name: "فاطمة بنت سالم المحروقية",
      location: "مسقط",
      rating: 5,
      comment: "محل عبد الرحيم أفضل متجر لتفصيل البُرقع في عُمان. الجودة ممتازة والخدمة راقية جداً. التطريز اليدوي فن حقيقي.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "بُرقع العرس الذهبي",
      date: "منذ أسبوعين"
    },
    {
      name: "عائشة بنت محمد البلوشية",
      location: "صلالة",
      rating: 5,
      comment: "التطريز اليدوي رائع جداً والتصاميم عصرية وأنيقة. فريق العمل محترف ومتعاون جداً. تجربة مميزة بكل المقاييس.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "أورنا حريرية متدرجة",
      date: "منذ شهر"
    },
    {
      name: "مريم بنت علي الزدجالية",
      location: "نزوى",
      rating: 5,
      comment: "خدمة التوصيل سريعة والأسعار معقولة جداً. حصلت على بُرقع العرس وكان فوق التوقعات بمراحل. شكراً لكم من القلب.",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "بُرقع التراث العُماني",
      date: "منذ 3 أسابيع"
    }
  ]

  const features = [
    {
      icon: Truck,
      title: "توصيل مجاني",
      description: "توصيل مجاني لجميع أنحاء السلطنة"
    },
    {
      icon: Shield,
      title: "ضمان الجودة",
      description: "ضمان شامل على جميع منتجاتنا"
    },
    {
      icon: CreditCard,
      title: "دفع آمن",
      description: "طرق دفع متعددة وآمنة"
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "خدمة عملاء على مدار الساعة"
    }
  ]

  const stats = [
    { number: "25000+", label: "عميلة راضية", icon: Users },
    { number: "4", label: "فروع متخصصة", icon: Store },
    { number: "28", label: "سنة خبرة", icon: Award },
    { number: "24/7", label: "خدمة العملاء", icon: Headphones }
  ]

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'dark bg-gray-950' : 'bg-white'}`}>
      {/* Enhanced Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  محل عبد الرحيم
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">للخياطة النسائية الفاخرة</p>
              </div>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { href: "#home", label: "الرئيسية" },
                { href: "#services", label: "خدماتنا" },
                { href: "#collections", label: "المجموعات" },
                { href: "#gallery", label: "المعرض" },
                { href: "#branches", label: "فروعنا" },
                { href: "#contact", label: "اتصل بنا" }
              ].map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {item.label}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Enhanced User Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="h-5 w-5 text-gray-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Enhanced User Profile or Login */}
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 cursor-pointer group bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-3 rounded-xl shadow-lg"
                  onClick={logout}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 group-hover:border-purple-500 transition-all duration-300"
                  />
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white block">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">اضغط للخروج</span>
                  </div>
                </motion.div>
              ) : (
                <Link href="/sign-in">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    تسجيل الدخول
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden py-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col space-y-4">
                  {[
                    { href: "#home", label: "الرئيسية" },
                    { href: "#services", label: "خدماتنا" },
                    { href: "#collections", label: "المجموعات" },
                    { href: "#gallery", label: "المعرض" },
                    { href: "#branches", label: "فروعنا" },
                    { href: "#contact", label: "اتصل بنا" }
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-right font-semibold text-lg py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative pt-20 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-0 opacity-30 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20"
              style={{
                backgroundSize: '400% 400%',
              }}
            />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  delay: i * 2,
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-12"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 text-blue-800 dark:text-blue-300 px-8 py-4 rounded-full text-lg font-bold mb-12 shadow-2xl border border-blue-200/50 dark:border-blue-800/50"
              >
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span>أفضل متجر للبُرقع والأورنا في عُمان منذ 1995</span>
                <Crown className="h-6 w-6 text-yellow-500" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-7xl md:text-9xl font-black text-gray-900 dark:text-white mb-8 leading-tight"
              >
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block text-right mb-6"
                >
                  محل
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.3 }}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block"
                >
                  عبد الرحيم
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="block text-4xl md:text-5xl mt-6 text-gray-700 dark:text-gray-300 font-bold"
                >
                  للخياطة النسائية الفاخرة
                </motion.span>
              </motion.h1>

              {/* Enhanced Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="max-w-5xl mx-auto mb-12"
              >
                <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed text-right mb-6 font-medium">
                  نحن رواد تفصيل وتصميم البُرقع والأورنا في سلطنة عُمان منذ أكثر من 28 عاماً
                </p>
                <p className="text-xl text-gray-500 dark:text-gray-400 text-right leading-relaxed">
                  نقدم أجود الخامات المستوردة مع أفضل التصاميم العصرية والتراثية بحرفية عُمانية أصيلة
                </p>
              </motion.div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <Crown className="h-6 w-6 mr-3" />
                استكشف مجموعاتنا الحصرية
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-500 transform hover:scale-105 shadow-xl"
              >
                <Phone className="h-6 w-6 mr-3" />
                احجز موعداً مجانياً
              </Button>

              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:scale-105"
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                واتساب مباشر
              </Button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-blue-500/10 transition-all duration-500"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-32 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 px-6 py-3 rounded-full text-lg font-bold mb-8 border-0">
              <Award className="h-5 w-5 mr-2" />
              خدمات متخصصة ومميزة
            </Badge>
            
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                خدماتنا
              </span>
              <br />
              الحصرية
            </h2>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto text-right leading-relaxed font-medium">
              نقدم مجموعة شاملة من الخدمات المتخصصة في تفصيل وتصميم البُرقع والأورنا بأعلى معايير الجودة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <CardHeader className="relative pb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl`}
                    >
                      <service.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white text-right mb-3">
                      {service.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-right leading-relaxed text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center justify-end gap-3 text-gray-600 dark:text-gray-300"
                        >
                          <span className="font-medium">{feature}</span>
                          <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r ${service.gradient} text-white hover:shadow-lg transition-all duration-300`}
                      >
                        اطلب الآن
                      </Button>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {service.price}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {service.titleEn}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Collections Section */}
      <section id="collections" className="py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 px-6 py-3 rounded-full text-lg font-bold mb-8 border-0">
              <Eye className="h-5 w-5 mr-2" />
              مجموعات حصرية ومميزة
            </Badge>
            
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              مجموعاتنا
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                الفاخرة
              </span>
            </h2>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto text-right leading-relaxed font-medium">
              اكتشفي أحدث تصاميمنا المستوحاة من التراث العربي الأصيل مع لمسة عصرية راقية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {collections.map((collection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white dark:bg-gray-800">
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Collection Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", bounce: 0.5 }}
                      className={`absolute top-6 right-6 bg-gradient-to-r ${collection.gradient} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
                    >
                      {collection.badge}
                    </motion.div>

                    {/* Items Count */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {collection.items} قطعة
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-3xl font-black mb-3 text-right">
                        {collection.name}
                      </h3>
                      <p className="text-purple-200 text-base mb-4 text-right font-medium">
                        {collection.nameEn}
                      </p>
                      <p className="text-white/90 text-base mb-6 text-right leading-relaxed">
                        {collection.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-xl">
                          استكشف المجموعة
                        </Button>
                        <div className="text-right">
                          <div className="text-3xl font-black">
                            {collection.price}
                          </div>
                          <div className="text-sm text-purple-200 font-medium">
                            {collection.priceEn}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              آراء
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}عميلاتنا
              </span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl p-12 text-center">
                  <div className="mb-8">
                    <Quote className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                    <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed text-right font-medium mb-8">
                      "{testimonials[currentTestimonial].comment}"
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-xl"
                    />
                    <div className="text-right">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {testimonials[currentTestimonial].location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonials[currentTestimonial].order} • {testimonials[currentTestimonial].date}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Branches Section */}
      <section id="branches" className="py-32 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 px-6 py-3 rounded-full text-lg font-bold mb-8 border-0">
              <Store className="h-5 w-5 mr-2" />
              فروع منتشرة في جميع أنحاء السلطنة
            </Badge>
            
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              فروعنا الأربعة
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                في عُمان
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white dark:bg-gray-800">
                  <div className="relative h-80">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Branch Number */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", bounce: 0.5 }}
                      className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl"
                    >
                      {branch.id}
                    </motion.div>

                    {/* Rating */}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {branch.rating} ({branch.reviews})
                    </div>

                    {/* Speciality */}
                    <div className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {branch.speciality}
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white text-right">
                        {branch.name}
                      </CardTitle>
                      <CardDescription className="text-blue-600 dark:text-blue-400 text-right font-semibold text-lg">
                        {branch.nameEn}
                      </CardDescription>
                    </CardHeader>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="text-right flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{branch.address}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{branch.addressEn}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                        <Phone className="h-6 w-6 text-blue-500" />
                        <div className="text-right flex-1">
                          <span className="font-semibold text-gray-900 dark:text-white">{branch.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                        <MessageCircle className="h-6 w-6 text-green-500" />
                        <div className="text-right flex-1">
                          <span className="font-semibold text-green-600">{branch.whatsapp}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 text-gray-600 dark:text-gray-300">
                        <Clock className="h-6 w-6 text-blue-500 mt-1" />
                        <div className="text-right flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{branch.hours}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{branch.hoursEn}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold shadow-xl">
                        <Phone className="h-5 w-5 mr-2" />
                        اتصل بالفرع
                      </Button>

                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold shadow-xl">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        واتساب
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              ابدئي رحلتك
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                معنا اليوم
              </span>
            </h2>
            
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              انضمي إلى آلاف العميلات الراضيات واحصلي على أجمل التصاميم الحصرية
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 transform hover:scale-105"
              >
                <Calendar className="h-6 w-6 mr-3" />
                احجزي موعدك الآن
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 rounded-2xl font-black text-xl transition-all duration-500 transform hover:scale-105"
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                تواصلي معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    محل عبد الرحيم
                  </h3>
                  <p className="text-gray-400">للخياطة النسائية الفاخرة</p>
                </div>
              </div>
              <p className="text-gray-300 text-right leading-relaxed text-lg mb-6">
                نحن رواد تفصيل وتصميم البُرقع والأورنا في سلطنة عُمان منذ أكثر من 28 عاماً، نقدم أجود الخامات والتصاميم بحرفية عُمانية أصيلة.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: Instagram, href: "#", color: "from-pink-500 to-purple-600" },
                  { icon: Facebook, href: "#", color: "from-blue-500 to-blue-700" },
                  { icon: MessageCircle, href: "#", color: "from-green-500 to-emerald-600" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <social.icon className="h-6 w-6 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-right">روابط سريعة</h4>
              <div className="space-y-3 text-right">
                {["خدماتنا", "المجموعات", "فروعنا", "من نحن", "اتصل بنا"].map((link, index) => (
                  <motion.a
                    key={link}
                    href="#"
                    whileHover={{ x: -5 }}
                    className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg"
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-right">تواصل معنا</h4>
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-300 text-lg">+968 2244 5566</span>
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-300 text-lg">info@abdurrahim.om</span>
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex items-start justify-end gap-3">
                  <span className="text-gray-300 text-lg text-right">مسقط، سلطنة عُمان</span>
                  <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-12 bg-gray-700" />

          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-right">
            <p className="text-gray-400 text-lg">
              © 2024 محل عبد الرحيم. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-400 text-lg">
              صُنع بـ ❤️ في سلطنة عُمان
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}