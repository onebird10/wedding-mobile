import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, MessageCircle, ChevronDown, ChevronUp, Share2, Camera, TrainFront, BusFront, Map, Car } from 'lucide-react';

// --- 스크롤 애니메이션 컴포넌트 ---
const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1 });

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1200ms] ease-out w-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- 커스텀 폰트 및 글로벌 스타일 설정 ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap');
  
  body {
    background-color: #ffffff;
    font-family: 'Noto Serif KR', serif;
    color: #1a1a1a;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  .font-cinzel {
    font-family: 'Cinzel', serif;
  }

  /* 하트 라인 드로잉 애니메이션 (무한 루프 및 페이드아웃) */
  .draw-heart {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 7s ease-in-out infinite;
  }

  @keyframes drawLine {
    0% { stroke-dashoffset: 1000; opacity: 0; }
    10% { opacity: 1; }
    60% { stroke-dashoffset: 0; }
    85% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isGroomOpen, setIsGroomOpen] = useState(false);
  const [isBrideOpen, setIsBrideOpen] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);
  
  // 스냅 사진 업로드 진행 상태
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // 카카오 SDK 로드 및 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('4d5ada06292a46a5fb9c5daacc4c8eac'); // 1단계에서 복사한 키
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 글로벌 스타일 주입 및 D-day 계산
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = globalStyles;
    document.head.appendChild(style);

    const calculateDday = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weddingDate = new Date(2026, 10, 22); // 2026년 11월 22일 (월은 0부터 시작하므로 10)
      const diff = weddingDate.getTime() - today.getTime();
      setDaysLeft(Math.floor(diff / (1000 * 60 * 60 * 24)));
    };

    calculateDday();
    const timer = setInterval(calculateDday, 1000 * 60 * 60); // 1시간마다 갱신

    return () => {
      document.head.removeChild(style);
      clearInterval(timer);
    };
  }, []);

  const copyToClipboard = (text, type = '정보') => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setToastMessage(`${type}가 복사되었습니다.`);
      setTimeout(() => setToastMessage(''), 2000);
    } catch (err) {
      setToastMessage('복사에 실패했습니다.');
    }
    document.body.removeChild(textarea);
  };

  // Base64 변환 헬퍼
  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  // 사진 업로드 핸들러 (구글 드라이브 순차 업로드)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    const oversizedFiles = files.filter(f => f.size > MAX_SIZE);
    
    if (oversizedFiles.length > 0) {
      setToastMessage('20MB 이하의 파일만 업로드 가능합니다.');
      setTimeout(() => setToastMessage(''), 3000);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`${i + 1} / ${files.length}장 업로드 중...`);

      try {
        const base64Data = await getBase64(file);
        const payload = {
          filename: `snap_${Date.now()}_${file.name}`,
          mimeType: file.type,
          base64: base64Data
        };

        const response = await fetch('https://script.google.com/macros/s/AKfycbwaLrHfTGng473sAnwTaskuR-SLFqI-u-z0BJdaUVpu5Q6TkhBcVjwp0uaF3Fp7CslGlA/exec', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        
        const result = await response.json();
        if (result.status === 'success') successCount++;
      } catch (error) {
        console.error('Upload Error:', error);
      }
    }

    setIsUploading(false);
    setUploadProgress('');
    setToastMessage(successCount > 0 ? `${successCount}장의 사진이 보관되었습니다!` : '업로드에 실패했습니다.');
    setTimeout(() => setToastMessage(''), 4000);
    e.target.value = '';
  };

  // 카카오톡 공유 함수
  const shareToKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      setToastMessage('카카오톡 기능을 불러오고 있거나, API 키가 입력되지 않았습니다.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '임한새 ❤️ 권세영 결혼합니다',
        description: '11월 22일 일요일 오후 3시, 루이비스 강서',
        imageUrl: 'https://hsy-wedding.vercel.app/images/main.webp', 
        link: {
          mobileWebUrl: 'https://hsy-wedding.vercel.app',
          webUrl: 'https://hsy-wedding.vercel.app',
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: 'https://hsy-wedding.vercel.app',
            webUrl: 'https://hsy-wedding.vercel.app',
          },
        },
        {
          title: '위치 보기',
          link: {
            // 네이버 지도 길찾기 URL을 여기에 넣으면 바로 연결됩니다.
            mobileWebUrl: 'https://map.naver.com/p/directions/-/-/14120448.97,37.560126,루이비스%20강서,34947704,PLACE_ID/-/pubtrans',
            webUrl: 'https://map.naver.com/p/directions/-/-/14120448.97,37.560126,루이비스%20강서,34947704,PLACE_ID/-/pubtrans',
          },
        },
      ],
    });
  };

  const weddingInfo = {
    groom: '임한새', bride: '권세영',
    groomEng: 'HANSE', brideEng: 'SEYOUNG',
    groomPhone: '010-1234-5678', bridePhone: '010-8765-4321',
    groomFather: '임형규', groomMother: '김현옥',
    brideFather: '권오성', brideMother: '한예섭',
    date: '2026년 11월 22일 일요일 낮 3시', dateEng: '22 Nov 2026',
    year: 2026, month: 11, day: 22,
    location: '루이비스 강서', address: '서울특별시 강서구 양천로 476',
    mainImage: '/images/main.webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617332386983-0599a08e1f5f?auto=format&fit=crop&q=80&w=600'
    ]
  };

  const visibleGallery = showAllGallery ? weddingInfo.galleryImages : weddingInfo.galleryImages.slice(0, 4);

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl relative overflow-hidden bg-white text-gray-900 pb-0">
      
      {/* 0. 메인 커버 */}
      <section className="pt-20 px-6 pb-24 flex flex-col items-center text-center bg-white border-b border-gray-100">
        <FadeInSection>
          <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-8 font-sans">Wedding Invitation</p>
          <h1 className="font-cinzel text-4xl tracking-widest text-black mb-14 leading-tight">
            {weddingInfo.groomEng}<br /><span className="text-xl font-light italic text-gray-400 font-serif block my-2">&amp;</span>{weddingInfo.brideEng}
          </h1>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="w-full aspect-[3/4] mb-14 overflow-hidden bg-gray-100 relative shadow-sm">
            <img src={weddingInfo.mainImage} alt="Cover" className="w-full h-full object-cover grayscale-[10%]" />
          </div>
        </FadeInSection>

        <FadeInSection delay={400}>
          <p className="font-cinzel text-[13px] tracking-[0.3em] text-black uppercase mb-4">{weddingInfo.dateEng}</p>
          <p className="text-[14px] text-gray-500 tracking-[0.2em] font-light">{weddingInfo.location}</p>
        </FadeInSection>
      </section>

      {/* 1. 초대 인사말 (하트 애니메이션 포함) */}
      <section className="px-8 py-32 text-center bg-white">
        <FadeInSection>
          <svg viewBox="0 0 400 150" className="w-full max-w-[280px] h-auto mb-6 text-black mx-auto overflow-visible -mt-28">
            <path 
              className="draw-heart"
              d="M 10 90 C 60 90, 120 65, 170 75 C 185 80, 190 100, 175 105 C 160 110, 150 85, 165 70 C 170 60, 175 35, 150 40 C 120 45, 130 90, 180 125 C 230 90, 240 45, 210 40 C 185 35, 175 65, 190 80 C 200 90, 215 105, 235 90 C 270 75, 330 70, 390 90" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              pathLength="1000"
            />
          </svg>
          <h2 className="font-cinzel text-xs tracking-[0.4em] mb-12 text-gray-400 uppercase">Invitation</h2>
          <div className="space-y-8 text-[15px] font-light leading-loose tracking-wide text-gray-800">
            <p>함께 있을 때 가장 나다운 모습이 되고,<br/>서로의 내일을 기대하게 만드는 사람을 만났습니다.</p>
            <p>저희 두 사람의 새로운 시작을<br/>가까이서 축복해 주시면 감사하겠습니다.</p>
            <p>따뜻한 마음으로 지켜봐 주시기 바랍니다.</p>
          </div>
        </FadeInSection>
      </section>

      {/* 2. 연락하기 */}
      <section className="px-8 py-24 bg-[#FAFAFA] border-y border-gray-100">
        <FadeInSection>
          <div className="flex flex-col items-center gap-8 mb-14">
            <div className="flex items-center justify-center w-full gap-6">
              <span className="text-[14px] text-gray-500 font-light">{weddingInfo.groomFather} · {weddingInfo.groomMother} 의 아들</span>
              <span className="text-[18px] tracking-widest font-normal">{weddingInfo.groom}</span>
            </div>
            <div className="flex items-center justify-center w-full gap-6">
              <span className="text-[14px] text-gray-500 font-light">{weddingInfo.brideFather} · {weddingInfo.brideMother} 의 딸</span>
              <span className="text-[18px] tracking-widest font-normal">{weddingInfo.bride}</span>
            </div>
          </div>
          <div className="flex justify-center gap-3 mb-10">
            <div className="flex bg-white border border-gray-200 p-1 shadow-sm">
              <span className="px-5 py-3 text-[13px] font-medium text-gray-600 border-r border-gray-100">신랑</span>
              <a href={`tel:${weddingInfo.groomPhone}`} className="px-4 py-3 text-gray-400 hover:text-black"><Phone size={16}/></a>
              <a href={`sms:${weddingInfo.groomPhone}`} className="px-4 py-3 text-gray-400 hover:text-black"><MessageCircle size={16}/></a>
            </div>
            <div className="flex bg-white border border-gray-200 p-1 shadow-sm">
              <span className="px-5 py-3 text-[13px] font-medium text-gray-600 border-r border-gray-100">신부</span>
              <a href={`tel:${weddingInfo.bridePhone}`} className="px-4 py-3 text-gray-400 hover:text-black"><Phone size={16}/></a>
              <a href={`sms:${weddingInfo.bridePhone}`} className="px-4 py-3 text-gray-400 hover:text-black"><MessageCircle size={16}/></a>
            </div>
          </div>
          <button onClick={() => setIsContactOpen(!isContactOpen)} className="w-full py-5 bg-white border border-gray-200 text-[13px] text-black font-medium uppercase shadow-sm flex items-center justify-center gap-2">
            혼주에게 연락하기 {isContactOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {isContactOpen && (
            <div className="mt-4 p-6 bg-white border border-gray-100 space-y-6">
              <div className="flex justify-between items-center text-[14px] text-gray-500">
                <span>신랑측 부모님</span>
                <div className="flex gap-4"><Phone size={16} className="text-gray-300 hover:text-black"/><MessageCircle size={16} className="text-gray-300 hover:text-black"/></div>
              </div>
              <div className="flex justify-between items-center text-[14px] text-gray-500">
                <span>신부측 부모님</span>
                <div className="flex gap-4"><Phone size={16} className="text-gray-300 hover:text-black"/><MessageCircle size={16} className="text-gray-300 hover:text-black"/></div>
              </div>
            </div>
          )}
        </FadeInSection>
      </section>

      {/* 3. 달력 및 디데이 */}
      <section className="py-32 px-6 bg-white text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">The Date</h2>
          <p className="text-[16px] text-black mb-12 tracking-widest">{weddingInfo.date}</p>
          <div className="w-full max-w-[300px] mx-auto py-10 border-y border-gray-100 mb-10">
             <div className="grid grid-cols-7 gap-y-6 text-sm font-light">
               {['S','M','T','W','T','F','S'].map((d, idx) => <div key={`h-${idx}`} className="text-[10px] text-gray-400">{d}</div>)}
               {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                 <div key={`d-${day}`} className={`relative flex justify-center items-center h-6 ${day === 22 ? 'text-white font-medium' : ''}`}>
                   {day === 22 && <div className="absolute w-7 h-7 bg-black rounded-full -z-10"></div>}
                   {day}
                 </div>
               ))}
             </div>
          </div>
          <div className="mt-8">
            {daysLeft !== null && (
              <p className="text-[14px] text-gray-800 tracking-widest font-light">
                {daysLeft === 0 ? (
                  <span>한새 <span className="text-red-400 text-[10px] mx-1">♥</span> 세영 결혼식이 오늘입니다</span>
                ) : daysLeft > 0 ? (
                  <span>한새 <span className="text-red-400 text-[10px] mx-1">♥</span> 세영 결혼식까지 <span className="font-cinzel text-lg mx-1 font-medium">{daysLeft}</span>일</span>
                ) : (
                  <span>한새 <span className="text-red-400 text-[10px] mx-1">♥</span> 세영 부부가 된 지 <span className="font-cinzel text-lg mx-1 font-medium">{Math.abs(daysLeft)}</span>일</span>
                )}
              </p>
            )}
          </div>
        </FadeInSection>
      </section>

      {/* 4. 장소 안내 */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100 text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-14 uppercase">Location</h2>
          <p className="font-normal text-[18px] text-black mb-3 tracking-widest">{weddingInfo.location}</p>
          <p className="text-[14px] text-gray-500 font-light mb-12">{weddingInfo.address}</p>
          <div className="w-full h-64 bg-gray-200 grayscale flex items-center justify-center mb-8">
            <MapPin size={24} className="text-gray-400 mb-2" /><span className="text-xs text-gray-400 ml-2">네이버 지도 영역</span>
          </div>
          <div className="grid grid-cols-3 border border-gray-200 bg-white mb-16">
            <button className="py-4 text-[11px] border-r border-gray-100 flex flex-col items-center gap-1 hover:bg-gray-50"><Map size={14}/>네이버</button>
            <button className="py-4 text-[11px] border-r border-gray-100 flex flex-col items-center gap-1 hover:bg-gray-50"><MapPin size={14}/>카카오</button>
            <button className="py-4 text-[11px] flex flex-col items-center gap-1 hover:bg-gray-50"><Car size={14}/>티맵</button>
          </div>
          
          <div className="text-left space-y-10 px-4">
            <div className="flex gap-4">
              <TrainFront size={20} className="text-gray-300" />
              <div><h4 className="text-[14px] font-medium mb-1">지하철</h4><p className="text-[13px] text-gray-500 leading-relaxed font-light">강남역 1번 출구 (도보 5분)</p></div>
            </div>
            <div className="flex gap-4">
              <BusFront size={20} className="text-gray-300" />
              <div><h4 className="text-[14px] font-medium mb-1">버스</h4><p className="text-[13px] text-gray-500 leading-relaxed font-light">간선: 146, 341, 360 / 지선: 4412</p></div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 5. 갤러리 */}
      <section className="py-32 px-5 bg-white border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs text-center tracking-[0.4em] text-gray-400 mb-14 uppercase">Gallery</h2>
          <div className="grid grid-cols-2 gap-1 mb-8">
            <div className="col-span-2 aspect-[4/5] overflow-hidden bg-gray-100"><img src={visibleGallery[0]} alt="Gallery 1" className="w-full h-full object-cover" /></div>
            {visibleGallery.slice(1).map((img, i) => (
              <div key={`gal-${i}`} className="aspect-[3/4] overflow-hidden bg-gray-100"><img src={img} alt={`Gallery ${i+2}`} className="w-full h-full object-cover" /></div>
            ))}
          </div>
          {!showAllGallery && (
            <button onClick={() => setShowAllGallery(true)} className="w-full py-4 border border-gray-200 text-[12px] text-gray-500 uppercase flex items-center justify-center gap-2 tracking-widest hover:bg-gray-50">View More <ChevronDown size={14}/></button>
          )}
        </FadeInSection>
      </section>

      {/* 6. 계좌번호 */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100 text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">For Your Heart</h2>
          <p className="text-[14px] text-gray-500 mb-14 font-light leading-loose text-center">참석이 어려우신 분들을 위해<br/>계좌번호를 기재하였습니다.</p>
          <div className="space-y-3">
            <button onClick={() => setIsGroomOpen(!isGroomOpen)} className="w-full py-5 bg-white border border-gray-200 text-[14px] flex justify-between px-6 items-center">
              <span>신랑측 마음 전하실 곳</span>{isGroomOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {isGroomOpen && <div className="p-6 bg-white border-x border-b border-gray-100 text-[13px] text-left">국민 123456-01-123456 (임한새)</div>}
            
            <button onClick={() => setIsBrideOpen(!isBrideOpen)} className="w-full py-5 bg-white border border-gray-200 text-[14px] flex justify-between px-6 items-center">
              <span>신부측 마음 전하실 곳</span>{isBrideOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {isBrideOpen && <div className="p-6 bg-white border-x border-b border-gray-100 text-[13px] text-left">신한 110-123-456789 (권세영)</div>}
          </div>
        </FadeInSection>
      </section>

      {/* 7. 하객 스냅 사진 업로드 */}
      <section className="py-32 px-6 bg-white border-t border-gray-100 text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">Guest Snap</h2>
          <p className="text-[14px] text-gray-500 mb-12 font-light">행복한 순간을 사진과 영상으로 남겨주세요.</p>
          <label className={`cursor-pointer inline-flex flex-col items-center justify-center w-full max-w-[280px] h-40 border-2 border-dashed ${isUploading ? 'border-black bg-gray-50' : 'border-gray-300 bg-[#FAFAFA] hover:bg-gray-50'} transition-colors`}>
            {isUploading ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-[13px] font-medium">{uploadProgress}</span>
                <span className="text-[10px] text-gray-400 mt-2">창을 닫지 말고 잠시 기다려주세요</span>
              </div>
            ) : (
              <>
                <Camera size={28} className="text-gray-300 mb-3" />
                <span className="text-[12px] text-gray-400 uppercase tracking-widest">Upload Photo & Video</span>
                <span className="text-[10px] text-gray-400 mt-2 font-sans">(최대 20MB 제한)</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*, video/*" multiple onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </FadeInSection>
      </section>

      {/* 8. RSVP 및 공유 */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100 text-center">
        <FadeInSection>
          <button onClick={() => setIsRsvpOpen(true)} className="w-full max-w-[280px] py-5 bg-black text-white text-[14px] tracking-widest uppercase mb-20 shadow-lg hover:bg-gray-900 transition-colors">RSVP</button>
          <div className="flex flex-col gap-4 items-center">
            <button onClick={shareToKakao} className="flex items-center gap-2 px-10 py-4 bg-[#fae100] text-[#371d1e] text-[13px] font-medium w-full max-w-[280px] justify-center hover:bg-[#f4dc00] transition-colors"><MessageCircle size={16} fill="#371d1e"/> 카카오톡으로 공유하기</button>
            <button onClick={() => copyToClipboard('URL', '링크')} className="flex items-center gap-2 px-10 py-4 bg-white border border-gray-200 text-black text-[13px] font-medium w-full max-w-[280px] justify-center hover:bg-gray-50 transition-colors"><Share2 size={16}/> 링크 복사</button>
          </div>
        </FadeInSection>
      </section>

      <div className="py-20 text-center bg-[#FAFAFA] font-cinzel text-[10px] text-gray-300 tracking-[0.5em] uppercase">Hanse & Seyoung</div>

      {/* RSVP 모달 */}
      {isRsvpOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-10 shadow-2xl animate-fade-in">
            <h3 className="text-[18px] font-medium text-center mb-10 tracking-widest font-cinzel uppercase">RSVP</h3>
            <div className="space-y-6 mb-12">
              <input type="text" placeholder="성함" className="w-full px-4 py-4 bg-[#FAFAFA] border border-gray-200 text-[14px] outline-none focus:border-black transition-colors" />
              <select className="w-full px-4 py-4 bg-[#FAFAFA] border border-gray-200 text-[14px] outline-none text-gray-500 focus:border-black transition-colors">
                <option>참석 인원</option><option>1명</option><option>2명</option><option>3명 이상</option><option>불참</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsRsvpOpen(false)} className="flex-1 py-4 bg-gray-100 text-[13px] uppercase hover:bg-gray-200 transition-colors">Close</button>
              <button onClick={() => { setIsRsvpOpen(false); setToastMessage('의사가 전달되었습니다.'); setTimeout(()=>setToastMessage(''), 2000); }} className="flex-1 py-4 bg-black text-white text-[13px] uppercase hover:bg-gray-800 transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 text-[13px] z-[60] shadow-2xl tracking-wide w-max max-w-[90%] text-center">{toastMessage}</div>
      )}
    </div>
  );
}