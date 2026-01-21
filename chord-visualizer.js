// 우쿨렐레 코드 시각화 컴포넌트

class ChordVisualizer {
    constructor(options = {}) {
        this.width = options.width || 200;
        this.height = options.height || 240;
        this.stringCount = 4;
        this.fretCount = 5;
        this.padding = 20;
        this.fretSpacing = (this.height - this.padding * 2) / this.fretCount;
        this.stringSpacing = (this.width - this.padding * 2) / (this.stringCount - 1);
    }

    // SVG 코드 다이어그램 생성
    createDiagram(chordInfo) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.width);
        svg.setAttribute('height', this.height);
        svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        svg.classList.add('chord-svg');

        // 배경
        const bg = this.createRect(0, 0, this.width, this.height, 'white', 'none');
        svg.appendChild(bg);

        // 코드 이름
        const title = this.createText(this.width / 2, 15, chordInfo.name, {
            fontSize: '22',
            fontWeight: 'bold',
            textAnchor: 'middle'
        });
        svg.appendChild(title);

        // 넛 (상단 굵은 선)
        const nutY = this.padding;
        const nutLine = this.createLine(
            this.padding,
            nutY,
            this.width - this.padding,
            nutY,
            'black',
            4
        );
        svg.appendChild(nutLine);

        // 프렛 그리기
        for (let i = 1; i <= this.fretCount; i++) {
            const y = this.padding + i * this.fretSpacing;
            const line = this.createLine(
                this.padding,
                y,
                this.width - this.padding,
                y,
                '#666',
                1
            );
            svg.appendChild(line);

            // 프렛 번호 표시 (왼쪽)
            const fretNumber = this.createText(
                this.padding - 12,
                y - this.fretSpacing / 2,
                i.toString(),
                {
                    fontSize: '11',
                    fill: '#999',
                    textAnchor: 'middle',
                    dominantBaseline: 'middle'
                }
            );
            svg.appendChild(fretNumber);
        }

        // 줄 그리기 (4번줄(G)부터 1번줄(A)까지, 왼쪽에서 오른쪽)
        for (let i = 0; i < this.stringCount; i++) {
            const x = this.padding + i * this.stringSpacing;
            const line = this.createLine(
                x,
                this.padding,
                x,
                this.padding + this.fretCount * this.fretSpacing,
                '#666',
                1
            );
            svg.appendChild(line);

            // 줄 이름 표시 (하단)
            const stringName = ['G', 'C', 'E', 'A'][i];
            const stringLabel = this.createText(x, this.height - 5, stringName, {
                fontSize: '12',
                fill: '#666',
                textAnchor: 'middle'
            });
            svg.appendChild(stringLabel);
        }

        // 운지 위치 표시
        chordInfo.frets.forEach((fret, stringIndex) => {
            const x = this.padding + stringIndex * this.stringSpacing;

            if (fret === 0) {
                // 오픈 스트링 (O 표시)
                const openCircle = this.createCircle(x, nutY - 10, 7, 'white', 'black', 2.5);
                svg.appendChild(openCircle);
            } else {
                // 프렛에 손가락 위치
                const y = this.padding + (fret - 0.5) * this.fretSpacing;
                const finger = this.createCircle(x, y, 8, '#2563eb', 'none');
                svg.appendChild(finger);

                // 연주되는 음 표시
                const note = getNoteAtFret(UKULELE_TUNING[stringIndex], fret);
                const noteText = this.createText(x, y + 1, note, {
                    fontSize: '11',
                    fill: 'white',
                    fontWeight: 'bold',
                    textAnchor: 'middle',
                    dominantBaseline: 'middle'
                });
                svg.appendChild(noteText);
            }
        });

        return svg;
    }

    // SVG 요소 생성 헬퍼 함수들
    createRect(x, y, width, height, fill, stroke) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', fill);
        if (stroke !== 'none') rect.setAttribute('stroke', stroke);
        return rect;
    }

    createLine(x1, y1, x2, y2, stroke, strokeWidth) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('stroke-linecap', 'round');
        return line;
    }

    createCircle(cx, cy, r, fill, stroke, strokeWidth = 0) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);
        if (stroke !== 'none') {
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', strokeWidth);
        }
        return circle;
    }

    createText(x, y, text, options = {}) {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.textContent = text;

        Object.keys(options).forEach(key => {
            const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            textEl.setAttribute(attrName, options[key]);
        });

        return textEl;
    }

    // 코드 카드 전체 생성
    createChordCard(chordInfo, index) {
        const card = document.createElement('div');
        card.classList.add('chord-card');
        card.dataset.index = index;

        // 헤더
        const header = document.createElement('div');
        header.classList.add('chord-card-header');

        const name = document.createElement('div');
        name.classList.add('chord-name');
        name.textContent = chordInfo.name;

        const actions = document.createElement('div');
        actions.classList.add('chord-actions');

        const insertBtn = document.createElement('button');
        insertBtn.classList.add('btn-icon', 'insert');
        insertBtn.textContent = '+ 삽입';
        insertBtn.onclick = () => this.onInsert(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-icon', 'delete');
        deleteBtn.textContent = '✕ 삭제';
        deleteBtn.onclick = () => this.onDelete(index);

        actions.appendChild(insertBtn);
        actions.appendChild(deleteBtn);

        header.appendChild(name);
        header.appendChild(actions);
        card.appendChild(header);

        // 다이어그램
        const diagramContainer = document.createElement('div');
        diagramContainer.classList.add('diagram-container');
        const svg = this.createDiagram(chordInfo);
        diagramContainer.appendChild(svg);

        const diagramWrapper = document.createElement('div');
        diagramWrapper.classList.add('chord-diagram');
        diagramWrapper.appendChild(diagramContainer);
        card.appendChild(diagramWrapper);

        // 연주되는 음 표시
        const notesContainer = document.createElement('div');
        notesContainer.classList.add('chord-notes');

        const notesLabel = document.createElement('span');
        notesLabel.textContent = '구성음: ';
        notesLabel.style.fontWeight = '600';
        notesLabel.style.fontSize = '14px';
        notesLabel.style.color = 'var(--text-secondary)';
        notesContainer.appendChild(notesLabel);

        chordInfo.playedNotes.forEach(note => {
            const badge = document.createElement('span');
            badge.classList.add('note-badge');
            badge.textContent = note;
            notesContainer.appendChild(badge);
        });

        card.appendChild(notesContainer);

        // 빠진 음이 있으면 경고 표시
        if (chordInfo.missingNotes.length > 0) {
            const warning = document.createElement('div');
            warning.classList.add('chord-warning');

            const warningTitle = document.createElement('strong');
            warningTitle.textContent = '⚠️ 대안 코드';
            warning.appendChild(warningTitle);

            const warningText = document.createElement('p');
            warningText.textContent = '우쿨렐레에서 완전한 코드를 구현하기 어려워 대안 운지법을 사용합니다.';
            warningText.style.margin = '4px 0';
            warning.appendChild(warningText);

            const missingContainer = document.createElement('div');
            missingContainer.classList.add('missing-notes');

            const missingLabel = document.createElement('span');
            missingLabel.textContent = '빠진 음: ';
            missingLabel.style.fontSize = '12px';
            missingContainer.appendChild(missingLabel);

            chordInfo.missingNotes.forEach(note => {
                const badge = document.createElement('span');
                badge.classList.add('missing-note');
                badge.textContent = note;
                missingContainer.appendChild(badge);
            });

            warning.appendChild(missingContainer);
            card.appendChild(warning);
        }

        return card;
    }

    // 이벤트 핸들러 (외부에서 설정)
    onInsert(index) {
        console.log('Insert at', index);
    }

    onDelete(index) {
        console.log('Delete at', index);
    }
}
