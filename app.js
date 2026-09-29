/**
 * Giỏ Hàng Thông Minh - Smart Cart Guard
 * Redesigned Compact & Modern Edition
 */

// Global State
const state = {
  currentImage: null,
  currentData: null,
  priceChartInstance: null,
  showOcrBoxes: true,
  isDark: localStorage.getItem('smart_cart_theme') === 'dark',
  history: JSON.parse(localStorage.getItem('smart_cart_history') || '[]'),
  totalSaved: parseInt(localStorage.getItem('smart_cart_total_saved') || '1250000', 10),
};

// Preset Scenarios
const PRESETS = {
  'fake-sale': {
    title: 'Tai nghe Chống Ồn XYZ Pro ANC',
    source: 'Shopee Mall',
    originalPrice: 1200000,
    salePrice: 399000,
    voucherText: 'Giảm 50% (Max 15k, Đơn 250k)',
    shippingFee: 38000,
    quantityText: '1 chiếc',
    fomoText: '00:03:45 (Chỉ còn 3 suất)',
    score: 32,
    scoreLabel: 'Bẫy Bơm Giá',
    scoreColor: '#ef4444',
    summaryHeadline: 'Phát hiện bẫy giá gốc ảo để giả vờ giảm sốc 67%!',
    summaryDesc: 'Giá gốc 1.200.000đ bị đẩy lên trước đợt sale. Thực tế suốt 90 ngày qua giá luôn quanh mức 380k - 400k. Bạn không thực sự hời 800k như quảng cáo!',
    realDiscountPct: '0% (Giá thường ngày)',
    tricks: [
      {
        type: 'danger',
        icon: 'tag',
        name: 'Bơm giá gốc ảo (Fake Anchor Price)',
        detail: 'Giá gạch 1.200.000đ cao gấp 3 lần giá trị thị trường thực tế.',
        advice: 'So sánh mức 399k với các đại lý uy tín khác thay vì tin % giảm giá.'
      },
      {
        type: 'warning',
        icon: 'ticket',
        name: 'Voucher trần thấp (Max 15k)',
        detail: 'Banner quảng cáo to "GIẢM 50%" nhưng bẫy chữ nhỏ giới hạn tối đa 15.000đ.',
        advice: 'Luôn trừ trực tiếp số tiền trần (15k) vào giá sản phẩm.'
      }
    ],
    chartData: {
      labels: ['T7', 'T8', 'T9 (Tuần 1)', 'T9 (Tuần 2)', 'T9 (3 ngày trước)', 'Hiện tại'],
      prices: [390000, 395000, 385000, 410000, 1200000, 399000],
      marketAvg: 395000
    },
    ocrBoxes: [
      { top: '22%', left: '4%', width: '92%', height: '28%', tag: 'Giá Gốc Ảo', type: 'trick-danger' },
      { top: '56%', left: '4%', width: '92%', height: '36%', tag: 'Voucher Max 15k', type: 'trick-warning' }
    ],
    canvasBg: {
      colorA: '#064e3b',
      colorB: '#0f172a',
      badge: 'SALE 67% HÔM NAY',
      priceA: '1.200.000đ',
      priceB: '399.000đ',
      tagline: 'VOUCHER 50% - DUY NHẤT HÔM NAY'
    }
  },

  'voucher-trap': {
    title: 'Nồi Chiên Không Dầu Điện Tử 8L',
    source: 'TikTok Shop Livestream',
    originalPrice: 1590000,
    salePrice: 899000,
    voucherText: 'Giảm 100k (Đơn từ 2.500.000đ)',
    shippingFee: 65000,
    quantityText: '1 bộ',
    fomoText: 'Đang có 1.200 người xem',
    score: 45,
    scoreLabel: 'Voucher Chưa Đạt',
    scoreColor: '#f59e0b',
    summaryHeadline: 'Voucher giảm 100k nhưng sản phẩm chưa đủ điều kiện áp dụng!',
    summaryDesc: 'Voucher đòi hỏi đơn tối thiểu 2.5 triệu. Người mua dễ bị dẫn dụ nhét thêm đồ không cần thiết vào giỏ để hưởng mã giảm giá.',
    realDiscountPct: '0% Áp dụng',
    tricks: [
      {
        type: 'danger',
        icon: 'ticket',
        name: 'Bẫy đơn tối thiểu (Minimum Spend Trap)',
        detail: 'Kích thích người mua chi thêm 1.6 triệu cho các món phụ chỉ để lấy 100k giảm giá.',
        advice: 'Không mua thêm hàng ngoài dự kiến chỉ để cứu 1 voucher.'
      },
      {
        type: 'warning',
        icon: 'truck',
        name: 'Phí ship hàng cồng kềnh',
        detail: 'Phí ship 65.000đ khiến giá cuối cùng đội lên 964.000đ.',
        advice: 'Kiểm tra kỹ bước tính ship trước khi chốt đơn.'
      }
    ],
    chartData: {
      labels: ['T6', 'T7', 'T8', 'T9 (Đầu tháng)', 'Tuần trước', 'Hiện tại'],
      prices: [950000, 920000, 890000, 910000, 950000, 899000],
      marketAvg: 910000
    },
    ocrBoxes: [
      { top: '56%', left: '4%', width: '92%', height: '36%', tag: 'Đơn Tối Thiểu 2.5Tr', type: 'trick-danger' }
    ],
    canvasBg: {
      colorA: '#831843',
      colorB: '#1e293b',
      badge: 'VOUCHER 100K LIVESTREAM',
      priceA: '1.590.000đ',
      priceB: '899.000đ',
      tagline: 'ĐƠN TỐI THIỂU 2.500.000đ'
    }
  },

  'combo-trap': {
    title: 'Combo 3 Tuýp Sữa Rửa Mặt Tràm Trà',
    source: 'Lazada Mall',
    originalPrice: 450000,
    salePrice: 320000,
    voucherText: 'Tặng kèm bông tẩy trang',
    shippingFee: 22000,
    quantityText: '3 tuýp x 100ml',
    fomoText: 'Chỉ còn 8 combo',
    score: 40,
    scoreLabel: 'Combo Đắt Hơn Lẻ',
    scoreColor: '#ef4444',
    summaryHeadline: 'Mua combo 3 tuýp đắt hơn mua 3 lần lẻ!',
    summaryDesc: 'Mua lẻ 1 tuýp giá 99.000đ (3 tuýp = 297.000đ). Nhưng combo 3 tuýp bán giá 320.000đ, tức bạn bị đắt hơn 23.000đ!',
    realDiscountPct: 'Đắt hơn lẻ +7.7%',
    tricks: [
      {
        type: 'danger',
        icon: 'package',
        name: 'Bẫy Combo giá ngược (Reverse Bundle Trap)',
        detail: 'Lợi dụng tâm lý người mua nghĩ combo luôn rẻ hơn để nâng giá.',
        advice: 'Lấy giá combo chia cho số lượng món trước khi bấm mua.'
      }
    ],
    chartData: {
      labels: ['1 Tuýp Lẻ x3', 'Giá Combo 3', 'Giá Chuẩn'],
      prices: [297000, 320000, 290000],
      marketAvg: 295000
    },
    ocrBoxes: [
      { top: '22%', left: '4%', width: '92%', height: '30%', tag: 'Combo 320k > Mua lẻ 297k', type: 'trick-danger' }
    ],
    canvasBg: {
      colorA: '#166534',
      colorB: '#0f172a',
      badge: 'COMBO SIÊU TIẾT KIỆM X3',
      priceA: '450.000đ',
      priceB: '320.000đ',
      tagline: 'LẺ 99K/TUÝP (3 TUÝP = 297K)'
    }
  },

  'fomo-trap': {
    title: 'Khóa Học Tiếng Anh Online 30 Ngày',
    source: 'Facebook Ad',
    originalPrice: 2499000,
    salePrice: 499000,
    voucherText: 'Tặng kèm 5 Ebook',
    shippingFee: 0,
    quantityText: 'Khóa học',
    fomoText: 'Chỉ còn 2 suất! Hết hạn sau 05:00',
    score: 28,
    scoreLabel: 'FOMO Ảo Giả Lập',
    scoreColor: '#ef4444',
    summaryHeadline: 'Đồng hồ đếm ngược và số lượng suất tự động reset liên tục!',
    summaryDesc: 'Website chạy script đếm ngược ảo 5 phút để tạo cảm giác khan hiếm giả tạo, ép khách mua vội vàng.',
    realDiscountPct: 'Giá cố định quanh năm',
    tricks: [
      {
        type: 'danger',
        icon: 'hourglass',
        name: 'Đếm ngược áp lực giả (Fake Urgency)',
        detail: 'Cứ sau 5 phút hoặc khi tải lại trang, đồng hồ và 2 suất còn lại lại tự reset.',
        advice: 'Tải lại trang bằng tab ẩn danh để kiểm chứng thời gian đếm ngược.'
      }
    ],
    chartData: {
      labels: ['Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Hiện tại'],
      prices: [499000, 499000, 499000, 499000, 499000],
      marketAvg: 499000
    },
    ocrBoxes: [
      { top: '56%', left: '4%', width: '92%', height: '36%', tag: 'Reset Đếm Ngược 5 Phút', type: 'trick-danger' }
    ],
    canvasBg: {
      colorA: '#9a3412',
      colorB: '#1e1b4b',
      badge: 'DUY NHẤT HÔM NAY - 2 SUẤT CUỐI',
      priceA: '2.499.000đ',
      priceB: '499.000đ',
      tagline: 'RESET TỰ ĐỘNG 05:00'
    }
  }
};

// DOM References
const themeToggleBtn = document.getElementById('btn-theme-toggle');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const uploadPrompt = document.getElementById('upload-prompt');
const previewWrapper = document.getElementById('preview-wrapper');
const previewImage = document.getElementById('preview-image');
const previewFilename = document.getElementById('preview-filename');
const btnRemoveImage = document.getElementById('btn-remove-image');
const btnToggleOcrView = document.getElementById('btn-toggle-ocr-view');
const ocrToggleText = document.getElementById('ocr-toggle-text');
const scanOverlay = document.getElementById('scan-overlay');
const ocrBoxesContainer = document.getElementById('ocr-boxes');

const btnAnalyze = document.getElementById('btn-analyze');
const btnAnalyzeText = document.getElementById('btn-analyze-text');
const spinnerAnalyze = document.getElementById('spinner-analyze');

const btnToggleManual = document.getElementById('btn-toggle-manual');
const manualFormContent = document.getElementById('manual-form-content');
const arrowManual = document.getElementById('arrow-manual');
const btnApplyManual = document.getElementById('btn-apply-manual');

const inputTitle = document.getElementById('input-title');
const inputOrigPrice = document.getElementById('input-original-price');
const inputSalePrice = document.getElementById('input-sale-price');
const inputVoucherText = document.getElementById('input-voucher-text');
const inputShipFee = document.getElementById('input-shipping-fee');

const emptyState = document.getElementById('empty-state');
const reportContent = document.getElementById('report-content');
const reportSourceTag = document.getElementById('report-source-tag');
const reportTimestamp = document.getElementById('report-timestamp');
const reportProductName = document.getElementById('report-product-name');
const scoreCircle = document.getElementById('score-circle');
const scoreNumber = document.getElementById('score-number');
const scoreLabel = document.getElementById('score-label');

const summaryAlertBox = document.getElementById('summary-alert-box');
const summaryIcon = document.getElementById('summary-icon');
const summaryHeadline = document.getElementById('summary-headline');
const summaryDescription = document.getElementById('summary-description');

const valOriginalPrice = document.getElementById('val-original-price');
const valSalePrice = document.getElementById('val-sale-price');
const valVoucherCut = document.getElementById('val-voucher-cut');
const valShipFee = document.getElementById('val-ship-fee');
const valFinalTotal = document.getElementById('val-final-total');
const realDiscountTag = document.getElementById('real-discount-tag');

const tricksList = document.getElementById('tricks-list');
const unitPriceCalc = document.getElementById('unit-price-calc');
const workHoursCalc = document.getElementById('work-hours-calc');

const checklistItems = document.getElementById('checklist-items');
const checklistProgress = document.getElementById('checklist-progress');
const btnSaveDecisionSkip = document.getElementById('btn-save-decision-skip');
const btnSaveVal = document.getElementById('btn-save-val');
const btnShareReport = document.getElementById('btn-share-report');
const globalSavedAmount = document.getElementById('global-saved-amount');
const historyBadge = document.getElementById('history-badge');

const modalQuickTools = document.getElementById('modal-quick-tools');
const btnQuickTools = document.getElementById('btn-quick-tools');
const btnCloseTools = document.getElementById('btn-close-tools');

const modalHistory = document.getElementById('modal-history');
const btnOpenHistory = document.getElementById('btn-open-history');
const btnCloseHistory = document.getElementById('btn-close-history');
const btnDoneHistory = document.getElementById('btn-done-history');
const historyList = document.getElementById('history-list');
const btnClearHistory = document.getElementById('btn-clear-history');

// Format Currency
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(Math.max(0, Math.round(amount))) + 'đ';
}

// Refresh Lucide Icons Helper
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// Theme handling
function applyTheme() {
  if (state.isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('smart_cart_theme', state.isDark ? 'dark' : 'light');
  if (state.currentData && state.currentData.chartData) {
    renderPriceChart(state.currentData.chartData);
  }
}

// Toast
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const colors = {
    info: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-500 text-slate-950',
    danger: 'bg-rose-500 text-white',
  };
  const iconMap = {
    info: 'info',
    success: 'check-circle-2',
    warning: 'alert-triangle',
    danger: 'alert-octagon',
  };

  toast.className = `px-3 py-2 rounded-lg shadow-lg font-semibold text-xs flex items-center gap-1.5 pointer-events-auto toast-in ${colors[type] || colors.info}`;
  toast.innerHTML = `<i data-lucide="${iconMap[type] || 'info'}" class="w-4 h-4 shrink-0"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  refreshIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Clean Proportional Canvas Generator
function generatePresetCanvas(config) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 600, 360);
  grad.addColorStop(0, config.colorA || '#064e3b');
  grad.addColorStop(1, config.colorB || '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 360);

  // Subtle grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 600; i += 30) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 360); ctx.stroke();
  }

  // Top Sale Badge
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(30, 25, 260, 38, 6);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText((config.badge || 'SIÊU GIẢM GIÁ 70%'), 42, 50);

  // Price Section Card Container
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.roundRect(25, 80, 550, 105, 10);
  ctx.fill();

  // Original Strikethrough Price
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Giá niêm yết: ' + (config.priceA || '1.200.000đ'), 40, 115);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(38, 109);
  ctx.lineTo(265, 109);
  ctx.stroke();

  // Current Sale Price
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(config.priceB || '399.000đ', 40, 165);

  // Voucher / Promotion Card Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(25, 205, 550, 125, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText((config.tagline || 'VOUCHER 50% - DUY NHẤT HÔM NAY'), 45, 245);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('* Áp dụng khi thanh toán ngay trong 03:45 giây (Tối đa 15k)', 45, 280);

  ctx.fillStyle = '#64748b';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Phí vận chuyển tiêu chuẩn: +38.000đ', 45, 308);

  return canvas.toDataURL('image/png');
}

// Update History UI
function updateHistoryStats() {
  historyBadge.textContent = state.history.length;
  globalSavedAmount.textContent = formatVND(state.totalSaved);
  localStorage.setItem('smart_cart_total_saved', state.totalSaved.toString());
}

function renderHistoryList() {
  if (state.history.length === 0) {
    historyList.innerHTML = `
      <div class="py-6 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5">
        <i data-lucide="inbox" class="w-6 h-6 text-slate-300 dark:text-slate-600"></i>
        <span>Chưa có món hàng nào được lưu.</span>
      </div>
    `;
    refreshIcons();
    return;
  }

  historyList.innerHTML = state.history.map(item => `
    <div class="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
      <div class="space-y-0.5 max-w-[70%]">
        <div class="font-bold text-slate-800 dark:text-slate-200 truncate">${item.title}</div>
        <div class="text-[10px] text-slate-400">Độ tin cậy: ${item.score}/100 • ${item.date}</div>
      </div>
      <div class="text-right font-bold text-emerald-600 dark:text-emerald-400">
        +${formatVND(item.savedAmount)}
      </div>
    </div>
  `).join('');
}

// Handle Image Files
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Vui lòng chọn hình ảnh hợp lệ!', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    state.currentImage = e.target.result;
    previewImage.src = state.currentImage;
    previewFilename.textContent = file.name || 'screenshot.png';
    uploadPrompt.classList.add('hidden');
    previewWrapper.classList.remove('hidden');
    ocrBoxesContainer.innerHTML = '';

    const customData = {
      title: 'Sản phẩm chụp màn hình (Auto OCR)',
      source: 'Ảnh chụp màn hình',
      originalPrice: 850000,
      salePrice: 299000,
      voucherText: 'Giảm 30k (Đơn từ 300k)',
      shippingFee: 32000,
      quantityText: '1 sản phẩm',
      score: 38,
      scoreLabel: 'Cần Cảnh Giác',
      scoreColor: '#f59e0b',
      summaryHeadline: 'Phát hiện chênh lệch giá niêm yết và voucher bị kẹt điều kiện',
      summaryDesc: 'Mức giá sale 299.000đ là giá bán thông thường. Voucher 30k đòi hỏi đơn từ 300k.',
      realDiscountPct: 'Giảm thực ~0%',
      tricks: [
        {
          type: 'warning',
          icon: 'tag',
          name: 'Giá gốc bị nâng cao',
          detail: 'Giá gạch 850.000đ cao hơn so với giá bán chuẩn thị trường.',
          advice: 'Đối chiếu từ khóa sản phẩm trên sàn khác.'
        },
        {
          type: 'warning',
          icon: 'ticket',
          name: 'Chưa đủ điều kiện voucher',
          detail: 'Giá sản phẩm 299k thiếu 1.000đ để áp dụng voucher 30k đơn 300k.',
          advice: 'Tránh nhét thêm món không cần thiết vào giỏ.'
        }
      ],
      chartData: {
        labels: ['T7', 'T8', 'T9 (Tuần 1)', 'Tuần này'],
        prices: [310000, 300000, 299000, 299000],
        marketAvg: 300000
      },
      ocrBoxes: [
        { top: '25%', left: '5%', width: '90%', height: '30%', tag: 'Giá sale thông thường', type: 'trick-warning' }
      ]
    };

    populateFormWithData(customData);
    runAnalysis(customData);
  };
  reader.readAsDataURL(file);
}

function populateFormWithData(data) {
  inputTitle.value = data.title;
  inputOrigPrice.value = data.originalPrice;
  inputSalePrice.value = data.salePrice;
  inputVoucherText.value = data.voucherText;
  inputShipFee.value = data.shippingFee;
}

function renderOCRBoxes(boxes) {
  ocrBoxesContainer.innerHTML = '';
  if (!boxes || boxes.length === 0 || !state.showOcrBoxes) return;

  boxes.forEach(box => {
    const el = document.createElement('div');
    el.className = `ocr-box ${box.type || ''}`;
    el.style.top = box.top;
    el.style.left = box.left;
    el.style.width = box.width;
    el.style.height = box.height;

    const tag = document.createElement('span');
    tag.className = 'ocr-tag';
    const tagIcon = box.type === 'trick-danger' ? 'alert-triangle' : 'info';
    tag.innerHTML = `<i data-lucide="${tagIcon}" class="w-2.5 h-2.5 inline"></i><span>${box.tag}</span>`;
    el.appendChild(tag);

    ocrBoxesContainer.appendChild(el);
  });
  refreshIcons();
}

// Run Analysis
function runAnalysis(data) {
  state.currentData = data;

  btnAnalyze.disabled = true;
  spinnerAnalyze.classList.remove('hidden');
  const btnAnalyzeIcon = document.getElementById('btn-analyze-icon');
  if (btnAnalyzeIcon) btnAnalyzeIcon.classList.add('hidden');
  btnAnalyzeText.textContent = 'AI Đang Quét...';
  scanOverlay.classList.remove('hidden');
  ocrBoxesContainer.innerHTML = '';

  setTimeout(() => {
    btnAnalyze.disabled = false;
    spinnerAnalyze.classList.add('hidden');
    if (btnAnalyzeIcon) btnAnalyzeIcon.classList.remove('hidden');
    btnAnalyzeText.textContent = 'Quét & Bóc Mẽ Chiêu Trò';
    scanOverlay.classList.add('hidden');

    emptyState.classList.add('hidden');
    reportContent.classList.remove('hidden');

    renderOCRBoxes(data.ocrBoxes);

    reportSourceTag.textContent = data.source || 'TMĐT';
    reportTimestamp.textContent = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    reportProductName.textContent = data.title;

    // Deal score
    animateScore(data.score, data.scoreLabel, data.scoreColor);

    // Summary alert
    summaryHeadline.textContent = data.summaryHeadline;
    summaryDescription.textContent = data.summaryDesc;

    if (data.score <= 35) {
      summaryAlertBox.className = 'p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs';
      summaryHeadline.className = 'font-bold text-rose-800 dark:text-rose-300';
      summaryIcon.className = 'p-1 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 shrink-0 mt-0.5 flex items-center justify-center';
      summaryIcon.innerHTML = '<i data-lucide="shield-alert" class="w-4 h-4"></i>';
    } else {
      summaryAlertBox.className = 'p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs';
      summaryHeadline.className = 'font-bold text-amber-800 dark:text-amber-300';
      summaryIcon.className = 'p-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5 flex items-center justify-center';
      summaryIcon.innerHTML = '<i data-lucide="alert-triangle" class="w-4 h-4"></i>';
    }

    // Calculations
    const origP = data.originalPrice;
    const saleP = data.salePrice;
    const shipP = data.shippingFee;
    let voucherCut = data.voucherText.includes('15k') ? 15000 : 0;
    const finalTotal = Math.max(0, saleP - voucherCut + shipP);

    valOriginalPrice.textContent = formatVND(origP);
    valSalePrice.textContent = formatVND(saleP);
    valVoucherCut.textContent = voucherCut > 0 ? `-${formatVND(voucherCut)}` : '0đ';
    valShipFee.textContent = `+${formatVND(shipP)}`;
    valFinalTotal.textContent = formatVND(finalTotal);
    realDiscountTag.textContent = data.realDiscountPct;
    btnSaveVal.textContent = formatVND(finalTotal);

    renderTricks(data.tricks);
    renderPriceChart(data.chartData);

    unitPriceCalc.textContent = `${formatVND(saleP)} / ${data.quantityText || 'món'}`;
    workHoursCalc.textContent = `~ ${(finalTotal / 35000).toFixed(1)} giờ lao động`;

    resetChecklist();
    refreshIcons();
    showToast('Đã phân tích xong chiêu trò giá!', 'success');
  }, 600);
}

function animateScore(targetScore, label, color) {
  const iconHtml = targetScore <= 35 ? '<i data-lucide="shield-alert" class="w-3 h-3 inline"></i>' : '<i data-lucide="alert-triangle" class="w-3 h-3 inline"></i>';
  scoreLabel.innerHTML = `${label} ${iconHtml}`;
  scoreLabel.style.color = color;
  scoreNumber.style.color = color;
  scoreCircle.style.color = color;

  let current = 0;
  const interval = setInterval(() => {
    current += 3;
    if (current >= targetScore) {
      current = targetScore;
      clearInterval(interval);
    }
    scoreNumber.textContent = current;
    scoreCircle.setAttribute('stroke-dasharray', `${current}, 100`);
  }, 15);
  refreshIcons();
}

function renderTricks(tricks) {
  if (!tricks || tricks.length === 0) {
    tricksList.innerHTML = '<div class="text-[11px] text-slate-400">Không có bẫy giá nguy hiểm.</div>';
    return;
  }

  tricksList.innerHTML = tricks.map(t => {
    const isDanger = t.type === 'danger';
    const bgCls = isDanger 
      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' 
      : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
    const titleCls = isDanger ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300';
    const trickIcon = t.icon || (isDanger ? 'alert-octagon' : 'alert-triangle');

    return `
      <div class="p-2.5 rounded-lg border ${bgCls} space-y-1.5 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 font-bold ${titleCls} text-[11px]">
            <i data-lucide="${trickIcon}" class="w-3.5 h-3.5 shrink-0"></i>
            <span>${t.name}</span>
          </div>
        </div>
        <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">${t.detail}</p>
        <div class="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-start gap-1">
          <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"></i>
          <span><strong>Né bẫy:</strong> ${t.advice}</span>
        </div>
      </div>
    `;
  }).join('');
  refreshIcons();
}

function renderPriceChart(chartData) {
  const ctx = document.getElementById('priceChart').getContext('2d');
  if (state.priceChartInstance) {
    state.priceChartInstance.destroy();
  }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  state.priceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Giá bán của shop',
          data: chartData.prices,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderWidth: 2,
          tension: 0.25,
          fill: true,
          pointRadius: 3,
        },
        {
          label: 'Giá trung bình thị trường',
          data: chartData.labels.map(() => chartData.marketAvg),
          borderColor: '#f59e0b',
          borderDash: [4, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 9, family: '"Plus Jakarta Sans"' }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatVND(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 9 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 9 },
            callback: (v) => formatVND(v)
          }
        }
      }
    }
  });
}

function resetChecklist() {
  const checkboxes = checklistItems.querySelectorAll('.checklist-cb');
  checkboxes.forEach(cb => {
    cb.checked = false;
    cb.onchange = updateChecklistProgress;
  });
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const checkboxes = checklistItems.querySelectorAll('.checklist-cb');
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  checklistProgress.textContent = `${checked}/${checkboxes.length} hoàn thành`;
}

// Events
function initEvents() {
  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    state.isDark = !state.isDark;
    applyTheme();
  });

  // Toggle OCR Bounding Boxes overlay
  btnToggleOcrView.addEventListener('click', () => {
    state.showOcrBoxes = !state.showOcrBoxes;
    const iconSpan = document.getElementById('ocr-toggle-icon');
    if (iconSpan) {
      iconSpan.innerHTML = `<i data-lucide="${state.showOcrBoxes ? 'eye' : 'eye-off'}" class="w-3.5 h-3.5"></i>`;
    }
    ocrToggleText.textContent = state.showOcrBoxes ? 'Ẩn bóc tách' : 'Hiện bóc tách';
    if (state.currentData) {
      renderOCRBoxes(state.currentData.ocrBoxes);
    }
    refreshIcons();
  });

  // Presets
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      const preset = PRESETS[presetKey];
      if (!preset) return;

      const canvasUrl = generatePresetCanvas(preset.canvasBg);
      state.currentImage = canvasUrl;
      previewImage.src = canvasUrl;
      previewFilename.textContent = `Preset_${presetKey}.png`;
      uploadPrompt.classList.add('hidden');
      previewWrapper.classList.remove('hidden');

      populateFormWithData(preset);
      runAnalysis(preset);
    });
  });

  // Re-upload button & clicking preview image
  const btnReuploadTrigger = document.getElementById('btn-reupload-trigger');
  if (btnReuploadTrigger) {
    btnReuploadTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  previewImage.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // Remove image
  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', (e) => {
      e.stopPropagation();
      state.currentImage = null;
      previewImage.src = '';
      fileInput.value = '';
      uploadPrompt.classList.remove('hidden');
      previewWrapper.classList.add('hidden');
      ocrBoxesContainer.innerHTML = '';
      refreshIcons();
    });
  }

  // Dropzone
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-emerald-500');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-emerald-500');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-emerald-500');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Global Ctrl + V paste
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        handleFile(item.getAsFile());
        showToast('Đã nhận ảnh chụp màn hình từ Clipboard!', 'success');
        break;
      }
    }
  });

  // Manual accordion
  btnToggleManual.addEventListener('click', () => {
    manualFormContent.classList.toggle('hidden');
    arrowManual.classList.toggle('rotate-180');
  });

  btnApplyManual.addEventListener('click', () => {
    const orig = parseFloat(inputOrigPrice.value) || 500000;
    const sale = parseFloat(inputSalePrice.value) || 300000;
    const ship = parseFloat(inputShipFee.value) || 30000;
    const title = inputTitle.value || 'Sản phẩm tùy chỉnh';
    const voucher = inputVoucherText.value || '';

    const custom = {
      title,
      source: 'Tùy chỉnh',
      originalPrice: orig,
      salePrice: sale,
      voucherText: voucher,
      shippingFee: ship,
      quantityText: '1 sản phẩm',
      score: 55,
      scoreLabel: 'Mức Bình Thường',
      scoreColor: '#f59e0b',
      summaryHeadline: `Đánh giá thông số: ${title}`,
      summaryDesc: `Giá bán ${formatVND(sale)}, phí ship ${formatVND(ship)}. Tổng tiền thanh toán ${formatVND(sale + ship)}.`,
      realDiscountPct: 'Tự điều chỉnh',
      tricks: state.currentData ? state.currentData.tricks : [],
      chartData: state.currentData ? state.currentData.chartData : {
        labels: ['Tuần trước', 'Hiện tại'],
        prices: [orig, sale],
        marketAvg: sale
      },
      ocrBoxes: []
    };
    runAnalysis(custom);
  });

  btnAnalyze.addEventListener('click', () => {
    if (!state.currentImage) {
      document.querySelector('[data-preset=fake-sale]').click();
      return;
    }
    btnApplyManual.click();
  });

  // Skip & Save Decision
  btnSaveDecisionSkip.addEventListener('click', () => {
    if (!state.currentData) return;
    const finalVal = Math.max(0, state.currentData.salePrice + state.currentData.shippingFee);

    state.history.unshift({
      title: state.currentData.title,
      savedAmount: finalVal,
      score: state.currentData.score,
      date: new Date().toLocaleDateString('vi-VN')
    });
    if (state.history.length > 20) state.history.pop();
    localStorage.setItem('smart_cart_history', JSON.stringify(state.history));

    state.totalSaved += finalVal;
    updateHistoryStats();

    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
    showToast(`Đã tránh lãng phí ${formatVND(finalVal)}!`, 'success');
  });

  // Share
  btnShareReport.addEventListener('click', () => {
    if (!state.currentData) return;
    const shareText = `[Giỏ Hàng Thông Minh]\n${state.currentData.title}\nĐộ tin cậy: ${state.currentData.score}/100\nGiá sale: ${formatVND(state.currentData.salePrice)} (Giá gốc: ${formatVND(state.currentData.originalPrice)})\nCảnh báo: ${state.currentData.summaryHeadline}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('Đã sao chép tóm tắt vào Clipboard!', 'success');
    });
  });

  // Quick Tools Modal
  btnQuickTools.addEventListener('click', () => {
    modalQuickTools.classList.remove('hidden');
    refreshIcons();
  });
  btnCloseTools.addEventListener('click', () => modalQuickTools.classList.add('hidden'));

  const tabBtns = [
    { btn: document.getElementById('tab-btn-bundle'), content: document.getElementById('tab-bundle-content') },
    { btn: document.getElementById('tab-btn-voucher'), content: document.getElementById('tab-voucher-content') },
    { btn: document.getElementById('tab-btn-weight'), content: document.getElementById('tab-weight-content') },
  ];

  tabBtns.forEach(({ btn, content }) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(t => {
        t.btn.classList.remove('bg-emerald-600', 'text-white');
        t.btn.classList.add('text-slate-500');
        t.content.classList.add('hidden');
      });
      btn.classList.add('bg-emerald-600', 'text-white');
      btn.classList.remove('text-slate-500');
      content.classList.remove('hidden');
      refreshIcons();
    });
  });

  // Tool 1
  document.getElementById('btn-calc-combo').addEventListener('click', () => {
    const single = parseFloat(document.getElementById('calc-single-price').value) || 0;
    const qty = parseFloat(document.getElementById('calc-combo-qty').value) || 1;
    const combo = parseFloat(document.getElementById('calc-combo-price').value) || 0;
    const singleTotal = single * qty;
    const diff = combo - singleTotal;
    const resBox = document.getElementById('combo-result');
    resBox.classList.remove('hidden');

    if (diff > 0) {
      resBox.className = 'p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] flex items-start gap-1.5';
      resBox.innerHTML = `
        <i data-lucide="alert-octagon" class="w-4 h-4 shrink-0 text-rose-600 mt-0.5"></i>
        <div><strong>BẪY COMBO:</strong> Mua combo đắt hơn mua lẻ ${formatVND(diff)} (Lẻ: ${formatVND(singleTotal)} vs Combo: ${formatVND(combo)}).</div>
      `;
    } else {
      resBox.className = 'p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-start gap-1.5';
      resBox.innerHTML = `
        <i data-lucide="check-circle-2" class="w-4 h-4 shrink-0 text-emerald-600 mt-0.5"></i>
        <div><strong>HỜI THẬT:</strong> Combo rẻ hơn mua lẻ ${formatVND(Math.abs(diff))}.</div>
      `;
    }
    refreshIcons();
  });

  // Tool 2
  document.getElementById('btn-calc-voucher').addEventListener('click', () => {
    const order = parseFloat(document.getElementById('calc-v-order').value) || 1;
    const advertisedPct = parseFloat(document.getElementById('calc-v-pct').value) || 0;
    const maxDiscount = parseFloat(document.getElementById('calc-v-max').value) || 0;
    const actual = Math.min((order * advertisedPct) / 100, maxDiscount);
    const realPct = ((actual / order) * 100).toFixed(1);

    const resBox = document.getElementById('voucher-result');
    resBox.classList.remove('hidden');
    resBox.className = 'p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1';
    resBox.innerHTML = `
      <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
        <i data-lucide="ticket" class="w-3.5 h-3.5 text-amber-500"></i>
        <span>Quảng cáo giảm: <strong>${advertisedPct}%</strong></span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
        <i data-lucide="percent" class="w-3.5 h-3.5 text-rose-500"></i>
        <span>Thực tế giảm: <strong class="text-rose-600 dark:text-rose-400">${formatVND(actual)}</strong> (Chỉ đạt <strong>${realPct}%</strong>)</span>
      </div>
    `;
    refreshIcons();
  });

  // Tool 3
  document.getElementById('btn-calc-weight').addEventListener('click', () => {
    const pA = parseFloat(document.getElementById('calc-w-a-price').value) || 1;
    const wA = parseFloat(document.getElementById('calc-w-a-weight').value) || 1;
    const pB = parseFloat(document.getElementById('calc-w-b-price').value) || 1;
    const wB = parseFloat(document.getElementById('calc-w-b-weight').value) || 1;
    const unitA = (pA / wA) * 100;
    const unitB = (pB / wB) * 100;
    const better = unitA < unitB ? 'Gói A' : 'Gói B';

    const resBox = document.getElementById('weight-result');
    resBox.classList.remove('hidden');
    resBox.className = 'p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1';
    resBox.innerHTML = `
      <div>Đơn giá 100g Gói A: <strong>${formatVND(unitA)}</strong></div>
      <div>Đơn giá 100g Gói B: <strong>${formatVND(unitB)}</strong></div>
      <div class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 pt-0.5 border-t border-slate-200 dark:border-slate-800">
        <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
        <span>${better} tiết kiệm hơn!</span>
      </div>
    `;
    refreshIcons();
  });

  // History modal
  btnOpenHistory.addEventListener('click', () => {
    renderHistoryList();
    modalHistory.classList.remove('hidden');
    refreshIcons();
  });
  btnCloseHistory.addEventListener('click', () => modalHistory.classList.add('hidden'));
  btnDoneHistory.addEventListener('click', () => modalHistory.classList.add('hidden'));

  btnClearHistory.addEventListener('click', () => {
    if (confirm('Xóa sạch lịch sử tiết kiệm?')) {
      state.history = [];
      localStorage.setItem('smart_cart_history', '[]');
      updateHistoryStats();
      renderHistoryList();
      showToast('Đã xóa lịch sử.', 'info');
    }
  });

  [modalQuickTools, modalHistory].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });
}

// Helper to refresh Lucide icons
function refreshIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  updateHistoryStats();
  initEvents();
  refreshIcons();

  setTimeout(() => {
    const firstBtn = document.querySelector('[data-preset=fake-sale]');
    if (firstBtn) firstBtn.click();
    refreshIcons();
  }, 200);
});
