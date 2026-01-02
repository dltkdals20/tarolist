import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Home, Loader } from 'lucide-react';
import { getReading } from './lib/supabase';

// 로마 숫자 변환
const toRoman = (num) => {
  const map = {
    21: 'XXI', 20: 'XX', 19: 'XIX', 18: 'XVIII', 17: 'XVII', 16: 'XVI', 15: 'XV', 14: 'XIV', 13: 'XIII', 12: 'XII', 11: 'XI', 10: 'X', 9: 'IX', 8: 'VIII', 7: 'VII', 6: 'VI', 5: 'V', 4: 'IV', 3: 'III', 2: 'II', 1: 'I', 0: '0'
  };
  return map[num] || num;
};

const NEW_YEAR_LABELS = [
  '1. 대표 (나의 상태)', '2. 금전운', '3. 형제/대화', '4. 가족/가정',
  '5. 연애/유희', '6. 건강/노동', '7. 결혼/파트너', '8. 타인의 도움',
  '9. 시험운/학업운', '10. 직장/사업운', '11. 우정/대인관계', '12. 장애물', '13. 최종 결과'
];

const INNER_ACTIVE_LABELS = [
  '1. 페르소나 (가면)',
  '2. 에고 (현재 의식)',
  '3. 그림자 (무의식)',
  '4. 내면아이 (상처)',
  '5. 셀프 (통합/치유)'
];

export default function SharePage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReading() {
      try {
        const data = await getReading(shareId);
        setReading(data);
      } catch (err) {
        setError('공유된 타로 결과를 찾을 수 없습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    loadReading();
  }, [shareId]);

  const getLabel = (idx, readingType) => {
    if (readingType === 'general') {
      return ['PAST (과거)', 'PRESENT (현재)', 'FUTURE (미래)', 'ADVICE (조언)'][idx];
    } else if (readingType === 'inneractive') {
      return INNER_ACTIVE_LABELS[idx];
    } else if (readingType === 'custom') {
      return `CARD ${idx + 1}`;
    } else {
      return NEW_YEAR_LABELS[idx];
    }
  };

  const renderTitle = (readingType) => {
    switch(readingType) {
      case 'newyear': return '2025 신년 운세';
      case 'inneractive': return 'INNER PSYCHOLOGY';
      case 'custom': return 'CUSTOM READING';
      default: return 'DESTINY READING';
    }
  };

  const isInnerActive = reading?.reading_type === 'inneractive';
  const themeText = isInnerActive ? 'text-cyan-100' : 'text-amber-100';
  const themeAccent = isInnerActive ? 'text-cyan-400' : 'text-amber-400';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-amber-500" size={48} />
          <p className="text-amber-500/80 font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-serif text-amber-100">{error || '결과를 찾을 수 없습니다'}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-100 rounded-sm font-serif tracking-widest transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-purple-500 overflow-hidden flex flex-col items-center relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_${isInnerActive ? '#0f172a' : '#1e1b4b'}_0%,_#020617_100%)] opacity-90`}></div>
      </div>

      <div className={`absolute top-0 w-full h-px bg-gradient-to-r from-transparent ${isInnerActive ? 'via-cyan-500/50' : 'via-amber-500/30'} to-transparent opacity-50`} />

      <header className="z-10 w-full p-4 md:p-6 text-center shrink-0">
        <h1 className={`text-3xl md:text-5xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${isInnerActive ? 'from-cyan-100 via-blue-200 to-cyan-100' : 'from-amber-100 via-amber-300 to-amber-100'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
          MYSTIC TAROT
        </h1>
        <p className={`${isInnerActive ? 'text-cyan-500/60' : 'text-amber-500/60'} text-xs md:text-sm mt-2 tracking-[0.3em] uppercase font-serif`}>
          Shared Reading
        </p>
      </header>

      <main className="z-10 flex-1 w-full max-w-7xl p-4 flex flex-col items-center justify-center relative">
        <div className="w-full flex flex-col items-center animate-fade-in pb-8 md:pb-12 overflow-y-auto max-h-[90vh] md:max-h-[85vh] custom-scrollbar">
          <h2 className={`text-lg md:text-2xl font-serif font-light mb-6 md:mb-12 ${themeText} border-b ${isInnerActive ? 'border-cyan-900/50' : 'border-amber-900/50'} pb-2 md:pb-4 w-full text-center tracking-[0.2em] px-4`}>
            {renderTitle(reading.reading_type)}
          </h2>

          <div className={`grid gap-4 md:gap-x-8 md:gap-y-16 w-full px-3 md:px-6 ${
            reading.reading_type === 'newyear' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          }`}>
            {reading.selected_cards.map((card, idx) => (
              <div key={card.id} className="flex flex-col items-center group mb-4 md:mb-0">
                <div className={`text-[10px] md:text-xs lg:text-sm font-serif font-bold mb-2 md:mb-4 tracking-widest uppercase text-center h-5 md:h-6 flex items-end ${themeAccent} px-2`}>
                  {getLabel(idx, reading.reading_type)}
                </div>

                <div className="relative w-32 h-52 sm:w-40 sm:h-64 md:w-44 md:h-72 lg:w-52 lg:h-80">
                  <div className={`relative w-full h-full bg-[#1c1917] border-[2px] md:border-[4px] rounded shadow-2xl overflow-hidden flex flex-col ${
                    (reading.reading_type === 'general' && idx === 3) || (reading.reading_type === 'newyear' && idx === 12) || (reading.reading_type === 'inneractive' && idx === 4)
                    ? (isInnerActive ? 'border-cyan-400' : 'border-amber-400') 
                    : (isInnerActive ? 'border-cyan-900' : 'border-[#451a03]')
                  }`}>
                    <div className="flex-1 relative overflow-hidden bg-black">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className={`w-full h-full object-cover contrast-125 brightness-90 transition-transform duration-[2s] md:group-hover:scale-110 ${isInnerActive ? 'sepia-[0.2]' : 'sepia-[0.4]'}`}
                      />
                      <div className="absolute inset-0 bg-[#000000] mix-blend-overlay opacity-30 pointer-events-none"></div>
                    </div>

                    <div className={`h-10 md:h-14 bg-[#0f0a05] flex flex-col items-center justify-center border-t-2 ${isInnerActive ? 'border-cyan-900' : 'border-[#451a03]'} shrink-0 px-1 md:px-2 text-center relative`}>
                      {card.type === 'major' && (
                        <span className={`text-[7px] md:text-[9px] font-serif tracking-widest absolute top-0.5 md:top-1 ${isInnerActive ? 'text-cyan-700' : 'text-amber-700'}`}>{toRoman(card.number)}</span>
                      )}
                      <span className={`font-serif text-[10px] sm:text-xs md:text-sm lg:text-base tracking-wider break-keep leading-tight mt-0.5 md:mt-1 ${
                        (reading.reading_type === 'general' && idx === 3) || (reading.reading_type === 'newyear' && idx === 12) || (reading.reading_type === 'inneractive' && idx === 4)
                        ? (isInnerActive ? 'text-cyan-300 font-bold' : 'text-amber-300 font-bold')
                        : 'text-[#d6d3d1]'
                      }`}>
                        {card.nameKo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-8 text-center px-2 w-full max-w-full md:max-w-xs">
                  <h3 className={`text-sm md:text-lg font-serif font-bold mb-1 ${themeText}`}>{card.name}</h3>
                  <p className={`text-[9px] md:text-[10px] lg:text-xs mb-2 md:mb-4 tracking-wider ${isInnerActive ? 'text-cyan-500/60' : 'text-amber-500/60'}`}>{card.keywords}</p>
                  <div className={`text-[11px] md:text-xs lg:text-sm leading-relaxed word-keep-all p-3 md:p-4 border relative bg-[#0a0a0a] ${
                    (reading.reading_type === 'general' && idx === 3) || (reading.reading_type === 'newyear' && idx === 12) || (reading.reading_type === 'inneractive' && idx === 4)
                    ? (isInnerActive ? 'border-cyan-500/40 text-cyan-50' : 'border-amber-500/40 text-amber-50')
                    : (isInnerActive ? 'border-cyan-900/20 text-slate-400' : 'border-amber-900/20 text-stone-400')
                  }`}>
                    {card.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/')}
            className={`mt-8 md:mt-20 px-6 md:px-12 py-3 md:py-4 text-sm md:text-base border ${isInnerActive ? 'border-cyan-900/50 hover:border-cyan-500 text-cyan-600 hover:text-cyan-100' : 'border-amber-900/50 hover:border-amber-500 text-amber-600 hover:text-amber-100'} font-serif tracking-[0.2em] transition-all flex items-center gap-2 md:gap-3 mx-auto bg-black/50 backdrop-blur-md`}
          >
            <Home size={14} className="md:w-4 md:h-4" />
            <span className="whitespace-nowrap">나도 타로 보기</span>
          </button>
        </div>
      </main>

      <style>{`
        .word-keep-all { word-break: keep-all; }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isInnerActive ? 'rgba(8, 145, 178, 0.5)' : 'rgba(120, 53, 15, 0.5)'};
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

