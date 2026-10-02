export interface WarmQuote {
  id: number;
  text: string;
  author: string;
  category: '위로' | '용기' | '휴식' | '사랑' | '희망';
}

export const WARM_QUOTES: WarmQuote[] = [
  {
    id: 1,
    text: "자세히 보아야 예쁘다. 오래 보아야 사랑스럽다. 너도 그렇다.",
    author: "나태주, <풀꽃>",
    category: "사랑",
  },
  {
    id: 2,
    text: "오늘 하루도 참 고생 많았어요. 완벽하지 않아도 당신은 이미 충분히 빛나고 있어요.",
    author: "하루벗의 속삭임",
    category: "위로",
  },
  {
    id: 3,
    text: "매일 행복하진 않지만, 행복한 일은 매일 있어.",
    author: "곰돌이 푸",
    category: "희망",
  },
  {
    id: 4,
    text: "잠시 멈추어 서서 숨을 고르는 것도 앞으로 나아가는 과정의 소중한 일부예요.",
    author: "마음 쉼표",
    category: "휴식",
  },
  {
    id: 5,
    text: "어두운 밤이 지나면 반드시 눈부신 아침 햇살이 찾아온답니다.",
    author: "헤르만 헤세",
    category: "희망",
  },
  {
    id: 6,
    text: "스스로에게 친절한 하루를 선물하세요. 따뜻한 차 한 잔의 여유처럼요.",
    author: "따뜻한 하루",
    category: "휴식",
  },
  {
    id: 7,
    text: "흔들리지 않고 피는 꽃이 어디 있으랴. 그 어떤 아름다운 꽃들도 다 흔들리면서 피었나니.",
    author: "도종환, <흔들리며 피는 꽃>",
    category: "용기",
  },
  {
    id: 8,
    text: "지금 네가 걷고 있는 이 길도 언젠가는 찬란한 꽃길이 될 거야.",
    author: "마음의 온기",
    category: "용기",
  },
  {
    id: 9,
    text: "가장 소중한 것은 눈에 보이지 않아. 오직 마음으로 보아야 분명하게 보이지.",
    author: "생텍쥐페리, <어린 왕자>",
    category: "사랑",
  },
  {
    id: 10,
    text: "오늘 실수했더라도 괜찮아요. 당신은 지금도 아주 멋지게 자라나고 있으니까요.",
    author: "하루벗의 응원",
    category: "위로",
  },
  {
    id: 11,
    text: "마음의 봄은 밖의 계절과 상관없이, 당신이 스스로를 다정하게 안아줄 때 피어납니다.",
    author: "마음 한 조각",
    category: "사랑",
  },
  {
    id: 12,
    text: "비가 내린 뒤에 땅이 더 굳어지듯, 오늘의 고단함도 내일의 단단한 지혜가 되어줄 거예요.",
    author: "따스한 위로",
    category: "용기",
  },
];
