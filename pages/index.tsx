import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => { supabase.auth.getUser().then(({data})=>setUser(data.user)); }, []);

  const login = async () => { await supabase.auth.signInWithOAuth({ provider:'google' }); };
  const logout = async () => { await supabase.auth.signOut(); location.reload(); };

  return (
    <>
      <header><h1>🐾 Animal Battles</h1></header>
      <main>
        {!user ? (
          <>
            <p>Sign in to create battle cards from your photos.</p>
            <button onClick={login}>Sign in with Google</button>
          </>
        ) : (
          <>
            <p>Welcome, {user.email || user.id}</p>
            <p>
              <a href="/upload">Generate a Card</a> · <a href="/dashboard">My Cards</a>
            </p>
            <button onClick={logout}>Sign out</button>
          </>
        )}
      </main>
    </>
  );
}
