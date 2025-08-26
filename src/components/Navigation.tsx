'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/lib/translations/TranslationsProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation() {
  const pathname = usePathname();
  const t = useT();

  const isActive = (path: string) => pathname === path;

  const links = ['', 'reports', 'analyser', 'submit', 'contact', 'about'];

  return (
    <nav
      className="bg-white shadow-sm border-b border-gray-200"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center"
              aria-label="Scam Radar - Home"
            >
              <span className="text-xl font-bold text-blue-600">
                Scam Radar
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link || 'home'}
                href={`/${link}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(`/${link}`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                aria-current={isActive(`/${link}`) ? 'page' : undefined}
              >
                {t(`nav.${link || 'home'}`)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
