import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Upload() {
  const [user,setUser] = useState<any>(null);
  const [file,setFile] = useState<File|null>(null);
  const [notes,setNotes] = useState('');
  const [status,setStatus] = useState('');

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data.user)); },[]);
  if(!user) return <main><p>Please <a href="/">sign in</a> first.</p></main>;

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!file){ alert('Pick an image'); return; }
    setStatus('Uploading image...');
    const path = `u-${user.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from('animals').upload(path, file, { upsert: true });
    if (upErr) { setStatus('Upload failed: '+upErr.message); return; }
    const { data: pub } = supabase.storage.from('animals').getPublicUrl(path);
    const imageUrl = pub.publicUrl;

    setStatus('Generating card (AI or mock)...');
    const res = await fetch('/api/cards/generate', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ imageUrl, notes })
    });
    const { card, error } = await res.json();
    if (error) { setStatus('Generate failed: '+error); return; }

    setStatus('Saving card to your deck...');
    const { error: insertErr } = await supabase.from('cards').insert({
      owner: user.id,
      common_name: card.common_name,
      scientific_name: card.scientific_name,
      tier: card.tier,
      type: card.type,
      hp: card.hp, attack: card.attack, defense: card.defense, speed: card.speed,
      special: card.special_move,
      env_bonuses: card.environment_bonuses,
      flavor: card.flavor,
      image_url: imageUrl
    });
    if (insertErr) { setStatus('Save failed: '+insertErr.message); return; }
    setStatus('Done! Redirecting...');
    location.href = '/dashboard';
  }

  return (
    <main>
      <h2>Generate a Card</h2>
      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <textarea placeholder="Optional notes (name, habitat, tier hint)" value={notes} onChange={e=>setNotes(e.target.value)} />
        <button type="submit">Create Card</button>
      </form>
      <p>{status}</p>
    </main>
  );
}
