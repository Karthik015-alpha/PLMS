require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

const url = process.env.DATABASE_URL;
if (url) {
  const sql = "ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS owner UUID REFERENCES public.users(id); CREATE INDEX IF NOT EXISTS idx_tasks_owner ON public.tasks(owner);";
  try {
    const out = execSync(`psql "${url}" -c "${sql}"`);
    console.log(out.toString());
  } catch(e) {
    console.error("Error running SQL:", e.message);
    if (e.stderr) console.error("stderr:", e.stderr.toString());
    if (e.stdout) console.log("stdout:", e.stdout.toString());
  }
} else {
  console.log('No DATABASE_URL found');
}
