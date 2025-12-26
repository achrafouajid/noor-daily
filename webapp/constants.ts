import { AdhkarItem } from './types';

export const ADHKAR_DATA: AdhkarItem[] = [
  {
    id: '1',
    category: 'morning',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    translation: 'All praise is due to Allah who gave us life after having given us death and unto Him is the resurrection.',
    reference: 'Bukhari 6312',
    count: 1
  },
  {
    id: '2',
    category: 'morning',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    translation: 'O Allah, You are my Lord. There is no god but You. You created me; and I am your servant. And I am abiding by Your covenant and promise as best as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favors upon me, and I acknowledge my sins. So forgive me, for there is no one who forgives sins except You.',
    reference: 'Sayyidul Istighfar',
    count: 1
  },
  {
    id: '3',
    category: 'evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    reference: 'Muslim 2723',
    count: 1
  },
  {
    id: '4',
    category: 'general',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    translation: 'Glory is to Allah and all praise is to Him.',
    reference: '100 times daily',
    count: 100
  }
];

// Placeholder for Adhan audio - using a public domain or creative commons permissible link
// In a real app, this should be hosted on your own CDN
export const ADHAN_AUDIO_URL = 'https://media.sd.ma/assabile/adhan_3338.mp3'; 
