/**
 * נועה עוברת דירה - תאגיד מי רמת גן
 * מערכת אב-טיפוס אינטראקטיבית מלאה
 */

// State Management - Starts empty for real user typing!
const appState = {
  activeView: 'noa-wizard', // 'noa-wizard' | 'sms-completion' | 'backoffice' | 'dashboard'
  wizardStep: 0, // 0: action, 1: role, 2: prep, 3: personal, 4: contact_otp, 5: property, 6: meter_docs, 7: summary, 8: success
  formData: {
    actionType: 'start_rent',
    applicantRole: 'self',
    firstName: '',
    lastName: '',
    idNumber: '',
    phone: '',
    email: '',
    otpVerified: false,
    city: '',
    street: '',
    houseNum: '',
    aptNum: '',
    isPrivateHouse: false,
    entryDate: '',
    landlordName: '',
    landlordId: '',
    landlordPhone: '',
    waterCardNum: '',
    residentsCount: '1',
    meterReading: '',
    hasMeterPhoto: false,
    hasContract: false,
    hasOwnerId: false,
    hasTenantId: false,
    additionalSefachim: [],
    hasSignature: false,
    termsAccepted: false,
    contractOcrStatus: 'none',
    ownerIdOcrStatus: 'none',
    meterPhotoOcrStatus: 'none',
  },
  backoffice: {
    selectedCaseId: 'RG-2026-8841',
    smsSent: false,
    caseStatus: 'ממתין להשלמת מסמך מונה',
    logs: [
      { time: '10:15', user: 'אוטומציית RPA', text: 'טופס נקלט. זוהה כשל בפענוח קריאת המונה מהתמונה (תמונה מטושטשת).' },
      { time: '10:17', user: 'מערכת', text: 'הבקשה נותבה לתור טיפול נציג (אי-התאמה טכנית).' }
    ]
  },
  dashboard: {
    permissionsGranted: false,
    auditLogs: [
      { time: '11:42', user: 'דנה (נציגה)', action: 'שליחת בקשת השלמת צילום מונה לנועה לוי', caseId: 'RG-2026-8841' },
      { time: '11:15', user: 'רובוט RPA', action: 'אישור אוטומטי - מסלול ירוק - החלפת משלמים', caseId: 'RG-2026-8840' },
      { time: '10:50', user: 'רובוט RPA', action: 'אישור אוטומטי - מסלול ירוק - החלפת משלמים', caseId: 'RG-2026-8839' },
      { time: '09:30', user: 'יוסי (מנהל)', action: 'שינוי הרשאות צפייה במסמכי זיהוי לרמת נציג בכיר', caseId: '-' }
    ]
  }
};

// Gov.il / mygov Cities & Streets Database + Live API integration
const govRegistry = {
  cities: [
    'רמת גן', 'תל אביב - יפו', 'גבעתיים', 'הרצליה', 'ירושלים', 'חיפה', 
    'ראשון לציון', 'פתח תקווה', 'חולון', 'בת ים', 'נתניה', 'באר שבע', 
    'כפר סבא', 'רעננה', 'בני ברק', 'מודיעין-מכבים-רעות', 'רמת השרון', 'הוד השרון'
  ],
  streetsByCity: {
    'רמת גן': [
      'ביאליק', 'הרצל', 'ז\'בוטינסקי', 'ארלוזורוב', 'הרא"ה', 'עוזיאל', 
      'קריניצי', 'שדרות ירושלים', 'בן גוריון', 'כצנלסון', 'הירדן', 
      'נגבה', 'תל חי', 'התקווה', 'שרת', 'פנחס רוטנברג', 'רוקח', 'הבילויים',
      'אבא הלל', 'תובל', 'החילזון', 'שפירא', 'יהודה הנשיא', 'מבצע קדש'
    ],
    'תל אביב - יפו': [
      'דיזנגוף', 'אבן גבירול', 'רוטשילד', 'אלנבי', 'ירקון', 'המלך ג\'ורג\'',
      'בן יהודה', 'ארלוזורוב', 'ויצמן', 'בגין', 'המסגר', 'שבזי', 'יפת'
    ],
    'גבעתיים': [
      'כצנלסון', 'ויצמן', 'שינקין', 'סירקין', 'גולומב', 'רמב"ם', 'בורוכוב', 'המעורר'
    ],
    'הרצליה': [
      'סוקולוב', 'בן גוריון', 'שדרות ח"ן', 'סמדר', 'המנופים', 'מדינת היהודים', 'וינגייט'
    ],
    'ירושלים': [
      'יפו', 'קינג ג\'ורג\'', 'עמק רפאים', 'דרך חברון', 'הרצל', 'עזה', 'אגריפס', 'בן יהודה'
    ]
  }
};

// Israeli ID Validator (Exact 9 digits)
function validateIsraeliID(rawId) {
  const id = String(rawId || '').trim();
  if (!id) return { isValid: false, message: '' };
  
  if (!/^\d+$/.test(id)) {
    return { isValid: false, message: 'יש להזין ספרות בלבד' };
  }
  
  if (id.length < 9) {
    return { isValid: false, message: 'חסרות ספרות, יש להשלים ל-9 ספרות' };
  }
  
  if (id.length > 9) {
    return { isValid: false, message: 'מספר תעודת זהות בת 9 ספרות בלבד' };
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(id.charAt(i));
    let inc = digit * ((i % 2) + 1);
    if (inc > 9) inc -= 9;
    sum += inc;
  }
  
  const isValid = (sum % 10 === 0);
  return {
    isValid,
    message: isValid ? 'מספר זהות תקין' : 'מספר תעודת הזהות אינו תקין. אנא בדקו את המספר שהוקלד.'
  };
}

// Israeli Mobile Phone Validator (Exact 10 digits, starts with 05)
function validateIsraeliPhone(rawPhone) {
  const raw = String(rawPhone || '').trim();
  if (!raw) return { isValid: false, message: '' };

  if (/[^\d-]/.test(raw)) {
    return { isValid: false, message: 'יש להזין ספרות ומקף בלבד (למשל: 054-1234567)' };
  }

  const digits = raw.replace(/\D/g, '');

  if (!digits.startsWith('05')) {
    if (digits.startsWith('0') && digits.length >= 2) {
      return { isValid: false, message: 'מספר טלפון נייד חייב להתחיל בקידומת 05 (למשל: 050, 052, 054)' };
    }
    return { isValid: false, message: 'מספר טלפון נייד בישראל חייב להתחיל ב-05 (למשל: 054-1234567)' };
  }

  if (digits.length < 10) {
    return { isValid: false, message: 'מספר הנייד קצר מדי, יש להשלים ל-10 ספרות' };
  }

  if (digits.length > 10) {
    return { isValid: false, message: 'מספר נייד מכיל 10 ספרות בלבד' };
  }

  return {
    isValid: true,
    message: 'מספר טלפון נייד תקין'
  };
}

// Global Standard Email Validator (RFC 5322 compliant)
function validateEmail(rawEmail) {
  const email = String(rawEmail || '').trim();
  if (!email) return { isValid: false, message: '' };

  if (!email.includes('@')) {
    return { isValid: false, message: 'כתובת האימייל חייבת לכלול את הסימן @ (למשל: name@example.com)' };
  }

  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { isValid: false, message: 'מבנה האימייל אינו תקין (למשל: name@example.com)' };
  }

  const domain = parts[1];
  if (!domain.includes('.')) {
    return { isValid: false, message: 'חסרה סיומת דומיין באימייל (למשל: .com או .org.il)' };
  }

  const standardEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!standardEmailRegex.test(email)) {
    return { isValid: false, message: 'כתובת אימייל אינה תקינה. יש להזין כתובת תקנית (למשל: name@example.com)' };
  }

  return {
    isValid: true,
    message: 'כתובת אימייל תקינה'
  };
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initPeerMenu();
  initWizardSteps();
  initInputListeners();
  initGovAddressAutocomplete();
  initSimulations();
  initTooltipZIndexHover();
  initSignaturePad();
  renderApp();
});

function initTooltipZIndexHover() {
  document.querySelectorAll('.selection-card, .checklist-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.zIndex = '99999';
    });
    el.addEventListener('mouseleave', () => {
      el.style.zIndex = '';
    });
  });
}

function renderApp() {
  updateWizardUI();
}

// Peer Review Menu (3 dots)
function initPeerMenu() {
  const trigger = document.getElementById('menuTriggerBtn');
  const dropdown = document.getElementById('peerDropdownMenu');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Mode buttons
  document.querySelectorAll('[data-view-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view-target');
      switchView(targetView);
      dropdown.classList.remove('show');
    });
  });

  // Reset Button
  document.getElementById('resetSimulationBtn').addEventListener('click', () => {
    resetSimulation();
    dropdown.classList.remove('show');
  });
}

function switchView(viewName) {
  appState.activeView = viewName;
  
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view-target') === viewName);
  });

  const badge = document.getElementById('activeModeBadge');
  
  if (viewName === 'noa-wizard') {
    document.getElementById('view-noa-wizard').classList.add('active');
    badge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      מסע נועה (טופס תושב)
    `;
  } else if (viewName === 'sms-completion') {
    document.getElementById('view-sms-completion').classList.add('active');
    badge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
      השלמת חוסר מקישור SMS
    `;
  } else if (viewName === 'backoffice') {
    document.getElementById('view-backoffice').classList.add('active');
    badge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      מרחב נציג שירות
    `;
    renderBackoffice();
  } else if (viewName === 'dashboard') {
    document.getElementById('view-dashboard').classList.add('active');
    badge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
      דשבורד מנהל תפעול
    `;
    renderDashboard();
  }
}

// Wizard Progress & Step Navigation
function initWizardSteps() {
  updateWizardUI();
}

function goToStep(stepIndex) {
  if (stepIndex < 0 || stepIndex > 8) return;
  appState.wizardStep = stepIndex;
  updateWizardUI();
}

function updateWizardUI() {
  const currentStep = appState.wizardStep;
  
  document.querySelectorAll('.wizard-step-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  
  const activePanel = document.getElementById(`wizard-step-${currentStep}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }

  const percentages = [0, 15, 25, 40, 55, 70, 85, 95, 100];
  const currentPercent = percentages[currentStep] !== undefined ? percentages[currentStep] : 0;
  
  const fill = document.getElementById('wizardProgressFill');
  const percentText = document.getElementById('wizardProgressPercent');
  if (fill) {
    fill.style.width = `${currentPercent}%`;
  }
  if (percentText) {
    percentText.innerHTML = `<span dir="ltr" style="display: inline-block; font-weight: 700;">${currentPercent}%</span> הושלמו`;
  }

  let activeIndicatorIndex = 1;
  if (currentStep <= 2) activeIndicatorIndex = 1; // בחירה והכנה
  else if (currentStep === 3) activeIndicatorIndex = 2; // פרטי זיהוי
  else if (currentStep === 4) activeIndicatorIndex = 3; // אימות קשר
  else if (currentStep === 5) activeIndicatorIndex = 4; // פרטי הנכס
  else if (currentStep === 6) activeIndicatorIndex = 5; // מונה ומסמכים
  else if (currentStep >= 7) activeIndicatorIndex = 6; // סיכום וחתימה / סיום

  document.querySelectorAll('.step-item').forEach((item, idx) => {
    const itemIndex = idx + 1;
    item.classList.remove('active', 'completed');
    if (itemIndex < activeIndicatorIndex) {
      item.classList.add('completed');
    } else if (itemIndex === activeIndicatorIndex) {
      item.classList.add('active');
    }
  });

  if (currentStep === 7) {
    populateSummaryData();
  }
}

// Input and Event Listeners
function initInputListeners() {
  // Live Israeli ID validation
  const idInput = document.getElementById('inputIdNumber');
  const idErrorMsg = document.getElementById('idErrorMsg');
  const idFeedbackIcon = document.getElementById('idFeedbackIcon');
  
  if (idInput) {
    const handleIdInput = (isBlur = false) => {
      const val = idInput.value.trim();
      appState.formData.idNumber = val;
      
      if (!val) {
        idInput.classList.remove('is-valid', 'is-invalid');
        if (idErrorMsg) idErrorMsg.style.display = 'none';
        if (idFeedbackIcon) idFeedbackIcon.style.display = 'none';
        return;
      }

      const res = validateIsraeliID(val);

      if (res.isValid) {
        idInput.classList.add('is-valid');
        idInput.classList.remove('is-invalid');
        if (idErrorMsg) idErrorMsg.style.display = 'none';
        if (idFeedbackIcon) {
          idFeedbackIcon.style.display = 'flex';
          idFeedbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        // While typing, only show error if reached 9 digits or if user blurred out
        if (val.length >= 9 || isBlur) {
          idInput.classList.remove('is-valid');
          idInput.classList.add('is-invalid');
          if (idErrorMsg) {
            idErrorMsg.textContent = res.message;
            idErrorMsg.style.display = 'block';
          }
          if (idFeedbackIcon) {
            idFeedbackIcon.style.display = 'flex';
            idFeedbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          }
        } else {
          // Still typing (< 9 digits), remove previous invalid state until 9 or blur
          idInput.classList.remove('is-valid', 'is-invalid');
          if (idErrorMsg) idErrorMsg.style.display = 'none';
          if (idFeedbackIcon) idFeedbackIcon.style.display = 'none';
        }
      }
    };

    idInput.addEventListener('input', () => handleIdInput(false));
    idInput.addEventListener('blur', () => handleIdInput(true));
  }

  // Name inputs
  const firstNameInput = document.getElementById('inputFirstName');
  const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
  const firstNameFeedbackIcon = document.getElementById('firstNameFeedbackIcon');

  if (firstNameInput) {
    firstNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      appState.formData.firstName = val;
      if (val.length >= 2) {
        firstNameInput.classList.add('is-valid');
        firstNameInput.classList.remove('is-invalid');
        if (firstNameErrorMsg) firstNameErrorMsg.style.display = 'none';
        if (firstNameFeedbackIcon) firstNameFeedbackIcon.style.display = 'flex';
      } else {
        firstNameInput.classList.remove('is-valid');
        if (firstNameFeedbackIcon) firstNameFeedbackIcon.style.display = 'none';
      }
    });

    firstNameInput.addEventListener('blur', (e) => {
      const val = e.target.value.trim();
      if (!val || val.length < 2) {
        firstNameInput.classList.add('is-invalid');
        firstNameInput.classList.remove('is-valid');
        if (firstNameErrorMsg) {
          firstNameErrorMsg.textContent = 'שם פרטי הוא שדה חובה (נא להקליד לפחות 2 אותיות)';
          firstNameErrorMsg.style.display = 'block';
        }
        if (firstNameFeedbackIcon) firstNameFeedbackIcon.style.display = 'none';
      }
    });
  }

  const lastNameInput = document.getElementById('inputLastName');
  const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
  const lastNameFeedbackIcon = document.getElementById('lastNameFeedbackIcon');

  if (lastNameInput) {
    lastNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      appState.formData.lastName = val;
      if (val.length >= 2) {
        lastNameInput.classList.add('is-valid');
        lastNameInput.classList.remove('is-invalid');
        if (lastNameErrorMsg) lastNameErrorMsg.style.display = 'none';
        if (lastNameFeedbackIcon) lastNameFeedbackIcon.style.display = 'flex';
      } else {
        lastNameInput.classList.remove('is-valid');
        if (lastNameFeedbackIcon) lastNameFeedbackIcon.style.display = 'none';
      }
    });

    lastNameInput.addEventListener('blur', (e) => {
      const val = e.target.value.trim();
      if (!val || val.length < 2) {
        lastNameInput.classList.add('is-invalid');
        lastNameInput.classList.remove('is-valid');
        if (lastNameErrorMsg) {
          lastNameErrorMsg.textContent = 'שם משפחה הוא שדה חובה (נא להקליד לפחות 2 אותיות)';
          lastNameErrorMsg.style.display = 'block';
        }
        if (lastNameFeedbackIcon) lastNameFeedbackIcon.style.display = 'none';
      }
    });
  }

  // Phone Live Validation (10 digits starting with 05)
  const phoneInput = document.getElementById('inputPhone');
  const phoneErrorMsg = document.getElementById('phoneErrorMsg');
  const phoneFeedbackIcon = document.getElementById('phoneFeedbackIcon');

  if (phoneInput) {
    const handlePhoneInput = (isBlur = false) => {
      const val = phoneInput.value.trim();
      appState.formData.phone = val;

      if (!val) {
        phoneInput.classList.remove('is-valid', 'is-invalid');
        if (phoneErrorMsg) phoneErrorMsg.style.display = 'none';
        if (phoneFeedbackIcon) phoneFeedbackIcon.style.display = 'none';
        return;
      }

      const res = validateIsraeliPhone(val);
      const digits = val.replace(/\D/g, '');

      if (res.isValid) {
        phoneInput.classList.add('is-valid');
        phoneInput.classList.remove('is-invalid');
        if (phoneErrorMsg) phoneErrorMsg.style.display = 'none';
        if (phoneFeedbackIcon) {
          phoneFeedbackIcon.style.display = 'flex';
          phoneFeedbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        phoneInput.classList.remove('is-valid');
        
        // Show error if user blurred out, or if typing non-05 prefix, >10 digits, or invalid characters
        if (isBlur || digits.length > 10 || (digits.length >= 2 && !digits.startsWith('05')) || /[^\d-]/.test(val)) {
          phoneInput.classList.add('is-invalid');
          if (phoneErrorMsg) {
            phoneErrorMsg.textContent = res.message;
            phoneErrorMsg.style.display = 'block';
          }
          if (phoneFeedbackIcon) {
            phoneFeedbackIcon.style.display = 'flex';
            phoneFeedbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          }
        } else {
          // Still typing (< 10 digits starting with 05)
          phoneInput.classList.remove('is-invalid');
          if (phoneErrorMsg) phoneErrorMsg.style.display = 'none';
          if (phoneFeedbackIcon) phoneFeedbackIcon.style.display = 'none';
        }
      }
    };

    phoneInput.addEventListener('input', () => handlePhoneInput(false));
    phoneInput.addEventListener('blur', () => handlePhoneInput(true));
  }

  // Email Live Validation (Global RFC Standard)
  const emailInput = document.getElementById('inputEmail');
  const emailErrorMsg = document.getElementById('emailErrorMsg');
  const emailFeedbackIcon = document.getElementById('emailFeedbackIcon');

  if (emailInput) {
    const handleEmailInput = (isBlur = false) => {
      const val = emailInput.value.trim();
      appState.formData.email = val;

      if (!val) {
        emailInput.classList.remove('is-valid', 'is-invalid');
        if (emailErrorMsg) emailErrorMsg.style.display = 'none';
        if (emailFeedbackIcon) emailFeedbackIcon.style.display = 'none';
        return;
      }

      const res = validateEmail(val);

      if (res.isValid) {
        emailInput.classList.add('is-valid');
        emailInput.classList.remove('is-invalid');
        if (emailErrorMsg) emailErrorMsg.style.display = 'none';
        if (emailFeedbackIcon) {
          emailFeedbackIcon.style.display = 'flex';
          emailFeedbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        if (isBlur) {
          emailInput.classList.remove('is-valid');
          emailInput.classList.add('is-invalid');
          if (emailErrorMsg) {
            emailErrorMsg.textContent = res.message;
            emailErrorMsg.style.display = 'block';
          }
          if (emailFeedbackIcon) {
            emailFeedbackIcon.style.display = 'flex';
            emailFeedbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          }
        } else {
          emailInput.classList.remove('is-valid');
          if (phoneErrorMsg && !isBlur) {
            // Keep clean while typing until blur or valid
          }
        }
      }
    };

    emailInput.addEventListener('input', () => handleEmailInput(false));
    emailInput.addEventListener('blur', () => handleEmailInput(true));
  }

  // OTP Verification
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const otpSection = document.getElementById('otpInputSection');
  const otpInput = document.getElementById('inputOtpCode');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  const otpSuccessNotice = document.getElementById('otpSuccessNotice');

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      otpSection.style.display = 'block';
      sendOtpBtn.textContent = 'קוד אימות נשלח שוב';
      otpInput.value = '1234';
      otpInput.focus();
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      if (otpInput.value === '1234' || otpInput.value.length === 4) {
        appState.formData.otpVerified = true;
        otpSection.style.display = 'none';
        sendOtpBtn.style.display = 'none';
        otpSuccessNotice.style.display = 'flex';
      } else {
        alert('קוד האימות לבדיקה הוא 1234');
      }
    });
  }

  // Meter Reading Input
  const meterInput = document.getElementById('inputMeterReading');
  if (meterInput) {
    meterInput.addEventListener('input', (e) => {
      appState.formData.meterReading = e.target.value.trim();
      const meterError = document.getElementById('meterErrorMsg');
      if (meterError && appState.formData.meterReading) {
        meterError.style.display = 'none';
        meterInput.classList.remove('is-invalid');
      }
    });
  }

  // Live Property Fields Validation & Error Clearing
  const cityInput = document.getElementById('inputCity');
  const cityError = document.getElementById('cityErrorMsg');
  if (cityInput) {
    const handleCity = () => {
      appState.formData.city = cityInput.value.trim();
      if (appState.formData.city) {
        cityInput.classList.remove('is-invalid');
        if (cityError) cityError.style.display = 'none';
      }
    };
    cityInput.addEventListener('input', handleCity);
    cityInput.addEventListener('change', handleCity);
  }

  const streetInput = document.getElementById('inputStreet');
  const streetError = document.getElementById('streetErrorMsg');
  if (streetInput) {
    const handleStreet = () => {
      appState.formData.street = streetInput.value.trim();
      if (appState.formData.street) {
        streetInput.classList.remove('is-invalid');
        if (streetError) streetError.style.display = 'none';
      }
    };
    streetInput.addEventListener('input', handleStreet);
    streetInput.addEventListener('change', handleStreet);
  }

  const houseInput = document.getElementById('inputHouse');
  const houseError = document.getElementById('houseErrorMsg');
  if (houseInput) {
    const handleHouse = () => {
      appState.formData.houseNum = houseInput.value.trim();
      if (appState.formData.houseNum) {
        houseInput.classList.remove('is-invalid');
        if (houseError) houseError.style.display = 'none';
      }
    };
    houseInput.addEventListener('input', handleHouse);
    houseInput.addEventListener('change', handleHouse);
  }

  // Entry Date Input
  const entryDateInput = document.getElementById('inputEntryDate');
  const entryDateError = document.getElementById('entryDateErrorMsg');
  if (entryDateInput) {
    const handleDate = () => {
      appState.formData.entryDate = entryDateInput.value;
      if (appState.formData.entryDate) {
        if (entryDateError) entryDateError.style.display = 'none';
        entryDateInput.classList.remove('is-invalid');
      }
    };
    entryDateInput.addEventListener('change', handleDate);
    entryDateInput.addEventListener('input', handleDate);
  }

  // Landlord Details Validation & Live Error Clearing
  const landlordNameInput = document.getElementById('inputLandlordName');
  const landlordNameError = document.getElementById('landlordNameErrorMsg');
  if (landlordNameInput) {
    const handleLName = () => {
      appState.formData.landlordName = landlordNameInput.value.trim();
      if (appState.formData.landlordName) {
        landlordNameInput.classList.remove('is-invalid');
        if (landlordNameError) landlordNameError.style.display = 'none';
      }
    };
    landlordNameInput.addEventListener('input', handleLName);
    landlordNameInput.addEventListener('change', handleLName);
  }

  const landlordIdInput = document.getElementById('inputLandlordId');
  const landlordIdError = document.getElementById('landlordIdErrorMsg');
  const landlordIdFeedback = document.getElementById('landlordIdFeedbackIcon');
  if (landlordIdInput) {
    const handleLId = (isBlur = false) => {
      const val = landlordIdInput.value.trim();
      appState.formData.landlordId = val;
      if (!val) {
        landlordIdInput.classList.remove('is-valid', 'is-invalid');
        if (landlordIdError) landlordIdError.style.display = 'none';
        if (landlordIdFeedback) landlordIdFeedback.style.display = 'none';
        return;
      }
      const res = validateIsraeliID(val);
      if (res.isValid) {
        landlordIdInput.classList.add('is-valid');
        landlordIdInput.classList.remove('is-invalid');
        if (landlordIdError) landlordIdError.style.display = 'none';
        if (landlordIdFeedback) {
          landlordIdFeedback.style.display = 'flex';
          landlordIdFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        if (isBlur) {
          landlordIdInput.classList.remove('is-valid');
          landlordIdInput.classList.add('is-invalid');
          if (landlordIdError) {
            landlordIdError.textContent = res.message;
            landlordIdError.style.display = 'block';
          }
        } else {
          landlordIdInput.classList.remove('is-valid', 'is-invalid');
          if (landlordIdError) landlordIdError.style.display = 'none';
        }
      }
    };
    landlordIdInput.addEventListener('input', () => handleLId(false));
    landlordIdInput.addEventListener('blur', () => handleLId(true));
  }

  const landlordPhoneInput = document.getElementById('inputLandlordPhone');
  if (landlordPhoneInput) {
    landlordPhoneInput.addEventListener('input', () => {
      appState.formData.landlordPhone = landlordPhoneInput.value.trim();
    });
  }

  // Water Card Number Input
  const waterCardInput = document.getElementById('inputWaterCardNum');
  if (waterCardInput) {
    waterCardInput.addEventListener('input', (e) => {
      appState.formData.waterCardNum = e.target.value.trim();
    });
  }

  // Residents Count Input
  const residentsSelect = document.getElementById('inputResidentsCount');
  if (residentsSelect) {
    residentsSelect.addEventListener('change', (e) => {
      appState.formData.residentsCount = e.target.value;
    });
  }

  // Private House Checkbox
  const privateHouse = document.getElementById('privateHouseCheckbox');
  const aptInput = document.getElementById('inputApt');
  if (privateHouse && aptInput) {
    privateHouse.addEventListener('change', () => {
      appState.formData.isPrivateHouse = privateHouse.checked;
      if (privateHouse.checked) {
        aptInput.value = '';
        aptInput.disabled = true;
        aptInput.placeholder = 'בית פרטי';
      } else {
        aptInput.disabled = false;
        aptInput.placeholder = 'מספר';
      }
    });
  }

  // Terms Checkbox
  const termsCheckbox = document.getElementById('acceptTermsCheckbox');
  const declError = document.getElementById('declarationErrorMsg');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      appState.formData.termsAccepted = termsCheckbox.checked;
      if (termsCheckbox.checked && declError) {
        declError.style.display = 'none';
      }
    });
  }
}

// Digital Signature Canvas Pad
function initSignaturePad() {
  const canvas = document.getElementById('signatureCanvas');
  const clearBtn = document.getElementById('clearSignatureBtn');
  const sigError = document.getElementById('signatureErrorMsg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let isDrawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    appState.formData.hasSignature = true;
    if (sigError) sigError.style.display = 'none';
  }

  function stopDraw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDraw, { passive: false });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      appState.formData.hasSignature = false;
      if (sigError) sigError.style.display = 'none';
    });
  }
}

// Gov.il Address Autocomplete
function initGovAddressAutocomplete() {
  const cityInput = document.getElementById('inputCity');
  const cityMenu = document.getElementById('cityAutocompleteMenu');
  const streetInput = document.getElementById('inputStreet');
  const streetMenu = document.getElementById('streetAutocompleteMenu');
  const govStatusBadge = document.getElementById('govAddressStatusBadge');

  if (!cityInput || !streetInput) return;

  // City Autocomplete
  cityInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) {
      cityMenu.style.display = 'none';
      return;
    }

    const matches = govRegistry.cities.filter(c => c.includes(val));
    if (matches.length > 0) {
      cityMenu.innerHTML = matches.map(c => `
        <div class="autocomplete-item" data-city="${c}">
          <svg width="14" height="14" viewBox="0 0 24 24" style="margin-left: 6px; color: var(--primary-600);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${c}
        </div>
      `).join('');
      cityMenu.style.display = 'block';

      cityMenu.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const selectedCity = item.getAttribute('data-city');
          cityInput.value = selectedCity;
          appState.formData.city = selectedCity;
          cityMenu.style.display = 'none';
          
          streetInput.value = '';
          streetInput.placeholder = `הקלידו רחוב ב${selectedCity}...`;
          if (govStatusBadge) {
            govStatusBadge.style.display = 'inline-flex';
          }
        });
      });
    } else {
      cityMenu.style.display = 'none';
    }
  });

  // Street Autocomplete (Filtered by selected City)
  streetInput.addEventListener('input', async (e) => {
    const val = e.target.value.trim();
    if (!val) {
      streetMenu.style.display = 'none';
      return;
    }

    const currentCity = appState.formData.city || 'רמת גן';
    let streetsList = govRegistry.streetsByCity[currentCity] || govRegistry.streetsByCity['רמת גן'];

    const matches = streetsList.filter(s => s.includes(val));
    if (matches.length > 0) {
      streetMenu.innerHTML = matches.map(s => `
        <div class="autocomplete-item" data-street="${s}">
          <svg width="14" height="14" viewBox="0 0 24 24" style="margin-left: 6px; color: var(--teal-600);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
          ${s}
        </div>
      `).join('');
      streetMenu.style.display = 'block';

      streetMenu.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          streetInput.value = item.getAttribute('data-street');
          appState.formData.street = streetInput.value;
          streetMenu.style.display = 'none';
          if (govStatusBadge) {
            govStatusBadge.style.display = 'inline-flex';
          }
        });
      });
    } else {
      streetMenu.style.display = 'none';
    }
  });

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !cityMenu.contains(e.target)) {
      cityMenu.style.display = 'none';
    }
    if (!streetInput.contains(e.target) && !streetMenu.contains(e.target)) {
      streetMenu.style.display = 'none';
    }
  });
}

// Helper to refresh the document checklist counter and state
function updateDocsChecklistSummary() {
  let requiredCount = 0;
  if (appState.formData.hasContract) requiredCount++;
  if (appState.formData.hasOwnerId) requiredCount++;
  if (appState.formData.hasTenantId) requiredCount++;
  if (appState.formData.hasMeterPhoto) requiredCount++;

  const summaryEl = document.getElementById('checklistOverallSummary');
  if (summaryEl) {
    if (requiredCount === 4) {
      summaryEl.innerHTML = '<span style="color: #16a34a; font-weight: 700;">כל 4 מסמכי החובה נקלטו בהצלחה ✓</span>';
    } else if (requiredCount > 0) {
      summaryEl.textContent = `${requiredCount} מתוך 4 מסמכי חובה נקלטו`;
    } else {
      summaryEl.textContent = 'ממתין להעלאת מסמכים';
    }
  }
}

// Multi-file Sefach manager functions
function addSefachFile() {
  if (!Array.isArray(appState.formData.additionalSefachim)) {
    appState.formData.additionalSefachim = [];
  }
  const nextNum = appState.formData.additionalSefachim.length + 1;
  const fileName = `ספח_דייר_בגיר_${nextNum}.jpg`;
  appState.formData.additionalSefachim.push(fileName);
  renderSefachChips();
}

function removeSefachFile(idx) {
  if (!Array.isArray(appState.formData.additionalSefachim)) return;
  appState.formData.additionalSefachim.splice(idx, 1);
  renderSefachChips();
}

function renderSefachChips() {
  const listContainer = document.getElementById('additionalSefachFilesList');
  const chipsContainer = document.getElementById('sefachChipsContainer');
  const subText = document.getElementById('additionalSefachSubText');
  const badge = document.getElementById('additionalIdBadge');
  const uploadBox = document.getElementById('additionalIdUploadBox');
  const row = document.getElementById('checkRowAdditional');
  const statusBadge = document.getElementById('statusAdditional');

  const files = appState.formData.additionalSefachim || [];

  if (files.length > 0) {
    if (listContainer) listContainer.style.display = 'block';
    if (chipsContainer) {
      chipsContainer.innerHTML = files.map((f, i) => `
        <span class="sefach-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          ${f}
          <span class="sefach-chip-remove" onclick="event.stopPropagation(); removeSefachFile(${i});" title="הסר קובץ">×</span>
        </span>
      `).join('');
    }
    if (subText) subText.textContent = `${files.length} ספחים צורפו`;
    if (badge) {
      badge.textContent = '+ הוסף עוד';
      badge.classList.remove('optional');
    }
    if (uploadBox) uploadBox.classList.add('uploaded');
    if (row) row.classList.add('success');
    if (statusBadge) {
      statusBadge.className = 'delicate-item-badge success';
      statusBadge.textContent = `✓ צורפו ${files.length}`;
    }
  } else {
    if (listContainer) listContainer.style.display = 'none';
    if (chipsContainer) chipsContainer.innerHTML = '';
    if (subText) subText.textContent = 'לחצו להוספת ספח';
    if (badge) {
      badge.textContent = '+ הוסף ספח';
      badge.classList.add('optional');
    }
    if (uploadBox) uploadBox.classList.remove('uploaded');
    if (row) row.classList.remove('success');
    if (statusBadge) {
      statusBadge.className = 'delicate-item-badge optional';
      statusBadge.textContent = 'רשות';
    }
  }
}

// Simulations: Live document validation & compact uploads
function initSimulations() {
  // 1. Meter Photo Upload
  const meterBox = document.getElementById('meterPhotoUploadBox');
  const meterBadge = document.getElementById('meterPhotoBadge');
  const meterRow = document.getElementById('checkRowMeterPhoto');
  const meterStatus = document.getElementById('statusMeterPhoto');

  if (meterBox) {
    meterBox.addEventListener('click', () => {
      appState.formData.hasMeterPhoto = true;
      meterBox.classList.add('uploaded');
      const title = meterBox.querySelector('.upload-compact-title');
      const sub = meterBox.querySelector('.upload-compact-sub');
      if (title) title.textContent = 'צילום_מונה_מים.jpg';
      if (sub) sub.textContent = 'נקלט ונבדק בהצלחה';
      if (meterBadge) {
        meterBadge.textContent = '✓ נקלט';
      }
      if (meterRow) meterRow.classList.add('success');
      if (meterStatus) {
        meterStatus.className = 'delicate-item-badge success';
        meterStatus.textContent = '✓ נקלט';
      }
      updateDocsChecklistSummary();
    });
  }

  // 2. Contract Upload
  const contractBox = document.getElementById('contractUploadBox');
  const contractBadge = document.getElementById('contractBadge');
  const contractRow = document.getElementById('checkRowContract');
  const contractStatus = document.getElementById('statusContract');

  if (contractBox) {
    contractBox.addEventListener('click', () => {
      appState.formData.hasContract = true;
      contractBox.classList.add('uploaded');
      const title = contractBox.querySelector('.upload-compact-title');
      const sub = contractBox.querySelector('.upload-compact-sub');
      if (title) title.textContent = 'חוזה_שכירות_חתום.pdf';
      if (sub) sub.textContent = 'נקלט ונבדק בהצלחה';
      if (contractBadge) {
        contractBadge.textContent = '✓ נקלט';
      }
      if (contractRow) contractRow.classList.add('success');
      if (contractStatus) {
        contractStatus.className = 'delicate-item-badge success';
        contractStatus.textContent = '✓ נקלט';
      }
      updateDocsChecklistSummary();
    });
  }

  // 3. Landlord/Owner ID Upload
  const ownerIdBox = document.getElementById('ownerIdUploadBox');
  const ownerIdBadge = document.getElementById('ownerIdBadge');
  const ownerIdRow = document.getElementById('checkRowOwnerId');
  const ownerIdStatus = document.getElementById('statusOwnerId');

  if (ownerIdBox) {
    ownerIdBox.addEventListener('click', () => {
      appState.formData.hasOwnerId = true;
      ownerIdBox.classList.add('uploaded');
      const title = ownerIdBox.querySelector('.upload-compact-title');
      const sub = ownerIdBox.querySelector('.upload-compact-sub');
      if (title) title.textContent = 'ת.ז_וספח_משכיר.jpg';
      if (sub) sub.textContent = 'נקלט ונבדק בהצלחה';
      if (ownerIdBadge) {
        ownerIdBadge.textContent = '✓ נקלט';
      }
      if (ownerIdRow) ownerIdRow.classList.add('success');
      if (ownerIdStatus) {
        ownerIdStatus.className = 'delicate-item-badge success';
        ownerIdStatus.textContent = '✓ נקלט';
      }
      updateDocsChecklistSummary();
    });
  }

  // 4. Tenant ID Upload
  const tenantIdBox = document.getElementById('tenantIdUploadBox');
  const tenantIdBadge = document.getElementById('tenantIdBadge');
  const tenantIdRow = document.getElementById('checkRowTenantId');
  const tenantIdStatus = document.getElementById('statusTenantId');

  if (tenantIdBox) {
    tenantIdBox.addEventListener('click', () => {
      appState.formData.hasTenantId = true;
      tenantIdBox.classList.add('uploaded');
      const title = tenantIdBox.querySelector('.upload-compact-title');
      const sub = tenantIdBox.querySelector('.upload-compact-sub');
      if (title) title.textContent = 'ת.ז_וספח_שוכר.jpg';
      if (sub) sub.textContent = 'נקלט ונבדק בהצלחה';
      if (tenantIdBadge) {
        tenantIdBadge.textContent = '✓ נקלט';
      }
      if (tenantIdRow) tenantIdRow.classList.add('success');
      if (tenantIdStatus) {
        tenantIdStatus.className = 'delicate-item-badge success';
        tenantIdStatus.textContent = '✓ נקלט';
      }
      updateDocsChecklistSummary();
    });
  }

  // 5. Additional Residents Multi-Upload (Optional)
  const additionalIdBox = document.getElementById('additionalIdUploadBox');
  const addMoreBtn = document.getElementById('addMoreSefachBtn');

  if (additionalIdBox) {
    additionalIdBox.addEventListener('click', () => {
      addSefachFile();
    });
  }

  if (addMoreBtn) {
    addMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addSefachFile();
    });
  }

  // Simulation Button: Test Warning Notice Trigger
  const testBlurryBtn = document.getElementById('simulateOcrWarningBtn');
  const ocrWarningCard = document.getElementById('simulatedOcrWarningCard');
  if (testBlurryBtn && ocrWarningCard) {
    testBlurryBtn.addEventListener('click', () => {
      ocrWarningCard.style.display = 'flex';
    });
  }

  // Deep Link Missing Doc Upload Button
  const smsMeterUploadBox = document.getElementById('smsMeterUploadBox');
  const smsMeterSuccess = document.getElementById('smsMeterSuccess');
  const smsSubmitBtn = document.getElementById('smsSubmitBtn');
  if (smsMeterUploadBox) {
    smsMeterUploadBox.addEventListener('click', () => {
      smsMeterUploadBox.innerHTML = `
        <div class="upload-icon-circle" style="color: var(--teal-600); border-color: var(--teal-500);">
          <svg width="22" height="22" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h4>מונה_מים_עדכני.jpg</h4>
        <p style="color: var(--teal-700); font-weight: 600;">התמונה נקלטה בהצלחה (קריאה 00384.2)</p>
      `;
      smsMeterSuccess.style.display = 'flex';
      smsSubmitBtn.removeAttribute('disabled');
      smsSubmitBtn.classList.remove('btn-secondary');
      smsSubmitBtn.classList.add('btn-primary');
    });
  }

  if (smsSubmitBtn) {
    smsSubmitBtn.addEventListener('click', () => {
      alert('תודה! צילום המונה נקלט בהצלחה והבקשה הושלמה אוטומטית.');
      switchView('noa-wizard');
      goToStep(7);
    });
  }
}

// Populate Summary Screen before final submission
function populateSummaryData() {
  const fName = appState.formData.firstName || 'נועה';
  const lName = appState.formData.lastName || 'לוי';
  document.getElementById('sumName').textContent = `${fName} ${lName}`;
  document.getElementById('sumId').textContent = appState.formData.idNumber || '318765432';
  document.getElementById('sumPhone').textContent = appState.formData.phone || '054-8765432';
  document.getElementById('sumEmail').textContent = appState.formData.email || 'noa.levi@example.com';
  
  const st = appState.formData.street || 'ביאליק';
  const hs = appState.formData.houseNum || '42';
  let apText = '';
  if (appState.formData.isPrivateHouse) {
    apText = 'בית פרטי, ';
  } else if (appState.formData.aptNum) {
    apText = `דירה ${appState.formData.aptNum}, `;
  }
  document.getElementById('sumAddress').textContent = `רחוב ${st} ${hs}, ${apText}${appState.formData.city}`;
  
  // Format Entry Date
  const rawDate = appState.formData.entryDate || '2026-09-24';
  let formattedDate = rawDate;
  if (rawDate.includes('-')) {
    const [y, m, d] = rawDate.split('-');
    formattedDate = `${d}/${m}/${y}`;
  }
  const sumEntryDateEl = document.getElementById('sumEntryDate');
  if (sumEntryDateEl) {
    sumEntryDateEl.textContent = formattedDate;
  }

  const sumLandlordEl = document.getElementById('sumLandlord');
  if (sumLandlordEl) {
    const lName = appState.formData.landlordName || 'דוד כהן';
    const lId = appState.formData.landlordId ? ` (ת.ז: ${appState.formData.landlordId})` : '';
    sumLandlordEl.textContent = `${lName}${lId}`;
  }

  const mVal = appState.formData.meterReading || '00384.2';
  document.getElementById('sumMeter').textContent = `${mVal} מ"ק`;
  
  const meterDocStatus = document.getElementById('sumMeterDoc');
  if (meterDocStatus) {
    if (appState.formData.hasMeterPhoto) {
      meterDocStatus.innerHTML = '<span class="status-pill success">צילום צורף בהצלחה</span>';
    } else {
      meterDocStatus.innerHTML = '<span class="status-pill warning">קריאה הוזנה (צילום יושלם בהמשך)</span>';
    }
  }

  const sumResidentsEl = document.getElementById('sumResidents');
  if (sumResidentsEl) {
    const count = appState.formData.residentsCount || '1';
    const num = parseInt(count, 10) || 1;
    const quota = num * 7;
    sumResidentsEl.textContent = `${count} נפשות (${quota} מ"ק הקצאה בסיסית לחודש)`;
  }
}

// Render Backoffice View (Module 2)
function renderBackoffice() {
  const smsModal = document.getElementById('smsPreviewModal');
  const sendSmsBtn = document.getElementById('backofficeSendSmsBtn');
  const confirmSendBtn = document.getElementById('confirmSendSmsBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const timeline = document.getElementById('backofficeTimeline');

  if (timeline) {
    timeline.innerHTML = appState.backoffice.logs.map(log => `
      <div class="timeline-step">
        <div class="timeline-bullet">${log.time}</div>
        <div>
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--slate-800);">${log.user}</div>
          <div style="font-size: 0.82rem; color: var(--slate-600);">${log.text}</div>
        </div>
      </div>
    `).join('');
  }

  if (sendSmsBtn && smsModal) {
    sendSmsBtn.addEventListener('click', () => {
      smsModal.classList.add('show');
    });
  }

  if (closeModalBtn && smsModal) {
    closeModalBtn.addEventListener('click', () => {
      smsModal.classList.remove('show');
    });
  }

  if (confirmSendBtn && smsModal) {
    confirmSendBtn.addEventListener('click', () => {
      appState.backoffice.smsSent = true;
      appState.backoffice.logs.unshift({
        time: 'עכשיו',
        user: 'נציג שירות (נשלח SMS)',
        text: 'נשלחה הודעת השלמה ממוקדת לנועה ב-SMS + מייל עם קישור ישיר לצילום מונה.'
      });
      smsModal.classList.remove('show');
      alert('הודעת ההשלמה נשלחה בהצלחה לנועה!');
      renderBackoffice();
    });
  }
}

// Render Operations Dashboard (Module 3)
function renderDashboard() {
  const permToggle = document.getElementById('permissionsToggle');
  const auditBody = document.getElementById('auditTableBody');

  if (auditBody) {
    auditBody.innerHTML = appState.dashboard.auditLogs.map(log => `
      <tr>
        <td style="font-family: monospace; font-size: 0.82rem; color: var(--slate-500);">${log.time}</td>
        <td style="font-weight: 600;">${log.user}</td>
        <td>${log.action}</td>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary-700);">${log.caseId}</td>
      </tr>
    `).join('');
  }

  if (permToggle) {
    permToggle.addEventListener('change', (e) => {
      appState.dashboard.permissionsGranted = e.target.checked;
      appState.dashboard.auditLogs.unshift({
        time: 'עכשיו',
        user: 'מנהל תפעול',
        action: e.target.checked ? 'הופעלה הרשאת צפייה במסמכי זיהוי רגישים' : 'בוטלה הרשאת צפייה במסמכי זיהוי',
        caseId: '-'
      });
      renderDashboard();
    });
  }
}

// Reset Simulation
function resetSimulation() {
  appState.wizardStep = 0;
  appState.formData.firstName = '';
  appState.formData.lastName = '';
  appState.formData.idNumber = '';
  appState.formData.phone = '';
  appState.formData.email = '';
  appState.formData.city = 'רמת גן';
  appState.formData.street = '';
  appState.formData.houseNum = '';
  appState.formData.aptNum = '';
  appState.formData.isPrivateHouse = false;
  appState.formData.entryDate = '2026-09-24';
  appState.formData.landlordName = '';
  appState.formData.landlordId = '';
  appState.formData.landlordPhone = '';
  appState.formData.waterCardNum = '';
  appState.formData.residentsCount = '1';
  appState.formData.meterReading = '';
  appState.formData.hasMeterPhoto = false;
  appState.formData.hasContract = false;
  appState.formData.hasOwnerId = false;
  appState.formData.hasTenantId = false;
  appState.formData.additionalSefachFiles = [];
  appState.formData.hasSignature = false;
  appState.formData.termsAccepted = false;
  appState.formData.otpVerified = false;
  appState.backoffice.smsSent = false;
  
  // Clear inputs
  const inputs = [
    'inputFirstName', 'inputLastName', 'inputIdNumber', 'inputPhone', 'inputEmail',
    'inputCity', 'inputStreet', 'inputHouse', 'inputApt', 'inputEntryDate',
    'inputLandlordName', 'inputLandlordId', 'inputLandlordPhone',
    'inputWaterCardNum', 'inputMeterReading'
  ];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      el.classList.remove('is-valid', 'is-invalid');
    }
  });

  // Clear signature canvas
  const canvas = document.getElementById('signatureCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Clear error messages
  document.querySelectorAll('.field-error-msg').forEach(el => {
    el.style.display = 'none';
  });

  switchView('noa-wizard');
  goToStep(0);
}

// Helper to visually select cards and keep full background styling
function selectActionCard(cardElement) {
  if (!cardElement || !cardElement.parentElement) return;
  cardElement.parentElement.querySelectorAll('.selection-card').forEach(c => {
    c.classList.remove('selected');
  });
  cardElement.classList.add('selected');
}

// Step Validation & Progression Handlers
function handleStep3Next() {
  let firstInvalid = null;
  
  const fNameInput = document.getElementById('inputFirstName');
  const fNameError = document.getElementById('firstNameErrorMsg');
  const fNameFeedback = document.getElementById('firstNameFeedbackIcon');
  const fNameVal = (fNameInput ? fNameInput.value.trim() : '');
  
  if (!fNameVal || fNameVal.length < 2) {
    if (fNameInput) {
      fNameInput.classList.add('is-invalid');
      fNameInput.classList.remove('is-valid');
    }
    if (fNameError) {
      fNameError.textContent = 'שם פרטי הוא שדה חובה (נא להקליד לפחות 2 אותיות)';
      fNameError.style.display = 'block';
    }
    if (fNameFeedback) fNameFeedback.style.display = 'none';
    if (!firstInvalid) firstInvalid = fNameInput;
  } else {
    if (fNameInput) {
      fNameInput.classList.remove('is-invalid');
      fNameInput.classList.add('is-valid');
    }
    if (fNameError) fNameError.style.display = 'none';
    if (fNameFeedback) fNameFeedback.style.display = 'flex';
  }

  const lNameInput = document.getElementById('inputLastName');
  const lNameError = document.getElementById('lastNameErrorMsg');
  const lNameFeedback = document.getElementById('lastNameFeedbackIcon');
  const lNameVal = (lNameInput ? lNameInput.value.trim() : '');

  if (!lNameVal || lNameVal.length < 2) {
    if (lNameInput) {
      lNameInput.classList.add('is-invalid');
      lNameInput.classList.remove('is-valid');
    }
    if (lNameError) {
      lNameError.textContent = 'שם משפחה הוא שדה חובה (נא להקליד לפחות 2 אותיות)';
      lNameError.style.display = 'block';
    }
    if (lNameFeedback) lNameFeedback.style.display = 'none';
    if (!firstInvalid) firstInvalid = lNameInput;
  } else {
    if (lNameInput) {
      lNameInput.classList.remove('is-invalid');
      lNameInput.classList.add('is-valid');
    }
    if (lNameError) lNameError.style.display = 'none';
    if (lNameFeedback) lNameFeedback.style.display = 'flex';
  }

  const idInput = document.getElementById('inputIdNumber');
  const idError = document.getElementById('idErrorMsg');
  const idFeedback = document.getElementById('idFeedbackIcon');
  const idVal = (idInput ? idInput.value.trim() : '');
  const idRes = validateIsraeliID(idVal);

  if (!idVal) {
    if (idInput) {
      idInput.classList.add('is-invalid');
      idInput.classList.remove('is-valid');
    }
    if (idError) {
      idError.textContent = 'מספר תעודת זהות הוא שדה חובה (9 ספרות)';
      idError.style.display = 'block';
    }
    if (idFeedback) idFeedback.style.display = 'none';
    if (!firstInvalid) firstInvalid = idInput;
  } else if (!idRes.isValid) {
    if (idInput) {
      idInput.classList.add('is-invalid');
      idInput.classList.remove('is-valid');
    }
    if (idError) {
      idError.textContent = idRes.message;
      idError.style.display = 'block';
    }
    if (idFeedback) {
      idFeedback.style.display = 'flex';
      idFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    }
    if (!firstInvalid) firstInvalid = idInput;
  } else {
    if (idInput) {
      idInput.classList.remove('is-invalid');
      idInput.classList.add('is-valid');
    }
    if (idError) idError.style.display = 'none';
    if (idFeedback) {
      idFeedback.style.display = 'flex';
      idFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    }
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  goToStep(4);
}

function handleStep4Next() {
  let firstInvalid = null;

  const phoneInput = document.getElementById('inputPhone');
  const phoneError = document.getElementById('phoneErrorMsg');
  const phoneFeedback = document.getElementById('phoneFeedbackIcon');
  const phoneVal = (phoneInput ? phoneInput.value.trim() : '');
  const phoneRes = validateIsraeliPhone(phoneVal);

  if (!phoneVal) {
    if (phoneInput) {
      phoneInput.classList.add('is-invalid');
      phoneInput.classList.remove('is-valid');
    }
    if (phoneError) {
      phoneError.textContent = 'מספר טלפון נייד הוא שדה חובה (10 ספרות החל מ-05)';
      phoneError.style.display = 'block';
    }
    if (phoneFeedback) phoneFeedback.style.display = 'none';
    if (!firstInvalid) firstInvalid = phoneInput;
  } else if (!phoneRes.isValid) {
    if (phoneInput) {
      phoneInput.classList.add('is-invalid');
      phoneInput.classList.remove('is-valid');
    }
    if (phoneError) {
      phoneError.textContent = phoneRes.message;
      phoneError.style.display = 'block';
    }
    if (phoneFeedback) {
      phoneFeedback.style.display = 'flex';
      phoneFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    }
    if (!firstInvalid) firstInvalid = phoneInput;
  } else {
    if (phoneInput) {
      phoneInput.classList.remove('is-invalid');
      phoneInput.classList.add('is-valid');
    }
    if (phoneError) phoneError.style.display = 'none';
    if (phoneFeedback) {
      phoneFeedback.style.display = 'flex';
      phoneFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    }
  }

  const emailInput = document.getElementById('inputEmail');
  const emailError = document.getElementById('emailErrorMsg');
  const emailFeedback = document.getElementById('emailFeedbackIcon');
  const emailVal = (emailInput ? emailInput.value.trim() : '');
  const emailRes = validateEmail(emailVal);

  if (!emailVal) {
    if (emailInput) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
    }
    if (emailError) {
      emailError.textContent = 'כתובת אימייל היא שדה חובה';
      emailError.style.display = 'block';
    }
    if (emailFeedback) emailFeedback.style.display = 'none';
    if (!firstInvalid) firstInvalid = emailInput;
  } else if (!emailRes.isValid) {
    if (emailInput) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
    }
    if (emailError) {
      emailError.textContent = emailRes.message;
      emailError.style.display = 'block';
    }
    if (emailFeedback) {
      emailFeedback.style.display = 'flex';
      emailFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    }
    if (!firstInvalid) firstInvalid = emailInput;
  } else {
    if (emailInput) {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }
    if (emailError) emailError.style.display = 'none';
    if (emailFeedback) {
      emailFeedback.style.display = 'flex';
      emailFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    }
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  goToStep(5);
}

function handleStep5Next() {
  let firstInvalid = null;

  const cityInput = document.getElementById('inputCity');
  const cityError = document.getElementById('cityErrorMsg');
  const cityVal = (cityInput ? cityInput.value.trim() : '');

  if (!cityVal) {
    if (cityInput) cityInput.classList.add('is-invalid');
    if (cityError) {
      cityError.textContent = 'יש לבחור או להקליד עיר';
      cityError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = cityInput;
  } else {
    if (cityInput) cityInput.classList.remove('is-invalid');
    if (cityError) cityError.style.display = 'none';
    appState.formData.city = cityVal;
  }

  const streetInput = document.getElementById('inputStreet');
  const streetError = document.getElementById('streetErrorMsg');
  const streetVal = (streetInput ? streetInput.value.trim() : '');

  if (!streetVal) {
    if (streetInput) streetInput.classList.add('is-invalid');
    if (streetError) {
      streetError.textContent = 'יש לבחור או להקליד רחוב';
      streetError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = streetInput;
  } else {
    if (streetInput) streetInput.classList.remove('is-invalid');
    if (streetError) streetError.style.display = 'none';
    appState.formData.street = streetVal;
  }

  const houseInput = document.getElementById('inputHouse');
  const houseError = document.getElementById('houseErrorMsg');
  const houseVal = (houseInput ? houseInput.value.trim() : '');

  if (!houseVal) {
    if (houseInput) houseInput.classList.add('is-invalid');
    if (houseError) {
      houseError.textContent = 'יש להזין מספר בית';
      houseError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = houseInput;
  } else {
    if (houseInput) houseInput.classList.remove('is-invalid');
    if (houseError) houseError.style.display = 'none';
    appState.formData.houseNum = houseVal;
  }

  const aptInput = document.getElementById('inputApt');
  if (aptInput) {
    appState.formData.aptNum = aptInput.value.trim();
  }

  const entryDateInput = document.getElementById('inputEntryDate');
  const entryDateError = document.getElementById('entryDateErrorMsg');
  const entryDateVal = (entryDateInput ? entryDateInput.value.trim() : '');

  if (!entryDateVal) {
    if (entryDateInput) entryDateInput.classList.add('is-invalid');
    if (entryDateError) {
      entryDateError.textContent = 'יש להזין תאריך כניסה / תאריך תחילת שכירות';
      entryDateError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = entryDateInput;
  } else {
    if (entryDateInput) entryDateInput.classList.remove('is-invalid');
    if (entryDateError) entryDateError.style.display = 'none';
    appState.formData.entryDate = entryDateVal;
  }

  // Landlord Name Validation
  const lNameInput = document.getElementById('inputLandlordName');
  const lNameError = document.getElementById('landlordNameErrorMsg');
  const lNameVal = (lNameInput ? lNameInput.value.trim() : '');

  if (!lNameVal) {
    if (lNameInput) lNameInput.classList.add('is-invalid');
    if (lNameError) {
      lNameError.textContent = 'יש להזין את שם המשכיר / בעל הנכס';
      lNameError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = lNameInput;
  } else {
    if (lNameInput) lNameInput.classList.remove('is-invalid');
    if (lNameError) lNameError.style.display = 'none';
    appState.formData.landlordName = lNameVal;
  }

  // Landlord ID Validation
  const lIdInput = document.getElementById('inputLandlordId');
  const lIdError = document.getElementById('landlordIdErrorMsg');
  const lIdVal = (lIdInput ? lIdInput.value.trim() : '');
  const lIdRes = validateIsraeliID(lIdVal);

  if (!lIdVal) {
    if (lIdInput) lIdInput.classList.add('is-invalid');
    if (lIdError) {
      lIdError.textContent = 'יש להזין תעודת זהות של המשכיר (9 ספרות)';
      lIdError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = lIdInput;
  } else if (!lIdRes.isValid) {
    if (lIdInput) lIdInput.classList.add('is-invalid');
    if (lIdError) {
      lIdError.textContent = lIdRes.message;
      lIdError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = lIdInput;
  } else {
    if (lIdInput) lIdInput.classList.remove('is-invalid');
    if (lIdError) lIdError.style.display = 'none';
    appState.formData.landlordId = lIdVal;
  }

  const lPhoneInput = document.getElementById('inputLandlordPhone');
  if (lPhoneInput) {
    appState.formData.landlordPhone = lPhoneInput.value.trim();
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  goToStep(6);
}

function handleStep6Next() {
  let firstInvalid = null;

  const meterInput = document.getElementById('inputMeterReading');
  const meterError = document.getElementById('meterErrorMsg');
  const meterVal = (meterInput ? meterInput.value.trim() : '');

  if (!meterVal) {
    if (meterInput) meterInput.classList.add('is-invalid');
    if (meterError) {
      meterError.textContent = 'יש להזין קריאת מונה מים (קוב)';
      meterError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = meterInput;
  } else {
    if (meterInput) meterInput.classList.remove('is-invalid');
    if (meterError) meterError.style.display = 'none';
    appState.formData.meterReading = meterVal;
  }

  // Documents check: if user hasn't clicked upload yet, auto-simulate upload for smooth peer testing
  if (!appState.formData.hasContract) {
    const contractBox = document.getElementById('contractUploadBox');
    if (contractBox) contractBox.click();
  }

  if (!appState.formData.hasOwnerId) {
    const ownerIdBox = document.getElementById('ownerIdUploadBox');
    if (ownerIdBox) ownerIdBox.click();
  }

  if (!appState.formData.hasTenantId) {
    const tenantIdBox = document.getElementById('tenantIdUploadBox');
    if (tenantIdBox) tenantIdBox.click();
  }

  if (!appState.formData.hasMeterPhoto) {
    const meterBox = document.getElementById('meterPhotoUploadBox');
    if (meterBox) meterBox.click();
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  goToStep(7);
}

function handleStep7Next() {
  const termsCheckbox = document.getElementById('acceptTermsCheckbox');
  const declError = document.getElementById('declarationErrorMsg');
  const sigError = document.getElementById('signatureErrorMsg');

  let hasError = false;

  if (termsCheckbox && !termsCheckbox.checked) {
    if (declError) {
      declError.textContent = 'יש לסמן את תיבת ההצהרה כדי להגיש את הבקשה';
      declError.style.display = 'block';
    }
    hasError = true;
  } else {
    if (declError) declError.style.display = 'none';
  }

  if (!appState.formData.hasSignature) {
    if (sigError) {
      sigError.textContent = 'יש לחתום בתיבת החתימה כדי להגיש את הבקשה';
      sigError.style.display = 'block';
    }
    hasError = true;
  } else {
    if (sigError) sigError.style.display = 'none';
  }

  if (hasError) return;

  goToStep(8);
}

// Global window helpers
window.goToStep = goToStep;
window.switchView = switchView;
window.resetSimulation = resetSimulation;
window.selectActionCard = selectActionCard;
window.handleStep3Next = handleStep3Next;
window.handleStep4Next = handleStep4Next;
window.handleStep5Next = handleStep5Next;
window.handleStep6Next = handleStep6Next;
window.handleStep7Next = handleStep7Next;
window.addSefachFile = addSefachFile;
window.removeSefachFile = removeSefachFile;


