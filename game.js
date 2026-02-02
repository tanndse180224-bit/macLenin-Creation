// ============================================
// BÁNH XE LỊCH SỬ - Professional Game Logic
// ============================================

// Game State
let currentTheory = 0;
let currentQuestion = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let streak = 0;
let maxStreak = 0;
let timer = null;
let timeLeft = 30;
let isMuted = false;

// Sound Effects (Web Audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

function playSound(type) {
    if (isMuted || !audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
        case 'correct':
            oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.4);
            break;
        case 'wrong':
            oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(150, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.3);
            break;
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
            break;
        case 'complete':
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.3);
                osc.start(audioCtx.currentTime + i * 0.15);
                osc.stop(audioCtx.currentTime + i * 0.15 + 0.3);
            });
            break;
    }
}

function toggleMusic() {
    isMuted = !isMuted;
    const btn = document.getElementById('music-toggle');
    btn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    btn.classList.toggle('muted', isMuted);
}

// Theory Content - Học thuyết hình thái kinh tế xã hội
const theories = [
    {
        title: '<i class="fas fa-landmark"></i> Học thuyết Hình thái Kinh tế - Xã hội',
        content: `
            <p>Đây là học thuyết cốt lõi của Chủ nghĩa Mác-Lênin về sự phát triển của xã hội loài người, giải thích quy luật vận động và phát triển của lịch sử nhân loại.</p>
            
            <div class="highlight-box">
                <h3><i class="fas fa-lightbulb"></i> Khái niệm cơ bản</h3>
                <p><strong>Hình thái kinh tế - xã hội</strong> là một xã hội cụ thể tồn tại trong một giai đoạn lịch sử nhất định, được cấu thành bởi:</p>
                <ul>
                    <li>🔧 Một kiểu <strong>quan hệ sản xuất</strong> đặc trưng</li>
                    <li>⚙️ Phù hợp với trình độ <strong>lực lượng sản xuất</strong></li>
                    <li>🏛️ Một <strong>kiến trúc thượng tầng</strong> tương ứng được xây dựng trên quan hệ sản xuất đó</li>
                </ul>
            </div>

            <h3><i class="fas fa-history"></i> 5 Hình thái trong lịch sử nhân loại</h3>
            <div class="diagram">
                <p class="diagram-title">Quá trình phát triển của xã hội loài người</p>
                <div class="diagram-flow">
                    <div class="diagram-item">🏕️ Công xã nguyên thủy</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">⛓️ Chiếm hữu nô lệ</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🏰 Phong kiến</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🏭 Tư bản chủ nghĩa</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🌟 Cộng sản chủ nghĩa</div>
                </div>
            </div>
            
            <p><em>Mỗi hình thái đại diện cho một bước tiến trong lịch sử, phản ánh sự phát triển của lực lượng sản xuất và quan hệ sản xuất.</em></p>
        `
    },
    {
        title: '<i class="fas fa-cogs"></i> Lực lượng sản xuất (LLSX)',
        content: `
            <p>Lực lượng sản xuất là nền tảng vật chất của mọi xã hội, quyết định sự tồn tại và phát triển của con người.</p>
            
            <div class="highlight-box">
                <h3><i class="fas fa-book-open"></i> Định nghĩa</h3>
                <p><strong>Lực lượng sản xuất</strong> là sự kết hợp giữa <em>người lao động</em> với <em>tư liệu sản xuất</em> để tạo ra của cải vật chất cho xã hội.</p>
            </div>

            <h3><i class="fas fa-puzzle-piece"></i> Các yếu tố cấu thành LLSX</h3>
            
            <table class="theory-table">
                <tr>
                    <th>Yếu tố</th>
                    <th>Nội dung</th>
                </tr>
                <tr>
                    <td><strong>👷 Người lao động</strong></td>
                    <td>Sức khỏe, kỹ năng, kinh nghiệm, tri thức, sáng tạo</td>
                </tr>
                <tr>
                    <td><strong>🎯 Đối tượng lao động</strong></td>
                    <td>Nguyên liệu, đất đai, tài nguyên thiên nhiên</td>
                </tr>
                <tr>
                    <td><strong>🔨 Tư liệu lao động</strong></td>
                    <td>Công cụ, máy móc, nhà xưởng, cơ sở hạ tầng</td>
                </tr>
            </table>

            <h3><i class="fas fa-chart-line"></i> Sự tiến hóa của công cụ sản xuất</h3>
            <div class="diagram">
                <p class="diagram-title">Minh họa sự phát triển của LLSX qua các thời kỳ</p>
                <div class="diagram-flow">
                    <div class="diagram-item">🪨 Đá thô sơ</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">⚒️ Đồng/Sắt</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🏭 Máy hơi nước</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">💻 Công nghệ số</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🤖 AI/Robot</div>
                </div>
            </div>
            
            <p><strong>💡 Điểm quan trọng:</strong> LLSX là yếu tố <em>động</em>, <em>cách mạng</em>, luôn có xu hướng phát triển không ngừng. Đây chính là nguồn gốc của sự vận động xã hội!</p>
        `
    },
    {
        title: '<i class="fas fa-handshake"></i> Quan hệ sản xuất (QHSX)',
        content: `
            <p>Quan hệ sản xuất là các mối quan hệ giữa người với người trong quá trình sản xuất vật chất.</p>
            
            <div class="highlight-box">
                <h3><i class="fas fa-layer-group"></i> 3 mặt cơ bản của Quan hệ sản xuất</h3>
                <ul>
                    <li><strong>🏠 Quan hệ sở hữu:</strong> Ai sở hữu tư liệu sản xuất? (Đây là mặt QUYẾT ĐỊNH)</li>
                    <li><strong>📋 Quan hệ tổ chức quản lý:</strong> Ai điều hành, ra quyết định trong sản xuất?</li>
                    <li><strong>💰 Quan hệ phân phối:</strong> Sản phẩm làm ra được chia như thế nào?</li>
                </ul>
            </div>

            <h3><i class="fas fa-balance-scale"></i> So sánh QHSX qua các hình thái</h3>
            <table class="theory-table">
                <tr>
                    <th>Hình thái KT-XH</th>
                    <th>Ai sở hữu TLSX?</th>
                    <th>Đặc điểm</th>
                </tr>
                <tr>
                    <td>⛓️ Chiếm hữu nô lệ</td>
                    <td>Chủ nô</td>
                    <td>Sở hữu cả người nô lệ</td>
                </tr>
                <tr>
                    <td>🏰 Phong kiến</td>
                    <td>Địa chủ, lãnh chúa</td>
                    <td>Nông dân phụ thuộc vào đất</td>
                </tr>
                <tr>
                    <td>🏭 Tư bản</td>
                    <td>Nhà tư bản</td>
                    <td>Công nhân bán sức lao động</td>
                </tr>
                <tr>
                    <td>🌟 XHCN</td>
                    <td>Công hữu xã hội</td>
                    <td>Nhà nước đại diện quản lý</td>
                </tr>
            </table>
            
            <p><strong>💡 Lưu ý:</strong> QHSX có tính <em>ổn định tương đối</em>, thường lạc hậu hơn so với LLSX. Giai cấp thống trị luôn muốn duy trì QHSX có lợi cho mình!</p>
        `
    },
    {
        title: '<i class="fas fa-bolt"></i> Mâu thuẫn LLSX - QHSX: Động lực phát triển',
        content: `
            <p style="font-size: 1.2rem; text-align: center; color: var(--secondary); margin-bottom: 25px;">
                ⚡ Đây là quy luật cơ bản nhất giải thích <strong>TẠI SAO XÃ HỘI LUÔN VẬN ĐỘNG!</strong> ⚡
            </p>
            
            <div class="highlight-box" style="border-color: var(--secondary);">
                <h3><i class="fas fa-sync-alt"></i> Quy luật biện chứng cốt lõi</h3>
                <p style="font-size: 1.15rem; text-align: center;"><strong>"QHSX phải phù hợp với trình độ phát triển của LLSX"</strong></p>
            </div>

            <h3><i class="fas fa-project-diagram"></i> Quá trình vận động của xã hội</h3>
            <ol style="padding-left: 20px; line-height: 2.2;">
                <li>🟢 <strong>Giai đoạn 1:</strong> QHSX phù hợp với LLSX → Xã hội ổn định, phát triển thuận lợi</li>
                <li>🟡 <strong>Giai đoạn 2:</strong> LLSX phát triển nhanh hơn → QHSX dần trở nên lạc hậu, kìm hãm</li>
                <li>🟠 <strong>Giai đoạn 3:</strong> Mâu thuẫn tích tụ → Khủng hoảng kinh tế, xã hội, xung đột</li>
                <li>🔴 <strong>Giai đoạn 4:</strong> Cách mạng xã hội → QHSX mới ra đời, phù hợp với LLSX</li>
                <li>🟢 <strong>Giai đoạn 5:</strong> Xã hội chuyển sang hình thái mới, tiến bộ hơn → Chu kỳ lặp lại</li>
            </ol>

            <div class="diagram">
                <p class="diagram-title">💡 Ví dụ điển hình: Cách mạng Công nghiệp Anh (thế kỷ 18)</p>
                <div class="diagram-flow">
                    <div class="diagram-item">⚙️ Máy móc phát triển (LLSX mới)</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">⛔ Phong kiến kìm hãm (QHSX cũ)</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🔥 Cách mạng tư sản</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🏭 CNTB ra đời (QHSX mới)</div>
                </div>
            </div>
        `
    },
    {
        title: '<i class="fas fa-fist-raised"></i> Đấu tranh giai cấp',
        content: `
            <p>Trong xã hội có giai cấp, mâu thuẫn giữa LLSX và QHSX biểu hiện ra thành <strong>đấu tranh giai cấp</strong> - cuộc đấu tranh giữa các tập đoàn người có lợi ích đối lập.</p>
            
            <div class="highlight-box">
                <h3><i class="fas fa-users"></i> Giai cấp là gì?</h3>
                <p>Là những <strong>tập đoàn người</strong> khác nhau về:</p>
                <ul>
                    <li>📍 Địa vị trong hệ thống sản xuất xã hội</li>
                    <li>🏠 Quan hệ với tư liệu sản xuất (sở hữu hay không sở hữu)</li>
                    <li>📋 Vai trò trong tổ chức lao động xã hội</li>
                    <li>💰 Cách thức và quy mô hưởng thụ của cải</li>
                </ul>
            </div>

            <h3><i class="fas fa-fire"></i> Các cuộc đấu tranh giai cấp trong lịch sử</h3>
            <table class="theory-table">
                <tr>
                    <th>Thời kỳ</th>
                    <th>Giai cấp đối kháng</th>
                    <th>Sự kiện tiêu biểu</th>
                </tr>
                <tr>
                    <td>Cổ đại</td>
                    <td>Nô lệ ↔ Chủ nô</td>
                    <td>Khởi nghĩa Spartacus (La Mã)</td>
                </tr>
                <tr>
                    <td>Trung đại</td>
                    <td>Nông dân ↔ Địa chủ</td>
                    <td>Các cuộc khởi nghĩa nông dân</td>
                </tr>
                <tr>
                    <td>Cận đại</td>
                    <td>Tư sản ↔ Phong kiến</td>
                    <td>Cách mạng Pháp 1789</td>
                </tr>
                <tr>
                    <td>Hiện đại</td>
                    <td>Vô sản ↔ Tư sản</td>
                    <td>Cách mạng Tháng Mười 1917</td>
                </tr>
            </table>

            <div class="highlight-box" style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(255, 217, 61, 0.1)); border-color: var(--success);">
                <h3><i class="fas fa-bullseye"></i> Vai trò của đấu tranh giai cấp</h3>
                <p>Đấu tranh giai cấp là <strong>động lực trực tiếp</strong> của sự phát triển trong xã hội có giai cấp. Nó thúc đẩy việc thay thế hình thái KT-XH cũ, lạc hậu bằng hình thái mới, tiến bộ hơn.</p>
            </div>
        `
    },
    {
        title: '<i class="fas fa-check-double"></i> TRẢ LỜI: Vì sao xã hội luôn vận động?',
        content: `
            <div class="highlight-box" style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(255, 217, 61, 0.1)); border-color: var(--success);">
                <h3 style="color: var(--success);"><i class="fas fa-award"></i> KẾT LUẬN QUAN TRỌNG</h3>
                <p style="font-size: 1.1rem;">Xã hội loài người <strong>KHÔNG THỂ</strong> đứng yên ổn định mà <strong>LUÔN VẬN ĐỘNG, PHÁT TRIỂN</strong> vì các nguyên nhân sau:</p>
            </div>

            <ol style="padding-left: 20px; line-height: 2.3; margin-top: 25px;">
                <li><strong>📜 Quy luật khách quan:</strong> Mâu thuẫn giữa LLSX và QHSX là <em>tất yếu</em>, không thể tránh khỏi trong bất kỳ xã hội nào.</li>
                <li><strong>⚙️ LLSX không ngừng phát triển:</strong> Con người luôn cải tiến công cụ, nâng cao năng suất lao động để đáp ứng nhu cầu ngày càng tăng.</li>
                <li><strong>🔒 QHSX có tính ổn định tương đối:</strong> Giai cấp thống trị luôn muốn duy trì QHSX có lợi cho mình, tạo ra sức ì.</li>
                <li><strong>💥 Mâu thuẫn tích tụ thành xung đột:</strong> Khi QHSX kìm hãm LLSX quá mức, khủng hoảng và cách mạng xã hội tất yếu nổ ra.</li>
                <li><strong>⚔️ Đấu tranh giai cấp:</strong> Là hình thức biểu hiện và động lực trực tiếp thúc đẩy giải quyết mâu thuẫn, đưa xã hội tiến lên.</li>
            </ol>

            <div class="diagram" style="margin-top: 30px;">
                <p class="diagram-title">🔄 VÒNG XOÁY VĨNH CỬU CỦA LỊCH SỬ</p>
                <div class="diagram-flow">
                    <div class="diagram-item">⚙️ Phát triển LLSX</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">💢 Mâu thuẫn với QHSX</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">⚔️ Đấu tranh giai cấp</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🔥 Cách mạng xã hội</div>
                    <span class="diagram-arrow">→</span>
                    <div class="diagram-item">🌟 Hình thái KT-XH mới</div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 35px; padding: 25px; background: rgba(255,217,61,0.1); border-radius: 15px; border: 1px solid rgba(255,217,61,0.3);">
                <p style="font-size: 1.3rem; color: var(--secondary); margin-bottom: 10px;">
                    <em>"Lịch sử tất cả các xã hội từ trước đến nay<br>chỉ là lịch sử của đấu tranh giai cấp"</em>
                </p>
                <p style="color: var(--text-muted);">— C. Mác & Ph. Ăng-ghen, Tuyên ngôn Đảng Cộng sản (1848) —</p>
            </div>
        `
    }
];

// Quiz Questions
const questions = [
    {
        question: "Hình thái kinh tế - xã hội bao gồm những yếu tố cấu thành nào?",
        options: [
            "Chỉ có lực lượng sản xuất",
            "Lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng",
            "Chỉ có quan hệ sản xuất và giai cấp",
            "Chỉ có yếu tố kinh tế và chính trị"
        ],
        correct: 1,
        explanation: "Hình thái KT-XH có cấu trúc gồm 3 bộ phận cơ bản: Lực lượng sản xuất (nền tảng), Quan hệ sản xuất (cơ sở hạ tầng), và Kiến trúc thượng tầng (bao gồm nhà nước, pháp luật, văn hóa, tư tưởng...)."
    },
    {
        question: "Lực lượng sản xuất bao gồm những yếu tố nào?",
        options: [
            "Chỉ có máy móc và công nghệ hiện đại",
            "Người lao động và tư liệu sản xuất",
            "Chỉ có người lao động với kỹ năng của họ",
            "Quan hệ giữa các giai cấp trong xã hội"
        ],
        correct: 1,
        explanation: "LLSX = Người lao động (với sức khỏe, kỹ năng, kinh nghiệm, tri thức) + Tư liệu sản xuất (gồm đối tượng lao động như nguyên liệu và tư liệu lao động như công cụ, máy móc)."
    },
    {
        question: "Quan hệ sản xuất có mấy mặt cơ bản?",
        options: [
            "2 mặt: sở hữu tư liệu sản xuất và phân phối sản phẩm",
            "3 mặt: sở hữu TLSX, tổ chức quản lý sản xuất, phân phối sản phẩm",
            "4 mặt: sở hữu, sản xuất, tiêu dùng, trao đổi",
            "1 mặt duy nhất: sở hữu tư liệu sản xuất"
        ],
        correct: 1,
        explanation: "QHSX có 3 mặt: (1) Quan hệ sở hữu TLSX - mặt quyết định, (2) Quan hệ tổ chức quản lý sản xuất, (3) Quan hệ phân phối sản phẩm. Ba mặt này có mối liên hệ biện chứng với nhau."
    },
    {
        question: "Trong quy luật về sự phù hợp giữa QHSX với LLSX, yếu tố nào đóng vai trò quyết định?",
        options: [
            "Quan hệ sản xuất quyết định lực lượng sản xuất",
            "Lực lượng sản xuất quyết định quan hệ sản xuất",
            "Cả hai yếu tố quyết định lẫn nhau với vai trò như nhau",
            "Kiến trúc thượng tầng quyết định cả LLSX và QHSX"
        ],
        correct: 1,
        explanation: "LLSX là yếu tố động, cách mạng, có vai trò quyết định QHSX. Tuy nhiên, QHSX cũng có tính độc lập tương đối và có thể tác động trở lại thúc đẩy hoặc kìm hãm LLSX phát triển."
    },
    {
        question: "Điều gì xảy ra khi QHSX không còn phù hợp với trình độ phát triển của LLSX?",
        options: [
            "Xã hội sẽ trở nên ổn định và phát triển nhanh hơn",
            "LLSX sẽ tự động điều chỉnh để phù hợp với QHSX",
            "Mâu thuẫn tích tụ, dẫn đến khủng hoảng và cách mạng xã hội",
            "Không có gì thay đổi, xã hội vẫn vận hành bình thường"
        ],
        correct: 2,
        explanation: "Khi QHSX lạc hậu so với LLSX, nó sẽ kìm hãm sự phát triển của LLSX. Mâu thuẫn tích tụ ngày càng gay gắt, dẫn đến khủng hoảng kinh tế-xã hội, và cuối cùng là cách mạng xã hội để thiết lập QHSX mới phù hợp hơn."
    },
    {
        question: "Theo quan điểm Mác-xít, giai cấp trong xã hội được xác định chủ yếu bởi yếu tố nào?",
        options: [
            "Thu nhập và mức sống hàng ngày",
            "Trình độ học vấn và bằng cấp",
            "Quan hệ với tư liệu sản xuất (sở hữu hay không sở hữu)",
            "Vị trí địa lý và nơi cư trú"
        ],
        correct: 2,
        explanation: "Theo định nghĩa của Lênin, giai cấp được xác định bởi địa vị trong hệ thống sản xuất xã hội, đặc biệt là quan hệ sở hữu đối với tư liệu sản xuất. Đây là tiêu chí cơ bản nhất để phân biệt các giai cấp."
    },
    {
        question: "Đấu tranh giai cấp có vai trò gì trong xã hội có giai cấp?",
        options: [
            "Chỉ gây ra hỗn loạn và bất ổn xã hội, không có tác dụng tích cực",
            "Là động lực trực tiếp thúc đẩy sự phát triển của xã hội có giai cấp",
            "Không có vai trò gì đáng kể trong tiến trình lịch sử",
            "Chỉ xảy ra trong xã hội tư bản chủ nghĩa hiện đại"
        ],
        correct: 1,
        explanation: "Đấu tranh giai cấp là động lực trực tiếp của sự phát triển trong xã hội có giai cấp. Nó thúc đẩy việc thay thế hình thái KT-XH cũ, lỗi thời bằng hình thái mới, tiến bộ hơn, đưa xã hội tiến về phía trước."
    },
    {
        question: "Cách mạng Pháp năm 1789 là cuộc đấu tranh giữa những lực lượng xã hội nào?",
        options: [
            "Nô lệ đấu tranh chống lại chủ nô",
            "Nông dân đấu tranh chống địa chủ phong kiến",
            "Giai cấp tư sản đấu tranh lật đổ chế độ phong kiến",
            "Giai cấp vô sản đấu tranh chống giai cấp tư sản"
        ],
        correct: 2,
        explanation: "Cách mạng Pháp 1789 là cuộc cách mạng tư sản điển hình, trong đó giai cấp tư sản lãnh đạo quần chúng nhân dân lật đổ chế độ phong kiến, xác lập chế độ tư bản chủ nghĩa với các nguyên tắc 'Tự do - Bình đẳng - Bác ái'."
    },
    {
        question: "Theo học thuyết Mác-Lênin, lịch sử loài người đã và sẽ trải qua mấy hình thái kinh tế - xã hội?",
        options: [
            "3 hình thái",
            "4 hình thái",
            "5 hình thái",
            "6 hình thái"
        ],
        correct: 2,
        explanation: "Lịch sử phát triển qua 5 hình thái KT-XH: (1) Công xã nguyên thủy, (2) Chiếm hữu nô lệ, (3) Phong kiến, (4) Tư bản chủ nghĩa, (5) Cộng sản chủ nghĩa (gồm giai đoạn XHCN và Cộng sản). Đây là quy luật phát triển chung của nhân loại."
    },
    {
        question: "Nguyên nhân căn bản nhất khiến xã hội không thể đứng yên mà luôn vận động và phát triển là gì?",
        options: [
            "Vì con người có bản chất thích thay đổi và sáng tạo",
            "Vì mâu thuẫn giữa LLSX và QHSX là tất yếu, khách quan",
            "Vì thiên tai, dịch bệnh và biến đổi khí hậu",
            "Vì chiến tranh và xung đột giữa các quốc gia"
        ],
        correct: 1,
        explanation: "Nguyên nhân căn bản là mâu thuẫn giữa LLSX (luôn có xu hướng phát triển không ngừng) và QHSX (có tính ổn định tương đối). Đây là quy luật khách quan, tất yếu, không phụ thuộc vào ý muốn chủ quan của con người, và là nguồn gốc sâu xa của mọi sự vận động xã hội."
    }
];

// Summary Data
const summaryData = [
    {
        icon: "fa-landmark",
        title: "Hình thái Kinh tế - Xã hội",
        content: "Là xã hội cụ thể tồn tại trong một giai đoạn lịch sử, gồm LLSX, QHSX (cơ sở hạ tầng) và kiến trúc thượng tầng. Lịch sử nhân loại phát triển qua 5 hình thái: Công xã nguyên thủy → Chiếm hữu nô lệ → Phong kiến → Tư bản chủ nghĩa → Cộng sản chủ nghĩa."
    },
    {
        icon: "fa-cogs",
        title: "Lực lượng sản xuất",
        content: "Bao gồm người lao động và tư liệu sản xuất. Đây là yếu tố ĐỘNG, CÁCH MẠNG, luôn có xu hướng phát triển không ngừng và quyết định sự phát triển của xã hội. LLSX phát triển là nguồn gốc của mọi biến đổi xã hội."
    },
    {
        icon: "fa-handshake",
        title: "Quan hệ sản xuất",
        content: "Gồm 3 mặt: sở hữu TLSX (mặt quyết định), tổ chức quản lý sản xuất, và phân phối sản phẩm. QHSX có tính ỔN ĐỊNH TƯƠNG ĐỐI, phải phù hợp với trình độ phát triển của LLSX thì xã hội mới phát triển thuận lợi."
    },
    {
        icon: "fa-bolt",
        title: "Mâu thuẫn LLSX - QHSX",
        content: "Đây là QUY LUẬT CƠ BẢN giải thích sự vận động của xã hội. Khi QHSX không còn phù hợp với LLSX (trở thành lực cản), mâu thuẫn gay gắt dẫn đến khủng hoảng và cách mạng xã hội, từ đó QHSX mới ra đời, xã hội tiến lên hình thái mới."
    },
    {
        icon: "fa-fist-raised",
        title: "Đấu tranh giai cấp",
        content: "Là hình thức biểu hiện của mâu thuẫn LLSX-QHSX trong xã hội có giai cấp. Giai cấp được xác định bởi quan hệ sở hữu TLSX. Đấu tranh giai cấp là ĐỘNG LỰC TRỰC TIẾP thúc đẩy sự phát triển và thay đổi hình thái KT-XH."
    },
    {
        icon: "fa-check-double",
        title: "Kết luận: Vì sao xã hội luôn vận động?",
        content: "Xã hội LUÔN VẬN ĐỘNG vì: (1) Mâu thuẫn LLSX-QHSX là tất yếu, khách quan; (2) LLSX không ngừng phát triển do nhu cầu của con người; (3) QHSX có tính ổn định tương đối, dần trở nên lạc hậu; (4) Mâu thuẫn tích tụ dẫn đến cách mạng; (5) Đấu tranh giai cấp là động lực trực tiếp thúc đẩy thay đổi. Đây là quy luật khách quan của lịch sử!"
    }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    hideLoadingScreen();
});

function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#e94560', '#ffd93d', '#6c63ff', '#2ecc71'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2500);
}

// ============================================
// SCREEN NAVIGATION
// ============================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startGame() {
    initAudio();
    playSound('click');
    currentTheory = 0;
    currentQuestion = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    streak = 0;
    maxStreak = 0;
    showScreen('theory-screen');
    showTheory();
    createProgressSteps();
}

// ============================================
// THEORY SECTION
// ============================================

function createProgressSteps() {
    const container = document.getElementById('progress-steps');
    container.innerHTML = '';
    for (let i = 0; i < theories.length; i++) {
        const step = document.createElement('div');
        step.className = 'progress-step';
        if (i < currentTheory) step.classList.add('completed');
        if (i === currentTheory) step.classList.add('current');
        container.appendChild(step);
    }
}

function showTheory() {
    const theory = theories[currentTheory];
    const progress = ((currentTheory + 1) / theories.length) * 100;
    
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('chapter-num').textContent = currentTheory + 1;
    
    document.getElementById('theory-content').innerHTML = `
        <div class="theory-card">
            <h2>${theory.title}</h2>
            ${theory.content}
        </div>
    `;
    
    const prevBtn = document.getElementById('prev-btn');
    prevBtn.classList.toggle('visible', currentTheory > 0);
    
    const nextBtn = document.getElementById('next-btn');
    if (currentTheory === theories.length - 1) {
        nextBtn.innerHTML = '<span>Làm Quiz</span><i class="fas fa-brain"></i>';
    } else {
        nextBtn.innerHTML = '<span>Tiếp theo</span><i class="fas fa-arrow-right"></i>';
    }
    
    createProgressSteps();
}

function nextTheory() {
    playSound('click');
    if (currentTheory < theories.length - 1) {
        currentTheory++;
        showTheory();
    } else {
        startQuiz();
    }
}

function prevTheory() {
    playSound('click');
    if (currentTheory > 0) {
        currentTheory--;
        showTheory();
    }
}

// ============================================
// QUIZ SECTION
// ============================================

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    streak = 0;
    maxStreak = 0;
    showScreen('quiz-screen');
    showQuestion();
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = 30;
    
    const q = questions[currentQuestion];
    document.getElementById('score').textContent = score;
    document.getElementById('question-num').textContent = currentQuestion + 1;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('quiz-progress').style.width = ((currentQuestion + 1) / questions.length * 100) + '%';
    document.getElementById('streak').textContent = streak;
    
    const streakDisplay = document.getElementById('streak-display');
    streakDisplay.classList.toggle('visible', streak >= 2);
    
    const letters = ['A', 'B', 'C', 'D'];
    let optionsHtml = q.options.map((opt, i) => 
        `<button class="option-btn" data-letter="${letters[i]}" onclick="selectAnswer(${i})">${opt}</button>`
    ).join('');
    
    document.getElementById('quiz-content').innerHTML = `
        <p class="question-text">${q.question}</p>
        <div class="options" id="options">${optionsHtml}</div>
    `;
    
    startTimer();
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    const timerContainer = document.querySelector('.stat-item.timer');
    
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
    });
    
    wrongCount++;
    streak = 0;
    document.getElementById('streak-display').classList.remove('visible');
    playSound('wrong');
    
    showFeedback(false, q.explanation);
}

function selectAnswer(selected) {
    clearInterval(timer);
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    const isCorrect = selected === q.correct;
    
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === selected && !isCorrect) opt.classList.add('wrong');
    });
    
    if (isCorrect) {
        score += 10;
        correctCount++;
        streak++;
        if (streak > maxStreak) maxStreak = streak;
        
        // Bonus for streak
        if (streak >= 3) {
            score += 5;
            showToast(`🔥 Chuỗi ${streak}! +5 điểm thưởng!`, 'success');
        }
        
        playSound('correct');
    } else {
        wrongCount++;
        streak = 0;
        playSound('wrong');
    }
    
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    document.getElementById('streak-display').classList.toggle('visible', streak >= 2);
    
    showFeedback(isCorrect, q.explanation);
}

function showFeedback(isCorrect, explanation) {
    const feedbackHtml = `
        <div class="feedback ${isCorrect ? 'correct' : 'wrong'}">
            <div class="feedback-header">
                <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <span>${isCorrect ? 'Chính xác!' : 'Chưa đúng!'}</span>
            </div>
            <p>${explanation}</p>
        </div>
        <button class="next-question-btn" onclick="nextQuestion()">
            ${currentQuestion < questions.length - 1 ? 'Câu tiếp theo →' : '📊 Xem kết quả'}
        </button>
    `;
    
    document.getElementById('quiz-content').innerHTML += feedbackHtml;
}

function nextQuestion() {
    playSound('click');
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}

// ============================================
// RESULT SECTION
// ============================================

function showResult() {
    showScreen('result-screen');
    playSound('complete');
    
    let title, badge;
    if (score >= 90) {
        title = "🎉 XUẤT SẮC!";
        badge = "🏆";
        createConfetti();
    } else if (score >= 70) {
        title = "👏 GIỎI LẮM!";
        badge = "🥈";
        createConfetti();
    } else if (score >= 50) {
        title = "💪 KHÁ TỐT!";
        badge = "🥉";
    } else {
        title = "📚 CẦN CỐ GẮNG!";
        badge = "📖";
    }
    
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-badge').textContent = badge;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('wrong-count').textContent = wrongCount;
    document.getElementById('max-streak').textContent = maxStreak;
    
    // Animate score
    animateScore(score);
    
    document.getElementById('conclusion').innerHTML = `
        <h3><i class="fas fa-scroll"></i> Kết luận quan trọng</h3>
        <p>Xã hội loài người <strong>luôn vận động và phát triển</strong> chứ không thể đứng yên ổn định vì:</p>
        <ul>
            <li><strong>Lực lượng sản xuất</strong> luôn có xu hướng phát triển không ngừng do nhu cầu của con người.</li>
            <li><strong>Quan hệ sản xuất</strong> có tính ổn định tương đối, dần trở nên lạc hậu so với LLSX.</li>
            <li>Mâu thuẫn giữa LLSX và QHSX là <strong>tất yếu, khách quan</strong>, tích tụ dẫn đến cách mạng xã hội.</li>
            <li><strong>Đấu tranh giai cấp</strong> là động lực trực tiếp thúc đẩy sự thay đổi và phát triển.</li>
        </ul>
        <div class="conclusion-quote">
            "Sự phát triển của xã hội là một quá trình lịch sử - tự nhiên, tuân theo các quy luật khách quan không phụ thuộc vào ý muốn chủ quan của con người."
        </div>
    `;
}

function animateScore(finalScore) {
    const scoreEl = document.getElementById('result-score-num');
    const circleEl = document.getElementById('score-circle');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (finalScore / 100) * circumference;
    
    let currentScore = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function updateScore(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentScore = Math.round(easeOut * finalScore);
        scoreEl.textContent = currentScore;
        
        const currentOffset = circumference - (currentScore / 100) * circumference;
        circleEl.style.strokeDashoffset = currentOffset;
        
        if (progress < 1) {
            requestAnimationFrame(updateScore);
        }
    }
    
    // Add gradient definition to SVG
    const svg = document.querySelector('.score-circle svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#e94560"/>
                <stop offset="50%" style="stop-color:#ff6b6b"/>
                <stop offset="100%" style="stop-color:#ffd93d"/>
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
    
    circleEl.style.stroke = 'url(#scoreGradient)';
    circleEl.style.strokeDasharray = circumference;
    circleEl.style.strokeDashoffset = circumference;
    
    requestAnimationFrame(updateScore);
}

function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#e94560', '#ffd93d', '#6c63ff', '#2ecc71', '#ff6b6b'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        container.appendChild(confetti);
    }
    
    // Clean up after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ============================================
// SUMMARY SECTION
// ============================================

function showSummary() {
    playSound('click');
    showScreen('summary-screen');
    
    document.getElementById('summary-sections').innerHTML = summaryData.map((item, index) => `
        <div class="timeline-item glass-card">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h3><i class="fas ${item.icon}"></i> ${item.title}</h3>
                <p>${item.content}</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// UTILITIES
// ============================================

function restartGame() {
    playSound('click');
    showScreen('welcome-screen');
}

function shareResult() {
    const text = `🎓 Tôi đạt ${score}/100 điểm trong game "Bánh Xe Lịch Sử" - Triết học Mác-Lênin!\n\n` +
                 `✅ Đúng: ${correctCount} | ❌ Sai: ${wrongCount} | 🔥 Chuỗi max: ${maxStreak}\n\n` +
                 `Bạn có thể làm tốt hơn không? 🤔`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Bánh Xe Lịch Sử - Game Triết Học',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Đã copy kết quả!', 'success');
        });
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
