// lib/mock.ts
export function mockGenerate(commonHint: string) {
  const lower = (commonHint || 'Unknown Creature').toLowerCase();
  let tier: 'Micro'|'Mini'|'Small'|'Medium'|'Large'|'Titan' = 'Mini';
  if (/elephant|whale|squid/.test(lower)) tier='Titan';
  else if (/lion|bear|shark|eagle/.test(lower)) tier='Large';
  else if (/dog|fox|wolf|goat/.test(lower)) tier='Medium';
  else if (/rat|lizard|frog|bird/.test(lower)) tier='Small';
  else if (/tardigrade|bacteria|amoeba/.test(lower)) tier='Micro';

  const ranges: Record<string,[number,number]> = {
    Micro:[5,40], Mini:[10,60], Small:[30,80], Medium:[50,100], Large:[70,120], Titan:[100,150]
  };
  const [lo,hi] = ranges[tier];
  const rnd = (a:number,b:number)=>Math.floor(Math.random()*(b-a+1))+a;

  const type = [/lion|shark|eagle|wolf|spider|mantis/.test(lower)?'Predator':'Prey'];
  if (/bee|butterfly/.test(lower)) type.push('Pollinator');
  if (/ant|termite|beetle/.test(lower)) type.push('Armored');
  if (/fish|shark|whale/.test(lower)) type.push('Aquatic');

  return {
    common_name: commonHint || 'Unknown Creature',
    scientific_name: 'Unknown sp.',
    tier,
    type: type.slice(0,2),
    hp: rnd(lo,hi),
    attack: rnd(5,18),
    defense: rnd(5,18),
    speed: rnd(5,18),
    special_move: { name:'Adaptive Burst', text:'Bursts based on natural adaptation', cooldown:2 },
    environment_bonuses: [{ env:'Forest', effect:'+25% Speed for flyers/climbers' }],
    flavor: 'Prototype without external AI.'
  };
}
