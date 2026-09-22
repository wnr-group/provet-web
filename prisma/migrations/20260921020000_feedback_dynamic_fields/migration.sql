-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN "answers" TEXT;

-- CreateTable
CREATE TABLE "FeedbackField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "placeholder" TEXT,
    "helpText" TEXT,
    "options" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
-- Created before the data migration below so its INSERT OR IGNORE fallbacks
-- can actually de-duplicate on "key".
CREATE UNIQUE INDEX "FeedbackField_key_key" ON "FeedbackField"("key");

-- DataMigration
-- The name/email show/require flags used to live on FeedbackSetting and are
-- dropped by the RedefineTables step below. Carry them over into the three
-- built-in FeedbackField rows first so an existing configuration survives the
-- upgrade instead of silently resetting to defaults.
INSERT INTO "FeedbackField" ("id","key","label","type","placeholder","isRequired","isEnabled","isSystem","order","createdAt","updatedAt")
SELECT 'fbfield_system_name','name','Name','text','Jane Doe',"requireName","showName",1,0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
FROM "FeedbackSetting" WHERE "key" = 'default';

INSERT INTO "FeedbackField" ("id","key","label","type","placeholder","isRequired","isEnabled","isSystem","order","createdAt","updatedAt")
SELECT 'fbfield_system_email','email','Email','email','jane@clinic.com',"requireEmail","showEmail",1,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
FROM "FeedbackSetting" WHERE "key" = 'default';

-- The message field has never been configurable: always shown, always required.
INSERT INTO "FeedbackField" ("id","key","label","type","placeholder","isRequired","isEnabled","isSystem","order","createdAt","updatedAt")
SELECT 'fbfield_system_message','message','Feedback','textarea','What did you think? What could we do better?',1,1,1,2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
FROM "FeedbackSetting" WHERE "key" = 'default';

-- Fallbacks for a database that has no settings row yet (nothing seeded, or a
-- fresh deploy): guarantee the three built-ins exist either way.
INSERT OR IGNORE INTO "FeedbackField" ("id","key","label","type","placeholder","isRequired","isEnabled","isSystem","order","createdAt","updatedAt")
VALUES ('fbfield_system_name','name','Name','text','Jane Doe',1,1,1,0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "FeedbackField" ("id","key","label","type","placeholder","isRequired","isEnabled","isSystem","order","createdAt","updatedAt")
VALUES ('fbfield_system_email','email','Email','email','jane@clinic.com',1,1,1,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "FeedbackField" ("id","key","label","type","placeholder","isRequired","isEnabled","isSystem","order","createdAt","updatedAt")
VALUES ('fbfield_system_message','message','Feedback','textarea','What did you think? What could we do better?',1,1,1,2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FeedbackSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL DEFAULT 'default',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL DEFAULT 'Share Your Feedback',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FeedbackSetting" ("createdAt", "description", "id", "isEnabled", "key", "title", "updatedAt") SELECT "createdAt", "description", "id", "isEnabled", "key", "title", "updatedAt" FROM "FeedbackSetting";
DROP TABLE "FeedbackSetting";
ALTER TABLE "new_FeedbackSetting" RENAME TO "FeedbackSetting";
CREATE UNIQUE INDEX "FeedbackSetting_key_key" ON "FeedbackSetting"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
