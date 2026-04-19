import { useState, useEffect, useRef } from 'react';
import { Coins, Zap, Clock, Globe, Shield, Check, Sparkles, TrendingUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { getLocalProductsByCategory } from '@/data/localDatabase';
import { useCartStore } from '@/store/cartStore';

const WHATSAPP_NUMBER = '23481225541898';

export default function CPPointsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cpProducts = getLocalProductsByCategory('cp');
  const popularPackage = cpProducts.find(p => p.is_bestseller);

  const openWhatsApp = () => {
    const message = `Hello Khalex Hub!%0AI want to buy CP Points.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <section ref={sectionRef} id="cp" className="relative py-24 bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#06B6D4]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFD700]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge className="mb-4 bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30">
            <Coins className="w-3 h-3 mr-1" />
            Call of Duty Points
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold font-['Orbitron'] text-white mb-4">
            INSTANT <span className="text-[#06B6D4]">CP TOP-UP</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get your Call of Duty Points instantly. No waiting, no hassle. 
            Use them for Battle Pass, bundles, and operator packs.
          </p>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { icon: Zap, label: 'Instant Delivery', desc: 'Under 5 minutes', color: '#FFD700' },
            { icon: Globe, label: 'Global Region', desc: 'Works worldwide', color: '#06B6D4' },
            { icon: Clock, label: '24/7 Service', desc: 'Always available', color: '#9333EA' },
            { icon: Shield, label: '100% Safe', desc: 'Secure transfer', color: '#10B981' },
          ].map((feature) => (
            <div key={feature.label} className="glass rounded-xl p-5 text-center hover:bg-white/10 transition-all group">
              <feature.icon 
                className="w-8 h-8 mx-auto mb-3 transition-transform group-hover:scale-110" 
                style={{ color: feature.color }}
              />
              <h4 className="text-white font-semibold text-sm mb-1">{feature.label}</h4>
              <p className="text-gray-500 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Popular Package Highlight */}
        {popularPackage && (
          <div className={`mb-16 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative glass rounded-3xl p-8 md:p-12 border border-[#FFD700]/30 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <Badge className="mb-4 gradient-gold text-black">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-bold text-white font-['Orbitron'] mb-4">
                    {popularPackage.name} Package
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-lg">
                    {popularPackage.description} Perfect for purchasing the Battle Pass 
                    and multiple bundles throughout the season.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {popularPackage.features.map((feature) => (
                      <span
                        key={feature}
                        className="flex items-center gap-1 text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full"
                      >
                        <Check className="w-3 h-3 text-[#10B981]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-[#FFD700]">
                      ₦{popularPackage.price.toLocaleString()}
                    </span>
                    {popularPackage.original_price && (
                      <span className="text-xl text-gray-500 line-through">
                        ₦{popularPackage.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => addItem(popularPackage)}
                    className="btn-primary text-lg px-8 py-6"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={openWhatsApp}
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Order on WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Packages */}
        <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white font-['Orbitron']">
              All CP Packages
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span>Best value guaranteed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cpProducts.map((cp, index) => (
              <div
                key={cp.id}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${350 + index * 50}ms` }}
              >
                <ProductCard product={cp} />
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className={`mt-20 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-2xl font-bold text-white font-['Orbitron'] text-center mb-12">
            How It <span className="text-[#06B6D4]">Works</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Package', desc: 'Select your desired CP amount', icon: Coins },
              { step: '2', title: 'Add to Cart', desc: 'Add items and proceed to checkout', icon: Zap },
              { step: '3', title: 'Order on WhatsApp', desc: 'Send your order details via WhatsApp', icon: MessageCircle },
              { step: '4', title: 'Receive CP', desc: 'Get your points within 5 minutes', icon: Check },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#06B6D4]/50 to-transparent" />
                )}
                
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5 border border-[#06B6D4]/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#06B6D4] font-['Orbitron']">{item.step}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
