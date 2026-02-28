import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean portfolio data
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();

  // Optionally clean users (DEV ONLY). Comment this out if you don't want to wipe users on each seed.
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.profile.create({
    data: {
      name: 'Roshan Shrestha',
      headline: 'Senior Full-Stack Engineer',
      tagline: 'Build. Ship. Scale.',
      shortBio:
        'Production-grade React, NestJS, PostgreSQL, AWS & Terraform. I build scalable web applications, APIs, and automation tools.',
      longBio:
        'Experienced Software Engineer with 7+ years building scalable web applications, APIs, and automation tools. Specialized in React, Node.js, NestJS, and Laravel with deep proficiency in TypeScript, AWS cloud, and modern frontend frameworks. Full-stack development across fintech, IoT, and SaaS with a focus on high-quality, maintainable solutions.',
      email: 'alex@example.com',
      linkedInUrl: 'https://linkedin.com/in/roshan-shrestha',
      githubUrl: 'https://github.com/roshanryzer',
      websiteUrl: 'https://roshan-shrestha.com',
      location: 'Nollamara, WA',
      yearsExperience: 7,
      projectsCount: 30
    },
  });

  const skillData = [
    { category: 'Frontend', name: 'React', sortOrder: 0 },
    { category: 'Frontend', name: 'TypeScript', sortOrder: 1 },
    { category: 'Frontend', name: 'Vue.js', sortOrder: 2 },
    { category: 'Frontend', name: 'Tailwind CSS', sortOrder: 3 },
    { category: 'Frontend', name: 'Framer Motion', sortOrder: 4 },
    { category: 'Frontend', name: 'Vite', sortOrder: 5 },
    { category: 'Frontend', name: 'HTML5', sortOrder: 6 },
    { category: 'Frontend', name: 'CSS3', sortOrder: 7 },
    { category: 'Backend', name: 'NestJS', sortOrder: 0 },
    { category: 'Backend', name: 'Node.js', sortOrder: 1 },
    { category: 'Backend', name: 'Laravel', sortOrder: 2 },
    { category: 'Backend', name: 'PHP', sortOrder: 3 },
    { category: 'Backend', name: 'Python', sortOrder: 4 },
    { category: 'Backend', name: 'GraphQL', sortOrder: 5 },
    { category: 'Backend', name: 'REST APIs', sortOrder: 6 },
    { category: 'Cloud & DevOps', name: 'AWS', sortOrder: 0 },
    { category: 'Cloud & DevOps', name: 'Terraform', sortOrder: 1 },
    { category: 'Cloud & DevOps', name: 'Docker', sortOrder: 2 },
    { category: 'Cloud & DevOps', name: 'CI/CD', sortOrder: 3 },
    { category: 'Cloud & DevOps', name: 'ECS', sortOrder: 4 },
    { category: 'Cloud & DevOps', name: 'RDS', sortOrder: 5 },
    { category: 'Cloud & DevOps', name: 'S3', sortOrder: 6 },
    { category: 'Cloud & DevOps', name: 'CloudFront', sortOrder: 7 },
    { category: 'Data & APIs', name: 'PostgreSQL', sortOrder: 0 },
    { category: 'Data & APIs', name: 'Prisma', sortOrder: 1 },
    { category: 'Data & APIs', name: 'Redis', sortOrder: 2 },
    { category: 'Data & APIs', name: 'MySQL', sortOrder: 3 },
    { category: 'Data & APIs', name: 'DynamoDB', sortOrder: 4 },
    { category: 'Data & APIs', name: 'JWT', sortOrder: 5 },
    { category: 'Data & APIs', name: 'OAuth2', sortOrder: 6 },
  ];
  for (const s of skillData) {
    await prisma.skill.create({ data: s });
  }

  await prisma.certification.createMany({
    data: [
      { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', issuedAt: new Date('2022-06-01'), url: 'https://aws.amazon.com/certification/', sortOrder: 0 },
      { name: 'Professional Scrum Master I', issuer: 'Scrum.org', issuedAt: new Date('2021-03-15'), sortOrder: 1 },
      { name: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta', issuedAt: new Date('2023-01-10'), sortOrder: 2 },
    ],
  });

  await prisma.education.createMany({
    data: [
      { institution: 'Stanford University', degree: 'B.S.', field: 'Computer Science', startYear: 2012, endYear: 2016, description: 'Focus on systems and software engineering.', sortOrder: 0 },
      { institution: 'MIT OpenCourseWare', degree: 'Coursework', field: 'Distributed Systems', startYear: 2018, endYear: 2019, sortOrder: 1 },
    ],
  });

  const now = new Date();
  await prisma.experience.createMany({
    data: [
      { company: 'TechCorp Inc.', role: 'Senior Full-Stack Engineer', startDate: new Date('2021-03-01'), endDate: null, current: true, description: 'Lead development of customer-facing SaaS platform. React, NestJS, AWS.', sortOrder: 0 },
      { company: 'StartupXYZ', role: 'Full-Stack Developer', startDate: new Date('2018-06-01'), endDate: new Date('2021-02-28'), current: false, description: 'Built APIs and dashboards for fintech product. Laravel, Vue.js, PostgreSQL.', sortOrder: 1 },
      { company: 'Agency.io', role: 'Software Engineer', startDate: new Date('2016-07-01'), endDate: new Date('2018-05-31'), current: false, description: 'Full-stack web applications for enterprise clients.', sortOrder: 2 },
    ],
  });

  await prisma.project.createMany({
    data: [
      { title: 'SaaS Admin Dashboard', description: 'Auth, RBAC, analytics, CRUD panels, audit logs, pagination & search.', tech: ['React', 'NestJS', 'PostgreSQL', 'Redis'], featured: true, sortOrder: 0 },
      { title: 'Job Portal Platform', description: 'Employer & candidate workflows, job posting, resume upload, application tracking.', tech: ['React', 'NestJS', 'Prisma'], featured: true, sortOrder: 1 },
      { title: 'Booking & Payment System', description: 'Real-time booking, Stripe payments, calendar sync, revenue analytics.', tech: ['React', 'NestJS', 'Stripe', 'BullMQ'], featured: true, sortOrder: 2 },
      { title: 'Internal API Gateway', description: 'Centralized API gateway with rate limiting and JWT auth for microservices.', repoUrl: 'https://github.com/example/gateway', tech: ['Node.js', 'Redis', 'Docker'], featured: false, sortOrder: 3 },
      { title: 'IoT Device Dashboard', description: 'Real-time monitoring and control for connected devices. WebSocket + MQTT.', tech: ['Vue.js', 'Laravel', 'MQTT'], featured: false, sortOrder: 4 },
    ],
  });

  // Create an admin user for local development
  const adminPassword = await bcrypt.hash('SecReT!!@#$%^&*', 10);
  await prisma.user.create({
    data: {
      email: 'roshanshresthapnk@gmail.com',
      password: adminPassword,
      name: 'Roshan Shrestha',
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created: roshanshresthapnk@gmail.com / SecReT!!@#$%^&*!');
}

main()
  .then(() => {
    console.log('Portfolio seed completed.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
