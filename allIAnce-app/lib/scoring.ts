// Scoring All(IA)nce - reconcilie a l'identique sur la fonction score() du fichier faisant foi.
// A sur 5 items (A3 retiru00e9), bandes 11/18 ; B 4 items, bandes 9/14 ; Kegan 3 sous-scores.
export type Answers = Record<string, number>;
const v = (a: Answers, c: string) => Number(a[c] || 0);

export function band(x: number, a: number, b: number): 'low' | 'mid' | 'high' {
  return x <= a ? 'low' : x <= b ? 'mid' : 'high';
}
export function polarity(A: number, B: number) {
  const ba = band(A, 11, 18), bb = band(B, 9, 14);
  if (ba === 'high' && bb === 'high') return 'erratic';
  if (ba === 'high') return 'over';
  if (bb === 'high') return 'rigid';
  if (ba === 'low' && bb === 'low') return 'healthy';
  return 'watch';
}
// Bandes de lecture (memes seuils que le fichier faisant foi)
export const bandA_   = (x: number) => (x <= 11 ? 'low' : x <= 18 ? 'mid' : 'high');
export const bandB_   = (x: number) => (x <= 9  ? 'low' : x <= 14 ? 'mid' : 'high');
export const bandC5_  = (x: number) => (x <= 11 ? 'low' : x <= 18 ? 'mid' : 'high');
export const bandAtr_ = (x: number) => (x <= 0  ? 'sain' : x <= 7 ? 'vigil' : 'prob');

export function score(ans: Answers) {
  const A = v(ans,'A1') + v(ans,'A2') + v(ans,'A4') + (6 - v(ans,'A6')) + (6 - v(ans,'A7')); // 5-25
  const B = v(ans,'B1') + v(ans,'B2') + v(ans,'B3') + v(ans,'B4');                            // 4-20
  const cInd  = v(ans,'K1') + v(ans,'K5') + v(ans,'K9')  + v(ans,'K13') + v(ans,'K17');
  const cColl = v(ans,'K2') + v(ans,'K6') + v(ans,'K10') + v(ans,'K14') + v(ans,'K18');
  const cSig  = v(ans,'K3') + v(ans,'K7') + v(ans,'K11') + v(ans,'K15') + v(ans,'K19');
  const comp = {
    crea:[v(ans,'K1'),v(ans,'K2'),v(ans,'K3')], cur:[v(ans,'K5'),v(ans,'K6'),v(ans,'K7')],
    col:[v(ans,'K9'),v(ans,'K10'),v(ans,'K11')], cri:[v(ans,'K13'),v(ans,'K14'),v(ans,'K15')],
    com:[v(ans,'K17'),v(ans,'K18'),v(ans,'K19')]
  };
  const container  = v(ans,'I1') + v(ans,'I2') + v(ans,'I3');
  const difference = v(ans,'I4') + v(ans,'I5') + v(ans,'I6');
  const exchange   = v(ans,'I7') + v(ans,'I8');
  const kSoc = v(ans,'KG1') + v(ans,'KG2');   // socialise
  const kAut = v(ans,'KG3') + v(ans,'KG4');   // auteur de soi
  const kTra = v(ans,'KG5') + v(ans,'KG6');   // auto-transformateur
  return { A, B, pol: polarity(A, B), cInd, cColl, cSig, atrophy: cSig - cInd,
           comp, container, difference, exchange, kSoc, kAut, kTra };
}
