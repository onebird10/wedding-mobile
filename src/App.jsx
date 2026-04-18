import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Copy, Heart, ChevronDown, ChevronUp, CalendarHeart, Share2, Car, Utensils, Info } from 'lucide-react';

// --- 커스텀 폰트 및 글로벌 스타일 설정 ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap');
  
  body {
    background-color: #ffffff;
    font-family: 'Noto Serif KR', serif;
    color: #333;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  .font-cinzel {
    font-family: 'Cinzel', serif;
  }

  /* 부드러운 페이드인 애니메이션 */
  .fade-in {
    animation: fadeIn 1.5s ease-in-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [isGroomOpen, setIsGroomOpen] = useState(false);
  const [isBrideOpen, setIsBrideOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  // 글로벌 스타일 주입
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 복사 함수
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

  // --- 확장된 데이터 설정 영역 (본인의 정보로 수정하세요) ---
  const weddingInfo = {
    groom: '임한새',
    bride: '권세영',
    groomEng: 'HANSE',
    brideEng: 'SEYOUNG',
    groomPhone: '010-1234-5678',
    bridePhone: '010-8765-4321',
    date: '2026년 11월 22일 일요일 낮 3시',
    dateEng: '22 Nov 2026',
    year: 2026,
    month: 11,
    day: 22,
    location: '루이비스 강서',
    address: '서울특별시 강서구 양천로 476',
    lat: 37.560126,
    lng: 126.840608,
    // 사진 소스들 (본인 사진 링크로 교체 필요)
    mainImage: '/images/main.jpg',
    intermissionImage1: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    intermissionImage2: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617332386983-0599a08e1f5f?auto=format&fit=crop&q=80&w=600',
    ]
  };

  // 11월 달력 생성 (2026년 11월 기준)
  const renderCalendar = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);
    
    return (
      <div className="w-full max-w-[280px] mx-auto mt-10">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-cinzel text-gray-400 mb-4">
          {days.map((day, i) => <div key={i} className={i === 0 ? 'text-red-300' : ''}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
          {dates.map((date) => (
            <div key={date} className="relative flex justify-center items-center h-6">
              <span className={`z-10 ${date === weddingInfo.day ? 'text-white font-medium' : 'text-gray-700'}`}>
                {date}
              </span>
              {date === weddingInfo.day && (
                <div className="absolute w-7 h-7 bg-gray-800 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 네이버 지도 API 로드
  useEffect(() => {
    const clientId = 'YOUR_CLIENT_ID'; // 여기에 네이버 클라우드 플랫폼에서 발급받은 Client ID를 넣으세요
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

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden text-gray-800 pb-10">
      
      {/* 1. 메인 커버 섹션 (Frame 2 디자인) */}
      <section className="pt-12 px-6 pb-12 flex flex-col items-center fade-in bg-[#fbfbfb]">
        <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] w-full p-8 pt-12 pb-16 flex flex-col items-center relative overflow-hidden rounded-sm">
          
          <h1 className="font-cinzel text-xl md:text-2xl tracking-widest text-gray-800 text-center mb-6">
            {weddingInfo.groomEng}
            <span className="mx-3 text-sm text-gray-400">&amp;</span>
            {weddingInfo.brideEng}
          </h1>

          <div className="flex justify-between w-full max-w-[240px] text-[10px] uppercase font-sans tracking-wider text-gray-500 mb-10">
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400">Sun</span>
              <span className="w-5 h-5 flex items-center justify-center border border-gray-800 rounded-full mt-[1px] text-gray-900 font-medium">22</span>
            </div>
            <div className="flex flex-col items-center gap-1 mt-[1px]"><span>Mon</span><span>23</span></div>
            <div className="flex flex-col items-center gap-1 mt-[1px]"><span>Tue</span><span>24</span></div>
            <div className="flex flex-col items-center gap-1 mt-[1px]"><span>Wed</span><span>25</span></div>
            <div className="flex flex-col items-center gap-1 mt-[1px]"><span>Thu</span><span>26</span></div>
            <div className="flex flex-col items-center gap-1 mt-[1px]"><span>Fri</span><span>27</span></div>
            <div className="flex flex-col items-center gap-1 mt-[1px]"><span>Sat</span><span>28</span></div>
          </div>

          <div className="w-full aspect-square mb-10 relative">
            <img src={weddingInfo.mainImage} alt="Main Wedding" className="w-full h-full object-cover shadow-sm" />
          </div>

          <p className="font-cinzel text-sm tracking-[0.2em] text-gray-800">
            {weddingInfo.dateEng}
          </p>
        </div>
      </section>

      {/* 2. 인사말 및 연락처 섹션 */}
      <section className="px-8 py-20 text-center border-t border-gray-100/50">
        <p className="font-cinzel text-xs tracking-widest mb-12 text-gray-400">INVITATION</p>
        
        <div className="space-y-7 text-[15px] font-light leading-loose tracking-wide text-gray-700">
          <p>함께 있을 때 가장 나다운 모습이 되고,<br/>서로의 내일을 기대하게 만드는 사람을 만났습니다.</p>
          <p>저희 두 사람의 새로운 시작을<br/>가까이서 축복해 주시면 감사하겠습니다.</p>
          <p>따뜻한 마음으로 지켜봐 주시기 바랍니다.</p>
        </div>
        
        <div className="mt-16 mb-12 flex flex-col items-center gap-6 font-medium border-y border-gray-100 py-10">
          <div className="flex items-center justify-center w-full gap-8">
            <span className="text-sm text-gray-500">임성민 · 김지연 의 아들</span>
            <span className="text-lg">{weddingInfo.groom}</span>
          </div>
          <div className="flex items-center justify-center w-full gap-8">
            <span className="text-sm text-gray-500">권오성 · 이수진 의 딸</span>
            <span className="text-lg">{weddingInfo.bride}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <div className="flex bg-gray-50 rounded-full border border-gray-100 p-1">
            <span className="px-4 py-2 text-sm font-medium text-gray-600 border-r border-gray-200">신랑에게</span>
            <a href={`tel:${weddingInfo.groomPhone}`} className="px-3 py-2 text-gray-400 hover:text-gray-800"><Phone size={18}/></a>
            <a href={`sms:${weddingInfo.groomPhone}`} className="px-3 py-2 text-gray-400 hover:text-gray-800"><MessageCircle size={18}/></a>
          </div>
          <div className="flex bg-gray-50 rounded-full border border-gray-100 p-1">
            <span className="px-4 py-2 text-sm font-medium text-gray-600 border-r border-gray-200">신부에게</span>
            <a href={`tel:${weddingInfo.bridePhone}`} className="px-3 py-2 text-gray-400 hover:text-gray-800"><Phone size={18}/></a>
            <a href={`sms:${weddingInfo.bridePhone}`} className="px-3 py-2 text-gray-400 hover:text-gray-800"><MessageCircle size={18}/></a>
          </div>
        </div>
      </section>

      {/* 3. 인터미션 사진 1 */}
      <section className="w-full h-96 relative">
        <img src={weddingInfo.intermissionImage1} alt="Intermission" className="w-full h-full object-cover" />
      </section>

      {/* 4. 달력 (DATE) 섹션 */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="text-center">
          <h2 className="font-cinzel text-xl tracking-[0.2em] text-gray-800 mb-4">SAVE THE DATE</h2>
          <p className="text-sm text-gray-600 mb-8">{weddingInfo.date}</p>
          <div className="w-12 h-[1px] bg-gray-300 mx-auto mb-8"></div>
          
          <h3 className="font-cinzel text-2xl text-gray-800 uppercase">{weddingInfo.dateEng.split(' ')[1]}</h3>
          {renderCalendar()}
        </div>
      </section>

      {/* 5. 갤러리 섹션 */}
      <section className="py-24 bg-white">
        <h2 className="font-cinzel text-xl text-center tracking-[0.2em] text-gray-800 mb-12">OUR MOMENTS</h2>
        <div className="grid grid-cols-2 gap-1 px-1">
          {weddingInfo.galleryImages.map((img, idx) => (
            <div key={idx} className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 6. 정보 안내 (Notice) */}
      <section className="py-24 px-8 bg-[#fafafa]">
        <h2 className="font-cinzel text-xl text-center tracking-[0.2em] text-gray-800 mb-12">INFORMATION</h2>
        <div className="space-y-8">
          <div className="flex gap-4">
            <Utensils className="text-gray-400 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">식사 안내</h3>
              <p className="text-sm text-gray-600 leading-relaxed">정성스럽게 준비한 뷔페가 연회장(3층)에 마련되어 있습니다. 예식 시작 30분 전부터 이용 가능합니다.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Car className="text-gray-400 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">주차 안내</h3>
              <p className="text-sm text-gray-600 leading-relaxed">웨딩홀 건물 지하 주차장을 이용해 주세요. 안내데스크에서 2시간 무료 주차권을 발급해 드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 오시는 길 섹션 */}
      <section className="py-24 px-6 text-center">
        <h2 className="font-cinzel text-xl tracking-[0.2em] mb-12">LOCATION</h2>
        <p className="font-medium text-lg mb-2">{weddingInfo.location}</p>
        <p className="text-sm text-gray-600 mb-8">{weddingInfo.address}</p>

        <div className="w-full relative mb-6">
          <div id="naver-map" className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center">
             <MapPin size={24} className="mb-2 text-gray-300" />
             <p className="text-sm text-gray-400">네이버 지도 영역 (Client ID 필요)</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <a href={`https://map.naver.com/v5/search/${weddingInfo.location}`} target="_blank" rel="noreferrer" className="py-3 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100">네이버 지도</a>
            <a href={`https://map.kakao.com/link/search/${weddingInfo.location}`} target="_blank" rel="noreferrer" className="py-3 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100">카카오맵</a>
            <a href={`https://tmap.life/clear?명칭=${weddingInfo.location}`} target="_blank" rel="noreferrer" className="py-3 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100">티맵</a>
          </div>
        </div>
      </section>

      {/* 8. 마음 전하실 곳 */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <h2 className="font-cinzel text-xl text-center tracking-[0.2em] text-gray-800 mb-6">FOR YOUR HEART</h2>
        <p className="text-center text-sm text-gray-600 mb-10">참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다.</p>

        <div className="space-y-3">
          <div className="border border-gray-200 bg-white">
            <button onClick={() => setIsGroomOpen(!isGroomOpen)} className="w-full px-6 py-5 flex justify-between items-center text-sm font-medium">
              <span>신랑측 계좌번호</span>
              {isGroomOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {isGroomOpen && (
              <div className="px-6 pb-5 pt-2 border-t border-gray-50 text-sm">
                <div className="flex justify-between items-center mb-3">
                  <p>국민 123456-00-123456 (임성민)</p>
                  <button onClick={() => copyToClipboard('국민 123456-00-123456')} className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-sm">복사</button>
                </div>
              </div>
            )}
          </div>
          <div className="border border-gray-200 bg-white">
            <button onClick={() => setIsBrideOpen(!isBrideOpen)} className="w-full px-6 py-5 flex justify-between items-center text-sm font-medium">
              <span>신부측 계좌번호</span>
              {isBrideOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {isBrideOpen && (
              <div className="px-6 pb-5 pt-2 border-t border-gray-50 text-sm">
                <div className="flex justify-between items-center">
                  <p>카카오 3333-12-1234567 (권세영)</p>
                  <button onClick={() => copyToClipboard('카카오 3333-12-1234567')} className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-sm">복사</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. 참석 의사 및 공유 */}
      <section className="py-24 px-6 text-center">
        <button onClick={() => setIsRsvpOpen(true)} className="w-full max-w-[240px] py-4 bg-gray-800 text-white text-sm font-medium tracking-wide mb-12">참석 의사 전달하기</button>
        <div className="border-t border-gray-100 pt-10 flex flex-col gap-4 items-center">
          <button onClick={() => copyToClipboard('청첩장 링크', '링크')} className="flex items-center gap-2 px-8 py-3 bg-[#fae100] text-[#371d1e] text-sm font-medium rounded-full"><MessageCircle size={18} fill="#371d1e" /> 카카오톡 공유</button>
          <button onClick={() => copyToClipboard('https://my-wedding.com', '링크')} className="flex items-center gap-2 px-8 py-3 bg-gray-50 text-gray-600 text-sm font-medium rounded-full border border-gray-200"><Share2 size={16} /> 링크 복사</button>
        </div>
      </section>

      {/* RSVP 모달 */}
      {isRsvpOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-8 rounded-sm">
            <h3 className="text-lg font-medium text-center mb-6">참석 의사 전달</h3>
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="성함" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm outline-none" />
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm outline-none">
                <option>참석 인원 선택</option>
                <option>1명 (본인)</option>
                <option>2명</option>
                <option>3명 이상</option>
                <option>불참</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsRsvpOpen(false)} className="flex-1 py-3 bg-gray-100 text-sm">닫기</button>
              <button onClick={() => { setIsRsvpOpen(false); setToastMessage('전달되었습니다.'); setTimeout(() => setToastMessage(''), 2000); }} className="flex-1 py-3 bg-gray-800 text-white text-sm">보내기</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full text-sm z-[60] shadow-lg">{toastMessage}</div>
      )}
    </div>
  );
}