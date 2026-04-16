import React from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

const SectionNav = ({ sections, currentSectionId }) => {
  if (!sections || sections.length === 0) return null;

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky headers if any
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto w-64 hidden lg:block pr-4">
      <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)]">
        <List className="h-4 w-4" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">In this chapter</h3>
      </div>
      <nav className="flex flex-col gap-1 border-l-2 border-[var(--border)] ml-2">
        {sections.map((section) => {
          const isActive = currentSectionId === section.anchor_id;
          return (
            <a
              key={section.anchor_id}
              href={`#${section.anchor_id}`}
              onClick={(e) => handleScroll(e, section.anchor_id)}
              className={`relative pl-4 py-1.5 text-sm transition-colors duration-200 ${
                isActive 
                  ? 'text-[var(--color-purple)] font-medium' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute left-[-2px] top-0 bottom-0 w-0.5 bg-[var(--color-purple)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {section.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default SectionNav;