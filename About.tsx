import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, ShieldCheck, Globe, ShoppingBag, Truck, Zap, Cpu, Search } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen pt-24 font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00FF00] rounded-full filter blur-[150px]" />
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400 dark:bg-white rounded-full filter blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-xs mb-8"
          >
            Digital Footprint
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-12 text-gray-900 dark:text-white"
          >
            Decoding <br /> <span className="text-transparent border-b-4 border-gray-200 dark:border-white/20">SneakerX</span>
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            MarketMaster was reimagined as SneakerX. An elite ecosystem for the fusion of high-performance footwear and digital luxury.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 leading-tight text-gray-900 dark:text-white">Our Core <span className="text-[#00FF00]">Logics</span></h2>
            <div className="space-y-8">
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-lg">
                SneakerX isn't just a marketplace; it's a protocol for authenticity. We've optimized the shopping experience for the next generation of collectors.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-lg">
                By integrating biometric security and high-speed logistics, we ensure every pair delivered meets the rigorous standards of the digital elite.
              </p>
            </div>
            
            <div className="mt-12 flex space-x-12">
               <div>
                  <p className="text-4xl font-black text-gray-900 dark:text-white italic">500+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF00]">Elite Units</p>
               </div>
               <div>
                  <p className="text-4xl font-black text-gray-900 dark:text-white italic">12k</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF00]">Verified Drops</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-12 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/5 rounded-[3.5rem] relative group hover:border-[#00FF00] transition-colors">
              <Zap className="h-10 w-10 text-[#00FF00] mb-8" />
              <h3 className="font-black uppercase italic text-2xl tracking-tight mb-4 text-gray-900 dark:text-white">Hyper Speed</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Optimization of the supply chain to provide 24-hour delivery cycles in primary sectors.</p>
            </div>
            <div className="p-12 bg-black dark:bg-white text-white dark:text-black rounded-[3.5rem] relative group">
              <Cpu className="h-10 w-10 text-white dark:text-gray-900 mb-8" />
              <h3 className="font-black uppercase italic text-2xl tracking-tight mb-4">Neural Auth</h3>
              <p className="text-sm text-gray-300 dark:text-gray-800 font-medium leading-relaxed">Proprietary AI-driven verification process to guarantee 100% product integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-32 bg-gray-50 dark:bg-[#0d0d0d] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-gray-900 dark:text-white">The Standard Protocol</h2>
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Architected for excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: 'Sentinel Guard',
                desc: 'Multi-layer encryption for every transaction data packet.'
              },
              {
                icon: Search,
                title: 'Deep Optics',
                desc: 'Granular visibility into product history and origin data.'
              },
              {
                icon: Globe,
                title: 'Global Nexus',
                desc: 'Synchronized with major sneaker hubs across 16 primary regions.'
              }
            ].map((item, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="p-10 rounded-[3rem] border border-gray-200 dark:border-white/5 bg-white dark:bg-black/40 hover:border-gray-300 dark:hover:border-white/20 transition-all text-center md:text-left shadow-sm hover:shadow-xl dark:shadow-none"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                  <item.icon className="h-8 w-8 text-[#00FF00]" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
