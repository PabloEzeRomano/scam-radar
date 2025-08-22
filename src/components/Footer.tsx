'use client';

import { useT } from '@/lib/translations/TranslationsProvider';
import { motion } from 'framer-motion';
import { Socials } from './Socials';
import Link from 'next/link';

export const Footer = () => {
  const t = useT();
  const currentYear = new Date().getFullYear();

  const links = ['reports', 'submit', 'about', 'contact'];

  return (
    <footer
      id="footer"
      className="bg-gray-50 text-gray-900 py-12 px-6 border-t border-gray-200 text-sm"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold text-blue-600 mb-4">
              {t('home.title')}
            </h4>
            <p className="text-gray-700 mb-4 max-w-[250px]">
              {t('footer.brandDescription')}
            </p>

            {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active monitoring 24/7</span>
            </div> */}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link}`}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {t(`${link}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <Socials />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 text-center text-gray-500"
        >
          <p>
            © {currentYear} {t('footer.copyright')}. {t('footer.rights')}
          </p>
          <p className="text-xs mt-4">{t('footer.disclaimer')}</p>
        </motion.div>
      </div>
    </footer>
  );
};
