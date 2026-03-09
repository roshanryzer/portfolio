import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Project } from '../api/types';
import { Skeleton } from '../components/Skeleton';

export default function Projects() {
  const [items, setItems] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.portfolio
      .getProjects()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  if (error) {
    return (
      <div className="section-padding container-tight">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="section-padding">
        <div className="container-tight">
          <Skeleton className="h-9 w-36 mb-10" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
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
          className="section-title flex items-baseline mb-10"
        >
          <span className="section-title-accent">03.</span>
          Work
        </motion.h1>
        <div className="grid md:grid-cols-2 gap-6">
          {items.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 col-span-full">No projects yet.</p>
          ) : (
            items.map((project, i) => {
              const url = project.url?.startsWith('/') ? project.url : project.repoUrl ?? '#';
              const isInternal = url.startsWith('/');
              const className =
                'block p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-primary-500 hover:shadow-lg transition-all h-full';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {isInternal ? (
                    <Link to={url} className={className}>
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt=""
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-2">
                        {project.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                        {project.description}
                      </p>
                      {project.tech && project.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {(project.tech as string[]).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt=""
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-2">
                        {project.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                        {project.description}
                      </p>
                      {project.tech && project.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {(project.tech as string[]).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </a>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
