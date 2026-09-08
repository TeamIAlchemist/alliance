// Barème All(IA)nce — CALCULÉ CÔTÉ SERVEUR (ne jamais faire confiance au navigateur).
// Reddition A = 5 items (A3 retiré) sur 25 ; bandes 11/18.
export type Answers = Record<string, number>;
const n = (a: Answers, c: string) => Number(a[c] || 0);

export function score(a: Answers) {
  const A = n(a,'A1')+n(a,'A2')+n(a,'A4')+(6-n(a,'A6'))+(6-n(a,'A7'));   // 5–25
  const B = n(a,'B1')+n(a,'B2')+n(a,'B3')+n(a,'B4');                      // 4–20
  const bandA = A<=11?'low':A<=18?'mid':'high';
  const bandB = B<=9?'low':B<=14?'mid':'high';
  const polarity =
    bandA==='high'&&bandB==='high' ? 'erratic' :
    bandA==='high' ? 'over' :
    bandB==='high' ? 'rigid' :
    (bandA==='low'&&bandB==='low') ? 'healthy' : 'watch';

  const container = n(a,'I1')+n(a,'I2')+n(a,'I3');
  const difference= n(a,'I4')+n(a,'I5')+n(a,'I6');
  const exchange  = n(a,'I7')+n(a,'I8');

  const cInd = n(a,'K1')+n(a,'K5')+n(a,'K9')+n(a,'K13')+n(a,'K17');       // /25
  const cColl= n(a,'K2')+n(a,'K6')+n(a,'K10')+n(a,'K14')+n(a,'K18');
  const cSig = n(a,'K3')+n(a,'K7')+n(a,'K11')+n(a,'K15')+n(a,'K19');
  const atrophy = cSig - cInd;                                           // report du fardeau
  const comp = {
    crea:[n(a,'K1'),n(a,'K2'),n(a,'K3')], cur:[n(a,'K5'),n(a,'K6'),n(a,'K7')],
    col:[n(a,'K9'),n(a,'K10'),n(a,'K11')], cri:[n(a,'K13'),n(a,'K14'),n(a,'K15')],
    com:[n(a,'K17'),n(a,'K18'),n(a,'K19')]
  };
  // Kegan (niveau de conscience) — 2 items/stade
  const kSoc = n(a,'KG1')+n(a,'KG2');
  const kAut = n(a,'KG3')+n(a,'KG4');
  const kTra = n(a,'KG5')+n(a,'KG6');
  const l1 = n(a,'L1'), l2 = n(a,'L2');

  return { A, bandA, B, bandB, polarity, container, difference, exchange,
           cInd, cColl, cSig, atrophy, comp, kSoc, kAut, kTra, l1, l2 };
}
