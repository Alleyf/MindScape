import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface NavDropdownProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ label, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="nav-link group flex items-center gap-1 cursor-pointer"
      >
        {icon && <span className="text-nebula-accent">{icon}</span>}
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-48 rounded-xl glass-card border border-white/10 shadow-xl overflow-hidden"
          >
            <div className="py-2" onMouseEnter={handleMouseEnter}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface NavDropdownItemProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const NavDropdownItem: React.FC<NavDropdownItemProps> = ({
  to,
  href,
  onClick,
  children,
  icon,
}) => {
  const content = (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer">
      {icon && <span className="text-nebula-accent">{icon}</span>}
      <span className="theme-text text-sm">{children}</span>
    </div>
  );

  if (to) {
    return (
      <a href={to} className="block">
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
};