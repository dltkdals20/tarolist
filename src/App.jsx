import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Moon, Loader, Calendar, Layers, Brain, Star, Share2, Copy, Check } from 'lucide-react';
import { saveReading, getReading } from './lib/supabase';

// --- 유틸리티: 로마 숫자 변환 ---
const toRoman = (num) => {
  const map = {
    21: 'XXI', 20: 'XX', 19: 'XIX', 18: 'XVIII', 17: 'XVII', 16: 'XVI', 15: 'XV', 14: 'XIV', 13: 'XIII', 12: 'XII', 11: 'XI', 10: 'X', 9: 'IX', 8: 'VIII', 7: 'VII', 6: 'VI', 5: 'V', 4: 'IV', 3: 'III', 2: 'II', 1: 'I', 0: '0'
  };
  return map[num] || num;
};

// --- 1. 일반 타로 데이터 (78장 - Sacred Texts 이미지 사용) ---
const createTarotDeck = () => {
  const baseURL = "https://www.sacred-texts.com/tarot/pkt/img/";
  
  // 메이저 아르카나
  const majorArcanaData = [
    { name: "The Fool", nameKo: "광대", keywords: "새로운 시작, 모험, 순수함", desc: "두려움 없이 새로운 여정을 시작할 때입니다. 순수한 마음으로 미지의 세계로 발을 내디뎌 보세요." },
    { name: "The Magician", nameKo: "마법사", keywords: "창조, 의지, 숙련됨", desc: "당신에게는 이미 목표를 이룰 능력이 있습니다. 가진 재능을 적극적으로 활용하여 현실을 만들어가세요." },
    { name: "The High Priestess", nameKo: "고위 여사제", keywords: "직관, 신비, 지혜", desc: "내면의 목소리에 귀를 기울이세요. 이성보다는 직감이 답을 줄 때가 있습니다." },
    { name: "The Empress", nameKo: "여황제", keywords: "풍요, 모성, 자연", desc: "물질적, 정신적으로 풍요로운 시기입니다. 사랑과 포용력으로 주변을 돌보세요." },
    { name: "The Emperor", nameKo: "황제", keywords: "권위, 구조, 리더십", desc: "질서와 규칙이 필요한 때입니다. 확고한 의지로 상황을 통제하고 리더십을 발휘하세요." },
    { name: "The Hierophant", nameKo: "교황", keywords: "전통, 가르침, 믿음", desc: "전통적인 가치나 멘토의 조언을 따르는 것이 좋습니다. 배움과 영적인 성장에 집중하세요." },
    { name: "The Lovers", nameKo: "연인", keywords: "사랑, 조화, 선택", desc: "중요한 관계나 선택의 기로에 서 있습니다. 가슴이 시키는 대로 조화로운 결정을 내리세요." },
    { name: "The Chariot", nameKo: "전차", keywords: "승리, 의지, 전진", desc: "장애물을 극복하고 목표를 향해 돌진할 때입니다. 강한 의지력이 승리를 가져옵니다." },
    { name: "Strength", nameKo: "힘", keywords: "인내, 용기, 외유내강", desc: "부드러움이 강함을 이깁니다. 인내심과 포용력으로 어려움을 극복하세요." },
    { name: "The Hermit", nameKo: "은둔자", keywords: "성찰, 고독, 탐구", desc: "잠시 멈춰 내면을 들여다볼 시간입니다. 혼자만의 시간을 통해 지혜를 얻으세요." },
    { name: "Wheel of Fortune", nameKo: "운명의 수레바퀴", keywords: "변화, 운명, 기회", desc: "피할 수 없는 변화가 다가옵니다. 흐름에 몸을 맡기면 새로운 기회가 찾아올 것입니다." },
    { name: "Justice", nameKo: "정의", keywords: "공정, 진실, 인과응보", desc: "객관적이고 공정한 판단이 필요합니다. 뿌린 대로 거두게 될 것입니다." },
    { name: "The Hanged Man", nameKo: "매달린 사람", keywords: "희생, 새로운 관점, 정지", desc: "잠시 멈춰 상황을 다른 각도에서 바라보세요. 더 큰 가치를 위한 인내가 필요합니다." },
    { name: "Death", nameKo: "죽음", keywords: "끝, 새로운 시작, 변화", desc: "과거의 것을 정리해야 새로운 것이 들어옵니다. 변화를 두려워하지 말고 받아들이세요." },
    { name: "Temperance", nameKo: "절제", keywords: "균형, 조화, 중용", desc: "극단을 피하고 균형을 잡으세요. 서로 다른 것들을 조화롭게 융합하는 지혜가 필요합니다." },
    { name: "The Devil", nameKo: "악마", keywords: "속박, 유혹, 물질", desc: "나쁜 습관이나 유혹에 얽매여 있지 않나요? 스스로를 가두는 사슬을 끊어내야 합니다." },
    { name: "The Tower", nameKo: "탑", keywords: "갑작스런 변화, 붕괴, 계시", desc: "예기치 못한 변화가 기존의 틀을 깨트립니다. 이는 더 튼튼한 기반을 쌓기 위한 과정입니다." },
    { name: "The Star", nameKo: "별", keywords: "희망, 영감, 평온", desc: "어둠 속에서 빛나는 희망을 찾게 됩니다. 긍정적인 마음으로 미래를 꿈꾸세요." },
    { name: "The Moon", nameKo: "달", keywords: "불안, 환상, 잠재의식", desc: "불확실한 상황에 마음이 흔들릴 수 있습니다. 눈에 보이는 것 너머의 진실을 찾으세요." },
    { name: "The Sun", nameKo: "태양", keywords: "성공, 활력, 기쁨", desc: "모든 것이 명확해지고 긍정적인 에너지가 넘칩니다. 밝은 미래와 성공이 기다립니다." },
    { name: "Judgement", nameKo: "심판", keywords: "부활, 소명, 결단", desc: "과거의 노력에 대한 보상을 받거나 중요한 깨달음을 얻게 됩니다. 새로운 단계로 나아가세요." },
    { name: "The World", nameKo: "세계", keywords: "완성, 통합, 성취", desc: "긴 여정이 성공적으로 마무리되었습니다. 완벽한 조화와 성취를 누리세요." },
  ];

  const majorArcana = majorArcanaData.map((card, index) => ({
    id: `m${String(index).padStart(2, '0')}`,
    ...card,
    type: 'major',
    number: index,
    image: `${baseURL}ar${String(index).padStart(2, '0')}.jpg`
  }));

  // 마이너 아르카나
  const suits = [
    { name: 'Wands', nameKo: '지팡이', char: 'wa', descKey: '열정, 행동, 영감' },
    { name: 'Cups', nameKo: '컵', char: 'cu', descKey: '감정, 사랑, 관계' },
    { name: 'Swords', nameKo: '검', char: 'sw', descKey: '이성, 사고, 갈등' },
    { name: 'Pentacles', nameKo: '펜타클', char: 'pe', descKey: '물질, 현실, 일' }
  ];

  const ranks = [
    { id: 1, code: 'ac', name: 'Ace', nameKo: '에이스' },
    { id: 2, code: '02', name: 'Two', nameKo: '2' },
    { id: 3, code: '03', name: 'Three', nameKo: '3' },
    { id: 4, code: '04', name: 'Four', nameKo: '4' },
    { id: 5, code: '05', name: 'Five', nameKo: '5' },
    { id: 6, code: '06', name: 'Six', nameKo: '6' },
    { id: 7, code: '07', name: 'Seven', nameKo: '7' },
    { id: 8, code: '08', name: 'Eight', nameKo: '8' },
    { id: 9, code: '09', name: 'Nine', nameKo: '9' },
    { id: 10, code: '10', name: 'Ten', nameKo: '10' },
    { id: 11, code: 'pa', name: 'Page', nameKo: '페이지' },
    { id: 12, code: 'kn', name: 'Knight', nameKo: '나이트' },
    { id: 13, code: 'qu', name: 'Queen', nameKo: '퀸' },
    { id: 14, code: 'ki', name: 'King', nameKo: '킹' },
  ];

  const minorArcana = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      let desc = "";
      if (rank.id === 1) desc = `${suit.nameKo}의 정수. 새로운 기회와 잠재력이 넘쳐나는 시작입니다.`;
      else if (rank.id === 10) desc = `완성과 끝. 한 사이클이 종료되고 다음 단계로 넘어감을 암시합니다.`;
      else desc = `${suit.nameKo}의 ${rank.nameKo}번 카드입니다. ${suit.descKey}와 관련된 흐름을 보여줍니다.`;

      minorArcana.push({
        id: `${suit.char}${rank.code}`,
        name: `${rank.name} of ${suit.name}`,
        nameKo: `${suit.nameKo} ${rank.nameKo}`,
        image: `${baseURL}${suit.char}${rank.code}.jpg`,
        keywords: `${suit.descKey}, ${rank.name}`,
        desc: desc,
        type: 'minor'
      });
    });
  });

  return [...majorArcana, ...minorArcana];
};

// --- 2. 이너액티브(심리) 전용 데이터 (76개 실제 촬영 카드) ---
const createInnerActiveDeck = () => {
  const imageFiles = [
    '20260106_083813.jpg', '20260106_083929.jpg', '20260106_084045.jpg', '20260106_084118.jpg',
    '20260106_084150.jpg', '20260106_084235.jpg', '20260106_084315.jpg', '20260106_084352.jpg',
    '20260106_084440.jpg', '20260106_084511.jpg', '20260106_084549.jpg', '20260106_084630.jpg',
    '20260106_084701.jpg', '20260106_084735.jpg', '20260106_084833.jpg', '20260106_084910.jpg',
    '20260106_084939.jpg', '20260106_085012.jpg', '20260106_085044.jpg', '20260106_085114.jpg',
    '20260106_085149.jpg', '20260106_085217.jpg', '20260106_085248.jpg', '20260106_085318.jpg',
    '20260106_085357.jpg', '20260106_085428.jpg', '20260106_085455.jpg', '20260106_085525.jpg',
    '20260106_085614.jpg', '20260106_085639.jpg', '20260106_085709.jpg', '20260106_085744.jpg',
    '20260106_085819.jpg', '20260106_085834.jpg', '20260106_085843.jpg', '20260106_085855.jpg',
    '20260106_085907.jpg', '20260106_085918.jpg', '20260106_085934.jpg', '20260106_085946.jpg',
    '20260106_085957.jpg', '20260106_090018.jpg', '20260106_090028.jpg', '20260106_090047.jpg',
    '20260106_090059.jpg', '20260106_090109.jpg', '20260106_090124.jpg', '20260106_090139.jpg',
    '20260106_090150.jpg', '20260106_090202.jpg', '20260106_090212.jpg', '20260106_090224.jpg',
    '20260106_090234.jpg', '20260106_090244.jpg', '20260106_090258.jpg', '20260106_090311.jpg',
    '20260106_090328.jpg', '20260106_090343.jpg', '20260106_090400.jpg', '20260106_090412.jpg',
    '20260106_090423.jpg', '20260106_090437.jpg', '20260106_090450.jpg', '20260106_090505.jpg',
    '20260106_090515.jpg', '20260106_090529.jpg', '20260106_090539.jpg', '20260106_090548.jpg',
    '20260106_090608.jpg', '20260106_090616.jpg', '20260106_090629.jpg', '20260106_090640.jpg',
    '20260106_090652.jpg', '20260106_090703.jpg', '20260106_090718.jpg', '20260106_090729.jpg'
  ];
  
  return imageFiles.map((filename, index) => ({
    id: `ia_${String(index + 1).padStart(2, '0')}`,
    image: `/타로/${filename}`,
    type: 'inneractive'
  }));
};

const TAROT_DATA = createTarotDeck();
const INNER_ACTIVE_DATA = createInnerActiveDeck();

const shuffleDeck = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- 레이블 상수 ---
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

export default function TarotApp() {
  const [gameState, setGameState] = useState('intro'); 
  const [readingType, setReadingType] = useState('general');
  const [deck, setDeck] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); 
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0); // 슬라이드 현재 인덱스
  const [touchStart, setTouchStart] = useState(0); // 터치 시작 위치

  useEffect(() => {
    const preloadImages = async () => {
      const priorityCards = [TAROT_DATA[10], TAROT_DATA[0], INNER_ACTIVE_DATA[0]];
      const promises = priorityCards.map((card) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = card.image;
          img.onload = resolve;
          img.onerror = resolve; 
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
    };
    preloadImages();
  }, []);

  const goToMenu = () => {
    setGameState('menu');
  }

  const startReading = (type) => {
    setReadingType(type);
    setGameState('shuffling');
    
    // 모드에 따라 덱 교체
    const currentDeck = type === 'inneractive' ? INNER_ACTIVE_DATA : TAROT_DATA;
    
    setTimeout(() => {
      setDeck(shuffleDeck(currentDeck));
      setGameState('selecting');
      setSelectedCards([]);
      setSlideIndex(0); // 슬라이드 인덱스 초기화
      
      let count = 4;
      if (type === 'newyear') count = 13;
      if (type === 'inneractive') count = 0; // 이너액티브 무제한
      if (type === 'custom') count = 0; // 커스텀은 무제한
      
      setFlippedCards(new Array(count).fill(false));
    }, 2000); 
  };

  const getTargetCount = () => {
    if (readingType === 'newyear') return 13;
    if (readingType === 'inneractive') return Infinity; // 이너액티브 무제한
    if (readingType === 'custom') return Infinity; // 커스텀은 무제한
    return 4; // general
  };

  const selectCard = (card) => {
    const maxCards = getTargetCount();
    
    // 커스텀/이너액티브 모드는 무제한이므로 항상 추가 가능
    if (readingType === 'custom' || readingType === 'inneractive') {
      if (selectedCards.find(c => c.id === card.id)) return;
      const newSelection = [...selectedCards, card];
      setSelectedCards(newSelection);
      // 자동으로 넘어가지 않음
      return;
    }
    
    // 일반 모드는 기존 로직
    if (selectedCards.length < maxCards) {
      if (selectedCards.find(c => c.id === card.id)) return;
      
      const newSelection = [...selectedCards, card];
      setSelectedCards(newSelection);

      if (newSelection.length === maxCards) {
        setTimeout(() => setGameState('reading'), 800);
      }
    }
  };

  const viewSelectedCards = () => {
    if (selectedCards.length > 0) {
      setFlippedCards(new Array(selectedCards.length).fill(false));
      setGameState('reading');
    }
  };

  const removeCard = (cardId) => {
    if (readingType === 'custom') {
      setSelectedCards(selectedCards.filter(c => c.id !== cardId));
    }
  };

  const handleReveal = (index) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  // 슬라이드 네비게이션 함수
  const nextSlide = () => {
    if (readingType === 'inneractive' && deck.length > 0) {
      const maxSlides = deck.length; // 1개씩 표시하므로 deck.length
      setSlideIndex((prev) => (prev + 1) % maxSlides);
    }
  };

  const prevSlide = () => {
    if (readingType === 'inneractive' && deck.length > 0) {
      const maxSlides = deck.length; // 1개씩 표시하므로 deck.length
      setSlideIndex((prev) => (prev - 1 + maxSlides) % maxSlides);
    }
  };

  // 터치/스와이프 핸들러
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // 50px 이상 스와이프한 경우
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(); // 왼쪽으로 스와이프 -> 다음
      } else {
        prevSlide(); // 오른쪽으로 스와이프 -> 이전
      }
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setSelectedCards([]);
    setFlippedCards([]);
    setShareUrl('');
    setSlideIndex(0);
  };

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      // 고유 ID 생성 (간단한 랜덤 문자열)
      const shareId = Math.random().toString(36).substring(2, 10);
      
      // 결과 데이터 준비
      const readingData = {
        share_id: shareId,
        reading_type: readingType,
        selected_cards: selectedCards.map(card => ({
          id: card.id,
          name: card.name,
          nameKo: card.nameKo,
          keywords: card.keywords,
          desc: card.desc,
          image: card.image,
          type: card.type,
          number: card.number
        }))
      };
      
      // Supabase에 저장
      await saveReading(readingData);
      
      // 공유 URL 생성
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      
    } catch (error) {
      console.error('공유 실패:', error);
      alert('공유 링크 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const selectableDeck = gameState === 'selecting' 
    ? deck.filter(c => !selectedCards.find(sc => sc.id === c.id))
    : [];

  const getLabel = (idx) => {
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

  const getInstructionText = () => {
    if (readingType === 'general') {
       if (selectedCards.length === 0) return "과거를 상징하는 첫 번째 카드를 뽑아주세요.";
       if (selectedCards.length === 1) return "현재를 상징하는 두 번째 카드를 뽑아주세요.";
       if (selectedCards.length === 2) return "미래를 상징하는 세 번째 카드를 뽑아주세요.";
       return "마지막으로, 당신을 위한 조언 카드를 뽑아주세요.";
    } else if (readingType === 'inneractive') {
        return `당신의 내면을 반영하는 카드를 선택하세요 (현재 ${selectedCards.length}장 선택됨)`;
    } else if (readingType === 'custom') {
        return `원하는 만큼 카드를 선택하세요. (현재 ${selectedCards.length}장 선택됨)`;
    } else {
       return `${selectedCards.length + 1}번째 카드를 선택해주세요. (${selectedCards.length + 1}/13)`;
    }
  };

  const renderTitle = () => {
      switch(readingType) {
          case 'newyear': return '2025 신년 운세';
          case 'inneractive': return 'INNER PSYCHOLOGY';
          case 'custom': return 'CUSTOM READING';
          default: return 'DESTINY READING';
      }
  };

  const renderCaption = () => {
      switch(readingType) {
          case 'newyear': return 'Grand 13 Houses';
          case 'inneractive': return 'Unconscious & Self';
          case 'custom': return 'Choose Your Cards';
          default: return 'Past, Present, Future & Advice';
      }
  };

  const isInnerActive = readingType === 'inneractive';
  const themeText = isInnerActive ? 'text-cyan-100' : 'text-amber-100';
  const themeTextDark = isInnerActive ? 'text-cyan-500/60' : 'text-amber-500/60';
  const themeAccent = isInnerActive ? 'text-cyan-400' : 'text-amber-400';
  const themeBgGradient = isInnerActive 
    ? 'from-cyan-100 via-blue-200 to-cyan-100' 
    : 'from-amber-100 via-amber-300 to-amber-100';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-purple-500 overflow-hidden flex flex-col items-center relative">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
         <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_${isInnerActive ? '#0f172a' : '#1e1b4b'}_0%,_#020617_100%)] opacity-90 transition-colors duration-1000`}></div>
      </div>
      
      <div className={`absolute top-0 w-full h-px bg-gradient-to-r from-transparent ${isInnerActive ? 'via-cyan-500/50' : 'via-amber-500/30'} to-transparent opacity-50 transition-all duration-1000`} />

      <header className="z-10 w-full p-4 md:p-6 text-center shrink-0">
        <h1 className={`text-3xl md:text-5xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${themeBgGradient} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
          MYSTIC TAROT
        </h1>
        <p className={`${themeTextDark} text-xs md:text-sm mt-2 tracking-[0.3em] uppercase font-serif`}>
          {renderCaption()}
        </p>
      </header>

      <main className="z-10 flex-1 w-full max-w-7xl p-4 flex flex-col items-center justify-center relative">
        
        {/* Intro */}
        {gameState === 'intro' && (
          <div className="text-center animate-fade-in space-y-6 md:space-y-10 relative px-4">
            <div className="relative group cursor-pointer touch-manipulation" onClick={goToMenu}>
              <div className="absolute -inset-2 md:-inset-4 bg-amber-500/20 rounded-[2rem] blur-2xl opacity-0 md:group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative w-40 h-56 md:w-56 md:h-80 bg-black rounded-xl flex items-center justify-center shadow-2xl transform transition-transform duration-500 md:group-hover:scale-105 active:scale-95 md:active:scale-100 overflow-hidden border border-amber-800">
                <div className="w-full h-full relative">
                   {!imagesLoaded ? (
                     <div className="flex flex-col items-center gap-4 justify-center h-full">
                        <Loader className="animate-spin text-amber-500 w-6 h-6 md:w-8 md:h-8" />
                     </div>
                   ) : (
                      <>
                         <img src={TAROT_DATA[10].image} alt="cover" className="w-full h-full object-cover opacity-50 mix-blend-luminosity md:hover:mix-blend-normal transition-all duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                         <div className="absolute bottom-4 md:bottom-6 w-full text-center">
                            <span className="text-amber-100/80 font-serif tracking-widest text-xs md:text-sm">CLICK TO ENTER</span>
                         </div>
                      </>
                   )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={goToMenu}
              disabled={!imagesLoaded}
              className={`px-6 md:px-10 py-2.5 md:py-3 text-sm md:text-base bg-slate-900 border border-amber-500/30 active:border-amber-400 md:hover:border-amber-400 text-amber-100 rounded-sm font-serif tracking-widest transition-all transform active:-translate-y-0.5 md:hover:-translate-y-1 ${!imagesLoaded ? 'opacity-50 cursor-not-allowed' : ''} touch-manipulation`}
            >
              START READING
            </button>
          </div>
        )}

        {/* Menu Selection */}
        {gameState === 'menu' && (
          <div className="text-center animate-fade-in w-full max-w-4xl space-y-6 md:space-y-8 px-4">
             <h2 className="text-lg md:text-2xl font-serif text-amber-100/80 mb-6 md:mb-8 tracking-widest">CHOOSE YOUR PATH</h2>
             
             <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <button 
                  onClick={() => startReading('general')}
                  className="group relative h-48 md:h-64 bg-slate-950/50 border border-amber-900/30 active:border-amber-500/50 md:hover:border-amber-500/50 transition-all duration-500 active:bg-slate-900 md:hover:bg-slate-900 overflow-hidden rounded-lg flex flex-col items-center justify-center gap-3 md:gap-4 touch-manipulation"
                >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
                   <Layers size={28} className="md:w-9 md:h-9 text-purple-400/80 md:group-hover:text-purple-300 transition-colors mb-1 md:mb-2" />
                   <div>
                       <h3 className="text-base md:text-xl font-serif text-amber-100 mb-1 md:mb-2">일반 타로</h3>
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-serif tracking-wider uppercase">Past · Present · Future</p>
                   </div>
                </button>

                <button 
                  onClick={() => startReading('newyear')}
                  className="group relative h-48 md:h-64 bg-slate-950/50 border border-amber-900/30 active:border-amber-500/50 md:hover:border-amber-500/50 transition-all duration-500 active:bg-slate-900 md:hover:bg-slate-900 overflow-hidden rounded-lg flex flex-col items-center justify-center gap-3 md:gap-4 touch-manipulation"
                >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
                   <Calendar size={28} className="md:w-9 md:h-9 text-amber-400/80 md:group-hover:text-amber-300 transition-colors mb-1 md:mb-2" />
                   <div>
                       <h3 className="text-base md:text-xl font-serif text-amber-100 mb-1 md:mb-2">신년 운세</h3>
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-serif tracking-wider uppercase">Grand 13 Houses</p>
                   </div>
                </button>

                <button 
                  onClick={() => startReading('inneractive')}
                  className="group relative h-48 md:h-64 bg-slate-950/50 border border-cyan-900/30 active:border-cyan-500/50 md:hover:border-cyan-500/50 transition-all duration-500 active:bg-slate-900 md:hover:bg-slate-900 overflow-hidden rounded-lg flex flex-col items-center justify-center gap-3 md:gap-4 touch-manipulation"
                >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
                   <Brain size={28} className="md:w-9 md:h-9 text-cyan-400/80 md:group-hover:text-cyan-300 transition-colors mb-1 md:mb-2" />
                   <div>
                       <h3 className="text-base md:text-xl font-serif text-cyan-100 mb-1 md:mb-2">심리 탐구</h3>
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-serif tracking-wider uppercase">Inner Parts Work</p>
                   </div>
                </button>

                <button 
                  onClick={() => startReading('custom')}
                  className="group relative h-48 md:h-64 bg-slate-950/50 border border-emerald-900/30 active:border-emerald-500/50 md:hover:border-emerald-500/50 transition-all duration-500 active:bg-slate-900 md:hover:bg-slate-900 overflow-hidden rounded-lg flex flex-col items-center justify-center gap-3 md:gap-4 touch-manipulation"
                >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
                   <Star size={28} className="md:w-9 md:h-9 text-emerald-400/80 md:group-hover:text-emerald-300 transition-colors mb-1 md:mb-2" />
                   <div>
                       <h3 className="text-base md:text-xl font-serif text-emerald-100 mb-1 md:mb-2">커스텀 뽑기</h3>
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-serif tracking-wider uppercase">Free Selection</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {/* Shuffling */}
        {gameState === 'shuffling' && (
          <div className="flex flex-col items-center justify-center h-64">
             <div className="relative w-32 h-48">
               {[...Array(5)].map((_, i) => (
                 <div 
                  key={i}
                  className={`absolute inset-0 bg-[#1e293b] border ${isInnerActive ? 'border-cyan-600' : 'border-[#b45309]'} rounded shadow-2xl overflow-hidden`}
                  style={{
                    animation: `shuffleCard 2s infinite ease-in-out`,
                    animationDelay: `${i * 0.1}s`,
                    zIndex: i
                  }}
                 >
                   <div className="w-full h-full bg-[#0c0a09] opacity-90 pattern-grid-lg"></div>
                 </div>
               ))}
             </div>
             <p className={`mt-10 text-lg font-serif ${isInnerActive ? 'text-cyan-400/80' : 'text-amber-500/80'} animate-pulse tracking-[0.2em]`}>SHUFFLING...</p>
          </div>
        )}

        {/* Selecting */}
        {gameState === 'selecting' && (
          <div className="w-full text-center animate-fade-in flex flex-col h-full pb-4 md:pb-8">
            <h2 className={`text-sm md:text-lg ${themeText} shrink-0 h-8 md:h-10 font-serif tracking-wider px-2`}>
              {getInstructionText()}
            </h2>

            {/* Selected Slots Preview */}
            <div className="flex flex-col items-center gap-3 shrink-0 z-20 relative mb-2">
               <div className="flex justify-center gap-1.5 md:gap-2 px-2 md:px-4 h-[70px] md:h-[130px] items-center overflow-x-auto custom-scrollbar w-full">
                  {(readingType === 'custom' || readingType === 'inneractive') ? (
                     // 커스텀/이너액티브 모드: 선택된 카드만 표시 (클릭 시 제거)
                     selectedCards.length > 0 ? (
                        selectedCards.map((card, idx) => (
                          <button
                             key={card.id}
                             onClick={() => removeCard(card.id)}
                             className={`shrink-0 w-10 h-14 md:w-16 md:h-24 border ${isInnerActive ? 'border-cyan-500/50 active:border-cyan-400' : 'border-amber-500/50 active:border-amber-400'} rounded bg-gradient-to-b ${isInnerActive ? 'from-cyan-950 to-black' : 'from-indigo-950 to-black'} shadow-inner flex items-center justify-center animate-card-place overflow-hidden transition-all active:scale-95 touch-manipulation relative group`}
                          >
                             <div className={`${isInnerActive ? 'text-cyan-500/50' : 'text-amber-500/50'} text-[7px] md:text-[10px] z-10 font-serif tracking-widest`}>#{idx + 1}</div>
                             <div className={`absolute inset-0 bg-black/0 ${isInnerActive ? 'group-active:bg-cyan-900/30' : 'group-active:bg-amber-900/30'} transition-colors flex items-center justify-center`}>
                                <span className="text-[8px] opacity-0 group-active:opacity-100 text-white">×</span>
                             </div>
                          </button>
                        ))
                     ) : (
                        <div className={`text-sm ${isInnerActive ? 'text-cyan-500/60' : 'text-amber-500/60'} font-serif`}>카드를 선택해주세요</div>
                     )
                  ) : (
                     // 일반 모드: 고정된 슬롯 표시
                     [...Array(getTargetCount())].map((_, slotIdx) => (
                        <div key={slotIdx} className={`shrink-0 w-10 h-14 md:w-16 md:h-24 border border-dashed ${isInnerActive ? 'border-cyan-800/50' : 'border-amber-900/40'} rounded bg-black/20 flex flex-col items-center justify-center relative transition-all duration-300`}>
                           {selectedCards[slotIdx] ? (
                               <div className={`w-full h-full bg-gradient-to-b ${isInnerActive ? 'from-cyan-950 to-black' : 'from-indigo-950 to-black'} rounded shadow-inner flex items-center justify-center animate-card-place overflow-hidden border ${isInnerActive ? 'border-cyan-500/30' : 'border-amber-500/30'}`}>
                                  <div className={`${isInnerActive ? 'text-cyan-500/50' : 'text-amber-500/50'} text-[7px] md:text-[10px] z-10 font-serif tracking-widest`}>CHOSEN</div>
                               </div>
                           ) : (
                               <span className={`${isInnerActive ? 'text-cyan-900/50' : 'text-amber-900/50'} text-sm md:text-xl font-serif`}>
                                   {slotIdx + 1}
                               </span>
                           )}
                        </div>
                     ))
                  )}
               </div>
               
               {/* 카드 보기 버튼 */}
               {(readingType === 'custom' || readingType === 'inneractive') && selectedCards.length > 0 && (
                  <button
                     onClick={viewSelectedCards}
                     className={`px-6 md:px-10 py-2.5 md:py-3 text-sm md:text-base bg-slate-900 border ${isInnerActive ? 'border-cyan-500/50 active:border-cyan-400 md:hover:border-cyan-400 text-cyan-400 active:text-cyan-100 md:hover:text-cyan-100' : 'border-amber-500/50 active:border-amber-400 md:hover:border-amber-400 text-amber-400 active:text-amber-100 md:hover:text-amber-100'} rounded-sm font-serif tracking-widest transition-all transform active:-translate-y-0.5 md:hover:-translate-y-1 touch-manipulation flex items-center gap-2`}
                  >
                     <Sparkles size={16} className="md:w-4 md:h-4" />
                     <span>카드 보기 ({selectedCards.length}장)</span>
                  </button>
               )}
            </div>
            
            {/* Card Container */}
            <div className="flex-1 w-full relative flex items-start justify-center overflow-hidden">
               {readingType === 'inneractive' ? (
                  /* 이너액티브: 1장씩 슬라이드 - 최대 크기 */
                  <div className="w-full h-full flex flex-col items-center justify-center px-2 py-2">
                     <div 
                        className="relative w-full h-full max-h-[80vh]"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                     >
                        {/* 슬라이드 컨테이너 */}
                        <div className="flex items-center justify-center w-full h-full relative">
                           {deck.length > 0 && (
                              <button
                                 key={deck[slideIndex].id}
                                 onClick={() => selectCard(deck[slideIndex])}
                                 disabled={selectedCards.find(c => c.id === deck[slideIndex].id)}
                                 className={`w-full h-full max-w-lg max-h-[70vh] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                                    selectedCards.find(c => c.id === deck[slideIndex].id) 
                                       ? 'opacity-40 scale-90 cursor-not-allowed' 
                                       : 'active:scale-95 md:hover:scale-105 cursor-pointer'
                                 } touch-manipulation border-4 ${isInnerActive ? 'border-cyan-600' : 'border-amber-600'}`}
                              >
                                 <img 
                                    src={deck[slideIndex].image} 
                                    alt={`카드 ${slideIndex + 1}`}
                                    className="w-full h-full object-contain bg-black"
                                 />
                              </button>
                           )}
                        </div>

                        {/* 좌우 네비게이션 버튼 */}
                        <button
                           onClick={prevSlide}
                           className={`absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/60 border-2 ${isInnerActive ? 'border-cyan-500' : 'border-amber-500'} rounded-full flex items-center justify-center ${isInnerActive ? 'text-cyan-400 active:bg-cyan-900/70' : 'text-amber-400 active:bg-amber-900/70'} transition-all touch-manipulation backdrop-blur-md text-2xl md:text-3xl font-bold`}
                        >
                           ‹
                        </button>
                        <button
                           onClick={nextSlide}
                           className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-black/60 border-2 ${isInnerActive ? 'border-cyan-500' : 'border-amber-500'} rounded-full flex items-center justify-center ${isInnerActive ? 'text-cyan-400 active:bg-cyan-900/70' : 'text-amber-400 active:bg-amber-900/70'} transition-all touch-manipulation backdrop-blur-md text-2xl md:text-3xl font-bold`}
                        >
                           ›
                        </button>

                        {/* 슬라이드 인디케이터 */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1">
                           {[...Array(deck.length)].map((_, idx) => (
                              <div 
                                 key={idx}
                                 className={`h-2 rounded-full transition-all ${
                                    idx === slideIndex 
                                       ? (isInnerActive ? 'bg-cyan-400 w-3' : 'bg-amber-400 w-3')
                                       : (isInnerActive ? 'bg-cyan-900/60 w-1.5' : 'bg-amber-900/60 w-1.5')
                                 }`}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               ) : (
                  /* 다른 모드: 그리드 레이아웃 */
                  <div className="flex-1 w-full relative flex items-start justify-center overflow-y-auto overflow-x-hidden">
                     <div className="w-full px-2 md:px-4 py-4">
                        <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-1.5 md:gap-2 max-w-full mx-auto">
                           {selectableDeck.map((card) => (
                             <button
                               key={card.id}
                               onClick={() => selectCard(card)}
                               className={`w-full aspect-[2/3] bg-[#0c0a09] border ${isInnerActive ? 'border-cyan-800' : 'border-[#78350f]'} rounded shadow-lg cursor-pointer overflow-hidden transition-all duration-200 group active:scale-95 md:hover:scale-105 relative touch-manipulation`}
                             >
                                <div className="absolute inset-0 transition-transform duration-200">
                                   {/* Back Design */}
                                   <div className="w-full h-full bg-[#1c1917]" style={{
                                       backgroundImage: `radial-gradient(${isInnerActive ? '#155e75' : '#78350f'} 1px, transparent 1px)`,
                                       backgroundSize: '6px 6px'
                                   }}></div>
                                   <div className={`absolute inset-0.5 border ${isInnerActive ? 'border-cyan-900/50' : 'border-amber-900/50'}`}></div>
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Moon size={10} className={`md:w-4 md:h-4 ${isInnerActive ? 'text-cyan-700/50' : 'text-amber-700/50'}`} />
                                   </div>
                                   <div className={`absolute inset-0 bg-transparent ${isInnerActive ? 'group-active:bg-cyan-500/10 md:group-hover:bg-cyan-500/10' : 'group-active:bg-amber-500/10 md:group-hover:bg-amber-500/10'} transition-colors`}></div>
                                </div>
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>
            
            {readingType !== 'inneractive' && (
               <p className={`text-xs ${isInnerActive ? 'text-cyan-800' : 'text-amber-900'} animate-pulse mt-2 font-serif tracking-[0.2em]`}>
                 {readingType === 'custom' ? '원하는 만큼 카드를 선택하세요' : 'PICK A CARD'}
               </p>
            )}
          </div>
        )}

        {/* Reading (Result) */}
        {gameState === 'reading' && (
          <div className="w-full flex flex-col items-center animate-fade-in pb-8 md:pb-12 overflow-y-auto max-h-[90vh] md:max-h-[85vh] custom-scrollbar">
            <h2 className={`text-lg md:text-2xl font-serif font-light mb-6 md:mb-12 ${themeText} border-b ${isInnerActive ? 'border-cyan-900/50' : 'border-amber-900/50'} pb-2 md:pb-4 w-full text-center tracking-[0.2em] px-4`}>
                {renderTitle()}
            </h2>
            
            {readingType === 'inneractive' ? (
              /* 이너액티브: 이미지 최대 크기로 표시 */
              <div className="w-full max-w-lg px-2 space-y-3 md:space-y-4">
                {selectedCards.map((card, idx) => (
                  <div key={card.id} className="w-full animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-cyan-600/70">
                      <img 
                        src={card.image} 
                        alt={`선택한 카드 ${idx + 1}`}
                        className="w-full h-full object-contain bg-black"
                      />
                      <div className="absolute bottom-3 right-3 bg-black/80 text-cyan-300 text-xs px-2 py-1 rounded font-serif font-bold">
                        #{idx + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 다른 모드: 기존 그리드 레이아웃 */
              <div className={`grid gap-4 md:gap-x-8 md:gap-y-16 w-full px-3 md:px-6 ${
                readingType === 'newyear' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
              }`}>
                {selectedCards.map((card, idx) => (
                  <div key={card.id} className="flex flex-col items-center group mb-4 md:mb-0">
                    {/* Label */}
                    <div className={`text-[10px] md:text-xs lg:text-sm font-serif font-bold mb-2 md:mb-4 tracking-widest uppercase text-center h-5 md:h-6 flex items-end ${themeAccent} px-2`}>
                      {getLabel(idx)}
                    </div>

                    {/* Card Container */}
                    <div 
                      className="relative w-32 h-52 sm:w-40 sm:h-64 md:w-44 md:h-72 lg:w-52 lg:h-80 cursor-pointer perspective-1000 touch-manipulation active:scale-95 md:active:scale-100"
                      onClick={() => handleReveal(idx)}
                    >
                      <div className={`relative w-full h-full transition-all duration-1000 transform-style-3d ${flippedCards[idx] ? 'rotate-y-180' : ''}`}>
                        
                        {/* Back Side */}
                        <div className={`absolute w-full h-full backface-hidden bg-[#0c0a09] border ${isInnerActive ? 'border-cyan-800' : 'border-[#78350f]'} rounded shadow-2xl flex items-center justify-center`}>
                           <div className={`absolute inset-1 md:inset-2 border ${isInnerActive ? 'border-cyan-900/30' : 'border-amber-900/30'}`}></div>
                           <div className="w-full h-full opacity-30" style={{
                               backgroundImage: `radial-gradient(${isInnerActive ? '#0891b2' : '#78350f'} 1px, transparent 1px)`,
                               backgroundSize: '8px 8px'
                           }}></div>
                           <Sparkles className={`${isInnerActive ? 'text-cyan-800/50' : 'text-amber-800/50'} animate-pulse w-6 h-6 md:w-8 md:h-8`} />
                        </div>

                        {/* Front Side */}
                        <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-[#1c1917] border-[2px] md:border-[4px] rounded shadow-2xl overflow-hidden flex flex-col ${
                            (readingType === 'general' && idx === 3) || (readingType === 'newyear' && idx === 12)
                            ? 'border-amber-400'
                            : 'border-[#451a03]'
                        }`}>
                           
                           <div className="flex-1 relative overflow-hidden bg-black">
                              <img 
                                src={card.image} 
                                alt={card.name} 
                                className={`w-full h-full object-cover contrast-125 brightness-90 transition-transform duration-[2s] md:group-hover:scale-110 sepia-[0.4]`}
                              />
                              <div className="absolute inset-0 bg-[#000000] mix-blend-overlay opacity-30 pointer-events-none"></div>
                           </div>

                           <div className={`h-10 md:h-14 bg-[#0f0a05] flex flex-col items-center justify-center border-t-2 border-[#451a03] shrink-0 px-1 md:px-2 text-center relative`}>
                              {card.type === 'major' && (
                                  <span className={`text-[7px] md:text-[9px] font-serif tracking-widest absolute top-0.5 md:top-1 text-amber-700`}>{toRoman(card.number)}</span>
                              )}
                              <span className={`font-serif text-[10px] sm:text-xs md:text-sm lg:text-base tracking-wider break-keep leading-tight mt-0.5 md:mt-1 ${
                                  (readingType === 'general' && idx === 3) || (readingType === 'newyear' && idx === 12)
                                  ? 'text-amber-300 font-bold'
                                  : 'text-[#d6d3d1]'
                              }`}>
                                  {card.nameKo}
                              </span>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Box */}
                    <div className={`mt-4 md:mt-8 text-center transition-all duration-1000 px-2 w-full max-w-full md:max-w-xs transform ${flippedCards[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:translate-y-8 pointer-events-none'}`}>
                       <h3 className={`text-sm md:text-lg font-serif font-bold mb-1 ${themeText}`}>{card.name}</h3>
                       <p className={`text-[9px] md:text-[10px] lg:text-xs mb-2 md:mb-4 tracking-wider text-amber-500/60`}>{card.keywords}</p>
                       <div className={`text-[11px] md:text-xs lg:text-sm leading-relaxed word-keep-all p-3 md:p-4 border relative bg-[#0a0a0a] ${
                           (readingType === 'general' && idx === 3) || (readingType === 'newyear' && idx === 12)
                           ? 'border-amber-500/40 text-amber-50'
                           : 'border-amber-900/20 text-stone-400'
                       }`}>
                         {card.desc}
                       </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* 공유 및 다시하기 버튼 */}
            <div className="mt-8 md:mt-20 flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* 공유하기 버튼 */}
              {!shareUrl ? (
                <button 
                  onClick={handleShare}
                  disabled={isSharing || !flippedCards.every(Boolean)}
                  className={`px-6 md:px-10 py-3 md:py-4 text-sm md:text-base border ${isInnerActive ? 'border-cyan-900/50 active:border-cyan-500 md:hover:border-cyan-500 text-cyan-600 active:text-cyan-100 md:hover:text-cyan-100' : 'border-amber-900/50 active:border-amber-500 md:hover:border-amber-500 text-amber-600 active:text-amber-100 md:hover:text-amber-100'} font-serif tracking-[0.2em] transition-all flex items-center gap-2 md:gap-3 bg-black/50 backdrop-blur-md ${!flippedCards.every(Boolean) || isSharing ? 'opacity-50 cursor-not-allowed' : 'opacity-100'} touch-manipulation`}
                >
                  <Share2 size={14} className="md:w-4 md:h-4" />
                  <span className="whitespace-nowrap">{isSharing ? '생성 중...' : '공유하기'}</span>
                </button>
              ) : (
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className={`px-4 py-2 text-xs md:text-sm ${isInnerActive ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300' : 'bg-amber-950/50 border-amber-500/30 text-amber-300'} border rounded font-mono max-w-xs md:max-w-md overflow-hidden text-ellipsis whitespace-nowrap`}>
                    {shareUrl}
                  </div>
                  <button 
                    onClick={copyShareUrl}
                    className={`px-4 py-2 text-sm border ${isInnerActive ? 'border-cyan-500/50 text-cyan-400 active:bg-cyan-500/10' : 'border-amber-500/50 text-amber-400 active:bg-amber-500/10'} rounded flex items-center gap-2 transition-all touch-manipulation`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? '복사됨!' : '복사'}</span>
                  </button>
                </div>
              )}
              
              {/* 다시하기 버튼 */}
              <button 
                onClick={resetGame}
                className={`px-6 md:px-12 py-3 md:py-4 text-sm md:text-base border ${isInnerActive ? 'border-cyan-900/50 active:border-cyan-500 md:hover:border-cyan-500 text-cyan-600 active:text-cyan-100 md:hover:text-cyan-100' : 'border-amber-900/50 active:border-amber-500 md:hover:border-amber-500 text-amber-600 active:text-amber-100 md:hover:text-amber-100'} font-serif tracking-[0.2em] transition-all flex items-center gap-2 md:gap-3 bg-black/50 backdrop-blur-md ${flippedCards.every(Boolean) ? 'opacity-100' : 'opacity-50'} touch-manipulation`}
              >
                <RefreshCw size={12} className="md:w-3.5 md:h-3.5" />
                <span className="whitespace-nowrap">CONSULT AGAIN</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .word-keep-all { word-break: keep-all; }
        .touch-manipulation { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        
        /* 모바일 터치 최적화 */
        button, [role="button"] {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        /* 모바일에서 텍스트 선택 방지 */
        @media (max-width: 768px) {
          * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
          input, textarea {
            -webkit-user-select: auto;
            user-select: auto;
          }
        }
        
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isInnerActive ? 'rgba(34, 211, 238, 0.8)' : 'rgba(180, 83, 9, 0.8)'};
        }
        
        /* 모바일 스크롤 최적화 */
        @media (max-width: 768px) {
          .custom-scrollbar {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }

        @keyframes shuffleCard {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-20px) rotate(-5deg); }
          75% { transform: translateX(20px) rotate(5deg); }
        }
        @keyframes dealDeck {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardPlace {
          from { transform: scale(1.2); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-card-place {
          animation: cardPlace 0.3s ease-out forwards;
        }

        @media (min-width: 768px) {
           button[style*="transformOrigin"] {
              transform-origin: 50% 1200px !important; 
              bottom: 350px !important; 
              margin-left: -40px !important; 
           }
        }
      `}</style>
    </div>
  );
}

