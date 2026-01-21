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
const CHORD_DATABASE = {
    // C 코드
    'C': { frets: [0, 0, 0, 3], quality: 'major' },
    'C#': { frets: [1, 1, 1, 4], quality: 'major' },
    'D': { frets: [2, 2, 2, 0], quality: 'major' },
    'D#': { frets: [0, 3, 3, 1], quality: 'major' },
    'E': { frets: [1, 4, 0, 2], quality: 'major' },
    'F': { frets: [2, 0, 1, 0], quality: 'major' },
    'F#': { frets: [3, 1, 2, 1], quality: 'major' },
    'G': { frets: [0, 2, 3, 2], quality: 'major' },
    'G#': { frets: [5, 3, 4, 3], quality: 'major' },
    'A': { frets: [2, 1, 0, 0], quality: 'major' },
    'A#': { frets: [3, 2, 1, 1], quality: 'major' },
    'B': { frets: [4, 3, 2, 2], quality: 'major' },

    // Minor 코드
    'Cm': { frets: [0, 3, 3, 3], quality: 'minor' },
    'C#m': { frets: [1, 1, 0, 4], quality: 'minor' },
    'Dm': { frets: [2, 2, 1, 0], quality: 'minor' },
    'D#m': { frets: [3, 3, 2, 1], quality: 'minor' },
    'Em': { frets: [0, 4, 3, 2], quality: 'minor' },
    'Fm': { frets: [1, 0, 1, 3], quality: 'minor' },
    'F#m': { frets: [2, 1, 2, 0], quality: 'minor' },
    'Gm': { frets: [0, 2, 3, 1], quality: 'minor' },
    'G#m': { frets: [1, 3, 4, 2], quality: 'minor' },
    'Am': { frets: [2, 0, 0, 0], quality: 'minor' },
    'A#m': { frets: [3, 1, 1, 1], quality: 'minor' },
    'Bm': { frets: [4, 2, 2, 2], quality: 'minor' },

    // 7th 코드
    'C7': { frets: [0, 0, 0, 1], quality: '7' },
    'C#7': { frets: [1, 1, 1, 2], quality: '7' },
    'D7': { frets: [2, 2, 2, 3], quality: '7' },
    'D#7': { frets: [3, 3, 3, 4], quality: '7' },
    'E7': { frets: [1, 2, 0, 2], quality: '7' },
    'F7': { frets: [2, 3, 1, 0], quality: '7' },
    'F#7': { frets: [3, 4, 2, 1], quality: '7' },
    'G7': { frets: [0, 2, 1, 2], quality: '7' },
    'G#7': { frets: [1, 3, 2, 3], quality: '7' },
    'A7': { frets: [0, 1, 0, 0], quality: '7' },
    'A#7': { frets: [1, 2, 1, 1], quality: '7' },
    'B7': { frets: [2, 3, 2, 2], quality: '7' },

    // Major 7th 코드
    'Cmaj7': { frets: [0, 0, 0, 2], quality: 'maj7' },
    'C#maj7': { frets: [1, 1, 1, 3], quality: 'maj7' },
    'Dmaj7': { frets: [2, 2, 2, 4], quality: 'maj7' },
    'D#maj7': { frets: [3, 3, 3, 5], quality: 'maj7' },
    'Emaj7': { frets: [1, 3, 0, 2], quality: 'maj7' },
    'Fmaj7': { frets: [2, 4, 1, 3], quality: 'maj7' },
    'F#maj7': { frets: [3, 5, 2, 4], quality: 'maj7' },
    'Gmaj7': { frets: [0, 2, 2, 2], quality: 'maj7' },
    'G#maj7': { frets: [1, 3, 3, 3], quality: 'maj7' },
    'Amaj7': { frets: [1, 1, 0, 0], quality: 'maj7' },
    'A#maj7': { frets: [2, 2, 1, 1], quality: 'maj7' },
    'Bmaj7': { frets: [3, 3, 2, 2], quality: 'maj7' },

    // Minor 7th 코드
    'Cm7': { frets: [3, 3, 3, 3], quality: 'm7' },
    'C#m7': { frets: [4, 4, 4, 4], quality: 'm7' },
    'Dm7': { frets: [2, 2, 1, 3], quality: 'm7' },
    'D#m7': { frets: [3, 3, 2, 4], quality: 'm7' },
    'Em7': { frets: [0, 2, 0, 2], quality: 'm7' },
    'Fm7': { frets: [1, 3, 1, 3], quality: 'm7' },
    'F#m7': { frets: [2, 4, 2, 4], quality: 'm7' },
    'Gm7': { frets: [0, 2, 1, 1], quality: 'm7' },
    'G#m7': { frets: [1, 3, 2, 2], quality: 'm7' },
    'Am7': { frets: [0, 0, 0, 0], quality: 'm7' },
    'A#m7': { frets: [1, 1, 1, 1], quality: 'm7' },
    'Bm7': { frets: [2, 2, 2, 2], quality: 'm7' },

    // Diminished 코드
    'Cdim': { frets: [0, 2, 3, 2], quality: 'dim' },
    'C#dim': { frets: [1, 0, 1, 0], quality: 'dim' },
    'Ddim': { frets: [2, 1, 2, 1], quality: 'dim' },
    'D#dim': { frets: [0, 2, 0, 2], quality: 'dim' },
    'Edim': { frets: [1, 3, 1, 3], quality: 'dim' },
    'Fdim': { frets: [2, 0, 2, 0], quality: 'dim' },
    'F#dim': { frets: [0, 1, 0, 1], quality: 'dim' },
    'Gdim': { frets: [1, 2, 1, 2], quality: 'dim' },
    'G#dim': { frets: [2, 3, 2, 3], quality: 'dim' },
    'Adim': { frets: [3, 1, 3, 1], quality: 'dim' },
    'A#dim': { frets: [1, 2, 1, 2], quality: 'dim' },
    'Bdim': { frets: [2, 0, 2, 0], quality: 'dim' },

    // Augmented 코드
    'Caug': { frets: [1, 0, 0, 3], quality: 'aug' },
    'C#aug': { frets: [2, 1, 1, 4], quality: 'aug' },
    'Daug': { frets: [3, 2, 2, 5], quality: 'aug' },
    'D#aug': { frets: [0, 3, 3, 2], quality: 'aug' },
    'Eaug': { frets: [1, 0, 0, 3], quality: 'aug' },
    'Faug': { frets: [2, 1, 1, 4], quality: 'aug' },
    'F#aug': { frets: [3, 2, 2, 5], quality: 'aug' },
    'Gaug': { frets: [0, 3, 3, 2], quality: 'aug' },
    'G#aug': { frets: [1, 0, 0, 3], quality: 'aug' },
    'Aaug': { frets: [2, 1, 1, 0], quality: 'aug' },
    'A#aug': { frets: [3, 2, 2, 1], quality: 'aug' },
    'Baug': { frets: [0, 3, 3, 2], quality: 'aug' },

    // Sus4 코드
    'Csus4': { frets: [0, 0, 1, 3], quality: 'sus4' },
    'C#sus4': { frets: [1, 1, 2, 4], quality: 'sus4' },
    'Dsus4': { frets: [2, 2, 3, 0], quality: 'sus4' },
    'D#sus4': { frets: [3, 3, 4, 1], quality: 'sus4' },
    'Esus4': { frets: [4, 4, 0, 0], quality: 'sus4' },
    'Fsus4': { frets: [3, 0, 1, 3], quality: 'sus4' },
    'F#sus4': { frets: [4, 1, 2, 2], quality: 'sus4' },
    'Gsus4': { frets: [0, 2, 3, 3], quality: 'sus4' },
    'G#sus4': { frets: [1, 3, 4, 4], quality: 'sus4' },
    'Asus4': { frets: [2, 2, 0, 0], quality: 'sus4' },
    'A#sus4': { frets: [3, 3, 1, 1], quality: 'sus4' },
    'Bsus4': { frets: [4, 4, 2, 2], quality: 'sus4' }
};

// 코드 정보 가져오기
function getChordInfo(root, quality) {
    const qualitySuffix = quality === 'major' ? '' : quality === 'minor' ? 'm' : quality;
    const chordName = root + qualitySuffix;

    const chordData = CHORD_DATABASE[chordName];
    if (!chordData) {
        return null;
    }

    // 실제 연주되는 음 계산
    const playedNotes = chordData.frets.map((fret, index) => {
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
        frets: chordData.frets,
        playedNotes: uniquePlayedNotes,
        theoreticalNotes: theoreticalNotes,
        missingNotes: missingNotes,
        isComplete: missingNotes.length === 0
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
