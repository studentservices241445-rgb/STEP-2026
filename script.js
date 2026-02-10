/*
 * Global JavaScript for Ayed Academy Intensive STEP Course Website
 */

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  // Load theme preference from localStorage
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      if (current === 'dark') {
        htmlEl.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  initCountdown();
  initChat();
  initSeatCounter();
  initRegistrationForm();
});

// Countdown timer for discount offer
function initCountdown() {
  const timerEl = document.getElementById('discount-timer');
  if (!timerEl) return;
  const now = Date.now();
  let deadline = localStorage.getItem('discountDeadline');
  if (!deadline || parseInt(deadline) < now) {
    // If no deadline or expired, set new 7-day deadline
    deadline = now + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('discountDeadline', deadline);
  }
  function updateTimer() {
    const diff = parseInt(deadline) - Date.now();
    if (diff <= 0) {
      // When expired: set additional 3 days then 7 days repeatedly
      const ext = localStorage.getItem('discountExtension') || '3';
      let days = parseInt(ext);
      deadline = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem('discountDeadline', deadline);
      // Toggle next extension between 3 and 7
      localStorage.setItem('discountExtension', days === 3 ? '7' : '3');
    }
    const remaining = parseInt(deadline) - Date.now();
    const d = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const h = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((remaining % (60 * 1000)) / 1000);
    timerEl.textContent = `${d}يوم ${h}س ${m}د ${s}ث`;
  }
  setInterval(updateTimer, 1000);
  updateTimer();
}

// Seats counter logic
function initSeatCounter() {
  const seatsEl = document.getElementById('seats-count');
  if (!seatsEl) return;
  let seats = parseInt(localStorage.getItem('seatsRemaining'));
  if (!seats || isNaN(seats)) {
    seats = 30; // starting seats
    localStorage.setItem('seatsRemaining', seats);
  }
  seatsEl.textContent = seats;
  // Optionally, update seats when a registration occurs
  window.addEventListener('storage', () => {
    const newSeats = localStorage.getItem('seatsRemaining');
    if (newSeats) seatsEl.textContent = newSeats;
  });
}

// Simple chat assistant
function initChat() {
  const chatBtn = document.getElementById('chat-button');
  const chatBox = document.getElementById('chat-box');
  if (!chatBtn || !chatBox) return;
  chatBtn.addEventListener('click', () => {
    chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
  });
  const chatInput = document.getElementById('chat-input-field');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  function appendMessage(text, sender) {
    const p = document.createElement('p');
    p.textContent = text;
    p.className = sender;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  const responses = {
    'متى تبدأ الدورة': 'الدورة تبدأ فور إتمام التسجيل، والمحاضرات متاحة على القنوات في تيليجرام.',
    'الخصم': 'الخصم الخاص بيوم التأسيس متوفر لمدة محدودة. تأكد من التسجيل قبل انتهاء العد التنازلي!',
    'كيف اسجل': 'يمكنك التوجه لصفحة التسجيل وملء النموذج وإرفاق إيصال التحويل البنكي.'
  };
  if (chatSend && chatInput) {
    chatSend.addEventListener('click', () => {
      const msg = chatInput.value.trim();
      if (!msg) return;
      appendMessage('أنت: ' + msg, 'user');
      // Simple matching
      let reply = 'شكراً لتواصلك معنا! تواصل مباشرة عبر تيليجرام @Ayed_Academy_2026 لمزيد من التفاصيل.';
      Object.keys(responses).forEach(key => {
        if (msg.includes(key)) reply = responses[key];
      });
      setTimeout(() => appendMessage('المساعد: ' + reply, 'assistant'), 500);
      chatInput.value = '';
    });
  }
}

// Registration form logic
function initRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;
  const prevTestRadios = form.querySelectorAll('input[name="prevTest"]');
  const prevScoreGroup = document.getElementById('prev-score-group');
  const targetScoreGroup = document.getElementById('target-score-group');
  const difficultyGroup = document.getElementById('difficulty-group');
  const bookedRadios = form.querySelectorAll('input[name="booked"]');
  const timeLeftGroup = document.getElementById('time-left-group');
  const weakRadios = form.querySelectorAll('input[name="weak-section"]');
  const testButton = document.getElementById('start-test');
  const levelModal = document.getElementById('level-modal');
  const modalOverlay = document.getElementById('level-overlay');
  const testContainer = document.getElementById('test-container');
  const closeTestBtn = document.getElementById('close-test');
  const testResult = document.getElementById('test-result');
  const backToFormBtn = document.getElementById('back-to-form');
  const recommendedInput = document.getElementById('recommended-plan');
  const termsLink = document.getElementById('terms-link');
  const policyLink = document.getElementById('policy-link');
  const termsModal = document.getElementById('terms-modal');
  const policyModal = document.getElementById('policy-modal');
  const closeTermsBtn = document.getElementById('close-terms');
  const closePolicyBtn = document.getElementById('close-policy');
  const acceptTermsBtn = document.getElementById('accept-terms');
  const acceptPolicyBtn = document.getElementById('accept-policy');
  const submitBtn = document.getElementById('submit-btn');
  let termsAccepted = false;
  let policyAccepted = false;
  function updateSubmitState() {
    submitBtn.disabled = !(termsAccepted && policyAccepted);
  }
  prevTestRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'yes') {
        prevScoreGroup.classList.remove('hidden');
        targetScoreGroup.classList.remove('hidden');
        difficultyGroup.classList.remove('hidden');
      } else {
        prevScoreGroup.classList.add('hidden');
        targetScoreGroup.classList.add('hidden');
        difficultyGroup.classList.add('hidden');
      }
    });
  });
  bookedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'yes') {
        timeLeftGroup.classList.remove('hidden');
      } else {
        timeLeftGroup.classList.add('hidden');
      }
    });
  });
  weakRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'unsure') {
        testButton.classList.remove('hidden');
      } else {
        testButton.classList.add('hidden');
      }
    });
  });
  // Level test logic
  if (testButton) {
    testButton.addEventListener('click', () => {
      modalOverlay.style.display = 'flex';
      levelModal.style.display = 'flex';
      startLevelTest();
    });
  }
  if (closeTestBtn) {
    closeTestBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      levelModal.style.display = 'none';
      testContainer.innerHTML = '';
      testResult.innerHTML = '';
    });
  }
  if (backToFormBtn) {
    backToFormBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      levelModal.style.display = 'none';
      testContainer.innerHTML = '';
    });
  }
  function startLevelTest() {
    // Example question bank (simple demonstration). Each object: {q: question, options: [..], answer: index}
    const questions = [
      {q: 'اختر الزمن الصحيح: He ____ playing football yesterday.', options: ['is', 'was', 'are'], answer: 1},
      {q: 'ما معنى الكلمة "analyse"؟', options: ['يحلل', 'يستمع', 'ينام'], answer: 0},
      {q: 'الصيغة الصحيحة: If I ____ rich, I would travel the world.', options: ['was', 'were', 'am'], answer: 1},
      {q: 'اختر الضمير الموصول الصحيح: The book ____ I read was interesting.', options: ['who', 'which', 'where'], answer: 1},
      {q: 'كم نسبة قسم الاستماع في اختبار STEP؟', options: ['20%', '40%', '10%'], answer: 0},
      {q: 'تتكون القراءة في اختبار STEP من:', options: ['10 أسئلة', '40 سؤالاً', '100 سؤال'], answer: 1},
      {q: 'ما هو الرقم الذي يعبر عن مستوى متقدم في STEP؟', options: ['50', '75', '90'], answer: 2},
      {q: 'ما هو synonym لكلمة "rapid"؟', options: ['slow', 'fast', 'late'], answer: 1},
      {q: 'اختبار STEP يقيس مهارات:', options: ['الاستماع والقراءة والقواعد', 'الرياضيات والفيزياء', 'التاريخ والجغرافيا'], answer: 0},
      {q: 'Past perfect continuous: He ____ for two hours when I called.', options: ['has been studying', 'had been studying', 'was studying'], answer: 1},
      {q: 'اختر الكلمة الخاطئة: She don’t like coffee.', options: ['She', 'don’t', 'coffee'], answer: 1},
      {q: 'اي من الخيارات يعبر عن reading strategy؟', options: ['البحث عن الكلمات المفتاحية', 'حفظ النص كاملا', 'تجاهل الأسئلة'], answer: 0},
      {q: 'اختر الإجابة الصحيحة: This is the house ____ I grew up.', options: ['which', 'where', 'when'], answer: 1},
      {q: 'أي مما يلي من أدوات الربط؟', options: ['however', 'happy', 'house'], answer: 0},
      {q: 'كم سؤال في اختبار STEP؟', options: ['100', '50', '150'], answer: 0},
      {q: 'كلمة "accurate" تعني:', options: ['صحيح', 'سريع', 'مستحيل'], answer: 0},
      {q: 'ما اسم الاختبار المكثف الذي يقدمه Ayed Academy؟', options: ['STEP', 'IELTS', 'TOEFL'], answer: 0},
      {q: 'اختر الإجابة الصحيحة: ____ you ever been abroad?', options: ['Do', 'Did', 'Have'], answer: 2},
      {q: 'ما نسبة قسم القواعد والتحليل الكتابي في STEP؟', options: ['40%', '30%', '20%'], answer: 0},
      {q: 'اختر الجملة الصحيحة: The students ___ very happy.', options: ['is', 'are', 'am'], answer: 1}
    ];
    // Shuffle and take first 20
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 20);
    let current = 0;
    let score = 0;
    testContainer.innerHTML = '';
    testResult.innerHTML = '';
    function showQuestion() {
      const qObj = shuffled[current];
      testContainer.innerHTML = '';
      const qEl = document.createElement('div');
      qEl.innerHTML = `<p><strong>سؤال ${current + 1}:</strong> ${qObj.q}</p>`;
      qObj.options.forEach((opt, idx) => {
        const label = document.createElement('label');
        label.style.display = 'block';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'q' + current;
        radio.value = idx;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + opt));
        qEl.appendChild(label);
      });
      const nextBtn = document.createElement('button');
      nextBtn.textContent = current === shuffled.length - 1 ? 'إنهاء' : 'التالي';
      nextBtn.className = 'btn-primary';
      nextBtn.style.marginTop = '10px';
      nextBtn.addEventListener('click', () => {
        const selected = testContainer.querySelector('input[name="q' + current + '"]:checked');
        if (selected) {
          if (parseInt(selected.value) === qObj.answer) score++;
          current++;
          if (current < shuffled.length) {
            showQuestion();
          } else {
            finishTest();
          }
        } else {
          alert('الرجاء اختيار إجابة.');
        }
      });
      testContainer.appendChild(qEl);
      testContainer.appendChild(nextBtn);
    }
    function finishTest() {
      testContainer.innerHTML = '';
      const percentage = (score / shuffled.length) * 100;
      let plan;
      if (percentage < 50) plan = 'خطة 90 يوم (أساسيات)';
      else if (percentage < 70) plan = 'خطة 60 يوم (متوسطة)';
      else plan = 'خطة 30 يوم (مكثفة)';
      testResult.innerHTML = `<p>نتيجتك: ${score} من ${shuffled.length} (${percentage.toFixed(0)}%).</p><p>الخطة المقترحة: <strong>${plan}</strong></p>`;
      recommendedInput.value = plan;
      backToFormBtn.classList.remove('hidden');
    }
    showQuestion();
  }
  // Terms and policy modals
  if (termsLink) termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.parentElement.style.display = 'flex';
  });
  if (policyLink) policyLink.addEventListener('click', (e) => {
    e.preventDefault();
    policyModal.parentElement.style.display = 'flex';
  });
  if (closeTermsBtn) closeTermsBtn.addEventListener('click', () => {
    termsModal.parentElement.style.display = 'none';
  });
  if (closePolicyBtn) closePolicyBtn.addEventListener('click', () => {
    policyModal.parentElement.style.display = 'none';
  });
  if (acceptTermsBtn) acceptTermsBtn.addEventListener('click', () => {
    termsAccepted = true;
    termsModal.parentElement.style.display = 'none';
    updateSubmitState();
  });
  if (acceptPolicyBtn) acceptPolicyBtn.addEventListener('click', () => {
    policyAccepted = true;
    policyModal.parentElement.style.display = 'none';
    updateSubmitState();
  });
  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const text = document.getElementById(target).textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'تم النسخ';
        setTimeout(() => {
          btn.textContent = 'نسخ';
        }, 1500);
      });
    });
  });
}