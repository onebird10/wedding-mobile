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

  /* 하트 라인 드로잉 애니메이션 */
  .draw-heart {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    /* 선이 길어진 만큼 속도를 7초로 조금 더 천천히, 무한 반복 설정 */
    animation: drawLine 7s ease-in-out infinite;
  }

  @keyframes drawLine {
    0% { stroke-dashoffset: 1000; opacity: 0; }
    10% { opacity: 1; }
    60% { stroke-dashoffset: 0; }
    85% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; } /* 부드럽게 사라진 후 다시 시작 */
  }
`;

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isGroomOpen, setIsGroomOpen] = useState(false);
  const [isBrideOpen, setIsBrideOpen] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 글로벌 스타일 주입 및 실시간 카운트다운 계산
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = globalStyles;
    document.head.appendChild(style);

    const timer = setInterval(() => {
      const weddingDate = new Date("2026-11-22T15:00:00").getTime();
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

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

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setToastMessage('소중한 사진이 업로드 되었습니다. 감사합니다!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // --- 웨딩 데이터 ---
  const weddingInfo = {
    groom: '임한새', bride: '권세영',
    groomEng: 'HANSE', brideEng: 'SEYOUNG',
    groomPhone: '010-1234-5678', bridePhone: '010-8765-4321',
    groomFather: '임형규', groomMother: '김현옥',
    brideFather: '권오성', brideMother: '한예섭',
    date: '2026년 11월 22일 일요일 낮 3시',
    dateEng: '22 Nov 2026',
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

      {/* 1. 초대 인사말 */}
      <section className="px-8 py-32 text-center bg-white">
        <FadeInSection>
          {/* 시작선과 끝선을 시원하게 연장한 하트 (타이틀 위치를 고정하기 위해 음수 마진 적용) */}
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
        </FadeInSection>

        <FadeInSection delay={200}>
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
        </FadeInSection>

        <FadeInSection delay={400}>
          <button onClick={() => setIsContactOpen(!isContactOpen)} className="w-full py-5 bg-white border border-gray-200 text-[13px] text-black tracking-wide font-medium uppercase shadow-sm flex items-center justify-center gap-2">
            혼주에게 연락하기
            {isContactOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {isContactOpen && (
            <div className="mt-4 p-6 bg-white border border-gray-100 space-y-6">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500">신랑측 부모님</span>
                <div className="flex gap-4"><Phone size={16} className="text-gray-300"/><MessageCircle size={16} className="text-gray-300"/></div>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500">신부측 부모님</span>
                <div className="flex gap-4"><Phone size={16} className="text-gray-300"/><MessageCircle size={16} className="text-gray-300"/></div>
              </div>
            </div>
          )}
        </FadeInSection>
      </section>

      {/* 3. 달력 및 디데이 카운터 */}
      <section className="py-32 px-6 bg-white text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">The Date</h2>
          <p className="text-[16px] text-black mb-12 tracking-widest">{weddingInfo.date}</p>
          <div className="w-full max-w-[300px] mx-auto py-10 border-y border-gray-100 mb-14">
             <div className="grid grid-cols-7 gap-y-6 text-sm font-light">
               {['S','M','T','W','T','F','S'].map((dayName, idx) => (
                 <div key={`header-${idx}`} className="text-[10px] text-gray-400 uppercase">{dayName}</div>
               ))}
               {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                 <div key={`day-${day}`} className={`relative flex justify-center items-center h-6 ${day === 22 ? 'text-white font-medium' : ''}`}>
                   {day === 22 && <div className="absolute w-7 h-7 bg-black rounded-full -z-10"></div>}
                   {day}
                 </div>
               ))}
             </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[11px] text-gray-400 tracking-widest uppercase">Wedding Countdown</p>
            <div className="flex justify-center items-center gap-5">
              {[
                { v: timeLeft.days, l: 'Days' },
                { v: timeLeft.hours, l: 'Hours' },
                { v: timeLeft.minutes, l: 'Mins' },
                { v: timeLeft.seconds, l: 'Secs' }
              ].map((t, idx) => (
                <div key={`timer-${idx}`} className="flex flex-col items-center">
                  <span className="text-2xl font-cinzel text-black">{String(t.v).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 uppercase mt-1">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 4, 5, 6. 지도 및 교통안내 */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100 text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-14 uppercase">Location</h2>
          <p className="font-normal text-[18px] text-black mb-3 tracking-widest">{weddingInfo.location}</p>
          <p className="text-[14px] text-gray-500 font-light mb-12">{weddingInfo.address}</p>
          
          <div className="w-full h-64 bg-gray-200 grayscale flex items-center justify-center mb-8">
            <MapPin size={24} className="text-gray-400 mb-2" />
            <span className="text-xs text-gray-400">네이버 지도 영역</span>
          </div>

          <div className="grid grid-cols-3 border border-gray-200 bg-white mb-16">
            <button className="py-4 text-[11px] border-r border-gray-100 flex flex-col items-center gap-1"><Map size={14}/>네이버</button>
            <button className="py-4 text-[11px] border-r border-gray-100 flex flex-col items-center gap-1"><MapPin size={14}/>카카오</button>
            <button className="py-4 text-[11px] flex flex-col items-center gap-1"><Car size={14}/>티맵</button>
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

      {/* 7. 웨딩 갤러리 */}
      <section className="py-32 px-5 bg-white border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs text-center tracking-[0.4em] text-gray-400 mb-14 uppercase">Gallery</h2>
          <div className="grid grid-cols-2 gap-1 mb-8">
            <div className="col-span-2 aspect-[4/5] overflow-hidden bg-gray-100 mb-0.5">
              <img src={visibleGallery[0]} alt="G1" className="w-full h-full object-cover grayscale-[5%]" />
            </div>
            {visibleGallery.slice(1).map((img, idx) => (
              <div key={`gallery-img-${idx}`} className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img src={img} alt="Wedding Moment" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {!showAllGallery && (
            <button onClick={() => setShowAllGallery(true)} className="w-full py-4 border border-gray-200 text-[12px] text-gray-500 tracking-widest uppercase flex items-center justify-center gap-2">
              View More <ChevronDown size={14}/>
            </button>
          )}
        </FadeInSection>
      </section>

      {/* 8. 축의금 안내 */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100 text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">For Your Heart</h2>
          <p className="text-[14px] text-gray-500 mb-14 font-light leading-loose">참석이 어려우신 분들을 위해<br/>계좌번호를 기재하였습니다.</p>
          
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

      {/* 9. 하객 스냅 사진 업로드 */}
      <section className="py-32 px-6 bg-white border-t border-gray-100 text-center">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">Guest Snap</h2>
          <p className="text-[14px] text-gray-500 mb-12 font-light">행복한 순간을 사진으로 남겨주세요.</p>
          <label className="cursor-pointer inline-flex flex-col items-center justify-center w-full max-w-[280px] h-40 border-2 border-dashed border-gray-300 bg-[#FAFAFA] hover:bg-gray-50 transition-colors">
            <Camera size={28} className="text-gray-300 mb-3" />
            <span className="text-[12px] text-gray-400 uppercase tracking-widest">Upload Photo</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </FadeInSection>
      </section>

      {/* 10. 초대장 공유 & RSVP */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100 text-center">
        <FadeInSection>
          <button onClick={() => setIsRsvpOpen(true)} className="w-full max-w-[280px] py-5 bg-black text-white text-[14px] tracking-widest uppercase mb-20 shadow-lg">RSVP</button>
          <div className="flex flex-col gap-4 items-center">
            <button onClick={() => copyToClipboard('청첩장 링크', '링크')} className="flex items-center gap-2 px-10 py-4 bg-[#fae100] text-[#371d1e] text-[13px] font-medium w-full max-w-[280px] justify-center"><MessageCircle size={16} fill="#371d1e"/> 카카오톡 공유</button>
            <button onClick={() => copyToClipboard('URL', '링크')} className="flex items-center gap-2 px-10 py-4 bg-white border border-gray-200 text-black text-[13px] font-medium w-full max-w-[280px] justify-center"><Share2 size={16}/> 링크 복사</button>
          </div>
        </FadeInSection>
      </section>

      <div className="py-20 text-center bg-[#FAFAFA] font-cinzel text-[10px] text-gray-300 tracking-[0.5em] uppercase">Hanse & Seyoung</div>

      {/* RSVP 모달 */}
      {isRsvpOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5 backdrop-blur-sm fade-in">
          <div className="bg-white w-full max-w-sm p-10 shadow-2xl">
            <h3 className="text-[18px] font-medium text-center mb-10 tracking-widest font-cinzel uppercase">RSVP</h3>
            <div className="space-y-6 mb-12">
              <input type="text" placeholder="성함" className="w-full px-4 py-4 bg-[#FAFAFA] border border-gray-200 text-[14px] outline-none" />
              <select className="w-full px-4 py-4 bg-[#FAFAFA] border border-gray-200 text-[14px] outline-none text-gray-500">
                <option>참석 인원</option>
                <option>1명</option><option>2명</option><option>3명 이상</option><option>불참</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsRsvpOpen(false)} className="flex-1 py-4 bg-gray-100 text-[13px] uppercase tracking-widest">Close</button>
              <button onClick={() => { setIsRsvpOpen(false); setToastMessage('의사가 전달되었습니다.'); setTimeout(() => setToastMessage(''), 2500); }} className="flex-1 py-4 bg-black text-white text-[13px] uppercase tracking-widest">Submit</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 text-[13px] z-[60] shadow-2xl fade-in tracking-wide">{toastMessage}</div>
      )}
    </div>
  );
}