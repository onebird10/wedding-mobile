import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, ChevronDown, ChevronUp, Share2, Camera, TrainFront, BusFront, Map, Car } from 'lucide-react';

// --- 스크롤 애니메이션 컴포넌트 ---
// 화면에 요소가 보일 때 스르륵 나타나게 해주는 래퍼(Wrapper) 컴포넌트입니다.
const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // 화면에 10% 이상 보이면 애니메이션 트리거
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current); // 한 번 보이면 계속 유지
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
    background-color: #ffffff; /* 뉴욕 테마: 순백색 */
    font-family: 'Noto Serif KR', serif;
    color: #1a1a1a; /* 시크한 차콜 블랙 */
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  .font-cinzel {
    font-family: 'Cinzel', serif;
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

  // 글로벌 스타일 주입 및 실시간 D-Day 계산
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

  const copyToClipboard = (text, type = '계좌번호') => {
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

  // --- 데이터 설정 영역 ---
  const weddingInfo = {
    groom: '임한새', bride: '권세영',
    groomEng: 'HANSE', brideEng: 'SEYOUNG',
    groomPhone: '010-1234-5678', bridePhone: '010-8765-4321',
    groomFather: '임성민', groomFatherPhone: '010-0000-0000', groomMother: '김지연', groomMotherPhone: '010-0000-0000',
    brideFather: '권오성', brideFatherPhone: '010-0000-0000', brideMother: '이수진', brideMotherPhone: '010-0000-0000',
    date: '2026년 11월 22일 일요일 낮 3시', dateEng: '22 Nov 2026',
    year: 2026, month: 11, day: 22,
    location: '루이비스 강서', address: '서울특별시 강서구 양천로 476',
    lat: 37.560126, lng: 126.840608,
    mainImage: '/images/main.jpg',
    galleryImages: [
      '/images/main.webp',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617332386983-0599a08e1f5f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1505934333218-8fe21ff88c6f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600'
    ]
  };

  // 11월 달력 생성
  const renderCalendar = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);
    return (
      <div className="w-full max-w-[300px] mx-auto mt-12 py-8 border-y border-gray-200">
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-sans text-gray-400 mb-6 tracking-widest uppercase">
          {days.map((day, i) => <div key={i} className={i === 0 ? 'text-gray-900 font-medium' : ''}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-6 text-center text-sm font-light">
          {dates.map((date) => (
            <div key={date} className="relative flex justify-center items-center h-6">
              <span className={`z-10 ${date === weddingInfo.day ? 'text-white font-medium' : 'text-gray-800'}`}>
                {date}
              </span>
              {date === weddingInfo.day && (
                <div className="absolute w-7 h-7 bg-black rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 네이버 지도 API 로드
  useEffect(() => {
    const clientId = 'YOUR_CLIENT_ID'; 
    if (clientId !== 'YOUR_CLIENT_ID') {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
      script.async = true;
      script.onload = () => {
        if (window.naver && window.naver.maps) {
          const location = new window.naver.maps.LatLng(weddingInfo.lat, weddingInfo.lng);
          const map = new window.naver.maps.Map('naver-map', { center: location, zoom: 15 });
          new window.naver.maps.Marker({ position: location, map: map });
        }
      };
      document.head.appendChild(script);
    }
  }, [weddingInfo.lat, weddingInfo.lng]);

  const visibleGallery = showAllGallery ? weddingInfo.galleryImages : weddingInfo.galleryImages.slice(0, 4);

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl relative overflow-hidden bg-white text-gray-900 pb-0">
      
      {/* ==========================================
          0. 메인 커버 섹션 (접속하자마자 애니메이션)
      ========================================== */}
      <section className="pt-20 px-6 pb-24 flex flex-col items-center text-center bg-white border-b border-gray-100">
        <FadeInSection>
          <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-8 font-sans">Wedding Invitation</p>
          <h1 className="font-cinzel text-4xl tracking-widest text-black mb-14 leading-tight">
            {weddingInfo.groomEng}
            <br />
            <span className="text-xl font-light italic text-gray-400 font-serif my-2 block">&amp;</span>
            {weddingInfo.brideEng}
          </h1>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="w-full aspect-[3/4] mb-14 overflow-hidden bg-gray-100 relative group">
            <img src={weddingInfo.mainImage} alt="Main Wedding" className="w-full h-full object-cover grayscale-[15%] transition-transform duration-700" />
          </div>
        </FadeInSection>

        <FadeInSection delay={400}>
          <p className="font-cinzel text-[13px] tracking-[0.3em] text-black uppercase mb-4">{weddingInfo.dateEng}</p>
          <p className="text-[14px] text-gray-500 tracking-[0.2em] font-light">{weddingInfo.location}</p>
        </FadeInSection>
      </section>

      {/* ==========================================
          1. 초대 인사말 (모시는 글)
      ========================================== */}
      <section className="px-8 py-32 text-center bg-white">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] mb-12 text-gray-400 uppercase">Invitation</h2>
        </FadeInSection>
        <FadeInSection delay={200}>
          <div className="space-y-8 text-[15px] font-light leading-loose tracking-wide text-gray-800">
            <p>함께 있을 때 가장 나다운 모습이 되고,<br/>서로의 내일을 기대하게 만드는 사람을 만났습니다.</p>
            <p>저희 두 사람의 새로운 시작을<br/>가까이서 축복해 주시면 감사하겠습니다.</p>
            <p>따뜻한 마음으로 지켜봐 주시기 바랍니다.</p>
          </div>
        </FadeInSection>
      </section>

      {/* ==========================================
          2. 연락하기 (신랑신부 및 혼주 연락처)
      ========================================== */}
      <section className="px-8 py-24 bg-[#FAFAFA] border-y border-gray-100">
        <FadeInSection>
          <div className="flex flex-col items-center gap-8 font-medium mb-14">
            <div className="flex items-center justify-center w-full gap-6">
              <span className="text-[14px] text-gray-500 font-light tracking-wide">{weddingInfo.groomFather} · {weddingInfo.groomMother} 의 아들</span>
              <span className="text-[18px] tracking-widest font-normal">{weddingInfo.groom}</span>
            </div>
            <div className="flex items-center justify-center w-full gap-6">
              <span className="text-[14px] text-gray-500 font-light tracking-wide">{weddingInfo.brideFather} · {weddingInfo.brideMother} 의 딸</span>
              <span className="text-[18px] tracking-widest font-normal">{weddingInfo.bride}</span>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="flex justify-center gap-3 mb-12">
            <div className="flex bg-white border border-gray-200 shadow-sm">
              <span className="px-5 py-3 text-[13px] font-medium text-gray-600 border-r border-gray-100 flex items-center">신랑에게</span>
              <a href={`tel:${weddingInfo.groomPhone}`} className="px-4 py-3 text-gray-400 hover:text-black transition-colors"><Phone size={16}/></a>
              <a href={`sms:${weddingInfo.groomPhone}`} className="px-4 py-3 text-gray-400 hover:text-black transition-colors"><MessageCircle size={16}/></a>
            </div>
            <div className="flex bg-white border border-gray-200 shadow-sm">
              <span className="px-5 py-3 text-[13px] font-medium text-gray-600 border-r border-gray-100 flex items-center">신부에게</span>
              <a href={`tel:${weddingInfo.bridePhone}`} className="px-4 py-3 text-gray-400 hover:text-black transition-colors"><Phone size={16}/></a>
              <a href={`sms:${weddingInfo.bridePhone}`} className="px-4 py-3 text-gray-400 hover:text-black transition-colors"><MessageCircle size={16}/></a>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection delay={400}>
          <div className="max-w-[340px] mx-auto border border-gray-200 bg-white shadow-sm">
            <button onClick={() => setIsContactOpen(!isContactOpen)} className="w-full py-5 flex justify-center items-center gap-3 text-[13px] text-black tracking-wide font-medium uppercase">
              혼주에게 연락하기
              {isContactOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            
            {isContactOpen && (
              <div className="px-6 py-8 border-t border-gray-100 bg-white space-y-8 fade-in">
                <div>
                  <p className="text-[10px] text-gray-400 mb-4 font-cinzel tracking-[0.2em]">GROOM'S FAMILY</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-500 font-light">아버지 <span className="font-medium ml-3 text-black">{weddingInfo.groomFather}</span></span>
                      <div className="flex gap-5">
                        <a href={`tel:${weddingInfo.groomFatherPhone}`}><Phone size={16} className="text-gray-400 hover:text-black"/></a>
                        <a href={`sms:${weddingInfo.groomFatherPhone}`}><MessageCircle size={16} className="text-gray-400 hover:text-black"/></a>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-500 font-light">어머니 <span className="font-medium ml-3 text-black">{weddingInfo.groomMother}</span></span>
                      <div className="flex gap-5">
                        <a href={`tel:${weddingInfo.groomMotherPhone}`}><Phone size={16} className="text-gray-400 hover:text-black"/></a>
                        <a href={`sms:${weddingInfo.groomMotherPhone}`}><MessageCircle size={16} className="text-gray-400 hover:text-black"/></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-gray-100"></div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-4 font-cinzel tracking-[0.2em]">BRIDE'S FAMILY</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-500 font-light">아버지 <span className="font-medium ml-3 text-black">{weddingInfo.brideFather}</span></span>
                      <div className="flex gap-5">
                        <a href={`tel:${weddingInfo.brideFatherPhone}`}><Phone size={16} className="text-gray-400 hover:text-black"/></a>
                        <a href={`sms:${weddingInfo.brideFatherPhone}`}><MessageCircle size={16} className="text-gray-400 hover:text-black"/></a>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-500 font-light">어머니 <span className="font-medium ml-3 text-black">{weddingInfo.brideMother}</span></span>
                      <div className="flex gap-5">
                        <a href={`tel:${weddingInfo.brideMotherPhone}`}><Phone size={16} className="text-gray-400 hover:text-black"/></a>
                        <a href={`sms:${weddingInfo.brideMotherPhone}`}><MessageCircle size={16} className="text-gray-400 hover:text-black"/></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeInSection>
      </section>

      {/* ==========================================
          3. 달력 및 디데이 카운터
      ========================================== */}
      <section className="py-32 px-6 bg-white">
        <div className="text-center">
          <FadeInSection>
            <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">The Date</h2>
            <p className="text-[16px] text-black mb-12 font-normal tracking-widest">{weddingInfo.date}</p>
            <h3 className="font-cinzel text-3xl text-black uppercase tracking-[0.1em]">{weddingInfo.dateEng.split(' ')[1]}</h3>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            {renderCalendar()}
          </FadeInSection>
          
          <FadeInSection delay={400}>
            <div className="mt-14">
              <p className="text-[11px] text-gray-400 mb-4 tracking-widest uppercase font-sans">Time left until we say I do</p>
              <div className="flex justify-center items-center gap-4 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-cinzel text-black">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 uppercase mt-1">Days</span>
                </div>
                <span className="text-xl text-gray-300 -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-cinzel text-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 uppercase mt-1">Hours</span>
                </div>
                <span className="text-xl text-gray-300 -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-cinzel text-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 uppercase mt-1">Mins</span>
                </div>
                <span className="text-xl text-gray-300 -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-cinzel text-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 uppercase mt-1">Secs</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ==========================================
          4, 5, 6. 예식장 위치 / 내비게이션 / 교통안내
      ========================================== */}
      <section className="py-32 px-6 text-center bg-[#FAFAFA] border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-14 uppercase">Location</h2>
          <p className="font-normal text-[18px] text-black mb-4 tracking-widest">{weddingInfo.location}</p>
          <p className="text-[14px] text-gray-500 font-light mb-12 tracking-wide">{weddingInfo.address}</p>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="w-full relative mb-8">
            <div id="naver-map" className="w-full h-[280px] bg-gray-200 flex flex-col items-center justify-center grayscale">
              <MapPin size={24} className="mb-3 text-gray-400" />
              <p className="text-[12px] text-gray-500 font-sans tracking-wide">네이버 지도 영역</p>
            </div>
            
            <div className="grid grid-cols-3 gap-0 border border-gray-200 mt-6 shadow-sm">
              <a href={`https://map.naver.com/v5/search/${weddingInfo.location}`} target="_blank" rel="noreferrer" className="py-4 flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors border-r border-gray-200">
                <Map size={16} className="text-gray-400" /> 네이버 지도
              </a>
              <a href={`https://map.kakao.com/link/search/${weddingInfo.location}`} target="_blank" rel="noreferrer" className="py-4 flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors border-r border-gray-200">
                <MapPin size={16} className="text-gray-400" /> 카카오맵
              </a>
              <a href={`https://tmap.life/clear?명칭=${weddingInfo.location}`} target="_blank" rel="noreferrer" className="py-4 flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                <Car size={16} className="text-gray-400" /> 티맵
              </a>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection delay={400}>
          <div className="mt-16 text-left space-y-10 px-2">
            <div className="flex gap-5">
              <TrainFront className="text-gray-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-black mb-2 text-[14px] tracking-wide">지하철 안내</h3>
                <p className="text-[13px] text-gray-500 font-light leading-relaxed">2호선, 신분당선 강남역 1번 출구 (도보 5분)<br/>9호선 신논현역 3번 출구 (도보 10분)</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="flex gap-5">
              <BusFront className="text-gray-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-black mb-2 text-[14px] tracking-wide">버스 안내</h3>
                <p className="text-[13px] text-gray-500 font-light leading-relaxed">간선: 146, 341, 360<br/>지선: 4211<br/>광역: 9404, 9408</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="flex gap-5">
              <Car className="text-gray-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-black mb-2 text-[14px] tracking-wide">셔틀버스 및 주차</h3>
                <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                  강남역 1번 출구 앞 수시 운행 (10분 간격)<br/>
                  건물 지하 주차장 B2~B4 이용 (2시간 무료)
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ==========================================
          7. 웨딩 갤러리 (+ 더보기 기능)
      ========================================== */}
      <section className="py-32 px-5 bg-white border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs text-center tracking-[0.4em] text-gray-400 mb-14 uppercase">Gallery</h2>
        </FadeInSection>
        
        <FadeInSection delay={200}>
          <div className="grid grid-cols-2 gap-1 mb-8">
            <div className="col-span-2 aspect-[4/5] overflow-hidden bg-gray-100 mb-0.5">
              <img src={visibleGallery[0]} alt="Gallery 1" className="w-full h-full object-cover grayscale-[10%]" />
            </div>
            {visibleGallery.slice(1).map((img, idx) => (
              <div key={idx} className={`${idx === 2 ? 'col-span-2 aspect-[16/9] mt-0.5' : 'aspect-[3/4]'} overflow-hidden bg-gray-100`}>
                <img src={img} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover grayscale-[10%]" />
              </div>
            ))}
          </div>

          {!showAllGallery && (
            <button 
              onClick={() => setShowAllGallery(true)}
              className="w-full py-4 border border-gray-300 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              사진 더보기 <ChevronDown size={14} />
            </button>
          )}
        </FadeInSection>
      </section>

      {/* ==========================================
          8. 축의금 계좌번호 안내
      ========================================== */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs text-center tracking-[0.4em] text-gray-400 mb-10 uppercase">For Your Heart</h2>
          <p className="text-center text-[14px] font-light text-gray-500 mb-14 leading-loose tracking-wide">참석이 어려우신 분들을 위해<br/>계좌번호를 기재하였습니다.</p>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="space-y-4">
            <div className="border border-gray-200 bg-white shadow-sm">
              <button onClick={() => setIsGroomOpen(!isGroomOpen)} className="w-full px-6 py-6 flex justify-between items-center text-[14px] font-medium text-black tracking-wide">
                <span>신랑측 계좌번호</span>
                {isGroomOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {isGroomOpen && (
                <div className="px-6 pb-8 pt-4 border-t border-gray-100 text-[13px] bg-white fade-in">
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-gray-600 font-light tracking-wide">국민 123456-00-123456 (임성민)</p>
                    <button onClick={() => copyToClipboard('국민 123456-00-123456')} className="text-[11px] bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors">복사</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 font-light tracking-wide">신한 110-123-456789 (임한새)</p>
                    <button onClick={() => copyToClipboard('신한 110-123-456789')} className="text-[11px] bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors">복사</button>
                  </div>
                </div>
              )}
            </div>
            <div className="border border-gray-200 bg-white shadow-sm">
              <button onClick={() => setIsBrideOpen(!isBrideOpen)} className="w-full px-6 py-6 flex justify-between items-center text-[14px] font-medium text-black tracking-wide">
                <span>신부측 계좌번호</span>
                {isBrideOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {isBrideOpen && (
                <div className="px-6 pb-8 pt-4 border-t border-gray-100 text-[13px] bg-white fade-in">
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-gray-600 font-light tracking-wide">우리 1002-123-456789 (권오성)</p>
                    <button onClick={() => copyToClipboard('우리 1002-123-456789')} className="text-[11px] bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors">복사</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 font-light tracking-wide">카카오 3333-12-1234567 (권세영)</p>
                    <button onClick={() => copyToClipboard('카카오 3333-12-1234567')} className="text-[11px] bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors">복사</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ==========================================
          9. 하객 스냅 사진 업로드
      ========================================== */}
      <section className="py-32 px-6 text-center bg-white border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-8 uppercase">Guest Snap</h2>
          <p className="text-[14px] text-gray-500 font-light mb-10 leading-loose tracking-wide">
            예식 당일, 하객분들이 찍어주신<br/>소중하고 행복한 순간들을 공유해 주세요.
          </p>
        </FadeInSection>
        
        <FadeInSection delay={200}>
          <label className="cursor-pointer inline-flex flex-col items-center justify-center w-full max-w-[280px] h-40 border-2 border-dashed border-gray-300 bg-[#FAFAFA] hover:bg-gray-50 transition-colors group">
            <Camera size={28} className="text-gray-400 group-hover:text-black mb-3 transition-colors" />
            <span className="text-[13px] font-medium text-gray-600 tracking-wide uppercase">사진 업로드하기</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
          </label>
        </FadeInSection>
      </section>

      {/* ==========================================
          10. 초대장 공유 & RSVP
      ========================================== */}
      <section className="py-32 px-6 text-center bg-[#FAFAFA] border-t border-gray-100">
        <FadeInSection>
          <h2 className="font-cinzel text-xs tracking-[0.4em] text-gray-400 mb-14 uppercase">Share & RSVP</h2>
          
          <button onClick={() => setIsRsvpOpen(true)} className="w-full max-w-[300px] mx-auto py-5 bg-black text-white text-[14px] font-medium tracking-widest mb-16 hover:bg-gray-900 transition-colors uppercase block">
            참석 의사 전달하기
          </button>
        </FadeInSection>
        
        <FadeInSection delay={200}>
          <div className="flex flex-col gap-4 items-center border-t border-gray-200 pt-16">
            <button onClick={() => copyToClipboard('청첩장 링크', '링크')} className="flex items-center gap-2 px-8 py-4 bg-[#fae100] text-[#371d1e] text-[13px] font-medium hover:bg-[#f4dc00] transition-colors w-full max-w-[300px] justify-center shadow-sm">
              <MessageCircle size={16} fill="#371d1e" /> 카카오톡으로 공유하기
            </button>
            <button onClick={() => copyToClipboard('https://my-wedding.com', '링크')} className="flex items-center gap-2 px-8 py-4 bg-white text-black text-[13px] font-medium border border-gray-300 hover:bg-gray-50 transition-colors w-full max-w-[300px] justify-center">
              <Share2 size={15} /> 링크 주소 복사하기
            </button>
          </div>
        </FadeInSection>
      </section>

      {/* 하단 마무리 */}
      <div className="pb-24 pt-12 text-center bg-[#FAFAFA]">
        <p className="font-cinzel text-[10px] text-gray-300 tracking-[0.5em] uppercase">Hanse & Seyoung</p>
      </div>

      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 text-[13px] z-[60] shadow-2xl fade-in tracking-wide w-max max-w-[90%] text-center">
          {toastMessage}
        </div>
      )}

      {/* RSVP 모달 */}
      {isRsvpOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5 fade-in backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-10 shadow-2xl">
            <h3 className="text-[18px] font-medium text-center mb-10 text-black tracking-widest font-cinzel uppercase">RSVP</h3>
            <div className="space-y-6 mb-12 text-left">
              <div>
                <label className="text-[11px] text-gray-500 ml-1 mb-2 block tracking-wider uppercase font-sans">Name</label>
                <input type="text" placeholder="성함을 입력해주세요" className="w-full px-4 py-4 bg-[#FAFAFA] border border-gray-200 text-[14px] outline-none focus:border-black text-black transition-colors" />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 ml-1 mb-2 block tracking-wider uppercase font-sans">Guests</label>
                <select className="w-full px-4 py-4 bg-[#FAFAFA] border border-gray-200 text-[14px] outline-none focus:border-black text-gray-700 transition-colors">
                  <option>참석 인원을 선택해주세요</option>
                  <option>1명 (본인)</option>
                  <option>2명</option>
                  <option>3명 이상</option>
                  <option>마음으로 축하 (불참)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsRsvpOpen(false)} className="flex-1 py-4 bg-white border border-gray-300 text-gray-600 text-[13px] font-medium hover:bg-gray-50 transition-colors uppercase tracking-wider">Close</button>
              <button onClick={() => { setIsRsvpOpen(false); setToastMessage('소중한 의사 전달 감사합니다.'); setTimeout(() => setToastMessage(''), 2500); }} className="flex-1 py-4 bg-black text-white text-[13px] font-medium hover:bg-gray-900 transition-colors uppercase tracking-wider">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}