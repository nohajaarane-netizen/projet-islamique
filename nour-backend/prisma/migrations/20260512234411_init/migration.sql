-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "preferredLang" TEXT NOT NULL DEFAULT 'fr',
    "locationLat" REAL,
    "locationLon" REAL,
    "cityName" TEXT NOT NULL DEFAULT 'Berrechid, Maroc',
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Casablanca',
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "fontSize" INTEGER NOT NULL DEFAULT 16,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "prayer_times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "fajr" DATETIME NOT NULL,
    "chourouq" DATETIME NOT NULL,
    "dhuhr" DATETIME NOT NULL,
    "asr" DATETIME NOT NULL,
    "maghrib" DATETIME NOT NULL,
    "isha" DATETIME NOT NULL,
    "hijriDate" TEXT NOT NULL,
    "calculationMethod" TEXT NOT NULL DEFAULT 'MWL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "prayer_trackings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "prayerType" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedAt" DATETIME,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "prayer_trackings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "names_of_allah" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" INTEGER NOT NULL,
    "arabic" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "frenchMeaning" TEXT NOT NULL,
    "englishMeaning" TEXT NOT NULL,
    "audioUrl" TEXT,
    "reflectionFr" TEXT NOT NULL,
    "reflectionEn" TEXT NOT NULL,
    "reflectionAr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_name_progress" (
    "userId" TEXT NOT NULL,
    "nameId" TEXT NOT NULL,
    "isLearned" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "learnedAt" DATETIME,

    PRIMARY KEY ("userId", "nameId"),
    CONSTRAINT "user_name_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_name_progress_nameId_fkey" FOREIGN KEY ("nameId") REFERENCES "names_of_allah" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hadiths" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "arabicText" TEXT NOT NULL,
    "frenchTranslation" TEXT NOT NULL,
    "englishTranslation" TEXT NOT NULL,
    "transliteration" TEXT,
    "sourceBook" TEXT NOT NULL,
    "sourceNumber" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'DAILY',
    "audioUrl" TEXT,
    "isDailyFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "duas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "arabicText" TEXT NOT NULL,
    "frenchTranslation" TEXT NOT NULL,
    "englishTranslation" TEXT NOT NULL,
    "transliteration" TEXT,
    "category" TEXT NOT NULL DEFAULT 'DAILY',
    "occasion" TEXT,
    "audioUrl" TEXT,
    "isDailyFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "gratitude_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'ALLAH',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gratitude_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dhikr_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dhikr_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hadithId" TEXT,
    "duaId" TEXT,
    "nameId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES "hadiths" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_duaId_fkey" FOREIGN KEY ("duaId") REFERENCES "duas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_nameId_fkey" FOREIGN KEY ("nameId") REFERENCES "names_of_allah" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_streaks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "streakType" TEXT NOT NULL DEFAULT 'PRAYER',
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestRecord" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" DATETIME,
    CONSTRAINT "user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criteria" TEXT NOT NULL,
    CONSTRAINT "badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "prayerType" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "minutesBefore" INTEGER NOT NULL DEFAULT 15,
    CONSTRAINT "notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "daily_contents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "hadithId" TEXT,
    "duaId" TEXT,
    "nameId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_times_userId_date_key" ON "prayer_times"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_trackings_userId_prayerType_date_key" ON "prayer_trackings"("userId", "prayerType", "date");

-- CreateIndex
CREATE UNIQUE INDEX "names_of_allah_orderNumber_key" ON "names_of_allah"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "dhikr_entries_userId_type_date_key" ON "dhikr_entries"("userId", "type", "date");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_hadithId_key" ON "favorites"("userId", "hadithId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_duaId_key" ON "favorites"("userId", "duaId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_nameId_key" ON "favorites"("userId", "nameId");

-- CreateIndex
CREATE UNIQUE INDEX "user_streaks_userId_streakType_key" ON "user_streaks"("userId", "streakType");

-- CreateIndex
CREATE UNIQUE INDEX "badges_userId_badgeType_key" ON "badges"("userId", "badgeType");

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_userId_prayerType_key" ON "notification_settings"("userId", "prayerType");

-- CreateIndex
CREATE UNIQUE INDEX "daily_contents_date_key" ON "daily_contents"("date");
