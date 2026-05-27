import { connectDB } from '$lib/server/db';
const dbReady = connectDB().catch(console.error);
export const handle = async ({ event, resolve }) => {
  await dbReady;
  return resolve(event);
};
