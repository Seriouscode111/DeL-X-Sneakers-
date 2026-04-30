import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-32 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-4xl font-black tracking-tighter uppercase italic mb-8 block text-gray-900 dark:text-white">
              Sneaker<span className="text-[#00FF00]">X</span>
            </Link>
            <p className="text-gray-500 font-medium max-w-sm mb-12 leading-relaxed">
              Establishing the standard for premium sneakers and athletic luxury. Our mission is to provide the world's most innovative footwear directly to the individual.
            </p>
            <div className="flex space-x-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all text-gray-400">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900 dark:text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Browse Products', path: '/search' },
                { label: 'New Releases', path: '/new-drops' },
                { label: 'Collaborations', path: '/sellers' },
                { label: 'Sale Archive', path: '/search' }
              ].map(item => (
                <li key={item.label}><Link to={item.path} className="text-gray-500 hover:text-[#00FF00] transition-colors font-medium text-sm">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900 dark:text-white mb-8">Legal</h4>
            <ul className="space-y-4">
              {[
                { label: 'Terms of Service', path: '/policy#terms' },
                { label: 'Privacy Policy', path: '/policy#privacy' },
                { label: 'Shipping Info', path: '/policy#shipping' },
                { label: 'Returns', path: '/policy#returns' }
              ].map(item => (
                <li key={item.label}><Link to={item.path} className="text-gray-500 hover:text-[#00FF00] transition-colors font-medium text-sm">{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-gray-100 dark:border-white/5">
           <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700">© {new Date().getFullYear()} SneakerX Digital Division. All Rights Reserved.</p>
           <div className="flex space-x-8 mt-6 md:mt-0">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700">Ghanaian Commerce</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#00FF00]">v4.0.2 Deployment</span>
           </div>
        </div>
      </div>
    </footer>
  );
};
