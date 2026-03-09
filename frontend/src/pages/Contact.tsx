import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, '');

    if (trimmedName.split(' ').length < 2 || trimmedName.length < 3) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (phoneDigits.length < 7) {
      toast.error('Please enter a valid mobile number.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contact', { name: trimmedName, email: trimmedEmail, phone: trimmedPhone, subject, message });
      toast.success('Message sent successfully');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-tight grid gap-10 md:grid-cols-2 items-start">
        <div>
          <p className="section-title-accent mb-2">04. Contact</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-ink-light mb-4">
            Let&apos;s build something together
          </h1>
          <p className="text-slate-600 dark:text-ink-muted mb-4">
            Whether you have a question about a project, want to collaborate, or just want to say hi, my inbox is always
            open. I&apos;ll try my best to get back to you.
          </p>
          <p className="text-sm text-slate-500 dark:text-ink-soft">
            Prefer email? You can also reach me directly at{' '}
            <span className="text-accent font-mono">roshanshresthapnk@gmail.com</span>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-navy-light/60 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
              placeholder="+61 4XXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
              placeholder="Project inquiry, collaboration, feedback..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  );
}

