import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Shield, Zap, Trophy, Target, Skull, Filter, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/supabase';
import type { Product } from '@/types/database';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';
type FilterOption = 'all' | 'prestige' | 'warzone' | 'zombies' | 'dmz';

export default function AccountsSection() {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [codAccounts, setCodAccounts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    loadAccounts();
    // Refresh accounts every 5 seconds
    const interval = setInterval(loadAccounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAccounts = async () => {
    try {
      const allProducts = await getAllProducts();
      setCodAccounts(allProducts.filter(p => p.category === 'accounts'));
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = (products: Product[]): Product[] => {
    if (filterBy === 'all') return products;
    
    return products.filter(product => {
      const desc = product.description.toLowerCase();
      const name = product.name.toLowerCase();
      
      switch (filterBy) {
        case 'prestige':
          return name.includes('prestige') || name.includes('master');
        case 'warzone':
          return name.includes('warzone') || desc.includes('kills');
        case 'zombies':
          return name.includes('zombies') || desc.includes('easter egg') || desc.includes('dark aether');
        case 'dmz':
          return name.includes('dmz') || desc.includes('faction');
        default:
          return true;
      }
    });
  };

  const sortProducts = (products: Product[]): Product[] => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  };

  const filteredAndSortedAccounts = sortProducts(filterProducts(codAccounts));

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All Accounts' },
    { value: 'prestige', label: 'Prestige Master' },
    { value: 'warzone', label: 'Warzone' },
    { value: 'zombies', label: 'Zombies' },
    { value: 'dmz', label: 'DMZ' },
  ];

  return (
    <section ref={sectionRef} id="accounts" className="relative py-24 bg-[#08080c]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9333EA]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <Badge className="mb-4 bg-[#9333EA]/10 text-[#9333EA] border-[#9333EA]/30">
              <Gamepad2 className="w-3 h-3 mr-1" />
              Call of Duty
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold font-['Orbitron'] text-white mb-4">
              COD <span className="text-[#9333EA]">ACCOUNTS</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Skip the grind with our premium Call of Duty accounts. 
              Pre-leveled, rare skins, and instant delivery.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterOptions.find(o => o.value === filterBy)?.label}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0f0f14] border-white/10">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterBy(option.value)}
                    className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    {filterBy === option.value && (
                      <Check className="w-4 h-4 mr-2 text-[#9333EA]" />
                    )}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Sort: {sortOptions.find(o => o.value === sortBy)?.label}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0f0f14] border-white/10">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    {sortBy === option.value && (
                      <Check className="w-4 h-4 mr-2 text-[#9333EA]" />
                    )}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Account Types */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { icon: Trophy, label: 'Prestige Master', desc: 'Max level accounts', color: '#FFD700' },
            { icon: Target, label: 'Warzone', desc: 'Battle Royale ready', color: '#06B6D4' },
            { icon: Skull, label: 'Zombies', desc: 'All easter eggs', color: '#9333EA' },
            { icon: Zap, label: 'DMZ', desc: 'Faction complete', color: '#10B981' },
          ].map((type) => (
            <button
              key={type.label}
              onClick={() => {
                const filterMap: Record<string, FilterOption> = {
                  'Prestige Master': 'prestige',
                  'Warzone': 'warzone',
                  'Zombies': 'zombies',
                  'DMZ': 'dmz',
                };
                setFilterBy(filterMap[type.label]);
              }}
              className="glass rounded-xl p-4 text-left hover:bg-white/10 transition-all group"
            >
              <type.icon 
                className="w-8 h-8 mb-3 transition-transform group-hover:scale-110" 
                style={{ color: type.color }}
              />
              <h4 className="text-white font-semibold text-sm mb-1">{type.label}</h4>
              <p className="text-gray-500 text-xs">{type.desc}</p>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedAccounts.map((account, index) => (
            <div
              key={account.id}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${150 + index * 50}ms` }}
            >
              <ProductCard product={account} />
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className={`mt-16 glass rounded-2xl p-8 border border-[#9333EA]/20 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#9333EA]/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#9333EA]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">Account Guarantee</h4>
                <p className="text-gray-400 text-sm">All accounts come with lifetime warranty and 24/7 support.</p>
              </div>
            </div>
            <div className="flex gap-8">
              {[
                { label: 'Safe Transfer', icon: Check },
                { label: 'Full Access', icon: Check },
                { label: 'No Recalls', icon: Check },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-[#10B981]" />
                  <span className="text-gray-300 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
