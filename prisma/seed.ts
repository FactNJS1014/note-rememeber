import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  await prisma.activityLog.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.noteTag.deleteMany();
  await prisma.note.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding demo user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Natdanai Jansomboon',
      email: 'demo@noteremember.com',
      passwordHash: hashedPassword,
    },
  });

  console.log('Seeding categories...');
  const categoriesData = [
    { name: 'Work', description: 'Office and career tasks', color: '#3b82f6', icon: 'Briefcase' },
    { name: 'Personal', description: 'Life goals and thoughts', color: '#ec4899', icon: 'User' },
    { name: 'Study', description: 'Learning and civil service exam prep', color: '#8b5cf6', icon: 'BookOpen' },
    { name: 'Programming', description: 'Next.js, Laravel, Go, Vue code snippets', color: '#10b981', icon: 'Code' },
    { name: 'Meeting', description: 'Meeting notes and action items', color: '#f59e0b', icon: 'Users' },
    { name: 'Ideas', description: 'Creative ideas and app features', color: '#06b6d4', icon: 'Lightbulb' },
    { name: 'Finance', description: 'Budget, expenses, investment', color: '#14b8a6', icon: 'DollarSign' },
    { name: 'Travel', description: 'Train trips & travel routes', color: '#f97316', icon: 'MapPin' },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: { ...cat, userId: user.id },
      })
    )
  );

  console.log('Seeding tags...');
  const tagsData = ['#nextjs', '#prisma', '#work', '#meeting', '#exam', '#idea', '#important', '#todo', '#laravel', '#tailwind'];
  const tags = await Promise.all(
    tagsData.map((name) =>
      prisma.tag.create({
        data: { name, userId: user.id },
      })
    )
  );

  console.log('Seeding notes...');
  const now = new Date();
  
  const notesData = [
    {
      title: 'Note Remember Architecture Overview',
      content: 'This project is built using Next.js 14 App Router, TypeScript, Prisma ORM, and Neon PostgreSQL. Fully monolithic single-app architecture.',
      excerpt: 'This project is built using Next.js 14 App Router, TypeScript, Prisma ORM, and Neon PostgreSQL.',
      color: 'purple',
      type: 'markdown',
      isPinned: true,
      isFavorite: true,
      categoryId: categories.find((c) => c.name === 'Programming')?.id,
      tagIndexes: [0, 1, 6],
    },
    {
      title: 'Civil Service Exam Prep - Logic & Math Series',
      content: 'Key concepts to review for ภาค ก:\n1. Mathematical Series\n2. Logic Puzzles\n3. Thai Language Ordering',
      excerpt: 'Key concepts to review for ภาค ก: Mathematical Series, Logic Puzzles, Thai Language Ordering',
      color: 'blue',
      type: 'text',
      isPinned: true,
      isFavorite: false,
      categoryId: categories.find((c) => c.name === 'Study')?.id,
      tagIndexes: [4, 6],
    },
    {
      title: 'Weekly Team Sync Checklist',
      content: '☐ Review sprint progress\n☐ Discuss database migration to Neon\n☑ Prepare deployment pipeline on Vercel\n☐ Assign next week tasks',
      excerpt: 'Review sprint progress, discuss database migration, prepare deployment.',
      color: 'green',
      type: 'checklist',
      isPinned: false,
      isFavorite: true,
      categoryId: categories.find((c) => c.name === 'Meeting')?.id,
      tagIndexes: [3, 7],
    },
    {
      title: 'Train Trip: Prachinburi to CentralWorld',
      content: 'Train schedule options from Prachinburi Railway Station to Hua Lamphong/Bang Sue, then MRT & BTS to Chidlom.',
      excerpt: 'Train schedule options from Prachinburi Railway Station to CentralWorld.',
      color: 'yellow',
      type: 'text',
      isPinned: false,
      isFavorite: false,
      categoryId: categories.find((c) => c.name === 'Travel')?.id,
      tagIndexes: [2],
    },
  ];

  for (const n of notesData) {
    const { tagIndexes, ...noteFields } = n;
    const note = await prisma.note.create({
      data: {
        ...noteFields,
        userId: user.id,
      },
    });

    if (tagIndexes && tagIndexes.length > 0) {
      for (const idx of tagIndexes) {
        await prisma.noteTag.create({
          data: {
            noteId: note.id,
            tagId: tags[idx].id,
          },
        });
      }
    }

    // Add activity log
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'CREATED',
        details: `Created note "${note.title}"`,
      },
    });
  }

  console.log('Seeding reminders...');
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  await prisma.reminder.createMany({
    data: [
      {
        userId: user.id,
        title: 'Submit Next.js & Neon Project Documentation',
        remindAt: tomorrow,
        completed: false,
      },
      {
        userId: user.id,
        title: 'Prepare Civil Service Practice Test',
        remindAt: nextWeek,
        completed: false,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
