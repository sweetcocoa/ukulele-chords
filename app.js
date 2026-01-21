// 우쿨렐레 코드 시각화 애플리케이션

class UkuleleChordApp {
    constructor() {
        this.selectedRoot = null;
        this.selectedQuality = null;
        this.chordSequence = [];
        this.visualizer = new ChordVisualizer();

        this.init();
    }

    init() {
        // DOM 요소 참조
        this.rootButtons = document.getElementById('rootButtons');
        this.qualityButtons = document.getElementById('qualityButtons');
        this.addChordBtn = document.getElementById('addChordBtn');
        this.selectedChordPreview = document.getElementById('selectedChordPreview');
        this.sequenceContainer = document.getElementById('sequenceContainer');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.exportBtn = document.getElementById('exportBtn');

        // 이벤트 리스너 설정
        this.setupEventListeners();

        // 초기 상태
        this.updateAddButton();
    }

    setupEventListeners() {
        // Root 버튼 이벤트
        this.rootButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-chord')) {
                this.selectRoot(e.target);
            }
        });

        // Quality 버튼 이벤트
        this.qualityButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-chord')) {
                this.selectQuality(e.target);
            }
        });

        // 코드 추가 버튼
        this.addChordBtn.addEventListener('click', () => {
            this.addChord();
        });

        // 전체 삭제 버튼
        this.clearAllBtn.addEventListener('click', () => {
            if (this.chordSequence.length === 0) return;

            if (confirm('모든 코드를 삭제하시겠습니까?')) {
                this.clearAll();
            }
        });

        // 이미지 export 버튼
        this.exportBtn.addEventListener('click', () => {
            this.exportAsImage();
        });

        // Visualizer 이벤트 핸들러 설정
        this.visualizer.onInsert = (index) => this.insertChord(index);
        this.visualizer.onDelete = (index) => this.deleteChord(index);
    }

    selectRoot(button) {
        // 이전 선택 해제
        this.rootButtons.querySelectorAll('.btn-chord').forEach(btn => {
            btn.classList.remove('active');
        });

        // 새로운 선택
        button.classList.add('active');
        this.selectedRoot = button.dataset.root;

        this.updatePreview();
        this.updateAddButton();
    }

    selectQuality(button) {
        // 이전 선택 해제
        this.qualityButtons.querySelectorAll('.btn-chord').forEach(btn => {
            btn.classList.remove('active');
        });

        // 새로운 선택
        button.classList.add('active');
        this.selectedQuality = button.dataset.quality;

        this.updatePreview();
        this.updateAddButton();
    }

    updateAddButton() {
        this.addChordBtn.disabled = !this.selectedRoot || !this.selectedQuality;
    }

    updatePreview() {
        if (!this.selectedRoot || !this.selectedQuality) {
            this.selectedChordPreview.innerHTML = '<p class="no-selection">코드를 선택하세요</p>';
            return;
        }

        const chordInfo = getChordInfo(this.selectedRoot, this.selectedQuality);

        if (!chordInfo) {
            this.selectedChordPreview.innerHTML = '<p class="no-selection" style="color: #dc2626;">해당 코드를 찾을 수 없습니다</p>';
            return;
        }

        // 미리보기 생성
        const preview = document.createElement('div');
        preview.style.display = 'flex';
        preview.style.alignItems = 'center';
        preview.style.justifyContent = 'space-between';
        preview.style.flexWrap = 'wrap';
        preview.style.gap = '12px';

        const info = document.createElement('div');
        info.innerHTML = `
            <div style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">${chordInfo.name}</div>
            <div style="font-size: 14px; color: var(--text-secondary);">${getQualityDisplayName(this.selectedQuality)}</div>
        `;

        const miniDiagram = document.createElement('div');
        miniDiagram.style.transform = 'scale(0.9)';
        miniDiagram.style.transformOrigin = 'right center';
        const svg = this.visualizer.createDiagram(chordInfo);
        miniDiagram.appendChild(svg);

        preview.appendChild(info);
        preview.appendChild(miniDiagram);

        this.selectedChordPreview.innerHTML = '';
        this.selectedChordPreview.appendChild(preview);
    }

    addChord() {
        if (!this.selectedRoot || !this.selectedQuality) return;

        const chordInfo = getChordInfo(this.selectedRoot, this.selectedQuality);

        if (!chordInfo) {
            alert('해당 코드를 찾을 수 없습니다.');
            return;
        }

        this.chordSequence.push(chordInfo);
        this.renderSequence();
    }

    insertChord(index) {
        if (!this.selectedRoot || !this.selectedQuality) {
            alert('먼저 추가할 코드를 선택해주세요.');
            return;
        }

        const chordInfo = getChordInfo(this.selectedRoot, this.selectedQuality);

        if (!chordInfo) {
            alert('해당 코드를 찾을 수 없습니다.');
            return;
        }

        // index 다음에 삽입
        this.chordSequence.splice(index + 1, 0, chordInfo);
        this.renderSequence();
    }

    deleteChord(index) {
        if (confirm(`"${this.chordSequence[index].name}" 코드를 삭제하시겠습니까?`)) {
            this.chordSequence.splice(index, 1);
            this.renderSequence();
        }
    }

    clearAll() {
        this.chordSequence = [];
        this.renderSequence();
    }

    renderSequence() {
        this.sequenceContainer.innerHTML = '';

        if (this.chordSequence.length === 0) {
            this.sequenceContainer.innerHTML = `
                <div class="empty-state">
                    <p>아직 추가된 코드가 없습니다</p>
                    <p class="hint">위에서 코드를 선택하고 추가해보세요</p>
                </div>
            `;
            return;
        }

        this.chordSequence.forEach((chordInfo, index) => {
            const card = this.visualizer.createChordCard(chordInfo, index);
            this.sequenceContainer.appendChild(card);
        });
    }

    async exportAsImage() {
        if (this.chordSequence.length === 0) {
            alert('내보낼 코드가 없습니다.');
            return;
        }

        // Export 버튼 비활성화
        this.exportBtn.disabled = true;
        this.exportBtn.textContent = '이미지 생성 중...';

        try {
            // 시퀀스 컨테이너를 캡처
            const canvas = await html2canvas(this.sequenceContainer, {
                backgroundColor: '#ffffff',
                scale: 2, // 고해상도
                logging: false,
                useCORS: true
            });

            // Canvas를 이미지로 변환
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                link.download = `ukulele-chords-${timestamp}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);

                // 버튼 원상복구
                this.exportBtn.disabled = false;
                this.exportBtn.textContent = '이미지로 내보내기';
            });
        } catch (error) {
            console.error('이미지 생성 실패:', error);
            alert('이미지 생성에 실패했습니다.');

            // 버튼 원상복구
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = '이미지로 내보내기';
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UkuleleChordApp();

    // 자동 데모 모드 (스크린샷용)
    const urlParams = new URLSearchParams(window.location.search);
    const demo = urlParams.get('demo');

    if (demo === '1') {
        // Demo 1: C Major 선택
        setTimeout(() => {
            document.querySelector('button[data-root="C"]').click();
        }, 500);
        setTimeout(() => {
            document.querySelector('button[data-quality="major"]').click();
        }, 800);
    } else if (demo === '2') {
        // Demo 2: 여러 코드 추가
        const addChord = (root, quality, delay) => {
            setTimeout(() => {
                document.querySelector(`button[data-root="${root}"]`).click();
            }, delay);
            setTimeout(() => {
                document.querySelector(`button[data-quality="${quality}"]`).click();
            }, delay + 200);
            setTimeout(() => {
                document.getElementById('addChordBtn').click();
            }, delay + 400);
        };

        addChord('C', 'major', 500);
        addChord('G', 'major', 1200);
        addChord('A', 'minor', 1900);
        addChord('F', 'major', 2600);
    }
});
