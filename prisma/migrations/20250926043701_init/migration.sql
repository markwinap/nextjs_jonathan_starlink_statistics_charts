-- CreateTable
CREATE TABLE "public"."Stats" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mission" TEXT NOT NULL,
    "total_sats_launched" INTEGER NOT NULL,
    "failed_to_orbit" INTEGER NOT NULL,
    "early_deorbit" INTEGER NOT NULL,
    "disposal_complete" INTEGER NOT NULL,
    "reentry_after_fail" INTEGER NOT NULL,
    "total_down" INTEGER NOT NULL,
    "total_in_orbit" INTEGER NOT NULL,
    "screened" INTEGER NOT NULL,
    "failed_decaying" INTEGER NOT NULL,
    "graveyard" INTEGER NOT NULL,
    "total_working" INTEGER NOT NULL,
    "disposal_underway" INTEGER NOT NULL,
    "out_of_constellation" INTEGER NOT NULL,
    "anomaly" INTEGER NOT NULL,
    "reserve_relocating" INTEGER NOT NULL,
    "special" INTEGER NOT NULL,
    "drift" INTEGER NOT NULL,
    "ascent" INTEGER NOT NULL,
    "operational_orbit" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "total_operational" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stats_timestamp_key" ON "public"."Stats"("timestamp");
