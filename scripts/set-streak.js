const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@supabase/supabase-js');

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE config in environment. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function setStreak(email, streak) {
  const { data: user } = await supabase.from('users').select('id, email, metadata').eq('email', email).maybeSingle();
  if (!user) {
    console.error('User not found for email:', email);
    process.exit(2);
  }

  const metadata = (user.metadata && typeof user.metadata === 'object') ? { ...user.metadata } : {};
  metadata.streak = Number(streak);
  metadata.lastStudyDate = new Date().toISOString();

  const { data, error } = await supabase.from('users').update({ metadata }).eq('id', user.id).select().single();
  if (error) {
    console.error('Failed to update user metadata:', error.message);
    process.exit(3);
  }

  console.log('Updated user', user.email, 'streak ->', metadata.streak);
  console.log('New metadata:', JSON.stringify(data.metadata, null, 2));
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/set-streak.js <email> <streak>');
  process.exit(1);
}

setStreak(args[0], args[1]).catch((err) => {
  console.error(err);
  process.exit(1);
});
