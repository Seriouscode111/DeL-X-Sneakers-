import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, Scale, Eye, Database } from 'lucide-react';

export const Policy = () => {
  return (
    <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-24 pb-32 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="py-24 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#080808]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-[#00FF00]/10 border border-[#00FF00] rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-[#00FF00]/10"
          >
            <Shield className="h-10 w-10 text-[#00FF00]" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-6">Security <br /> <span className="text-transparent border-b-2 border-gray-200 dark:border-white/20">Protocols</span></h1>
          <p className="text-gray-500 font-medium tracking-wide">Your data integrity is our primary directive. Review the SneakerX governance framework.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="space-y-24">
          {/* Section: Privacy */}
          <section id="privacy">
            <div className="flex items-center space-x-6 mb-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-[#00FF00]" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Privacy Logic</h2>
            </div>
            
            <div className="space-y-12">
              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">01. Signal Harvesting</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  We capture essential data packets provided during session initiation, including identity metrics, digital communication logs, and physical sector coordinates for logistics.
                </p>
              </div>
              
              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">02. Data Processing</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  Your metrics are utilized to optimize transaction logic, mitigate malicious activities, and refine the curated neural feed on the SneakerX platform.
                </p>
              </div>

              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">03. Secure Transmission</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  Information sharing is restricted to verified distributors within the Nexus for delivery execution. Zero-tolerance policy for secondary market data liquidation.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Terms */}
          <section id="terms">
            <div className="flex items-center space-x-6 mb-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center">
                <Scale className="h-6 w-6 text-[#00FF00]" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Terms of Use</h2>
            </div>
            
            <div className="space-y-12">
              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">Distributor Covenant</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  All distributors must provide absolute accuracy in product manifests. Counterfeit assets or deceptive metadata result in instant terminal disconnection and archive deletion.
                </p>
              </div>
              
              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">Collector Protection</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  SneakerX operates an advanced escrow protocol. Credits are held in virtualization until final delivery validation is confirmed by the collector.
                </p>
              </div>

              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">Nexus Arbitration</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  In cases of transaction conflicts, SneakerX moderators act as neutral processors. Deterministic decisions are reached based on validated chain evidence.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Shipping & Returns */}
          <section id="shipping">
            <div className="flex items-center space-x-6 mb-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center">
                <Database className="h-6 w-6 text-[#00FF00]" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Logistics Policy</h2>
            </div>
            
            <div className="space-y-12">
              <div className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">Shipping Protocols</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  We utilize hyper-speed logistics for 24-48 hour delivery in core sectors. All shipments are insured and tracked via neural-link manifests.
                </p>
              </div>
              
              <div id="returns" className="relative pl-12 border-l border-gray-100 dark:border-white/5">
                <h3 className="text-[12px] font-black text-[#00FF00] uppercase tracking-[0.3em] mb-4">Refund Logic</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  Returns are accepted within 14 Earth days if the biometric security tag remains intact. Liquidated credits are returned to source after successful data validation.
                </p>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="mt-32 p-12 bg-gray-50 dark:bg-[#0d0d0d] rounded-[3.5rem] border border-gray-100 dark:border-white/5 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] mb-4">Last Revision</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">APRIL 30, 2026</p>
            </div>
            <div className="text-right">
               <span className="text-[8px] font-black uppercase tracking-widest text-[#00FF00]">Sec_Protocol_v9.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
