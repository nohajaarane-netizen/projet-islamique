/**
 * Prisma Seed Script
 * Populates database with initial data
 */

import { PrismaClient, ContentCategory } from '@prisma/client';

const prisma = new PrismaClient();

// 99 Names of Allah (premiers 15 pour l'exemple)
const namesOfAllah = [
  { orderNumber: 1, arabic: 'الله', transliteration: 'Allah', frenchMeaning: 'Le Nom d\'Allah', englishMeaning: 'The Name of Allah', reflectionFr: 'Allah est le nom propre du Créateur, Celui qui est adoré avec amour et vénération.', reflectionEn: 'Allah is the proper name of the Creator, the One who is worshipped with love and veneration.', reflectionAr: 'الله هو الاسم الخاص للخالق، المعبود بالحب والتبجيل.' },
  { orderNumber: 2, arabic: 'الرحمن', transliteration: 'Ar-Rahman', frenchMeaning: 'Le Tout Miséricordieux', englishMeaning: 'The Most Gracious', reflectionFr: 'Sa miséricorde englobe toute chose. Il est Celui qui accorde sans compter, qui pardonne et qui donne sans attendre.', reflectionEn: 'His mercy encompasses all things. He is the One who gives without reckoning, who forgives and gives without expecting anything in return.', reflectionAr: 'رحمته وسعت كل شيء. هو الذي يعطي بلا حساب، ويغفر ويهب بلا مقابل.' },
  { orderNumber: 3, arabic: 'الرحيم', transliteration: 'Ar-Rahim', frenchMeaning: 'Le Très Miséricordieux', englishMeaning: 'The Most Merciful', reflectionFr: 'Sa miséricorde est spéciale pour les croyants. Il est doux envers Ses serviteurs et ne cesse de leur accorder Ses bienfaits.', reflectionEn: 'His mercy is special for the believers. He is gentle with His servants and never ceases to grant them His blessings.', reflectionAr: 'رحمته خاصة بالمؤمنين. هو رؤوف بعباده ولا يزال يمنحهم نعمه.' },
  { orderNumber: 4, arabic: 'الملك', transliteration: 'Al-Malik', frenchMeaning: 'Le Souverain', englishMeaning: 'The King', reflectionFr: 'Il est le Possesseur absolu de tout. Son règne s\'étend sur toute chose visible et invisible.', reflectionEn: 'He is the absolute Possessor of all. His dominion extends over all things visible and invisible.', reflectionAr: 'هو المالك المطلق للكل. ملكه يمتد على كل شيء مرئي وغير مرئي.' },
  { orderNumber: 5, arabic: 'القدوس', transliteration: 'Al-Quddus', frenchMeaning: 'Le Pur, Le Saint', englishMeaning: 'The Holy', reflectionFr: 'Il est pur de toute imperfection. Sa sainteté est au-delà de toute compréhension humaine.', reflectionEn: 'He is pure from all imperfection. His holiness is beyond all human comprehension.', reflectionAr: 'هو طاهر من كل نقص. قدسه فوق كل إدراك بشري.' },
  { orderNumber: 6, arabic: 'السلام', transliteration: 'As-Salam', frenchMeaning: 'La Paix', englishMeaning: 'The Source of Peace', reflectionFr: 'Il est la source de toute paix et sécurité. En Lui, les cœurs trouvent le repos.', reflectionEn: 'He is the source of all peace and security. In Him, hearts find rest.', reflectionAr: 'هو مصدر كل سلام وأمان. فيه تطمئن القلوب.' },
  { orderNumber: 7, arabic: 'المؤمن', transliteration: 'Al-Mu\'min', frenchMeaning: 'Le Garant de la foi', englishMeaning: 'The Giver of Faith', reflectionFr: 'Il est Celui qui accorde la sécurité et la tranquillité à Ses créatures.', reflectionEn: 'He is the One who grants security and tranquility to His creatures.', reflectionAr: 'هو الذي يمنح الأمن والطمأنينة لخلقه.' },
  { orderNumber: 8, arabic: 'المهيمن', transliteration: 'Al-Muhaymin', frenchMeaning: 'Le Protecteur', englishMeaning: 'The Guardian', reflectionFr: 'Il veille sur toute chose. Rien n\'échappe à Sa surveillance et Sa protection.', reflectionEn: 'He watches over all things. Nothing escapes His surveillance and protection.', reflectionAr: 'هو يرعى كل شيء. لا يفوته شيء من رقابته وحمايته.' },
  { orderNumber: 9, arabic: 'العزيز', transliteration: 'Al-Aziz', frenchMeaning: 'Le Puissant', englishMeaning: 'The Almighty', reflectionFr: 'Il est le Tout-Puissant dont la force ne connaît pas de limites. Nul ne peut Lui résister.', reflectionEn: 'He is the Almighty whose strength knows no bounds. None can resist Him.', reflectionAr: 'هو العزيز الذي لا يحد قوته شيء. لا أحد يستطيع مقاومته.' },
  { orderNumber: 10, arabic: 'الجبار', transliteration: 'Al-Jabbar', frenchMeaning: 'Le Contraignant', englishMeaning: 'The Compeller', reflectionFr: 'Il est Celui dont la volonté s\'impose à tout. Il répare les cœurs brisés.', reflectionEn: 'He is the One whose will is imposed on all. He mends broken hearts.', reflectionAr: 'هو الذي تخضع له مشيئة الكل. هو يصلح القلوب المكسورة.' },
  { orderNumber: 11, arabic: 'المتكبر', transliteration: 'Al-Mutakabbir', frenchMeaning: 'Le Majestueux', englishMeaning: 'The Majestic', reflectionFr: 'Il est au-dessus de toute chose. Sa grandeur est incommensurable.', reflectionEn: 'He is above all things. His greatness is immeasurable.', reflectionAr: 'هو فوق كل شيء. عظمته لا تُقاس.' },
  { orderNumber: 12, arabic: 'الخالق', transliteration: 'Al-Khaliq', frenchMeaning: 'Le Créateur', englishMeaning: 'The Creator', reflectionFr: 'Il est Celui qui donne l\'existence à tout ce qui est. Sa création est parfaite en tout point.', reflectionEn: 'He is the One who gives existence to all that is. His creation is perfect in every way.', reflectionAr: 'هو الذي يعطي الوجود لكل ما هو. خلقه كامل في كل شيء.' },
  { orderNumber: 13, arabic: 'البارئ', transliteration: 'Al-Bari\'', frenchMeaning: 'Le Créateur d\'ordre', englishMeaning: 'The Evolver', reflectionFr: 'Il crée sans modèle préexistant. Sa création est unique et sans pareille.', reflectionEn: 'He creates without any prior model. His creation is unique and unparalleled.', reflectionAr: 'هو يخلق بلا نموذج سابق. خلقه فريد لا مثيل له.' },
  { orderNumber: 14, arabic: 'المصور', transliteration: 'Al-Musawwir', frenchMeaning: 'Le Formateur', englishMeaning: 'The Fashioner', reflectionFr: 'Il donne forme à toute chose. Chaque créature a une forme unique et parfaite.', reflectionEn: 'He gives form to all things. Every creature has a unique and perfect form.', reflectionAr: 'هو يعطي الشكل لكل شيء. كل مخلوق له شكل فريد وكامل.' },
  { orderNumber: 15, arabic: 'الغفار', transliteration: 'Al-Ghaffar', frenchMeaning: 'Le Pardonneur', englishMeaning: 'The Forgiver', reflectionFr: 'Il pardonne sans cesse les péchés de Ses serviteurs repentants. Son pardon est illimité.', reflectionEn: 'He constantly forgives the sins of His repentant servants. His forgiveness is unlimited.', reflectionAr: 'هو يغفر دائماً ذنوب عباده التائبين. مغفرته بلا حدود.' },
];

// Sample Hadiths
const hadiths = [
  {
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    frenchTranslation: 'Les actions ne valent que par les intentions, et chacun n\'a que ce qu\'il a intentionné.',
    englishTranslation: 'Actions are judged by intentions, and each person will have what they intended.',
    transliteration: 'Innamal a\'malu bin-niyyat',
    sourceBook: 'Sahih al-Bukhari',
    sourceNumber: '1',
    category: ContentCategory.DAILY,
  },
  {
    arabicText: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
    frenchTranslation: 'L\'Islam est fondé sur cinq piliers : témoigner qu\'il n\'y a de dieu que Dieu et que Muhammad est le messager de Dieu, accomplir la prière, acquitter la zakât, faire le pèlerinage et jeûner le ramadan.',
    englishTranslation: 'Islam is built on five pillars: testifying that there is no god but Allah and Muhammad is His messenger, performing prayer, paying zakat, making pilgrimage, and fasting Ramadan.',
    sourceBook: 'Sahih al-Bukhari',
    sourceNumber: '8',
    category: ContentCategory.FAITH,
  },
  {
    arabicText: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
    frenchTranslation: 'Celui qu\'Allah veut du bien, Il lui donne la compréhension de la religion.',
    englishTranslation: 'If Allah intends good for someone, He gives him understanding of the religion.',
    sourceBook: 'Sahih al-Bukhari',
    sourceNumber: '71',
    category: ContentCategory.KNOWLEDGE,
  },
  {
    arabicText: 'الدِّينُ النَّصِيحَةُ',
    frenchTranslation: 'La religion, c\'est le conseil sincère.',
    englishTranslation: 'Religion is sincere advice.',
    transliteration: 'Ad-dinu nasihah',
    sourceBook: 'Sahih Muslim',
    sourceNumber: '55',
    category: ContentCategory.DAILY,
  },
  {
    arabicText: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    frenchTranslation: 'Celui qui guide vers un bien aura une récompense égale à celle qui l\'accomplit.',
    englishTranslation: 'Whoever guides someone to goodness will have a reward like that of its doer.',
    sourceBook: 'Sahih Muslim',
    sourceNumber: '1893',
    category: ContentCategory.KNOWLEDGE,
  },
  {
    arabicText: 'مَنْ لاَ يَرْحَمِ النَّاسَ لاَ يَرْحَمْهُ اللَّهُ',
    frenchTranslation: 'Celui qui n\'est pas miséricordieux envers les gens ne sera pas traité avec miséricorde par Allah.',
    englishTranslation: 'Whoever does not show mercy to people will not be shown mercy by Allah.',
    sourceBook: 'Sahih al-Bukhari',
    sourceNumber: '5999',
    category: ContentCategory.PATIENCE,
  },
  {
    arabicText: 'إِيَّاكُمْ وَالْحَسَدَ',
    frenchTranslation: 'Prenez garde à l\'envie.',
    englishTranslation: 'Beware of envy.',
    sourceBook: 'Sahih Muslim',
    sourceNumber: '2653',
    category: ContentCategory.PROTECTION,
  },
];

// Sample Duas
const duas = [
  {
    arabicText: 'رَبِّ زِدْنِي عِلْمًا',
    frenchTranslation: 'Mon Seigneur, augmente-moi en science.',
    englishTranslation: 'My Lord, increase me in knowledge.',
    transliteration: 'Rabbi zidni ilma',
    category: ContentCategory.KNOWLEDGE,
    occasion: 'Étude, apprentissage',
  },
  {
    arabicText: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي',
    frenchTranslation: 'Ô Allah, pardonne-moi, accorde-moi Ta miséricorde et guide-moi.',
    englishTranslation: 'O Allah, forgive me, have mercy on me, and guide me.',
    transliteration: 'Allahummaghfir li warhamni wahdini',
    category: ContentCategory.REPENTANCE,
    occasion: 'Après la prière, repentance',
  },
  {
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ',
    frenchTranslation: 'Au nom d\'Allah dont le nom, rien sur terre ni dans le ciel ne peut nuire.',
    englishTranslation: 'In the name of Allah, with whose name nothing on earth or in heaven can harm.',
    category: ContentCategory.PROTECTION,
    occasion: 'Protection matin et soir',
  },
  {
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    frenchTranslation: 'Louange à Allah par la grâce de qui les bonnes œuvres s\'accomplissent.',
    englishTranslation: 'Praise be to Allah by whose grace good deeds are completed.',
    category: ContentCategory.GRATITUDE,
    occasion: 'Après avoir mangé, accompli une tâche',
  },
  {
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً',
    frenchTranslation: 'Notre Seigneur, donne-nous le bien en ce monde et le bien dans l\'au-delà.',
    englishTranslation: 'Our Lord, give us good in this world and good in the Hereafter.',
    transliteration: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah',
    category: ContentCategory.FAITH,
    occasion: 'Prière, demande générale',
  },
  {
    arabicText: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ',
    frenchTranslation: 'Je demande pardon à Allah le Grand, il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même.',
    englishTranslation: 'I seek forgiveness from Allah the Mighty, there is no god but He, the Living, the Eternal.',
    category: ContentCategory.REPENTANCE,
    occasion: 'Repentance quotidienne',
  },
  {
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا',
    frenchTranslation: 'Ô Allah, je Te demande une science bénéfique et une subsistance pure.',
    englishTranslation: 'O Allah, I ask You for beneficial knowledge and good provision.',
    category: ContentCategory.KNOWLEDGE,
    occasion: 'Début de journée, étude',
  },
];

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (dans l'ordre inverse des relations)
  await prisma.favorite.deleteMany();
  await prisma.userNameProgress.deleteMany();
  await prisma.dailyContent.deleteMany();
  await prisma.gratitudeEntry.deleteMany();
  await prisma.dhikrEntry.deleteMany();
  await prisma.prayerTracking.deleteMany();
  await prisma.prayerTime.deleteMany();
  await prisma.notificationSetting.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.userStreak.deleteMany();
  await prisma.user.deleteMany();
  await prisma.nameOfAllah.deleteMany();
  await prisma.hadith.deleteMany();
  await prisma.dua.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Seed Names of Allah
  for (const name of namesOfAllah) {
    await prisma.nameOfAllah.create({ data: name });
  }
  console.log(`✅ Seeded ${namesOfAllah.length} Names of Allah`);

  // Seed Hadiths
  for (const hadith of hadiths) {
    await prisma.hadith.create({ data: hadith });
  }
  console.log(`✅ Seeded ${hadiths.length} Hadiths`);

  // Seed Duas
  for (const dua of duas) {
    await prisma.dua.create({ data: dua });
  }
  console.log(`✅ Seeded ${duas.length} Duas`);

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      email: 'mohamed@example.com',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/I1O', // "password123"
      name: 'Mohamed',
      preferredLang: 'fr',
      locationLat: 33.2635,
      locationLon: -7.5813,
      cityName: 'Berrechid, Maroc',
      timezone: 'Africa/Casablanca',
    },
  });

  // Initialize user data
  await prisma.userStreak.createMany({
    data: [
      { userId: testUser.id, streakType: 'PRAYER' },
      { userId: testUser.id, streakType: 'GRATITUDE' },
      { userId: testUser.id, streakType: 'DHIKR' },
    ],
  });

  await prisma.notificationSetting.createMany({
    data: [
      { userId: testUser.id, prayerType: 'FAJR' },
      { userId: testUser.id, prayerType: 'DHUHR' },
      { userId: testUser.id, prayerType: 'ASR' },
      { userId: testUser.id, prayerType: 'MAGHRIB' },
      { userId: testUser.id, prayerType: 'ISHA' },
    ],
  });

  console.log('✅ Created test user: mohamed@example.com (password: password123)');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });