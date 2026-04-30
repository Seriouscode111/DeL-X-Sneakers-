import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen pt-24 pb-32 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-xs mb-8"
          >
            Direct Communication
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-12"
          >
            Contact <br /> <span className="text-transparent border-b-2 border-gray-200 dark:border-white/20">The Collective</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-[#00FF00]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Email Division</h3>
                  <p className="text-xl font-black italic text-gray-900 dark:text-white">ops@sneakerx.store</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-[#00FF00]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Voice Comms</h3>
                  <p className="text-xl font-black italic text-gray-900 dark:text-white">+233 (0) 24 555 0192</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-[#00FF00]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Phyiscal Manifestation</h3>
                  <p className="text-xl font-black italic text-gray-900 dark:text-white">No. 12 Silicon Circle, Accra Digital Centre, Ghana</p>
                </div>
              </div>
            </div>

            <div className="mt-24">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-gray-600 mb-8">Social Grid</h3>
              <div className="flex space-x-6">
                {[Instagram, Twitter, MessageSquare].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-[#00FF00] hover:text-black hover:border-[#00FF00] transition-all dark:text-white">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 p-12 rounded-[3.5rem] shadow-sm dark:shadow-none"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 block">Identity</label>
                  <input 
                    type="text" 
                    placeholder="ENTER FULL NAME"
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 font-black uppercase italic tracking-tight text-gray-900 dark:text-white focus:border-[#00FF00] focus:outline-none transition-colors"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 block">Digital Signal</label>
                  <input 
                    type="email" 
                    placeholder="ENTER EMAIL ADDRESS"
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 font-black uppercase italic tracking-tight text-gray-900 dark:text-white focus:border-[#00FF00] focus:outline-none transition-colors"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 block">Message Data</label>
                  <textarea 
                    rows={4}
                    placeholder="TRANSMIT YOUR MESSAGE"
                    className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-4 font-black uppercase italic tracking-tight text-gray-900 dark:text-white focus:border-[#00FF00] focus:outline-none transition-colors resize-none"
                  />
               </div>
               
               <button className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-none font-black uppercase tracking-[0.3em] hover:bg-[#00FF00] dark:hover:bg-[#00FF00] transition-colors flex items-center justify-center group">
                  Initiate Transmission <Send className="ml-3 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
