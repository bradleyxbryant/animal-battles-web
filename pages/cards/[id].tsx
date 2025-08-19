import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CardPage(){
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [card,setCard] = useState<any>(null);

  useEffect(()=>{
    if(!id) return;
    supabase.from('cards').select('*').eq('id', id).single().then(({data})=>setCard(data));
  },[id]);

  if(!card) return <main><p>Loading...</p></main>;

  return (
    <main>
      <div className="card" id="cardCanvas">
        <img src={card.image_url} alt="" style={{width:300,height:220,objectFit:'cover',borderRadius:10}}/>
        <h2>{card.common_name} <small><em>{card.scientific_name}</em></small></h2>
        <p><span className="badge">{card.tier}</span> {Array.isArray(card.type)&&card.type.map((t:string)=><span key={t} className="badge">{t}</span>)}</p>
        <ul>
          <li>HP: <b>{card.hp}</b></li>
          <li>ATK: <b>{card.attack}</b></li>
          <li>DEF: <b>{card.defense}</b></li>
          <li>SPD: <b>{card.speed}</b></li>
        </ul>
        <p><b>Special:</b> {card.special?.name} — {card.special?.text} (CD {card.special?.cooldown})</p>
        <p>{card.flavor}</p>
      </div>
      <p><a href="/dashboard">← Back</a></p>
    </main>
  );
}
