import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import type { Skill } from '../api/types';
import { Skeleton } from '../components/Skeleton';

function groupByCategory(skills: Skill[]) {
  const map = new Map<string, Skill[]>();
  for (const s of skills) {
    const list = map.get(s.category) ?? [];
    list.push(s);
    map.set(s.category, list);
  }
  return Array.from(map.entries()).map(([title, tags]) => ({
    title,
    skills: tags.sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    api.portfolio
      .getSkills()
      .then(setSkills)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  const categories = useMemo(() => (skills ? groupByCategory(skills) : []), [skills]);
  const filtered = useMemo(
    () => (filter ? categories.filter((c) => c.title === filter) : categories),
    [filter, categories]
  );

  if (error) {
    return (
      <div className="section-padding container-tight">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (skills === null) {
    return (
      <div className="section-padding">
        <div className="container-tight">
          <Skeleton className="h-9 w-32 mb-6" />
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-tight">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-title flex items-baseline mb-8"
        >
          <span className="section-title-accent">02.</span>Skills
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === null
                ? 'bg-accent/20 text-accent border border-accent/50'
                : 'bg-slate-200 dark:bg-navy-light hover:bg-slate-300 dark:hover:bg-navy-lighter border border-transparent'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.title}
              type="button"
              onClick={() => setFilter(c.title)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === c.title
                  ? 'bg-accent/20 text-accent border border-accent/50'
                  : 'bg-slate-200 dark:bg-navy-light hover:bg-slate-300 dark:hover:bg-navy-lighter border border-transparent'
              }`}
            >
              {c.title}
            </button>
          ))}
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={filter ?? 'all'}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {filtered.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                viewport={{ once: true, amount: 0.2 }}
                className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-navy-light shadow-card dark:shadow-card-dark"
              >
                <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-ink-light">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-navy text-slate-700 dark:text-ink-muted border border-slate-200 dark:border-white/5"
                    >
                      {skill.iconUrl && (
                        <img
                          src={skill.iconUrl}
                          alt={skill.name}
                          className="w-4 h-4 object-contain"
                          loading="lazy"
                        />
                      )}
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
