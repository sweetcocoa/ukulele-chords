// 우쿨렐레 코드 데이터베이스
// 표준 튜닝: G(4번줄) C(3번줄) E(2번줄) A(1번줄)

const UKULELE_TUNING = ['G', 'C', 'E', 'A'];

// 음계 정의
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 프렛의 음을 계산하는 함수
function getNoteAtFret(openString, fret) {
    const startIndex = NOTES.indexOf(openString);
    const noteIndex = (startIndex + fret) % 12;
    return NOTES[noteIndex];
}

// 코드 타입별 음정 간격 (반음 단위)
const CHORD_INTERVALS = {
    major: [0, 4, 7],           // Root, Major 3rd, Perfect 5th
    minor: [0, 3, 7],           // Root, Minor 3rd, Perfect 5th
    7: [0, 4, 7, 10],          // Root, Major 3rd, Perfect 5th, Minor 7th
    maj7: [0, 4, 7, 11],       // Root, Major 3rd, Perfect 5th, Major 7th
    m7: [0, 3, 7, 10],         // Root, Minor 3rd, Perfect 5th, Minor 7th
    dim: [0, 3, 6],            // Root, Minor 3rd, Diminished 5th
    aug: [0, 4, 8],            // Root, Major 3rd, Augmented 5th
    sus4: [0, 5, 7]            // Root, Perfect 4th, Perfect 5th
};

// 코드의 구성음 계산
function getChordNotes(root, quality) {
    const rootIndex = NOTES.indexOf(root);
    const intervals = CHORD_INTERVALS[quality];
    return intervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return NOTES[noteIndex];
    });
}

// 우쿨렐레 코드 데이터베이스
// [4번줄(G), 3번줄(C), 2번줄(E), 1번줄(A)] 순서
// 각 코드는 variations 배열을 가지며, 여러 운지법을 지원
const CHORD_DATABASE = {
    // C 코드
    'C': {
        quality: 'major',
        variations: [
            { name: '기본', frets: [0, 0, 0, 3], description: '오픈 포지션' },
            { name: '하이', frets: [5, 4, 3, 3], description: '5프렛 포지션' }
        ]
    },
    'C#': { quality: 'major', variations: [{ name: '기본', frets: [1, 1, 1, 4] }] },
    'D': {
        quality: 'major',
        variations: [
            { name: '기본', frets: [2, 2, 2, 0], description: '오픈 포지션' },
            { name: '하이', frets: [2, 2, 2, 5], description: '5프렛 포지션' }
        ]
    },
    'D#': { quality: 'major', variations: [{ name: '기본', frets: [0, 3, 3, 1] }] },
    'E': {
        quality: 'major',
        variations: [
            { name: '기본', frets: [1, 4, 0, 2], description: '오픈 포지션' },
            { name: '하이', frets: [4, 4, 4, 7], description: '7프렛 포지션' }
        ]
    },
    'F': {
        quality: 'major',
        variations: [
            { name: '기본', frets: [2, 0, 1, 0], description: '오픈 포지션' },
            { name: '하이', frets: [5, 5, 5, 8], description: '8프렛 포지션' }
        ]
    },
    'F#': { quality: 'major', variations: [{ name: '기본', frets: [3, 1, 2, 1] }] },
    'G': {
        quality: 'major',
        variations: [
            { name: '기본', frets: [0, 2, 3, 2], description: '오픈 포지션' },
            { name: '하이', frets: [0, 2, 3, 5], description: '5프렛 포지션' }
        ]
    },
    'G#': { quality: 'major', variations: [{ name: '기본', frets: [5, 3, 4, 3] }] },
    'A': {
        quality: 'major',
        variations: [
            { name: '기본', frets: [2, 1, 0, 0], description: '오픈 포지션' },
            { name: '하이', frets: [2, 1, 0, 4], description: '4프렛 포지션' }
        ]
    },
    'A#': { quality: 'major', variations: [{ name: '기본', frets: [3, 2, 1, 1] }] },
    'B': { quality: 'major', variations: [{ name: '기본', frets: [4, 3, 2, 2] }] },

    // Minor 코드
    'Cm': {
        quality: 'minor',
        variations: [
            { name: '기본', frets: [0, 3, 3, 3], description: '오픈 포지션' },
            { name: '하이', frets: [5, 3, 3, 3], description: '5프렛 포지션' }
        ]
    },
    'C#m': { quality: 'minor', variations: [{ name: '기본', frets: [1, 1, 0, 4] }] },
    'Dm': {
        quality: 'minor',
        variations: [
            { name: '기본', frets: [2, 2, 1, 0], description: '오픈 포지션' },
            { name: '하이', frets: [2, 2, 1, 5], description: '5프렛 포지션' }
        ]
    },
    'D#m': { quality: 'minor', variations: [{ name: '기본', frets: [3, 3, 2, 1] }] },
    'Em': {
        quality: 'minor',
        variations: [
            { name: '기본', frets: [0, 4, 3, 2], description: '오픈 포지션' },
            { name: '하이', frets: [0, 4, 3, 7], description: '7프렛 포지션' }
        ]
    },
    'Fm': { quality: 'minor', variations: [{ name: '기본', frets: [1, 0, 1, 3] }] },
    'F#m': { quality: 'minor', variations: [{ name: '기본', frets: [2, 1, 2, 0] }] },
    'Gm': { quality: 'minor', variations: [{ name: '기본', frets: [0, 2, 3, 1] }] },
    'G#m': { quality: 'minor', variations: [{ name: '기본', frets: [1, 3, 4, 2] }] },
    'Am': {
        quality: 'minor',
        variations: [
            { name: '기본', frets: [2, 0, 0, 0], description: '오픈 포지션' },
            { name: '하이', frets: [2, 4, 5, 7], description: '5프렛 포지션' }
        ]
    },
    'A#m': { quality: 'minor', variations: [{ name: '기본', frets: [3, 1, 1, 1] }] },
    'Bm': { quality: 'minor', variations: [{ name: '기본', frets: [4, 2, 2, 2] }] },

    // 7th 코드
    'C7': { quality: '7', variations: [{ name: '기본', frets: [0, 0, 0, 1] }] },
    'C#7': { quality: '7', variations: [{ name: '기본', frets: [1, 1, 1, 2] }] },
    'D7': { quality: '7', variations: [{ name: '기본', frets: [2, 2, 2, 3] }] },
    'D#7': { quality: '7', variations: [{ name: '기본', frets: [3, 3, 3, 4] }] },
    'E7': { quality: '7', variations: [{ name: '기본', frets: [1, 2, 0, 2] }] },
    'F7': { quality: '7', variations: [{ name: '기본', frets: [2, 3, 1, 0] }] },
    'F#7': { quality: '7', variations: [{ name: '기본', frets: [3, 4, 2, 1] }] },
    'G7': { quality: '7', variations: [{ name: '기본', frets: [0, 2, 1, 2] }] },
    'G#7': { quality: '7', variations: [{ name: '기본', frets: [1, 3, 2, 3] }] },
    'A7': { quality: '7', variations: [{ name: '기본', frets: [0, 1, 0, 0] }] },
    'A#7': { quality: '7', variations: [{ name: '기본', frets: [1, 2, 1, 1] }] },
    'B7': { quality: '7', variations: [{ name: '기본', frets: [2, 3, 2, 2] }] },

    // Major 7th 코드
    'Cmaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [0, 0, 0, 2] }] },
    'C#maj7': { quality: 'maj7', variations: [{ name: '기본', frets: [1, 1, 1, 3] }] },
    'Dmaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [2, 2, 2, 4] }] },
    'D#maj7': { quality: 'maj7', variations: [{ name: '기본', frets: [3, 3, 3, 5] }] },
    'Emaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [1, 3, 0, 2] }] },
    'Fmaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [2, 4, 1, 3] }] },
    'F#maj7': { quality: 'maj7', variations: [{ name: '기본', frets: [3, 5, 2, 4] }] },
    'Gmaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [0, 2, 2, 2] }] },
    'G#maj7': { quality: 'maj7', variations: [{ name: '기본', frets: [1, 3, 3, 3] }] },
    'Amaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [1, 1, 0, 0] }] },
    'A#maj7': { quality: 'maj7', variations: [{ name: '기본', frets: [2, 2, 1, 1] }] },
    'Bmaj7': { quality: 'maj7', variations: [{ name: '기본', frets: [3, 3, 2, 2] }] },

    // Minor 7th 코드
    'Cm7': { quality: 'm7', variations: [{ name: '기본', frets: [3, 3, 3, 3] }] },
    'C#m7': { quality: 'm7', variations: [{ name: '기본', frets: [4, 4, 4, 4] }] },
    'Dm7': { quality: 'm7', variations: [{ name: '기본', frets: [2, 2, 1, 3] }] },
    'D#m7': { quality: 'm7', variations: [{ name: '기본', frets: [3, 3, 2, 4] }] },
    'Em7': { quality: 'm7', variations: [{ name: '기본', frets: [0, 2, 0, 2] }] },
    'Fm7': { quality: 'm7', variations: [{ name: '기본', frets: [1, 3, 1, 3] }] },
    'F#m7': { quality: 'm7', variations: [{ name: '기본', frets: [2, 4, 2, 4] }] },
    'Gm7': { quality: 'm7', variations: [{ name: '기본', frets: [0, 2, 1, 1] }] },
    'G#m7': { quality: 'm7', variations: [{ name: '기본', frets: [1, 3, 2, 2] }] },
    'Am7': { quality: 'm7', variations: [{ name: '기본', frets: [0, 0, 0, 0] }] },
    'A#m7': { quality: 'm7', variations: [{ name: '기본', frets: [1, 1, 1, 1] }] },
    'Bm7': { quality: 'm7', variations: [{ name: '기본', frets: [2, 2, 2, 2] }] },

    // Diminished 코드
    'Cdim': { quality: 'dim', variations: [{ name: '기본', frets: [5, 3, 2, 3] }] },
    'C#dim': { quality: 'dim', variations: [{ name: '기본', frets: [6, 4, 3, 4] }] },
    'Ddim': { quality: 'dim', variations: [{ name: '기본', frets: [7, 5, 4, 5] }] },
    'D#dim': { quality: 'dim', variations: [{ name: '기본', frets: [2, 3, 2, 0] }] },
    'Edim': { quality: 'dim', variations: [{ name: '기본', frets: [0, 4, 0, 1] }] },
    'Fdim': { quality: 'dim', variations: [{ name: '기본', frets: [1, 5, 1, 2] }] },
    'F#dim': { quality: 'dim', variations: [{ name: '기본', frets: [2, 0, 2, 0] }] },
    'Gdim': { quality: 'dim', variations: [{ name: '기본', frets: [0, 1, 3, 1] }] },
    'G#dim': { quality: 'dim', variations: [{ name: '기본', frets: [1, 2, 4, 2] }] },
    'Adim': { quality: 'dim', variations: [{ name: '기본', frets: [2, 3, 5, 3] }] },
    'A#dim': { quality: 'dim', variations: [{ name: '기본', frets: [3, 1, 0, 1] }] },
    'Bdim': { quality: 'dim', variations: [{ name: '기본', frets: [4, 2, 1, 2] }] },

    // Augmented 코드
    'Caug': { quality: 'aug', variations: [{ name: '기본', frets: [1, 0, 0, 3] }] },
    'C#aug': { quality: 'aug', variations: [{ name: '기본', frets: [2, 1, 1, 4] }] },
    'Daug': { quality: 'aug', variations: [{ name: '기본', frets: [3, 2, 2, 5] }] },
    'D#aug': { quality: 'aug', variations: [{ name: '기본', frets: [0, 3, 3, 2] }] },
    'Eaug': { quality: 'aug', variations: [{ name: '기본', frets: [1, 0, 0, 3] }] },
    'Faug': { quality: 'aug', variations: [{ name: '기본', frets: [2, 1, 1, 4] }] },
    'F#aug': { quality: 'aug', variations: [{ name: '기본', frets: [3, 2, 2, 5] }] },
    'Gaug': { quality: 'aug', variations: [{ name: '기본', frets: [0, 3, 3, 2] }] },
    'G#aug': { quality: 'aug', variations: [{ name: '기본', frets: [1, 0, 0, 3] }] },
    'Aaug': { quality: 'aug', variations: [{ name: '기본', frets: [2, 1, 1, 0] }] },
    'A#aug': { quality: 'aug', variations: [{ name: '기본', frets: [3, 2, 2, 1] }] },
    'Baug': { quality: 'aug', variations: [{ name: '기본', frets: [0, 3, 3, 2] }] },

    // Sus4 코드
    'Csus4': { quality: 'sus4', variations: [{ name: '기본', frets: [0, 0, 1, 3] }] },
    'C#sus4': { quality: 'sus4', variations: [{ name: '기본', frets: [1, 1, 2, 4] }] },
    'Dsus4': { quality: 'sus4', variations: [{ name: '기본', frets: [2, 2, 3, 0] }] },
    'D#sus4': { quality: 'sus4', variations: [{ name: '기본', frets: [3, 3, 4, 1] }] },
    'Esus4': { quality: 'sus4', variations: [{ name: '기본', frets: [4, 4, 0, 0] }] },
    'Fsus4': { quality: 'sus4', variations: [{ name: '기본', frets: [3, 0, 1, 3] }] },
    'F#sus4': { quality: 'sus4', variations: [{ name: '기본', frets: [4, 1, 2, 2] }] },
    'Gsus4': { quality: 'sus4', variations: [{ name: '기본', frets: [0, 2, 3, 3] }] },
    'G#sus4': { quality: 'sus4', variations: [{ name: '기본', frets: [1, 3, 4, 4] }] },
    'Asus4': { quality: 'sus4', variations: [{ name: '기본', frets: [2, 2, 0, 0] }] },
    'A#sus4': { quality: 'sus4', variations: [{ name: '기본', frets: [3, 3, 1, 1] }] },
    'Bsus4': { quality: 'sus4', variations: [{ name: '기본', frets: [4, 4, 2, 2] }] }
};

// 코드 정보 가져오기
function getChordInfo(root, quality, variationIndex = 0) {
    const qualitySuffix = quality === 'major' ? '' : quality === 'minor' ? 'm' : quality;
    const chordName = root + qualitySuffix;

    const chordData = CHORD_DATABASE[chordName];
    if (!chordData) {
        return null;
    }

    // variations 배열에서 선택된 variation 가져오기
    const variation = chordData.variations[variationIndex] || chordData.variations[0];

    // 실제 연주되는 음 계산
    const playedNotes = variation.frets.map((fret, index) => {
        return getNoteAtFret(UKULELE_TUNING[index], fret);
    });

    // 이론적 코드 구성음
    const theoreticalNotes = getChordNotes(root, chordData.quality);

    // 빠진 음 찾기
    const missingNotes = theoreticalNotes.filter(note => !playedNotes.includes(note));

    // 유니크한 음만 추출
    const uniquePlayedNotes = [...new Set(playedNotes)];

    return {
        name: chordName,
        frets: variation.frets,
        playedNotes: uniquePlayedNotes,
        theoreticalNotes: theoreticalNotes,
        missingNotes: missingNotes,
        isComplete: missingNotes.length === 0,
        variationName: variation.name,
        variationDescription: variation.description || '',
        totalVariations: chordData.variations.length,
        currentVariationIndex: variationIndex
    };
}

// Quality 이름 한글 변환
function getQualityDisplayName(quality) {
    const names = {
        'major': 'Major',
        'minor': 'Minor',
        '7': '7th',
        'maj7': 'Major 7th',
        'm7': 'Minor 7th',
        'dim': 'Diminished',
        'aug': 'Augmented',
        'sus4': 'Suspended 4th'
    };
    return names[quality] || quality;
}
