import cron from 'node-cron';

import { importPilotes } from '../scripts/importPilotes';
import { importEcuries } from '../scripts/importEcuries';
import { importPilotesAndEcuries } from '../scripts/importPilotesAndEcuries';
import { importTracks } from '../scripts/importTracks';
import { importUpcomingGPs } from '../scripts/importUpcomingGPs';
import { importClassements } from '../scripts/importClassement';
import { calculatePoints } from '../scripts/calculatePoints';
import { generateGPP } from '../scripts/generateGPP';

// Exemple : Tous les dimanches à 18h (UTC)
cron.schedule('0 18 * * 0', async () => {
  console.log('Lancement des imports hebdomadaires');

  await importPilotes();
  await importEcuries();
  await importPilotesAndEcuries();
  await importTracks();
  await importUpcomingGPs();
  await generateGPP();
  await importClassements();
  await calculatePoints();

  console.log('Tous les imports ont été exécutés');
});
