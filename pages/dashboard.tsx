import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Card = {
  id: string; common_name: string; scientific_name: string;
  tier: string; type: string[]; hp: number; attack: number; defense: number; speed: number;
  image_url: string;
};

export default function Dashboard(){
  const [user,setUser] = useState<any>(null);
  const [cards,setCards] = useState<Card[]>([]);

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data.user)); },[]);
  useEffect(()=>{ if(!user) return; supabase.from('cards').select('*').eq('owner', user.id).order('created_at',{ascending:false}).then(({data})=>setCards(data||[])); },[user]);

  if(!user) return <main><p>Please <a href="/">sign in</a>.</p></main>;

  return (
    <main>
      <h2>My Cards</h2>
      <div className="grid">
        {cards.map(c=>(
          <a key={c.id} className="card" href={`/cards/${c.id}`}>
            <img src={c.image_url} alt="" style={{width:'100%',height:140,objectFit:'cover',borderRadius:8}}/>
            <h3>{c.common_name}</h3>
            <p><em>{c.scientific_name}</em></p>
            <p><span className="badge">{c.tier}</span></p>
          </a>
        ))}
      </div>
      <p><a href="/upload">+ New Card</a></p>
    </main>
  );
}
