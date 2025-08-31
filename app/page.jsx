"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import Link from "next/link"

export default function LadiesTailoringLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null) // Simulating auth state
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Simulate theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const logout = () => {
    setUser(null)
  }

  // Services data
  const services = [
    {
      title: "تفصيل البُرقع",
      titleEn: "Burqa Tailoring",
      description: "نقدم خدمات تفصيل البُرقع العُماني التقليدي بتصاميم عصرية ومبتكرة، مع الحفاظ على الأصالة. نستخدم أجود أنواع الأقمشة والخيوط.",
      features: ["تصميم حسب الطلب", "خامات فاخرة", "تطريز يدوي"],
      icon: Shield,
    },
    {
      title: "تطريز يدوي",
      titleEn: "Hand Embroidery",
      description: "فريقنا المتخصص في التطريز اليدوي يحول كل قطعة إلى عمل فني فريد. نستخدم خيوطاً ذهبية وفضية وأحجار كريمة لتزيين تصاميمك.",
      features: ["تطريز ذهبي وفضي", "تصميمات شخصية", "جودة عالية"],
      icon: Zap,
    },
    {
      title: "تصميم الأورنا",
      titleEn: "Orna Design",
      description: "نقدم تصاميم حصرية للأورنا (الشال) بألوان وأنماط مختلفة تناسب جميع المناسبات. يمكنك اختيار الأقمشة والألوان التي تفضلينها.",
      features: ["تصاميم حصرية", "ألوان متناسقة", "أقمشة حريرية"],
      icon: Heart,
    },
    {
      title: "إعادة تأهيل وتجديد",
      titleEn: "Restoration & Renovation",
      description: "نقوم بإعادة تأهيل وتجديد القطع القديمة لتستعيد جمالها وبريقها. نصلح أي أضرار ونضيف لمسات عصرية إذا رغبتِ.",
      features: ["إصلاح الأضرار", "تجديد التصميم", "تغيير الألوان"],
      icon: Palette,
    }
  ];

  const branches = [
    {
      id: 1,
      name: "الفرع الأول - مسقط الرئيسي",
      nameEn: "Branch 1 - Muscat Main",
      address: "شارع السلطان قابوس، الخوير، مسقط",
      addressEn: "Sultan Qaboos Street, Al Khuwair, Muscat",
      phone: "+968 2244 5566",
      whatsapp: "+968 9988 7766",
      hours: "السبت - الخميس: 9:00 ص - 10:00 م",
      hoursEn: "Sat - Thu: 9:00 AM - 10:00 PM",
      image: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تصاميم VIP وخدمة شخصية"
    },
    {
      id: 2,
      name: "الفرع الثاني - صلالة",
      nameEn: "Branch 2 - Salalah",
      address: "منطقة الحافة، بجانب مول صلالة",
      addressEn: "Al Hafah, Next to Salalah Mall",
      phone: "+968 2377 8899",
      whatsapp: "+968 9955 4433",
      hours: "السبت - الخميس: 9:30 ص - 9:30 م",
      hoursEn: "Sat - Thu: 9:30 AM - 9:30 PM",
      image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تطريز تراثي وتصاميم ظفارية"
    },
    {
      id: 3,
      name: "الفرع الثالث - نزوى",
      nameEn: "Branch 3 - Nizwa",
      address: "سوق نزوى التقليدي، بجانب القلعة",
      addressEn: "Nizwa Traditional Souq, Near the Fort",
      phone: "+968 2544 3322",
      whatsapp: "+968 9922 1199",
      hours: "السبت - الخميس: 8:00 ص - 8:00 م",
      hoursEn: "Sat - Thu: 8:00 AM - 8:00 PM",
      image: "https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تراث الداخلية وتصاميم كلاسيكية"
    },
    {
      id: 4,
      name: "الفرع الرابع - صور",
      nameEn: "Branch 4 - Sur",
      address: "الكورنيش، مقابل فندق صور بلازا",
      addressEn: "Corniche, Opposite Sur Plaza Hotel",
      phone: "+968 2566 7788",
      whatsapp: "+968 9977 5544",
      hours: "السبت - الخميس: 9:00 ص - 9:00 م",
      hoursEn: "Sat - Thu: 9:00 AM - 9:00 PM",
      image: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      speciality: "تصاميم بحرية وألوان عصرية"
    }
  ]

  const collections = [
    {
      name: "مجموعة الأناقة الملكية",
      nameEn: "Royal Elegance Collection",
      image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 250 ر.ع",
      priceEn: "From 250 OMR",
      description: "تصاميم مستوحاة من القصور الملكية بتطريز ذهبي فاخر",
      items: 25
    },
    {
      name: "مجموعة المناسبات الخاصة",
      nameEn: "Special Occasions Collection",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 180 ر.ع",
      priceEn: "From 180 OMR",
      description: "تصاميم رسمية للمناسبات والحفلات الراقية",
      items: 35
    },
    {
      name: "مجموعة العروس الماسية",
      nameEn: "Diamond Bridal Collection",
      image: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 500 ر.ع",
      priceEn: "From 500 OMR",
      description: "تصاميم حصرية للعرائس بأحجار كريمة ولؤلؤ طبيعي",
      items: 15
    },
    {
      name: "مجموعة الشباب العصرية",
      nameEn: "Modern Youth Collection",
      image: "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 120 ر.ع",
      priceEn: "From 120 OMR",
      description: "تصاميم عصرية للشابات بألوان جريئة وأنماط حديثة",
      items: 40
    },
    {
      name: "مجموعة التراث العُماني",
      nameEn: "Omani Heritage Collection",
      image: "https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 200 ر.ع",
      priceEn: "From 200 OMR",
      description: "تصاميم تراثية أصيلة مستوحاة من الفنون العُمانية التقليدية",
      items: 20
    },
    {
      name: "مجموعة الأورنا الحريرية",
      nameEn: "Premium Silk Orna Collection",
      image: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=500&h=600",
      price: "من 80 ر.ع",
      priceEn: "From 80 OMR",
      description: "أورنا حريرية فاخرة بألوان متدرجة وتصاميم فنية راقية",
      items: 60
    }
  ]

  const testimonials = [
    {
      name: "فاطمة بنت سالم المحروقية",
      location: "مسقط",
      rating: 5,
      comment: "محل عبد الرحيم أفضل متجر لتفصيل البُرقع في عُمان. الجودة ممتازة والخدمة راقية جداً. التطريز اليدوي فن حقيقي. أنصح جميع الأخوات بزيارة هذا المحل الرائع.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "بُرقع العرس الذهبي"
    },
    {
      name: "عائشة بنت محمد البلوشية",
      location: "صلالة",
      rating: 5,
      comment: "التطريز اليدوي رائع جداً والتصاميم عصرية وأنيقة. فريق العمل محترف ومتعاون جداً. حصلت على أجمل أورنا في المناسبة. تجربة مميزة بكل المقاييس.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "أورنا حريرية متدرجة"
    },
    {
      name: "مريم بنت علي الزدجالية",
      location: "نزوى",
      rating: 5,
      comment: "خدمة التوصيل سريعة والأسعار معقولة جداً. حصلت على بُرقع العرس من الفرع الثالث وكان فوق التوقعات بمراحل. الخامات فاخرة والتفصيل دقيق. شكراً لكم من القلب.",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "بُرقع التراث العُماني"
    },
    {
      name: "زينب بنت أحمد الهنائية",
      location: "صور",
      rating: 5,
      comment: "الفرع الرابع في صور خدمة ممتازة. طلبت تصميم حسب الطلب وكانت النتيجة أكثر من رائعة. الألوان البحرية جميلة جداً والتطريز فني احترافي. أعود دائماً لهذا المحل.",
      avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      order: "تصميم بحري خاص"
    }
  ]

  const galleryImages = [
    {
      src: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400&h=500",
      title: "بُرقع مطرز بالذهب",
      category: "تطريز فاخر"
    },
    {
      src: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=500",
      title: "أورنا حريرية زرقاء",
      category: "حرير طبيعي"
    },
    {
      src: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400&h=500",
      title: "تصميم العروس الملكي",
      category: "مجموعة العرائس"
    },
    {
      src: "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=400&h=500",
      title: "بُرقع شبابي عصري",
      category: "تصاميم حديثة"
    },
    {
      src: "https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg?auto=compress&cs=tinysrgb&w=400&h=500",
      title: "تراث عُماني أصيل",
      category: "التراث العُماني"
    },
    {
      src: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=400&h=500",
      title: "أورنا ملونة راقية",
      category: "ألوان متدرجة"
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
          } border-b border-gray-200 dark:border-gray-700`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  محل عبد الرحيم
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Mohol Abdur Rahim</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">الرئيسية</a>
              <a href="#services" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">خدماتنا</a>
              <a href="#collections" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">المجموعات</a>
              <a href="#gallery" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">المعرض</a>
              <a href="#branches" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">فروعنا</a>
              <a href="#contact" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">اتصل بنا</a>
            </div>

            {/* User Profile & Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </motion.button>

              {/* User Profile or Login */}
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={logout}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 group-hover:border-pink-500 transition-colors"
                  />
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white block">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">اضغط للخروج</span>
                  </div>
                </motion.div>
              ) : (
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}

                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg"
                  >
                    تسجيل الدخول
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-right font-medium">الرئيسية</a>
                <a href="#services" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-right font-medium">خدماتنا</a>
                <a href="#collections" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-right font-medium">المجموعات</a>
                <a href="#gallery" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-right font-medium">المعرض</a>
                <a href="#branches" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-right font-medium">فروعنا</a>
                <a href="#contact" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-right font-medium">اتصل بنا</a>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-20 min-h-screen flex items-center overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
            alt="A woman wearing a burqa from our premium collection"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
                <Sparkles className="h-4 w-4" />
                <span>أفضل متجر للبُرقع والأورنا في عُمان منذ 1995</span>
                <Sparkles className="h-4 w-4" />
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                <span className="block text-right mb-4">محل</span>
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  عبد الرحيم
                </span>
                <span className="block text-3xl md:text-4xl mt-4 text-gray-700 dark:text-gray-300">
                  للخياطة النسائية الفاخرة
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed text-right mb-4">
                نحن رواد تفصيل وتصميم البُرقع والأورنا في سلطنة عُمان منذ أكثر
                من 25 عاماً. نقدم أجود الخامات المستوردة مع أفضل التصاميم
                العصرية والتراثية بحرفية عُمانية أصيلة.
              </p>

              <p className="text-lg text-purple-700 dark:text-purple-400 font-semibold">
                4 فروع | 25000+ عميلة راضية | خدمة 24/7
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-xl font-semibold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-3"
              >
                <Crown className="h-6 w-6" />
                استكشف مجموعاتنا الحصرية
                <ArrowRight className="h-6 w-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-10 py-5 rounded-xl font-semibold text-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 flex items-center gap-3 shadow-lg"
              >
                <Phone className="h-6 w-6" />
                احجز موعداً مجانياً
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-10 py-5 rounded-xl font-semibold text-xl shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                واتساب مباشر
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              >
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  25000+
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  عميلة راضية
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              >
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  4
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  فروع متخصصة
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              >
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  24/7
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  خدمة العملاء
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              <span>خدمات متخصصة ومميزة</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              خدماتنا الحصرية
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-right leading-relaxed">
              نقدم مجموعة شاملة من الخدمات المتخصصة في تفصيل وتصميم البُرقع
              والأورنا بأعلى معايير الجودة والحرفية العُمانية الأصيلة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-right">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-right leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <span>{feature}</span>
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-sm text-purple-600 dark:text-purple-400 font-medium text-right">
                    {service.titleEn}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Eye className="h-4 w-4" />
              <span>مجموعات حصرية ومميزة</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              مجموعاتنا الفاخرة
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-right leading-relaxed">
              اكتشفي أحدث تصاميمنا المستوحاة من التراث العربي الأصيل مع لمسة
              عصرية راقية تناسب جميع الأذواق والمناسبات
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {collections.map((collection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-xl">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Collection Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
                    {collection.items} قطعة
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-right">
                      {collection.name}
                    </h3>
                    <p className="text-purple-200 text-sm mb-3 text-right">
                      {collection.nameEn}
                    </p>
                    <p className="text-white/90 text-sm mb-4 text-right leading-relaxed">
                      {collection.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      >
                        استكشف المجموعة
                      </motion.button>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {collection.price}
                        </div>
                        <div className="text-sm text-purple-200">
                          {collection.priceEn}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              معرض أعمالنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-right">
              شاهدي نماذج من أعمالنا الفنية والتصاميم الحصرية التي أبدعناها
              لعميلاتنا الكريمات
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-bold text-lg text-right">
                      {item.title}
                    </h4>
                    <p className="text-sm text-purple-200 text-right">
                      {item.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Store className="h-4 w-4" />
              <span>فروع منتشرة في جميع أنحاء السلطنة</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              فروعنا الأربعة في عُمان
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-right leading-relaxed">
              نخدمكم في أربعة مواقع استراتيجية عبر السلطنة لنكون قريبين منكم
              دائماً مع نفس مستوى الجودة والخدمة المميزة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 dark:border-gray-700"
              >
                <div className="relative h-64">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Branch Number Badge */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {branch.id}
                  </div>

                  {/* Speciality Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {branch.speciality}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-right">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-6 text-right font-medium">
                    {branch.nameEn}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <MapPin className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                      <div className="text-right flex-1">
                        <div className="font-medium">{branch.address}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {branch.addressEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="h-5 w-5 text-purple-500" />
                      <div className="text-right flex-1">
                        <span className="font-medium">{branch.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      <div className="text-right flex-1">
                        <span className="font-medium text-green-600">
                          {branch.whatsapp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <Clock className="h-5 w-5 text-purple-500 mt-1" />
                      <div className="text-right flex-1">
                        <div className="font-medium">{branch.hours}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {branch.hoursEn}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      اتصل بالفرع
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      واتساب
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div >
  )
}