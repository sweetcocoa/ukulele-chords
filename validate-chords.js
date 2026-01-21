// 코드 데이터베이스 검증 스크립트
const fs = require('fs');

// chord-data.js의 내용을 불러오기 위한 설정
const UKULELE_TUNING = ['G', 'C', 'E', 'A'];
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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

function getNoteAtFret(openString, fret) {
    const startIndex = NOTES.indexOf(openString);
    const noteIndex = (startIndex + fret) % 12;
    return NOTES[noteIndex];
}

function getChordNotes(root, quality) {
    const rootIndex = NOTES.indexOf(root);
    const intervals = CHORD_INTERVALS[quality];
    return intervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return NOTES[noteIndex];
    });
}

function parseChordName(chordName) {
    // C, C#, Cm, C7, Cmaj7 등을 파싱
    const match = chordName.match(/^([A-G]#?)(.*)$/);
    if (!match) return null;

    const root = match[1];
    const suffix = match[2];

    let quality;
    if (suffix === '' || suffix === 'M') {
        quality = 'major';
    } else if (suffix === 'm') {
        quality = 'minor';
    } else if (suffix === '7') {
        quality = '7';
    } else if (suffix === 'maj7') {
        quality = 'maj7';
    } else if (suffix === 'm7') {
        quality = 'm7';
    } else if (suffix === 'dim') {
        quality = 'dim';
    } else if (suffix === 'aug') {
        quality = 'aug';
    } else if (suffix === 'sus4') {
        quality = 'sus4';
    } else {
        return null;
    }

    return { root, quality };
}

function validateChord(chordName, frets, quality) {
    const parsed = parseChordName(chordName);
    if (!parsed) {
        return { valid: false, error: 'Cannot parse chord name' };
    }

    // 실제 연주되는 음 계산
    const playedNotes = frets.map((fret, index) => {
        return getNoteAtFret(UKULELE_TUNING[index], fret);
    });

    // 이론적 코드 구성음
    const theoreticalNotes = getChordNotes(parsed.root, quality || parsed.quality);

    // 유니크한 연주 음
    const uniquePlayedNotes = [...new Set(playedNotes)];

    // 검증: 이론적 구성음이 연주되는 음에 모두 포함되어야 함
    // 단, 우쿨렐레는 4줄이므로 일부 음이 빠질 수 있음 (이는 경고로 표시)
    const missingNotes = theoreticalNotes.filter(note => !uniquePlayedNotes.includes(note));
    const extraNotes = uniquePlayedNotes.filter(note => !theoreticalNotes.includes(note));

    // Extra notes가 있으면 잘못된 것
    if (extraNotes.length > 0) {
        return {
            valid: false,
            error: 'Wrong notes played',
            chordName,
            frets,
            quality: quality || parsed.quality,
            theoreticalNotes,
            playedNotes: uniquePlayedNotes,
            extraNotes,
            missingNotes
        };
    }

    // Missing notes는 경고 (우쿨렐레 특성상 허용)
    if (missingNotes.length > 0) {
        return {
            valid: true,
            warning: 'Some notes missing (acceptable for ukulele)',
            chordName,
            frets,
            quality: quality || parsed.quality,
            theoreticalNotes,
            playedNotes: uniquePlayedNotes,
            missingNotes
        };
    }

    return {
        valid: true,
        chordName,
        frets,
        quality: quality || parsed.quality,
        theoreticalNotes,
        playedNotes: uniquePlayedNotes
    };
}

// chord-data.js 파일 읽기
const chordDataFile = fs.readFileSync('./chord-data.js', 'utf8');

// CHORD_DATABASE 추출 (간단한 방법으로)
const databaseMatch = chordDataFile.match(/const CHORD_DATABASE = \{([\s\S]*?)\};/);
if (!databaseMatch) {
    console.error('Cannot find CHORD_DATABASE in chord-data.js');
    process.exit(1);
}

// 각 코드 항목 파싱
const lines = chordDataFile.split('\n');
let currentChord = null;
let errors = [];
let warnings = [];
let validCount = 0;

const chordPattern = /['"]([A-G]#?(?:m|maj7|m7|7|dim|aug|sus4)?)['"]:\s*\{/;
const fretsPattern = /frets:\s*\[([^\]]+)\]/g;
const qualityPattern = /quality:\s*['"]([^'"]+)['"]/;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 코드 이름 찾기
    const chordMatch = line.match(chordPattern);
    if (chordMatch) {
        currentChord = chordMatch[1];
    }

    // quality 찾기
    const qualityMatch = line.match(qualityPattern);
    let quality = null;
    if (qualityMatch) {
        quality = qualityMatch[1];
    }

    // frets 찾기
    const fretsMatches = [...line.matchAll(fretsPattern)];
    for (const fretsMatch of fretsMatches) {
        if (currentChord && fretsMatch[1]) {
            const frets = fretsMatch[1].split(',').map(s => parseInt(s.trim()));

            if (frets.length === 4 && frets.every(f => !isNaN(f))) {
                const result = validateChord(currentChord, frets, quality);

                if (!result.valid) {
                    errors.push(result);
                    console.error(`❌ ERROR: ${result.chordName}`);
                    console.error(`   Frets: [${frets.join(', ')}]`);
                    console.error(`   Expected: ${result.theoreticalNotes.join(', ')}`);
                    console.error(`   Got: ${result.playedNotes.join(', ')}`);
                    console.error(`   Extra notes: ${result.extraNotes.join(', ')}`);
                    console.error('');
                } else if (result.warning) {
                    warnings.push(result);
                } else {
                    validCount++;
                }
            }
        }
    }
}

console.log('\n=== Validation Summary ===');
console.log(`✅ Valid: ${validCount}`);
console.log(`⚠️  Warnings (missing notes): ${warnings.length}`);
console.log(`❌ Errors (wrong notes): ${errors.length}`);

if (errors.length > 0) {
    console.log('\n=== ERRORS TO FIX ===');
    errors.forEach(error => {
        console.log(`\n${error.chordName}: [${error.frets.join(', ')}]`);
        console.log(`  Quality: ${error.quality}`);
        console.log(`  Expected: ${error.theoreticalNotes.join(', ')}`);
        console.log(`  Got: ${error.playedNotes.join(', ')}`);
        console.log(`  Wrong notes: ${error.extraNotes.join(', ')}`);
    });
}

if (warnings.length > 0 && errors.length === 0) {
    console.log('\n=== Warnings (missing notes - acceptable) ===');
    warnings.slice(0, 5).forEach(warning => {
        console.log(`${warning.chordName}: Missing ${warning.missingNotes.join(', ')}`);
    });
    console.log(`... and ${warnings.length - 5} more`);
}

process.exit(errors.length > 0 ? 1 : 0);
