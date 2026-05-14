// Major world cities with coordinates — letters land near these
const CITIES = [
  { name: "서울, 한국", lat: 37.5665, lng: 126.978 },
  { name: "도쿄, 일본", lat: 35.6762, lng: 139.6503 },
  { name: "파리, 프랑스", lat: 48.8566, lng: 2.3522 },
  { name: "런던, 영국", lat: 51.5074, lng: -0.1278 },
  { name: "뉴욕, 미국", lat: 40.7128, lng: -74.006 },
  { name: "로마, 이탈리아", lat: 41.9028, lng: 12.4964 },
  { name: "바르셀로나, 스페인", lat: 41.3851, lng: 2.1734 },
  { name: "시드니, 호주", lat: -33.8688, lng: 151.2093 },
  { name: "리스본, 포르투갈", lat: 38.7223, lng: -9.1393 },
  { name: "암스테르담, 네덜란드", lat: 52.3676, lng: 4.9041 },
  { name: "프라하, 체코", lat: 50.0755, lng: 14.4378 },
  { name: "이스탄불, 터키", lat: 41.0082, lng: 28.9784 },
  { name: "방콕, 태국", lat: 13.7563, lng: 100.5018 },
  { name: "부에노스아이레스, 아르헨티나", lat: -34.6037, lng: -58.3816 },
  { name: "케이프타운, 남아프리카", lat: -33.9249, lng: 18.4241 },
  { name: "밴쿠버, 캐나다", lat: 49.2827, lng: -123.1207 },
  { name: "베를린, 독일", lat: 52.52, lng: 13.405 },
  { name: "비엔나, 오스트리아", lat: 48.2082, lng: 16.3738 },
  { name: "싱가포르", lat: 1.3521, lng: 103.8198 },
  { name: "두바이, UAE", lat: 25.2048, lng: 55.2708 },
  { name: "상하이, 중국", lat: 31.2304, lng: 121.4737 },
  { name: "뭄바이, 인도", lat: 19.076, lng: 72.8777 },
  { name: "카이로, 이집트", lat: 30.0444, lng: 31.2357 },
  { name: "멕시코시티, 멕시코", lat: 19.4326, lng: -99.1332 },
  { name: "하노이, 베트남", lat: 21.0285, lng: 105.8542 },
  { name: "헬싱키, 핀란드", lat: 60.1699, lng: 24.9384 },
  { name: "레이캬비크, 아이슬란드", lat: 64.1466, lng: -21.9426 },
  { name: "리우, 브라질", lat: -22.9068, lng: -43.1729 },
  { name: "오슬로, 노르웨이", lat: 59.9139, lng: 10.7522 },
  { name: "아테네, 그리스", lat: 37.9838, lng: 23.7275 },
];

export function getRandomLocation(): { lat: number; lng: number; locationName: string } {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];

  // Add slight random offset (within ~50km) so letters don't stack exactly
  const latOffset = (Math.random() - 0.5) * 0.8;
  const lngOffset = (Math.random() - 0.5) * 0.8;

  return {
    lat: city.lat + latOffset,
    lng: city.lng + lngOffset,
    locationName: city.name,
  };
}
