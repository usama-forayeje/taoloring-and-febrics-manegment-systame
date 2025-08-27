"use client"
import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
}

// Shop data for ladies tailoring
const services = [
  {
    id: 1,
    name: "Custom Burkha Tailoring",
    description: "Traditional and modern burkha designs tailored to perfection",
    image: "/elegant-burkha-tailoring-shop.png",
    price: "Starting from OMR 45",
    features: ["Custom fitting", "Premium fabrics", "Traditional designs"],
  },
  {
    id: 2,
    name: "Abaya Collection",
    description: "Elegant abayas for every occasion with intricate embroidery",
    image: "/beautiful-abaya-collection-display.png",
    price: "Starting from OMR 65",
    features: ["Hand embroidery", "Luxury materials", "Modern cuts"],
  },
  {
    id: 3,
    name: "Hijab & Accessories",
    description: "Premium hijabs and matching accessories",
    image: "/colorful-hijab-collection.png",
    price: "Starting from OMR 15",
    features: ["Silk materials", "Various colors", "Matching sets"],
  },
  {
    id: 4,
    name: "Fabric Shop",
    description: "High-quality fabrics for all your tailoring needs",
    image: "/fabric-shop-with-colorful-textiles.png",
    price: "Per meter pricing",
    features: ["Premium quality", "Wide selection", "Competitive prices"],
  },
]

const shopLocations = [
  { name: "Muscat Main Branch", address: "Al Khuwair, Muscat", phone: "+968 2234 5678" },
  { name: "Salalah Branch", address: "Al Dahariz, Salalah", phone: "+968 2334 5679" },
  { name: "Nizwa Branch", address: "Al Aqr, Nizwa", phone: "+968 2534 5680" },
  { name: "Sur Branch", address: "Al Ayjah, Sur", phone: "+968 2634 5681" },
]

const features = [
  {
    icon: Scissors,
    title: "Expert Tailoring",
    description: "15+ years of professional tailoring experience",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Premium materials and perfect finishing guaranteed",
  },
  {
    icon: Zap,
    title: "Quick Service",
    description: "Fast turnaround without compromising on quality",
  },
  {
    icon: Award,
    title: "Trusted Brand",
    description: "Serving Omani families with pride and excellence",
  },
]

const testimonials = [
  {
    name: "Fatima Al-Zahra",
    location: "Muscat",
    rating: 5,
    comment: "The best tailoring shop in Oman! Perfect fitting and beautiful designs every time.",
    image: "/happy-omani-woman-customer.png",
  },
  {
    name: "Aisha Mohammed",
    location: "Salalah",
    rating: 5,
    comment: "Excellent service and high-quality fabrics. My family has been coming here for years.",
    image: "/satisfied-female-customer.png",
  },
  {
    name: "Mariam Al-Busaidi",
    location: "Nizwa",
    rating: 5,
    comment: "Professional staff and beautiful work. Highly recommend for custom tailoring.",
    image: "/happy-customer-testimonial.png",
  },
]

export default function LadiesTailoringLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <div className="p-2 bg-primary rounded-lg">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">Ladies Tailoring</span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Services", "About", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
            <Button size="sm">
              Get Quote
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <Badge className="mb-6">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium Tailoring Services
                </Badge>
              </motion.div>

              <motion.h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance" variants={fadeInUp}>
                Elegant
                <span className="text-primary block">Ladies Tailoring</span>
                <span className="text-muted-foreground">& Fabric Shop</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground max-w-lg leading-relaxed text-pretty"
                variants={fadeInUp}
              >
                Expert tailoring services for burkhas, abayas, and traditional wear. Premium fabrics and perfect fitting
                guaranteed.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
                <Button size="lg" className="h-14 px-8 text-base hover-lift">
                  <Scissors className="h-5 w-5 mr-2" />
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base hover-lift bg-transparent">
                  <Eye className="h-5 w-5 mr-2" />
                  View Gallery
                </Button>
              </motion.div>

              <motion.div className="grid grid-cols-3 gap-8 pt-8" variants={staggerContainer}>
                {[
                  { number: "500+", label: "Happy Customers" },
                  { number: "15+", label: "Years Experience" },
                  { number: "4.9", label: "Rating", icon: Star },
                ].map((stat, index) => (
                  <motion.div key={index} className="text-center" variants={scaleIn}>
                    <div className="text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center mt-1">
                      {stat.icon && <stat.icon className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />}
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative z-10">
                <img
                  src="/elegant-ladies-tailoring-shop-interior.png"
                  alt="Ladies Tailoring Shop"
                  className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto"
                />
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} className="text-center space-y-4 hover-lift" variants={scaleIn}>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-balance">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Professional tailoring and premium fabrics for all your fashion needs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <motion.div key={service.id} variants={fadeInUp}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift">
                  <div className="relative">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg text-balance">{service.name}</h3>
                    <p className="text-muted-foreground text-sm text-pretty">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <Check className="h-3 w-3 text-primary mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-primary">{service.price}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Our Locations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Visit us at any of our convenient locations across Oman
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {shopLocations.map((location, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="hover:shadow-lg transition-all duration-300 hover-lift">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{location.name}</h3>
                    <p className="text-muted-foreground text-sm">{location.address}</p>
                    <p className="text-primary font-medium">{location.phone}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Join hundreds of satisfied customers who trust us for their tailoring needs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="hover:shadow-lg transition-all duration-300 hover-lift">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic leading-relaxed text-pretty">"{testimonial.comment}"</p>
                    <div className="flex items-center space-x-3 pt-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.location}</div>
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
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Ready for Perfect Tailoring?</h2>
            <p className="text-xl opacity-90 leading-relaxed text-pretty">
              Book your appointment today and experience the finest tailoring services in Oman.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileInView={{ scale: [0.8, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base hover-lift">
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-lift bg-transparent"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Visit Store
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-background border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Ladies Tailoring</span>
              </div>
              <p className="text-muted-foreground text-pretty">
                Expert tailoring services and premium fabrics for the modern Omani woman.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Services</h3>
              <div className="space-y-3">
                {["Custom Tailoring", "Burkha Design", "Abaya Collection", "Fabric Shop"].map((link) => (
                  <a key={link} href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <div className="space-y-3">
                {["Contact Us", "Size Guide", "Care Instructions", "FAQ"].map((link) => (
                  <a key={link} href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>Muscat, Sultanate of Oman</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <span>+968 2234 5678</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span>info@ladiestailoring.om</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">&copy; 2024 Ladies Tailoring Shop. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
