-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "shared_link" TEXT,
    "active" BOOLEAN NOT NULL,
    "id_avatar" INTEGER,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "id_avatar" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" SERIAL NOT NULL,
    "picture_avatar" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLeague" (
    "id" SERIAL NOT NULL,
    "id_league" INTEGER NOT NULL,
    "id_user" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GP" (
    "id_api_races" BIGINT NOT NULL,
    "season" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "id_api_tracks" BIGINT NOT NULL,

    CONSTRAINT "GP_pkey" PRIMARY KEY ("id_api_races")
);

-- CreateTable
CREATE TABLE "Track" (
    "id_api_tracks" BIGINT NOT NULL,
    "country_name" TEXT NOT NULL,
    "track_name" TEXT NOT NULL,
    "picture_country" TEXT NOT NULL,
    "picture_track" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id_api_tracks")
);

-- CreateTable
CREATE TABLE "Pilote" (
    "id_api_pilotes" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "name_acronym" TEXT NOT NULL,
    "driver_number" INTEGER,

    CONSTRAINT "Pilote_pkey" PRIMARY KEY ("id_api_pilotes")
);

-- CreateTable
CREATE TABLE "Ecurie" (
    "id_api_ecuries" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Ecurie_pkey" PRIMARY KEY ("id_api_ecuries")
);

-- CreateTable
CREATE TABLE "GPP" (
    "id" SERIAL NOT NULL,
    "id_gp" BIGINT NOT NULL,
    "id_pilote" INTEGER NOT NULL,
    "id_ecurie" INTEGER NOT NULL,

    CONSTRAINT "GPP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PiloteEcurie" (
    "id" SERIAL NOT NULL,
    "id_pilote" INTEGER NOT NULL,
    "id_ecurie" INTEGER NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PiloteEcurie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GPClassement" (
    "id" SERIAL NOT NULL,
    "id_gp" BIGINT NOT NULL,
    "id_gp_pilote" INTEGER NOT NULL,
    "isDNF" BOOLEAN NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GPClassement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetSelectionResult" (
    "id" SERIAL NOT NULL,
    "id_utilisateur" TEXT NOT NULL,
    "id_gp" BIGINT NOT NULL,
    "points_p10" TEXT NOT NULL,
    "points_dnf" TEXT NOT NULL,
    "id_pilote_p10" INTEGER NOT NULL,
    "id_pilote_dnf" INTEGER NOT NULL,

    CONSTRAINT "BetSelectionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "League_shared_link_key" ON "League"("shared_link");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pilote_driver_number_key" ON "Pilote"("driver_number");

-- CreateIndex
CREATE UNIQUE INDEX "Ecurie_name_key" ON "Ecurie"("name");

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_id_avatar_fkey" FOREIGN KEY ("id_avatar") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_avatar_fkey" FOREIGN KEY ("id_avatar") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_id_league_fkey" FOREIGN KEY ("id_league") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeague" ADD CONSTRAINT "UserLeague_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GP" ADD CONSTRAINT "GP_id_api_tracks_fkey" FOREIGN KEY ("id_api_tracks") REFERENCES "Track"("id_api_tracks") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPP" ADD CONSTRAINT "GPP_id_gp_fkey" FOREIGN KEY ("id_gp") REFERENCES "GP"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPP" ADD CONSTRAINT "GPP_id_pilote_fkey" FOREIGN KEY ("id_pilote") REFERENCES "Pilote"("id_api_pilotes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPP" ADD CONSTRAINT "GPP_id_ecurie_fkey" FOREIGN KEY ("id_ecurie") REFERENCES "Ecurie"("id_api_ecuries") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PiloteEcurie" ADD CONSTRAINT "PiloteEcurie_id_pilote_fkey" FOREIGN KEY ("id_pilote") REFERENCES "Pilote"("id_api_pilotes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PiloteEcurie" ADD CONSTRAINT "PiloteEcurie_id_ecurie_fkey" FOREIGN KEY ("id_ecurie") REFERENCES "Ecurie"("id_api_ecuries") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPClassement" ADD CONSTRAINT "GPClassement_id_gp_fkey" FOREIGN KEY ("id_gp") REFERENCES "GP"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPClassement" ADD CONSTRAINT "GPClassement_id_gp_pilote_fkey" FOREIGN KEY ("id_gp_pilote") REFERENCES "GPP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_gp_fkey" FOREIGN KEY ("id_gp") REFERENCES "GP"("id_api_races") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_pilote_p10_fkey" FOREIGN KEY ("id_pilote_p10") REFERENCES "Pilote"("id_api_pilotes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelectionResult" ADD CONSTRAINT "BetSelectionResult_id_pilote_dnf_fkey" FOREIGN KEY ("id_pilote_dnf") REFERENCES "Pilote"("id_api_pilotes") ON DELETE RESTRICT ON UPDATE CASCADE;
