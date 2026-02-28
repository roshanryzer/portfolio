import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

const mainNav = [
  { path: '/about', num: '01.', label: 'About' },
  { path: '/experience', num: '02.', label: 'Experience' },
  { path: '/projects', num: '03.', label: 'Work' },
  { path: '/contact', num: '04.', label: 'Contact' },
];

function NavLink({
  path,
  num,
  label,
  isActive,
  onClick,
  className = '',
}: {
  path: string;
  num: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const isHash = path.startsWith('/#');
  const to = isHash ? path.slice(1) : path;
  const content = (
    <>
      <span className="text-accent font-mono text-sm">{num}</span>
      <span className="ml-1.5">{label}</span>
    </>
  );
  const linkClass = clsx(
    'text-sm font-medium transition-colors flex items-center',
    isActive ? 'text-accent' : 'text-slate-600 dark:text-ink-light hover:text-accent',
    className
  );
  if (isHash) {
    return (
      <a href={to} onClick={onClick} className={linkClass}>
        {content}
      </a>
    );
  }
  return (
    <Link to={path} onClick={onClick} className={linkClass}>
      {content}
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/projects' && location.pathname === '/projects');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="app-header fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-navy/90 backdrop-blur border-b border-slate-200 dark:border-white/5"
      >
        <div className="container-tight flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-accent font-semibold text-lg border border-accent/40 hover:bg-accent-dim hover:border-accent/60 transition-all duration-200"
            aria-label="Home"
          >
            R
          </Link>
          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {mainNav.map(({ path, num, label }) => (
              <NavLink
                key={path}
                path={path}
                num={num}
                label={label}
                isActive={isActive(path)}
              />
            ))}
            <Link
              to="/resume"
              className="ml-2 px-4 py-2.5 text-sm font-medium text-accent border border-accent/60 rounded-full hover:bg-accent-dim transition-colors duration-200"
            >
              Resume
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded text-slate-600 dark:text-ink-muted hover:text-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
          {/* Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded text-slate-500 dark:text-ink-muted hover:text-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded text-slate-600 dark:text-ink-light hover:text-accent"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-slate-200 dark:border-white/5 bg-white dark:bg-navy"
            >
              <div className="container-tight py-4 flex flex-col gap-4">
                {mainNav.map(({ path, num, label }) => (
                  <NavLink
                    key={path}
                    path={path}
                    num={num}
                    label={label}
                    isActive={isActive(path)}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
                <Link
                  to="/resume"
                  onClick={() => setMobileOpen(false)}
                  className="text-accent border border-accent rounded px-4 py-2 w-fit"
                >
                  Resume
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
      <main className="flex-1 pt-16">{children}</main>
      <footer id="contact" className="app-footer border-t border-slate-200 dark:border-white/5 py-8 text-center text-sm text-slate-500 dark:text-ink-muted bg-slate-50 dark:bg-navy-light">
        <div className="container-tight">
          <p>© {new Date().getFullYear()} — Developed by Roshan Shrestha</p>
        </div>
      </footer>
    </div>
  );
}
