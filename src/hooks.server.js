import { connectDB } from '$lib/server/db';

connectDB().catch(console.error);
