import * as dotenv from 'dotenv';
import { HIT } from './functions/Football/functions/HIT';
dotenv.config();

async function main() {
    await HIT.playerStatistics();
}

main();
