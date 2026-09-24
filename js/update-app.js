/**
 * נועה עוברת דירה - תאגיד מי רמת גן
 * גרסה מעודכנת חכמה ומקוצרת (update.html)
 * מבוססת חילוץ ופענוח נתונים אוטומטי ממסמכים (Smart OCR & Minimal Friction)
 */

// State Management
const appState = {
  activeView: 'noa-wizard', // 'noa-wizard' | 'sms-completion' | 'backoffice' | 'dashboard'
  wizardStep: 0, // 0: action, 1: id_contact, 2: smart_upload, 3: review_sign, 4: success
  formData: {
    actionType: 'start_rent',
    firstName: '',
    lastName: '',
    idNumber: '',
    phone: '',
    email: '',
    otpVerified: false,
    
    // Extracted / Verified Fields
    city: 'רמת גן',
    street: 'ביאליק',
    houseNum: '42',
    aptNum: '7',
    entryDate: '2026-10-01',
    waterCardNum: '1048291',
    meterReading: '00384.2',
    landlordName: 'דוד כהן',
    landlordId: '058765432',
    residentsCount: '1',

    // Document Flags
    hasMeterPhoto: false,
    hasContract: false,
    hasOwnerId: false,
    hasTenantId: false,
    additionalSefachFiles: [],

    // Submission Flags
    hasSignature: false,
    termsAccepted: false,
  },
  backoffice: {
    selectedCaseId: 'RG-2026-8841',
    activeFilter: 'all',
    searchQuery: '',
    tickets: [
      {
        id: 'RG-2026-8841',
        tenantName: 'נועה לוי',
        tenantId: '318765432',
        tenantPhone: '050-1234567',
        tenantEmail: 'noa.levi@example.com',
        actionType: 'החלפת שוכרים נכנסים',
        city: 'רמת גן',
        street: 'ביאליק',
        houseNum: '42',
        aptNum: '7',
        meterNum: '9482710',
        meterReading: '00384.2',
        effectiveDate: '2026-10-01',
        ownerName: 'דוד כהן',
        ownerId: '058765432',
        ownerPhone: '052-9876543',
        receivedTime: '11:02',
        elapsedMinutes: 14,
        slaStatus: 'fresh',
        status: 'pending_review',
        statusText: 'ממתין לבדיקת נציג',
        statusClass: 'warning',
        comparison: [
          { field: 'קריאת מונה מים', userInput: '384.2 מ"ק', ocrInput: '00384.2 מ"ק (צילום מונה)', dbInput: 'היסטוריית צריכה תקינה', status: 'match', statusText: '✓ תואם ומאומת' },
          { field: 'תאריך כניסה לתוקף', userInput: '01/10/2026', ocrInput: '01/10/2026 (עמוד 1 בחוזה)', dbInput: 'תואם סיום דייר יוצא', status: 'match', statusText: '✓ תואם ומאומת' },
          { field: 'זהות השוכר/ת', userInput: 'נועה לוי (318765432)', ocrInput: 'זוהה בת.ז ובחתימת חוזה', dbInput: 'קיים במרשם האוכלוסין', status: 'match', statusText: '✓ תואם ומאומת' },
          { field: 'בעלות הנכס (משכיר)', userInput: 'דוד כהן (058765432)', ocrInput: 'זוהה בת.ז משכיר וחוזה', dbInput: 'רשום כבעל הנכס בתאגיד', status: 'match', statusText: '✓ תואם ומאומת' },
          { field: 'ספח להנחת מים (נפשות)', userInput: 'תוספת בגיר (2 נפשות)', ocrInput: 'ספח תואם כתובת הנכס', dbInput: 'מעודכן במרשם אוכלוסין', status: 'match', statusText: '✓ זכאות מאושרת' }
        ],
        docs: [
          { title: '1. צילום מונה מים', type: 'JPG', img: 'assets/meter_sample.jpg', desc: 'צילום מונה עם קריאה 00384.2 ומספר מונה 9482710' },
          { title: '2. חוזה שכירות חתום', type: 'PDF', img: 'assets/contract_sample.jpg', desc: 'עמודי חוזה שכירות עם פרטי הצדדים וחתימות' },
          { title: '3. ת.ז וספח משכיר', type: 'JPG', img: 'assets/id_sample.jpg', desc: 'תעודת זהות וספח פתוח של בעל הנכס דוד כהן' },
          { title: '4. ת.ז וספח שוכר/ת', type: 'JPG', img: 'assets/israeli_id_and_sefach.jpg', desc: 'תעודת זהות וספח פתוח של נועה לוי' },
          { title: '5. ספח בגיר נוסף', type: 'JPG', img: 'assets/israeli_biometric_id_sefach_v2.jpg', desc: 'ספח דייר נוסף בדירה להנחת נפשות' }
        ],
        logs: [
          { time: '11:02', user: 'מערכת', text: 'הבקשה התקבלה בהצלחה מהפורטל הדיגיטלי עם 5 מסמכים מצורפים.' },
          { time: '11:03', user: 'רובוט פענוח (AI OCR)', text: 'הושלם פענוח מונה מים (00384.2 מ"ק), תאריך כניסה וזיהוי ת.ז.' },
          { time: '11:05', user: 'מערכת', text: 'הפנייה שובצה לתור טיפול נציג שירות (נציגה תורנית: דנה).' }
        ]
      },
      {
        id: 'RG-2026-8842',
        tenantName: 'איתי שרון',
        tenantId: '029384756',
        tenantPhone: '054-4433221',
        tenantEmail: 'itai.sharon@gmail.com',
        actionType: 'כניסת דייר חדש',
        city: 'רמת גן',
        street: 'הרצל',
        houseNum: '15',
        aptNum: '3',
        meterNum: '8172645',
        meterReading: '00129.0',
        effectiveDate: '2026-10-01',
        ownerName: 'שרה לוינשטיין',
        ownerId: '019283746',
        ownerPhone: '050-8877665',
        receivedTime: '10:45',
        elapsedMinutes: 32,
        slaStatus: 'warning',
        status: 'pending_customer',
        statusText: 'ממתין להשלמת לקוח',
        statusClass: 'warning',
        comparison: [
          { field: 'קריאת מונה מים', userInput: '129.0 מ"ק', ocrInput: '⚠️ תמונה מטושטשת (לא פוענח)', dbInput: 'ממתין לתמונה קריאה', status: 'warning', statusText: '⚠️ דורש השלמה' },
          { field: 'חוזה שכירות', userInput: 'תקף מ-01/10/2026', ocrInput: 'פוענח חוזה תקף', dbInput: 'תקין', status: 'match', statusText: '✓ תואם ומאומת' },
          { field: 'ת.ז שוכר', userInput: 'איתי שרון', ocrInput: 'פוענחה ת.ז', dbInput: 'תקין', status: 'match', statusText: '✓ תואם ומאומת' }
        ],
        docs: [
          { title: 'צילום מונה מים', type: 'JPG', img: 'assets/meter_sample.jpg', desc: 'צילום מונה (קריאה חסרה)' },
          { title: 'חוזה שכירות', type: 'PDF', img: 'assets/contract_sample.jpg', desc: 'חוזה חתום' },
          { title: 'ת.ז וספח שוכר', type: 'JPG', img: 'assets/id_sample.jpg', desc: 'תעודת זהות שוכר' }
        ],
        logs: [
          { time: '10:45', user: 'מערכת', text: 'הבקשה התקבלה מהתושב.' },
          { time: '10:50', user: 'נציג שירות (דנה)', text: 'נשלח SMS ללקוח להשלמת צילום מונה קריא.' }
        ]
      },
      {
        id: 'RG-2026-8843',
        tenantName: 'מיכל ברקוביץ\'',
        tenantId: '048291045',
        tenantPhone: '052-5544332',
        tenantEmail: 'michal.b@walla.co.il',
        actionType: 'סיום שכירות ויציאה',
        city: 'רמת גן',
        street: 'ז\'בוטינסקי',
        houseNum: '88',
        aptNum: '12',
        meterNum: '7362910',
        meterReading: '01540.8',
        effectiveDate: '2026-09-30',
        ownerName: 'אברהם שפירא',
        ownerId: '018273645',
        ownerPhone: '053-2211445',
        receivedTime: '09:55',
        elapsedMinutes: 80,
        slaStatus: 'warning',
        status: 'escalated',
        statusText: 'בטיפול מנהל',
        statusClass: 'info',
        comparison: [
          { field: 'קריאת מונה מים', userInput: '1,540.8 מ"ק', ocrInput: '01540.8 מ"ק', dbInput: 'חריגת צריכה קלה', status: 'match', statusText: '✓ תואם ומאומת' },
          { field: 'חתימת משכיר', userInput: 'אברהם שפירא', ocrInput: 'חתימה שונה ממרשם', dbInput: 'דורש אישור מנהל', status: 'warning', statusText: '⚠️ בדיקת מנהל' }
        ],
        docs: [
          { title: 'צילום מונה מים', type: 'JPG', img: 'assets/meter_sample.jpg', desc: 'צילום מונה' },
          { title: 'הסכם עזיבה', type: 'PDF', img: 'assets/contract_sample.jpg', desc: 'הסכם עזיבה' }
        ],
        logs: [
          { time: '09:55', user: 'מערכת', text: 'הבקשה התקבלה.' },
          { time: '10:15', user: 'נציג שירות (יוסי)', text: 'הפנייה הועברה לבדיקת מנהל עקב בדיקת חתימה מיוחדת.' }
        ]
      },
      {
        id: 'RG-2026-8840',
        tenantName: 'יוסי אברהם',
        tenantId: '038192847',
        tenantPhone: '050-9988776',
        tenantEmail: 'yossi.av@gmail.com',
        actionType: 'החלפת שוכרים',
        city: 'רמת גן',
        street: 'קריניצי',
        houseNum: '10',
        aptNum: '4',
        meterNum: '6251849',
        meterReading: '00512.4',
        effectiveDate: '2026-10-01',
        ownerName: 'רינה כץ',
        ownerId: '047382910',
        ownerPhone: '054-1122334',
        receivedTime: '08:15',
        elapsedMinutes: 180,
        slaStatus: 'overdue',
        status: 'pending_review',
        statusText: 'ממתין לבדיקת נציג',
        statusClass: 'danger',
        comparison: [
          { field: 'קריאת מונה מים', userInput: '512.4 מ"ק', ocrInput: '00512.4 מ"ק', dbInput: 'תקין', status: 'match', statusText: '✓ תואם' },
          { field: 'חוזה שכירות', userInput: 'תקף', ocrInput: 'פוענח חוזה', dbInput: 'תקין', status: 'match', statusText: '✓ תואם' }
        ],
        docs: [
          { title: 'צילום מונה', type: 'JPG', img: 'assets/meter_sample.jpg', desc: 'צילום מונה מים' },
          { title: 'חוזה שכירות', type: 'PDF', img: 'assets/contract_sample.jpg', desc: 'חוזה שכירות' }
        ],
        logs: [
          { time: '08:15', user: 'מערכת', text: 'הבקשה נקלטה במערכת.' }
        ]
      }
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
window.appState = appState;

// Israeli ID Luhn Validator
function validateIsraeliID(rawId) {
  const idStr = String(rawId || '').trim();
  if (!idStr) return { isValid: false, message: '' };

  if (!/^\d+$/.test(idStr)) {
    return { isValid: false, message: 'מספר זהות חייב להכיל ספרות בלבד' };
  }

  if (idStr.length < 9) {
    const missing = 9 - idStr.length;
    return { isValid: false, message: `חסרות ${missing} ספרות (השלימו ל-9 ספרות)` };
  }

  if (idStr.length > 9) {
    return { isValid: false, message: 'מספר תעודת זהות לא יכול להכיל יותר מ-9 ספרות' };
  }

  const paddedId = idStr.padStart(9, '0');
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(paddedId.charAt(i));
    let weight = (i % 2 === 0) ? 1 : 2;
    let step = digit * weight;
    sum += step > 9 ? step - 9 : step;
  }

  const isValidLuhn = (sum % 10 === 0);
  if (!isValidLuhn) {
    return { isValid: false, message: 'ספרת הביקורת אינה תקינה. אנא בדקו שוב את המספר' };
  }

  return { isValid: true, message: 'תעודת זהות תקינה' };
}

// Israeli Phone Validator
function validateIsraeliPhone(rawPhone) {
  const phone = String(rawPhone || '').trim();
  if (!phone) return { isValid: false, message: '' };

  const digitsOnly = phone.replace(/\D/g, '');

  if (/[^\d-]/.test(phone)) {
    return { isValid: false, message: 'מספר הטלפון יכול להכיל רק ספרות ומקף' };
  }

  if (digitsOnly.length >= 2 && !digitsOnly.startsWith('05')) {
    return { isValid: false, message: 'מספר טלפון נייד חייב להתחיל בקידומת 05 (למשל: 054, 052, 050)' };
  }

  if (digitsOnly.length < 10) {
    const missing = 10 - digitsOnly.length;
    return { isValid: false, message: `חסרות ${missing} ספרות (מספר נייד תקין כולל 10 ספרות בדיוק)` };
  }

  if (digitsOnly.length > 10) {
    return { isValid: false, message: 'מספר הטלפון ארוך מדי (הזינו 10 ספרות בלבד)' };
  }

  return { isValid: true, message: 'מספר טלפון תקין' };
}

// Global Email Validator (RFC 5322)
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

  return { isValid: true, message: 'כתובת אימייל תקינה' };
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  initPeerMenu();
  initWizardSteps();
  initInputListeners();
  initSimulations();
  initSignaturePad();
  resetUploadCardsUI();
  updateWizardUI();
});

// Peer Review Menu (3 dots)
function initPeerMenu() {
  const trigger = document.getElementById('menuTriggerBtn');
  const dropdown = document.getElementById('peerDropdownMenu');

  if (!trigger || !dropdown) return;

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

  document.querySelectorAll('[data-view-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view-target');
      switchView(targetView);
      dropdown.classList.remove('show');
    });
  });

  const resetBtn = document.getElementById('resetSimulationBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetSimulation();
      dropdown.classList.remove('show');
    });
  }
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
    if (badge) {
      badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        מסלול מקוצר חכם
      `;
    }
  } else if (viewName === 'sms-completion') {
    document.getElementById('view-sms-completion').classList.add('active');
    if (badge) {
      badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        השלמת חוסר מקישור SMS
      `;
    }
  } else if (viewName === 'backoffice') {
    document.getElementById('view-backoffice').classList.add('active');
    if (badge) {
      badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        מרחב נציג שירות
      `;
    }
    renderBackoffice();
  } else if (viewName === 'dashboard') {
    document.getElementById('view-dashboard').classList.add('active');
    if (badge) {
      badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        דשבורד מנהל תפעול
      `;
    }
    renderDashboard();
  }
}

// Wizard Step Progression
function initWizardSteps() {
  updateWizardUI();
}

function canNavigateToStep(targetStep) {
  const currentStep = appState.wizardStep;
  if (targetStep <= currentStep) {
    return true; // Going back is always allowed
  }

  // If currently at Step 3 or trying to skip past Step 3, validate personal details
  if (targetStep >= 4 && currentStep <= 3) {
    const fNameVal = (document.getElementById('inputFirstName')?.value || appState.formData.firstName || '').trim();
    const lNameVal = (document.getElementById('inputLastName')?.value || appState.formData.lastName || '').trim();
    const idVal = (document.getElementById('inputIdNumber')?.value || appState.formData.idNumber || '').trim();
    const phoneVal = (document.getElementById('inputPhone')?.value || appState.formData.phone || '').trim();
    const emailVal = (document.getElementById('inputEmail')?.value || appState.formData.email || '').trim();

    const idRes = validateIsraeliID(idVal);
    const phoneRes = validateIsraeliPhone(phoneVal);
    const emailRes = validateEmail(emailVal);

    if (fNameVal.length < 2 || lNameVal.length < 2 || !idRes.isValid || !phoneRes.isValid || !emailRes.isValid) {
      if (currentStep === 3) {
        handleSmartStep3Next();
      }
      return false;
    }
  }

  // If currently at Step 4 or trying to skip past Step 4, validate all 4 mandatory docs
  if (targetStep >= 5 && currentStep <= 4) {
    const isAllDocs = appState.formData.hasMeterPhoto && 
                      appState.formData.hasContract && 
                      appState.formData.hasOwnerId && 
                      appState.formData.hasTenantId;
    if (!isAllDocs) {
      if (currentStep === 4) {
        handleSmartStep4Next();
      }
      return false;
    }
  }

  // If currently at Step 5 or trying to skip past Step 5, validate signature & terms
  if (targetStep >= 6 && currentStep <= 5) {
    const terms = document.getElementById('acceptTermsCheckbox')?.checked || appState.formData.termsAccepted;
    if (!terms || !appState.formData.hasSignature) {
      if (currentStep === 5) {
        handleSmartStep5Submit();
      }
      return false;
    }
  }

  return true;
}

function goToStep(stepIndex) {
  if (stepIndex < 0 || stepIndex > 6) return;
  if (!canNavigateToStep(stepIndex)) return;
  appState.wizardStep = stepIndex;
  if (stepIndex === 5) {
    syncSummaryData();
  }
  updateWizardUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateDynamicProgress() {
  const step = appState.wizardStep;
  if (step === 0) return 0;
  if (step === 6) return 100;

  let progress = 0;

  // Step 1: Role selection
  if (step === 1) {
    progress = 10;
  }
  // Step 2: Documents prep checklist
  else if (step === 2) {
    progress = 15;
  }
  // Step 3: Personal Details (Base 20% + 4% per valid field)
  else if (step === 3) {
    progress = 20;
    const fNameVal = (document.getElementById('inputFirstName')?.value || appState.formData.firstName || '').trim();
    const lNameVal = (document.getElementById('inputLastName')?.value || appState.formData.lastName || '').trim();
    const idVal = (document.getElementById('inputIdNumber')?.value || appState.formData.idNumber || '').trim();
    const phoneVal = (document.getElementById('inputPhone')?.value || appState.formData.phone || '').trim();
    const emailVal = (document.getElementById('inputEmail')?.value || appState.formData.email || '').trim();

    if (fNameVal.length >= 2) progress += 4;
    if (lNameVal.length >= 2) progress += 4;
    if (validateIsraeliID(idVal).isValid) progress += 4;
    if (validateIsraeliPhone(phoneVal).isValid) progress += 4;
    if (validateEmail(emailVal).isValid) progress += 4;
  }
  // Step 4: Documents Upload (Base 40% + 10% per uploaded mandatory doc)
  else if (step === 4) {
    progress = 40;
    if (appState.formData.hasMeterPhoto) progress += 10;
    if (appState.formData.hasContract) progress += 10;
    if (appState.formData.hasOwnerId) progress += 10;
    if (appState.formData.hasTenantId) progress += 10;
  }
  // Step 5: Summary & Signature (Base 85% + 5% terms + 10% signature)
  else if (step === 5) {
    progress = 85;
    const terms = document.getElementById('acceptTermsCheckbox')?.checked || appState.formData.termsAccepted;
    if (terms) progress += 5;
    if (appState.formData.hasSignature) progress += 10;
  }

  return Math.min(100, Math.max(0, progress));
}

function updateProgressUI() {
  const currentPercent = calculateDynamicProgress();
  const fill = document.getElementById('wizardProgressFill');
  const percentText = document.getElementById('wizardProgressPercent');
  if (fill) fill.style.width = `${currentPercent}%`;
  if (percentText) {
    percentText.innerHTML = `<span dir="ltr" style="display: inline-block; font-weight: 700;">${currentPercent}%</span> הושלמו`;
  }
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

  updateProgressUI();

  document.querySelectorAll('.step-item').forEach((item, idx) => {
    item.classList.remove('active', 'completed');
    if (idx < currentStep) {
      item.classList.add('completed');
    } else if (idx === currentStep) {
      item.classList.add('active');
    }
  });
}

// Live Input Listeners & Error Clearing
function initInputListeners() {
  // 1. First Name
  const fNameInput = document.getElementById('inputFirstName');
  const fNameError = document.getElementById('firstNameErrorMsg');
  const fNameFeedback = document.getElementById('firstNameFeedbackIcon');
  if (fNameInput) {
    fNameInput.addEventListener('input', () => {
      const val = fNameInput.value.trim();
      appState.formData.firstName = val;
      if (val.length >= 2) {
        fNameInput.classList.add('is-valid');
        fNameInput.classList.remove('is-invalid');
        if (fNameError) fNameError.style.display = 'none';
        if (fNameFeedback) fNameFeedback.style.display = 'flex';
      } else {
        fNameInput.classList.remove('is-valid');
        if (fNameFeedback) fNameFeedback.style.display = 'none';
      }
      updateProgressUI();
    });
  }

  // 2. Last Name
  const lNameInput = document.getElementById('inputLastName');
  const lNameError = document.getElementById('lastNameErrorMsg');
  const lNameFeedback = document.getElementById('lastNameFeedbackIcon');
  if (lNameInput) {
    lNameInput.addEventListener('input', () => {
      const val = lNameInput.value.trim();
      appState.formData.lastName = val;
      if (val.length >= 2) {
        lNameInput.classList.add('is-valid');
        lNameInput.classList.remove('is-invalid');
        if (lNameError) lNameError.style.display = 'none';
        if (lNameFeedback) lNameFeedback.style.display = 'flex';
      } else {
        lNameInput.classList.remove('is-valid');
        if (lNameFeedback) lNameFeedback.style.display = 'none';
      }
      updateProgressUI();
    });
  }

  // 3. ID Number
  const idInput = document.getElementById('inputIdNumber');
  const idError = document.getElementById('idErrorMsg');
  const idFeedback = document.getElementById('idFeedbackIcon');
  if (idInput) {
    const handleId = (isBlur = false) => {
      const val = idInput.value.trim();
      appState.formData.idNumber = val;
      if (!val) {
        idInput.classList.remove('is-valid', 'is-invalid');
        if (idError) idError.style.display = 'none';
        if (idFeedback) idFeedback.style.display = 'none';
        updateProgressUI();
        return;
      }
      const res = validateIsraeliID(val);
      if (res.isValid) {
        idInput.classList.add('is-valid');
        idInput.classList.remove('is-invalid');
        if (idError) idError.style.display = 'none';
        if (idFeedback) {
          idFeedback.style.display = 'flex';
          idFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        if (val.length >= 9 || isBlur) {
          idInput.classList.remove('is-valid');
          idInput.classList.add('is-invalid');
          if (idError) {
            idError.textContent = res.message;
            idError.style.display = 'block';
          }
          if (idFeedback) {
            idFeedback.style.display = 'flex';
            idFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          }
        } else {
          idInput.classList.remove('is-valid', 'is-invalid');
          if (idError) idError.style.display = 'none';
          if (idFeedback) idFeedback.style.display = 'none';
        }
      }
      updateProgressUI();
    };
    idInput.addEventListener('input', () => handleId(false));
    idInput.addEventListener('blur', () => handleId(true));
  }

  // 4. Phone
  const phoneInput = document.getElementById('inputPhone');
  const phoneError = document.getElementById('phoneErrorMsg');
  const phoneFeedback = document.getElementById('phoneFeedbackIcon');
  if (phoneInput) {
    const handlePhone = (isBlur = false) => {
      const val = phoneInput.value.trim();
      appState.formData.phone = val;
      if (!val) {
        phoneInput.classList.remove('is-valid', 'is-invalid');
        if (phoneError) phoneError.style.display = 'none';
        if (phoneFeedback) phoneFeedback.style.display = 'none';
        updateProgressUI();
        return;
      }
      const res = validateIsraeliPhone(val);
      const digits = val.replace(/\D/g, '');
      if (res.isValid) {
        phoneInput.classList.add('is-valid');
        phoneInput.classList.remove('is-invalid');
        if (phoneError) phoneError.style.display = 'none';
        if (phoneFeedback) {
          phoneFeedback.style.display = 'flex';
          phoneFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        if (isBlur || digits.length > 10 || (digits.length >= 2 && !digits.startsWith('05'))) {
          phoneInput.classList.add('is-invalid');
          if (phoneError) {
            phoneError.textContent = res.message;
            phoneError.style.display = 'block';
          }
          if (phoneFeedback) {
            phoneFeedback.style.display = 'flex';
            phoneFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          }
        } else {
          phoneInput.classList.remove('is-invalid');
          if (phoneError) phoneError.style.display = 'none';
          if (phoneFeedback) phoneFeedback.style.display = 'none';
        }
      }
      updateProgressUI();
    };
    phoneInput.addEventListener('input', () => handlePhone(false));
    phoneInput.addEventListener('blur', () => handlePhone(true));
  }

  // 5. Email
  const emailInput = document.getElementById('inputEmail');
  const emailError = document.getElementById('emailErrorMsg');
  const emailFeedback = document.getElementById('emailFeedbackIcon');
  if (emailInput) {
    const handleEmail = (isBlur = false) => {
      const val = emailInput.value.trim();
      appState.formData.email = val;
      if (!val) {
        emailInput.classList.remove('is-valid', 'is-invalid');
        if (emailError) emailError.style.display = 'none';
        if (emailFeedback) emailFeedback.style.display = 'none';
        updateProgressUI();
        return;
      }
      const res = validateEmail(val);
      if (res.isValid) {
        emailInput.classList.add('is-valid');
        emailInput.classList.remove('is-invalid');
        if (emailError) emailError.style.display = 'none';
        if (emailFeedback) {
          emailFeedback.style.display = 'flex';
          emailFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }
      } else {
        if (isBlur) {
          emailInput.classList.remove('is-valid');
          emailInput.classList.add('is-invalid');
          if (emailError) {
            emailError.textContent = res.message;
            emailError.style.display = 'block';
          }
          if (emailFeedback) {
            emailFeedback.style.display = 'flex';
            emailFeedback.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          }
        } else {
          emailInput.classList.remove('is-valid');
        }
      }
      updateProgressUI();
    };
    emailInput.addEventListener('input', () => handleEmail(false));
    emailInput.addEventListener('blur', () => handleEmail(true));
  }

  // 6. Property & Extracted Review Fields (Live clearing on edit)
  ['inputCity', 'inputStreet', 'inputHouse', 'inputEntryDate', 'inputMeterReading', 'inputLandlordName', 'inputLandlordId'].forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById(`${id.replace('input', '').toLowerCase()}ErrorMsg`);
    if (el) {
      const clearErr = () => {
        if (el.value.trim()) {
          el.classList.remove('is-invalid');
          if (err) err.style.display = 'none';
        }
      };
      el.addEventListener('input', clearErr);
      el.addEventListener('change', clearErr);
    }
  });

  // Terms Checkbox
  const termsCheckbox = document.getElementById('acceptTermsCheckbox');
  const declError = document.getElementById('declarationErrorMsg');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      appState.formData.termsAccepted = termsCheckbox.checked;
      if (termsCheckbox.checked && declError) {
        declError.style.display = 'none';
      }
      updateProgressUI();
    });
  }
}

// Digital Signature Canvas
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
    updateProgressUI();
  }

  function stopDraw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
    updateProgressUI();
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
      updateProgressUI();
    });
  }
}

// Smart Upload & Simulation Handlers
function initSimulations() {
  // OTP
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const otpSection = document.getElementById('otpInputSection');
  const otpInput = document.getElementById('inputOtpCode');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  const otpSuccessNotice = document.getElementById('otpSuccessNotice');

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      if (otpSection) otpSection.style.display = 'block';
      sendOtpBtn.textContent = 'קוד אימות נשלח שוב';
      if (otpInput) {
        otpInput.value = '1234';
        otpInput.focus();
      }
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      if (otpInput && (otpInput.value === '1234' || otpInput.value.length === 4)) {
        appState.formData.otpVerified = true;
        if (otpSection) otpSection.style.display = 'none';
        if (sendOtpBtn) sendOtpBtn.style.display = 'none';
        if (otpSuccessNotice) otpSuccessNotice.style.display = 'flex';
      } else {
        alert('קוד האימות לסימולציה הוא 1234');
      }
    });
  }

  // 1. Meter Photo Upload
  const meterBox = document.getElementById('meterPhotoUploadBox');
  const meterBadge = document.getElementById('meterPhotoBadge');
  const meterRow = document.getElementById('checkRowMeterPhoto');
  const meterStatus = document.getElementById('statusMeterPhoto');

  if (meterBox) {
    meterBox.addEventListener('click', () => {
      appState.formData.hasMeterPhoto = true;
      meterBox.classList.remove('is-invalid');
      meterBox.classList.add('uploaded');
      const title = meterBox.querySelector('.upload-compact-title');
      if (title) title.innerHTML = '1. העלו צילום של שעון מונה המים <span style="color: #166534; font-weight: normal; font-size: 0.76rem; margin-right: 4px;">(✓ צילום_מונה_מים.jpg • 00384.2 מ"ק)</span>';
      if (meterBadge) meterBadge.textContent = '✓ נקלט';
      if (meterRow) meterRow.classList.add('success');
      if (meterStatus) {
        meterStatus.className = 'delicate-item-badge success';
        meterStatus.textContent = '✓ נקלט';
      }
      checkAllDocsUploaded();
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
      contractBox.classList.remove('is-invalid');
      contractBox.classList.add('uploaded');
      const title = contractBox.querySelector('.upload-compact-title');
      if (title) title.innerHTML = '2. העלו חוזה שכירות חתום <span style="color: #166534; font-weight: normal; font-size: 0.76rem; margin-right: 4px;">(✓ חוזה_שכירות_חתום.pdf • ביאליק 42)</span>';
      if (contractBadge) contractBadge.textContent = '✓ נקלט';
      if (contractRow) contractRow.classList.add('success');
      if (contractStatus) {
        contractStatus.className = 'delicate-item-badge success';
        contractStatus.textContent = '✓ נקלט';
      }
      checkAllDocsUploaded();
    });
  }

  // 3. Landlord ID Upload
  const ownerIdBox = document.getElementById('ownerIdUploadBox');
  const ownerIdBadge = document.getElementById('ownerIdBadge');
  const ownerIdRow = document.getElementById('checkRowOwnerId');
  const ownerIdStatus = document.getElementById('statusOwnerId');

  if (ownerIdBox) {
    ownerIdBox.addEventListener('click', () => {
      appState.formData.hasOwnerId = true;
      ownerIdBox.classList.remove('is-invalid');
      ownerIdBox.classList.add('uploaded');
      const title = ownerIdBox.querySelector('.upload-compact-title');
      if (title) title.innerHTML = '3. העלו ת.ז וספח של המשכיר <span style="color: #166534; font-weight: normal; font-size: 0.76rem; margin-right: 4px;">(✓ ת.ז_וספח_משכיר.jpg • דוד כהן)</span>';
      if (ownerIdBadge) ownerIdBadge.textContent = '✓ נקלט';
      if (ownerIdRow) ownerIdRow.classList.add('success');
      if (ownerIdStatus) {
        ownerIdStatus.className = 'delicate-item-badge success';
        ownerIdStatus.textContent = '✓ נקלט';
      }
      checkAllDocsUploaded();
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
      tenantIdBox.classList.remove('is-invalid');
      tenantIdBox.classList.add('uploaded');
      const title = tenantIdBox.querySelector('.upload-compact-title');
      if (title) title.innerHTML = '4. העלו ת.ז וספח של השוכר/ת <span style="color: #166534; font-weight: normal; font-size: 0.76rem; margin-right: 4px;">(✓ ת.ז_וספח_שוכר.jpg • אומת)</span>';
      if (tenantIdBadge) tenantIdBadge.textContent = '✓ נקלט';
      if (tenantIdRow) tenantIdRow.classList.add('success');
      if (tenantIdStatus) {
        tenantIdStatus.className = 'delicate-item-badge success';
        tenantIdStatus.textContent = '✓ נקלט';
      }
      checkAllDocsUploaded();
    });
  }

  // 5. Additional Sefach (Optional)
  const additionalIdBox = document.getElementById('additionalIdUploadBox');
  const addMoreBtn = document.getElementById('addMoreSefachBtn');
  if (additionalIdBox) {
    additionalIdBox.addEventListener('click', () => addSefachFile());
  }
  if (addMoreBtn) {
    addMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addSefachFile();
    });
  }

  // Step 5 Sefach Extracted Details Accordion Toggle
  const sefachToggleBtn = document.getElementById('sefachExtractedToggleBtn');
  const sefachBody = document.getElementById('sefachExtractedBody');
  const sefachArrow = document.getElementById('sefachToggleArrow');
  const sefachLabel = document.getElementById('sefachToggleLabel');

  if (sefachToggleBtn && sefachBody) {
    sefachToggleBtn.addEventListener('click', () => {
      const isVisible = sefachBody.style.display === 'block';
      sefachBody.style.display = isVisible ? 'none' : 'block';
      if (sefachArrow) sefachArrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
      if (sefachLabel) sefachLabel.textContent = isVisible ? 'לחצו לצפייה בפרטים שחולצו' : 'לחצו לצמצום פרטים';
    });
  }

  // Backoffice SMS modal simulation
  const sendSmsBtn = document.getElementById('backofficeSendSmsBtn');
  const smsModal = document.getElementById('smsPreviewModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmSendBtn = document.getElementById('confirmSendSmsBtn');

  if (sendSmsBtn && smsModal) {
    sendSmsBtn.addEventListener('click', () => smsModal.classList.add('show'));
  }
  if (closeModalBtn && smsModal) {
    closeModalBtn.addEventListener('click', () => smsModal.classList.remove('show'));
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

  // SMS Upload View
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
      if (smsMeterSuccess) smsMeterSuccess.style.display = 'flex';
      if (smsSubmitBtn) {
        smsSubmitBtn.removeAttribute('disabled');
        smsSubmitBtn.classList.remove('btn-secondary');
        smsSubmitBtn.classList.add('btn-primary');
      }
    });
  }

  if (smsSubmitBtn) {
    smsSubmitBtn.addEventListener('click', () => {
      alert('תודה! צילום המונה נקלט בהצלחה והבקשה הושלמה אוטומטית.');
      switchView('noa-wizard');
      goToStep(4);
    });
  }
}

function checkAllDocsUploaded() {
  const isAll = appState.formData.hasMeterPhoto && appState.formData.hasContract && appState.formData.hasOwnerId && appState.formData.hasTenantId;
  const summary = document.getElementById('checklistOverallSummary');
  const extractBox = document.getElementById('extractionLiveBox');
  const docsError = document.getElementById('docsRequiredErrorMsg');
  
  if (isAll) {
    if (summary) {
      summary.textContent = 'כל מסמכי החובה נקלטו ונבדקו בהצלחה ✓';
      summary.style.color = '#15803d';
    }
    if (extractBox) {
      extractBox.style.display = 'block';
    }
    if (docsError) {
      docsError.style.display = 'none';
    }
  } else {
    if (summary) {
      summary.textContent = 'בתהליך קליטה ואימות...';
      summary.style.color = 'var(--primary-700)';
    }
    if (extractBox) {
      extractBox.style.display = 'none';
    }
  }
  updateProgressUI();
}

function resetUploadCardsUI() {
  // 1. Meter
  const meterBox = document.getElementById('meterPhotoUploadBox');
  if (meterBox) {
    meterBox.classList.remove('uploaded', 'is-invalid');
    const title = meterBox.querySelector('.upload-compact-title');
    const badge = document.getElementById('meterPhotoBadge');
    if (title) title.innerHTML = '1. העלו צילום של שעון מונה המים <span class="required-star">*</span>';
    if (badge) badge.textContent = 'העלאה +';
  }
  const meterRow = document.getElementById('checkRowMeterPhoto');
  const meterStatus = document.getElementById('statusMeterPhoto');
  if (meterRow) meterRow.classList.remove('success');
  if (meterStatus) {
    meterStatus.className = 'delicate-item-badge pending';
    meterStatus.textContent = 'טרם הועלה';
  }

  // 2. Contract
  const contractBox = document.getElementById('contractUploadBox');
  if (contractBox) {
    contractBox.classList.remove('uploaded', 'is-invalid');
    const title = contractBox.querySelector('.upload-compact-title');
    const badge = document.getElementById('contractBadge');
    if (title) title.innerHTML = '2. העלו חוזה שכירות חתום <span class="required-star">*</span>';
    if (badge) badge.textContent = 'העלאה +';
  }
  const contractRow = document.getElementById('checkRowContract');
  const contractStatus = document.getElementById('statusContract');
  if (contractRow) contractRow.classList.remove('success');
  if (contractStatus) {
    contractStatus.className = 'delicate-item-badge pending';
    contractStatus.textContent = 'טרם הועלה';
  }

  // 3. Landlord ID
  const ownerIdBox = document.getElementById('ownerIdUploadBox');
  if (ownerIdBox) {
    ownerIdBox.classList.remove('uploaded', 'is-invalid');
    const title = ownerIdBox.querySelector('.upload-compact-title');
    const badge = document.getElementById('ownerIdBadge');
    if (title) title.innerHTML = '3. העלו ת.ז וספח של המשכיר <span class="required-star">*</span>';
    if (badge) badge.textContent = 'העלאה +';
  }
  const ownerIdRow = document.getElementById('checkRowOwnerId');
  const ownerIdStatus = document.getElementById('statusOwnerId');
  if (ownerIdRow) ownerIdRow.classList.remove('success');
  if (ownerIdStatus) {
    ownerIdStatus.className = 'delicate-item-badge pending';
    ownerIdStatus.textContent = 'טרם הועלה';
  }

  // 4. Tenant ID
  const tenantIdBox = document.getElementById('tenantIdUploadBox');
  if (tenantIdBox) {
    tenantIdBox.classList.remove('uploaded', 'is-invalid');
    const title = tenantIdBox.querySelector('.upload-compact-title');
    const badge = document.getElementById('tenantIdBadge');
    if (title) title.innerHTML = '4. העלו ת.ז וספח של השוכר/ת <span class="required-star">*</span>';
    if (badge) badge.textContent = 'העלאה +';
  }
  const tenantIdRow = document.getElementById('checkRowTenantId');
  const tenantIdStatus = document.getElementById('statusTenantId');
  if (tenantIdRow) tenantIdRow.classList.remove('success');
  if (tenantIdStatus) {
    tenantIdStatus.className = 'delicate-item-badge pending';
    tenantIdStatus.textContent = 'טרם הועלה';
  }

  const summary = document.getElementById('checklistOverallSummary');
  if (summary) {
    summary.textContent = 'ממתין להעלאת מסמכים';
    summary.style.color = 'var(--primary-700)';
  }
  const extractBox = document.getElementById('extractionLiveBox');
  if (extractBox) extractBox.style.display = 'none';
  const docsError = document.getElementById('docsRequiredErrorMsg');
  if (docsError) docsError.style.display = 'none';

  renderSefachChips();
}

// Multi-Sefach dynamic handler
function addSefachFile() {
  const currentCount = appState.formData.additionalSefachFiles.length;
  const newNum = currentCount + 1;
  const fileName = `ספח_דייר_נוסף_${newNum}.jpg`;
  appState.formData.additionalSefachFiles.push(fileName);
  renderSefachChips();
}

function removeSefachFile(idx) {
  appState.formData.additionalSefachFiles.splice(idx, 1);
  renderSefachChips();
}

function renderSefachChips() {
  const listContainer = document.getElementById('additionalSefachFilesList');
  const chipsContainer = document.getElementById('sefachChipsContainer');
  const uploadBox = document.getElementById('additionalIdUploadBox');
  const badge = document.getElementById('additionalIdBadge');
  const subText = document.getElementById('additionalSefachSubText');
  const row = document.getElementById('checkRowAdditional');
  const statusBadge = document.getElementById('statusAdditional');

  const files = appState.formData.additionalSefachFiles;
  if (files.length > 0) {
    if (listContainer) listContainer.style.display = 'block';
    if (chipsContainer) {
      chipsContainer.innerHTML = files.map((f, i) => `
        <span style="display: inline-flex; align-items: center; gap: 0.35rem; background: var(--teal-50); border: 1px solid var(--teal-200); color: var(--teal-800); font-size: 0.72rem; padding: 0.15rem 0.45rem; border-radius: 999px;">
          ✓ ${f}
          <button type="button" onclick="event.stopPropagation(); removeSefachFile(${i})" style="background: none; border: none; color: var(--danger-600); cursor: pointer; font-size: 0.8rem; line-height: 1; padding: 0 0.15rem;">×</button>
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

// Sync Data for Summary Step
function syncSummaryData() {
  // Personal Details
  const fName = appState.formData.firstName || (document.getElementById('inputFirstName') ? document.getElementById('inputFirstName').value.trim() : '') || 'נועה';
  const lName = appState.formData.lastName || (document.getElementById('inputLastName') ? document.getElementById('inputLastName').value.trim() : '') || 'לוי';
  const fullName = `${fName} ${lName}`.trim() || 'נועה לוי';
  const idNum = appState.formData.idNumber || (document.getElementById('inputIdNumber') ? document.getElementById('inputIdNumber').value.trim() : '') || '318765432';
  const phone = appState.formData.phone || (document.getElementById('inputPhone') ? document.getElementById('inputPhone').value.trim() : '') || '054-8765432';
  const email = appState.formData.email || (document.getElementById('inputEmail') ? document.getElementById('inputEmail').value.trim() : '') || 'noa.levi@example.com';

  // Extracted Property Details
  const city = (document.getElementById('inputCity') ? document.getElementById('inputCity').value.trim() : '') || appState.formData.city || 'רמת גן';
  const street = (document.getElementById('inputStreet') ? document.getElementById('inputStreet').value.trim() : '') || appState.formData.street || 'ביאליק';
  const house = (document.getElementById('inputHouse') ? document.getElementById('inputHouse').value.trim() : '') || appState.formData.houseNum || '42';
  const apt = (document.getElementById('inputApt') ? document.getElementById('inputApt').value.trim() : '') || appState.formData.aptNum || '7';
  const aptText = apt ? `, דירה ${apt}` : '';
  const fullAddress = `רחוב ${street} ${house}${aptText}, ${city}`;

  const entryDate = (document.getElementById('inputEntryDate') ? document.getElementById('inputEntryDate').value : '') || appState.formData.entryDate || '2026-10-01';
  let formattedDate = entryDate;
  if (entryDate && entryDate.includes('-')) {
    const [y, m, d] = entryDate.split('-');
    formattedDate = `${d}/${m}/${y}`;
  }

  const landlordName = (document.getElementById('inputLandlordName') ? document.getElementById('inputLandlordName').value.trim() : '') || appState.formData.landlordName || 'דוד כהן';
  const landlordId = (document.getElementById('inputLandlordId') ? document.getElementById('inputLandlordId').value.trim() : '') || appState.formData.landlordId || '058765432';
  const landlordFull = `${landlordName} (ת.ז: ${landlordId})`;

  const meter = (document.getElementById('inputMeterReading') ? document.getElementById('inputMeterReading').value.trim() : '') || appState.formData.meterReading || '00384.2';
  const residents = (document.getElementById('inputResidentsCount') ? document.getElementById('inputResidentsCount').value : '') || appState.formData.residentsCount || '1';

  // Update DOM elements
  const elName = document.getElementById('sumName');
  if (elName) elName.textContent = fullName;

  const elId = document.getElementById('sumId');
  if (elId) elId.textContent = idNum;

  const elPhone = document.getElementById('sumPhone');
  if (elPhone) elPhone.textContent = phone;

  const elEmail = document.getElementById('sumEmail');
  if (elEmail) elEmail.textContent = email;

  const elAddress = document.getElementById('sumAddress');
  if (elAddress) elAddress.textContent = fullAddress;

  const elEntryDate = document.getElementById('sumEntryDate');
  if (elEntryDate) elEntryDate.textContent = formattedDate;

  const elLandlord = document.getElementById('sumLandlord');
  if (elLandlord) elLandlord.textContent = landlordFull;

  const elMeter = document.getElementById('sumMeter');
  if (elMeter) elMeter.textContent = `${meter} מ"ק`;

  const elResidents = document.getElementById('sumResidents');
  const sefachContainer = document.getElementById('sefachExtractedDetailsContainer');
  const sefachBadge = document.getElementById('sefachExtractedBadge');
  const sefachGrid = document.getElementById('sefachResidentsGrid');
  const sefachBody = document.getElementById('sefachExtractedBody');

  const extraCount = appState.formData.additionalSefachFiles.length;
  const totalResidents = 1 + extraCount;

  if (elResidents) {
    if (extraCount > 0) {
      elResidents.innerHTML = `<strong>${totalResidents} נפשות</strong> (${totalResidents * 7} מ"ק הקצאה מוזלת לחודש) <span class="extracted-highlight-badge" style="margin-right: 0.35rem;">✓ חולץ מ-${extraCount} ספחים נוספים</span>`;
    } else {
      elResidents.textContent = `1 נפש (7 מ"ק הקצאה בסיסית מוזלת לחודש)`;
    }
  }

  if (sefachBadge) {
    sefachBadge.textContent = `חולצו ${totalResidents} נפשות מוכרות (${totalResidents * 7} מ"ק) ✓`;
  }

  if (sefachGrid) {
    let residentsHtml = `
      <!-- Resident 1 (Main Applicant) -->
      <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-sm); padding: 0.7rem 0.8rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--slate-900);">דייר/ת 1: ${fullName} (מגיש/ת הבקשה)</span>
          <span class="status-pill success" style="font-size: 0.68rem;">מאומת בספח ✓</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--slate-600); line-height: 1.45;">
          <div>תעודת זהות: <strong>${idNum}</strong> | שנת לידה: <strong>1996</strong> (גיל: 30)</div>
          <div>כתובת מגורים בספח: <strong>${fullAddress}</strong></div>
          <div style="color: #15803d; font-weight: 600; margin-top: 0.2rem;">✓ ספח תואם לכתובת הנכס המבוקש</div>
        </div>
      </div>
    `;

    if (extraCount > 0) {
      const demoNames = [
        { name: 'יונתן שפירא', id: '209847561', birth: '1994', age: '32', rel: 'בן זוג / שותף' },
        { name: 'מאיה לוינשטיין', id: '329182746', birth: '1998', age: '28', rel: 'שותפה' },
        { name: 'אלון ברגר', id: '048291038', birth: '1995', age: '31', rel: 'דייר בגיר' }
      ];

      for (let i = 0; i < extraCount; i++) {
        const d = demoNames[i % demoNames.length];
        residentsHtml += `
          <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-sm); padding: 0.7rem 0.8rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--slate-900);">דייר/ת ${i + 2}: ${d.name} (ספח נוסף #${i + 1})</span>
              <span class="status-pill success" style="font-size: 0.68rem;">מאומת בספח ✓</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--slate-600); line-height: 1.45;">
              <div>תעודת זהות: <strong>${d.id}</strong> | שנת לידה: <strong>${d.birth}</strong> (גיל: ${d.age})</div>
              <div>כתובת מגורים בספח: <strong>${fullAddress}</strong></div>
              <div style="color: #15803d; font-weight: 600; margin-top: 0.2rem;">✓ ספח תואם נכס (${d.rel})</div>
            </div>
          </div>
        `;
      }
    } else {
      // Default demo showcase for single resident with invitation to expand
      residentsHtml += `
        <div style="background: #f8fafc; border: 1px dashed var(--slate-300); border-radius: var(--radius-sm); padding: 0.7rem 0.8rem; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--slate-700); margin-bottom: 0.2rem;">מעוניינים להוסיף ספחי בגירים נוספים?</div>
          <div style="font-size: 0.74rem; color: var(--slate-500); line-height: 1.4;">
            צירוף ספח עבור כל בגיר נוסף המתגורר בדירה מעניק תוספת של 7 מ"ק לחודש בתעריף מוזל.
          </div>
          <div style="margin-top: 0.4rem;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="goToStep(4)" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;">+ הוספת ספחי דיירים</button>
          </div>
        </div>
      `;
    }

    sefachGrid.innerHTML = residentsHtml;
  }

  const elDocs = document.getElementById('sumDocs');
  if (elDocs) {
    const docs = ['צילום מונה מים', 'חוזה שכירות חתום', 'ת.ז וספח משכיר', 'ת.ז וספח שוכר'];
    if (extraCount > 0) {
      docs.push(`+ ${extraCount} ספחי דיירים נוספים`);
    }
    elDocs.textContent = docs.join(' • ');
  }
}

// Inline Editing Handlers for Step 5 Review Cards
window.toggleEditCard = function(cardKey, forceOpen) {
  const viewEl = document.getElementById('view' + cardKey);
  const editEl = document.getElementById('edit' + cardKey);
  const btnEl = document.getElementById('btnEdit' + cardKey);
  
  if (!viewEl || !editEl) return;
  
  const shouldOpen = forceOpen !== undefined ? forceOpen : (editEl.style.display === 'none' || editEl.style.display === '');
  
  if (shouldOpen) {
    if (cardKey === 'Applicant') {
      const nameInp = document.getElementById('inlineEditName');
      if (nameInp) nameInp.value = document.getElementById('sumName')?.textContent || 'נועה לוי';
      const idInp = document.getElementById('inlineEditId');
      if (idInp) idInp.value = document.getElementById('sumId')?.textContent || '318765432';
      const phoneInp = document.getElementById('inlineEditPhone');
      if (phoneInp) phoneInp.value = document.getElementById('sumPhone')?.textContent || '054-8765432';
      const emailInp = document.getElementById('inlineEditEmail');
      if (emailInp) emailInp.value = document.getElementById('sumEmail')?.textContent || 'noa.levi@example.com';
    } else if (cardKey === 'Property') {
      const addrInp = document.getElementById('inlineEditAddress');
      if (addrInp) addrInp.value = document.getElementById('sumAddress')?.textContent || 'רחוב ביאליק 42, דירה 7, רמת גן';
      const dateInp = document.getElementById('inlineEditEntryDate');
      if (dateInp) dateInp.value = appState.formData.entryDate || '2026-10-01';
    } else if (cardKey === 'Landlord') {
      const lNameInp = document.getElementById('inlineEditLandlordName');
      if (lNameInp) lNameInp.value = appState.formData.landlordName || 'דוד כהן';
      const lIdInp = document.getElementById('inlineEditLandlordId');
      if (lIdInp) lIdInp.value = appState.formData.landlordId || '058765432';
    } else if (cardKey === 'Meter') {
      const currentMeter = (document.getElementById('sumMeter')?.textContent || '').replace(' מ"ק', '').trim() || appState.formData.meterReading || '00384.2';
      const meterInp = document.getElementById('inlineEditMeterReading');
      if (meterInp) meterInp.value = currentMeter;
      const extraCount = appState.formData.additionalSefachFiles.length;
      const countInp = document.getElementById('inlineEditResidentsCount');
      if (countInp) countInp.value = (1 + extraCount) || 2;
    }
    
    viewEl.style.display = 'none';
    editEl.style.display = 'block';
    if (btnEl) btnEl.style.display = 'none';
  } else {
    viewEl.style.display = 'block';
    editEl.style.display = 'none';
    if (btnEl) btnEl.style.display = 'inline-block';
  }
};

window.saveEditCard = function(cardKey) {
  if (cardKey === 'Applicant') {
    const nameVal = document.getElementById('inlineEditName')?.value.trim() || 'נועה לוי';
    const idVal = document.getElementById('inlineEditId')?.value.trim() || '318765432';
    const phoneVal = document.getElementById('inlineEditPhone')?.value.trim() || '054-8765432';
    const emailVal = document.getElementById('inlineEditEmail')?.value.trim() || 'noa.levi@example.com';
    
    const parts = nameVal.split(' ');
    appState.formData.firstName = parts[0] || '';
    appState.formData.lastName = parts.slice(1).join(' ') || '';
    appState.formData.idNumber = idVal;
    appState.formData.phone = phoneVal;
    appState.formData.email = emailVal;
    
    if (document.getElementById('sumName')) document.getElementById('sumName').textContent = nameVal;
    if (document.getElementById('sumId')) document.getElementById('sumId').textContent = idVal;
    if (document.getElementById('sumPhone')) document.getElementById('sumPhone').textContent = phoneVal;
    if (document.getElementById('sumEmail')) document.getElementById('sumEmail').textContent = emailVal;
  } else if (cardKey === 'Property') {
    const addressVal = document.getElementById('inlineEditAddress')?.value.trim() || 'רחוב ביאליק 42, דירה 7, רמת גן';
    const entryDateVal = document.getElementById('inlineEditEntryDate')?.value || '2026-10-01';
    
    appState.formData.entryDate = entryDateVal;
    
    let formatted = entryDateVal;
    if (entryDateVal && entryDateVal.includes('-')) {
      const [y, m, d] = entryDateVal.split('-');
      formatted = `${d}/${m}/${y}`;
    }
    
    if (document.getElementById('sumAddress')) document.getElementById('sumAddress').textContent = addressVal;
    if (document.getElementById('sumEntryDate')) document.getElementById('sumEntryDate').textContent = formatted;
    
    const badge1 = document.getElementById('badgeAddress');
    if (badge1) {
      badge1.innerHTML = '✎ עודכן ידנית';
      badge1.style.background = '#e0f2fe';
      badge1.style.color = '#0369a1';
      badge1.style.borderColor = '#7dd3fc';
    }
    const badge2 = document.getElementById('badgeEntryDate');
    if (badge2) {
      badge2.innerHTML = '✎ עודכן ידנית';
      badge2.style.background = '#e0f2fe';
      badge2.style.color = '#0369a1';
      badge2.style.borderColor = '#7dd3fc';
    }
  } else if (cardKey === 'Landlord') {
    const lName = document.getElementById('inlineEditLandlordName')?.value.trim() || 'דוד כהן';
    const lId = document.getElementById('inlineEditLandlordId')?.value.trim() || '058765432';
    
    appState.formData.landlordName = lName;
    appState.formData.landlordId = lId;
    
    if (document.getElementById('sumLandlord')) document.getElementById('sumLandlord').textContent = `${lName} (ת.ז: ${lId})`;
    
    const badge = document.getElementById('badgeLandlord');
    if (badge) {
      badge.innerHTML = '✎ עודכן ידנית';
      badge.style.background = '#e0f2fe';
      badge.style.color = '#0369a1';
      badge.style.borderColor = '#7dd3fc';
    }
  } else if (cardKey === 'Meter') {
    const meterVal = document.getElementById('inlineEditMeterReading')?.value.trim() || '00384.2';
    const countVal = parseInt(document.getElementById('inlineEditResidentsCount')?.value, 10) || 2;
    
    appState.formData.meterReading = meterVal;
    
    if (document.getElementById('sumMeter')) document.getElementById('sumMeter').textContent = `${meterVal} מ"ק`;
    
    const quota = countVal * 7;
    if (document.getElementById('sumResidents')) {
      document.getElementById('sumResidents').innerHTML = `<strong>${countVal} נפשות</strong> (${quota} מ"ק הקצאה מוזלת לחודש) <span class="extracted-highlight-badge" style="margin-right: 0.35rem; background: #e0f2fe; color: #0369a1; border-color: #7dd3fc;">✎ עודכן ידנית</span>`;
    }
    
    const badge = document.getElementById('badgeMeter');
    if (badge) {
      badge.innerHTML = '✎ עודכן ידנית';
      badge.style.background = '#e0f2fe';
      badge.style.color = '#0369a1';
      badge.style.borderColor = '#7dd3fc';
    }
    
    // Also update backoffice ticket comparison if present
    if (appState.backoffice && appState.backoffice.tickets) {
      const ticket = appState.backoffice.tickets.find(t => t.id === 'RG-2026-8841');
      if (ticket) {
        ticket.meterReading = meterVal;
        const row = ticket.comparison.find(c => c.field === 'קריאת מונה מים');
        if (row) row.userInput = `${meterVal} מ"ק`;
      }
    }
  }
  
  toggleEditCard(cardKey, false);
};

// Step Transition Handlers
function handleSmartStep3Next() {
  let firstInvalid = null;

  // First Name
  const fNameInput = document.getElementById('inputFirstName');
  const fNameError = document.getElementById('firstNameErrorMsg');
  const fNameVal = (fNameInput ? fNameInput.value.trim() : '');
  if (!fNameVal || fNameVal.length < 2) {
    if (fNameInput) fNameInput.classList.add('is-invalid');
    if (fNameError) {
      fNameError.textContent = 'שם פרטי הוא שדה חובה (לפחות 2 אותיות)';
      fNameError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = fNameInput;
  }

  // Last Name
  const lNameInput = document.getElementById('inputLastName');
  const lNameError = document.getElementById('lastNameErrorMsg');
  const lNameVal = (lNameInput ? lNameInput.value.trim() : '');
  if (!lNameVal || lNameVal.length < 2) {
    if (lNameInput) lNameInput.classList.add('is-invalid');
    if (lNameError) {
      lNameError.textContent = 'שם משפחה הוא שדה חובה (לפחות 2 אותיות)';
      lNameError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = lNameInput;
  }

  // ID
  const idInput = document.getElementById('inputIdNumber');
  const idError = document.getElementById('idErrorMsg');
  const idVal = (idInput ? idInput.value.trim() : '');
  const idRes = validateIsraeliID(idVal);
  if (!idVal) {
    if (idInput) idInput.classList.add('is-invalid');
    if (idError) {
      idError.textContent = 'מספר תעודת זהות הוא שדה חובה (9 ספרות)';
      idError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = idInput;
  } else if (!idRes.isValid) {
    if (idInput) idInput.classList.add('is-invalid');
    if (idError) {
      idError.textContent = idRes.message;
      idError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = idInput;
  }

  // Phone
  const phoneInput = document.getElementById('inputPhone');
  const phoneError = document.getElementById('phoneErrorMsg');
  const phoneVal = (phoneInput ? phoneInput.value.trim() : '');
  const phoneRes = validateIsraeliPhone(phoneVal);
  if (!phoneVal) {
    if (phoneInput) phoneInput.classList.add('is-invalid');
    if (phoneError) {
      phoneError.textContent = 'מספר טלפון נייד הוא שדה חובה (10 ספרות החל מ-05)';
      phoneError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = phoneInput;
  } else if (!phoneRes.isValid) {
    if (phoneInput) phoneInput.classList.add('is-invalid');
    if (phoneError) {
      phoneError.textContent = phoneRes.message;
      phoneError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = phoneInput;
  }

  // Email
  const emailInput = document.getElementById('inputEmail');
  const emailError = document.getElementById('emailErrorMsg');
  const emailVal = (emailInput ? emailInput.value.trim() : '');
  const emailRes = validateEmail(emailVal);
  if (!emailVal) {
    if (emailInput) emailInput.classList.add('is-invalid');
    if (emailError) {
      emailError.textContent = 'כתובת אימייל היא שדה חובה';
      emailError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = emailInput;
  } else if (!emailRes.isValid) {
    if (emailInput) emailInput.classList.add('is-invalid');
    if (emailError) {
      emailError.textContent = emailRes.message;
      emailError.style.display = 'block';
    }
    if (!firstInvalid) firstInvalid = emailInput;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  goToStep(4);
}

function handleSmartStep4Next() {
  const docsError = document.getElementById('docsRequiredErrorMsg');
  let hasMissing = false;

  const meterBox = document.getElementById('meterPhotoUploadBox');
  const contractBox = document.getElementById('contractUploadBox');
  const ownerIdBox = document.getElementById('ownerIdUploadBox');
  const tenantIdBox = document.getElementById('tenantIdUploadBox');

  if (!appState.formData.hasMeterPhoto) {
    if (meterBox) meterBox.classList.add('is-invalid');
    hasMissing = true;
  } else {
    if (meterBox) meterBox.classList.remove('is-invalid');
  }

  if (!appState.formData.hasContract) {
    if (contractBox) contractBox.classList.add('is-invalid');
    hasMissing = true;
  } else {
    if (contractBox) contractBox.classList.remove('is-invalid');
  }

  if (!appState.formData.hasOwnerId) {
    if (ownerIdBox) ownerIdBox.classList.add('is-invalid');
    hasMissing = true;
  } else {
    if (ownerIdBox) ownerIdBox.classList.remove('is-invalid');
  }

  if (!appState.formData.hasTenantId) {
    if (tenantIdBox) tenantIdBox.classList.add('is-invalid');
    hasMissing = true;
  } else {
    if (tenantIdBox) tenantIdBox.classList.remove('is-invalid');
  }

  if (hasMissing) {
    if (docsError) {
      docsError.textContent = 'יש להעלות את כל 4 מסמכי החובה המסומנים בכוכבית אדומה (*) כדי להמשיך';
      docsError.style.display = 'block';
    }
    return;
  }

  if (docsError) docsError.style.display = 'none';
  syncSummaryData();
  goToStep(5);
}

function handleSmartStep5Submit() {
  const termsCheckbox = document.getElementById('acceptTermsCheckbox');
  const declError = document.getElementById('declarationErrorMsg');
  const sigError = document.getElementById('signatureErrorMsg');

  let hasError = false;

  if (termsCheckbox && !termsCheckbox.checked) {
    if (declError) {
      declError.textContent = 'יש לסמן את תיבת ההצהרה כדי לשלוח את הבקשה';
      declError.style.display = 'block';
    }
    hasError = true;
  } else {
    if (declError) declError.style.display = 'none';
  }

  if (!appState.formData.hasSignature) {
    if (sigError) {
      sigError.textContent = 'יש לחתום בתיבת החתימה הדיגיטלית כדי לשלוח את הבקשה';
      sigError.style.display = 'block';
    }
    hasError = true;
  } else {
    if (sigError) sigError.style.display = 'none';
  }

  if (hasError) return;

  // Sync actual user submission data into the backoffice ticket
  const noaTicket = appState.backoffice.tickets.find(t => t.id === 'RG-2026-8841');
  if (noaTicket) {
    if (appState.formData.firstName || appState.formData.lastName) {
      noaTicket.tenantName = `${appState.formData.firstName} ${appState.formData.lastName}`.trim() || noaTicket.tenantName;
    }
    if (appState.formData.idNumber) noaTicket.tenantId = appState.formData.idNumber;
    if (appState.formData.phone) noaTicket.tenantPhone = appState.formData.phone;
    if (appState.formData.email) noaTicket.tenantEmail = appState.formData.email;
    noaTicket.elapsedMinutes = 1;
    noaTicket.status = 'pending_review';
    noaTicket.statusText = 'ממתין לבדיקת נציג';
    noaTicket.statusClass = 'warning';
    noaTicket.logs.unshift({
      time: 'עכשיו',
      user: `${noaTicket.tenantName} (התושב/ת)`,
      text: 'טופס הבקשה נחתם ונשלח בהצלחה מהממשק הדיגיטלי.'
    });
  }

  goToStep(6);
}

// ==========================================
// REPRESENTATIVE BACKOFFICE PORTAL LOGIC
// ==========================================

function renderBackoffice() {
  updateRepStatsAndCounts();
  renderRepTicketsTable();
  initBackofficeEvents();
}

function updateRepStatsAndCounts() {
  const tickets = appState.backoffice.tickets;
  const total = tickets.length;
  const pendingReview = tickets.filter(t => t.status === 'pending_review').length;
  const pendingCustomer = tickets.filter(t => t.status === 'pending_customer').length;
  const escalated = tickets.filter(t => t.status === 'escalated').length;
  const completed = tickets.filter(t => t.status === 'completed').length;

  const statTotal = document.getElementById('statTotalTickets');
  const statReview = document.getElementById('statPendingReview');
  const statCust = document.getElementById('statPendingCustomer');
  const statEsc = document.getElementById('statEscalated');

  if (statTotal) statTotal.textContent = total;
  if (statReview) statReview.textContent = pendingReview;
  if (statCust) statCust.textContent = pendingCustomer;
  if (statEsc) statEsc.textContent = escalated;

  const countAll = document.getElementById('countAll');
  const countPendingRev = document.getElementById('countPendingReview');
  const countPendingCust = document.getElementById('countPendingCustomer');
  const countEsc = document.getElementById('countEscalated');
  const countComp = document.getElementById('countCompleted');

  if (countAll) countAll.textContent = total;
  if (countPendingRev) countPendingRev.textContent = pendingReview;
  if (countPendingCust) countPendingCust.textContent = pendingCustomer;
  if (countEsc) countEsc.textContent = escalated;
  if (countComp) countComp.textContent = completed;
}

function renderRepTicketsTable() {
  const tbody = document.getElementById('repTicketsTableBody');
  if (!tbody) return;

  const filter = appState.backoffice.activeFilter || 'all';
  const query = (appState.backoffice.searchQuery || '').trim().toLowerCase();

  let filtered = appState.backoffice.tickets.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (query) {
      const matchText = `${t.id} ${t.tenantName} ${t.tenantId} ${t.street} ${t.houseNum} ${t.actionType}`.toLowerCase();
      if (!matchText.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--slate-500);">
          לא נמצאו פניות התואמות את החיפוש והסינון הנבחר.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    let slaClass = 'fresh';
    let slaText = `לפני ${t.elapsedMinutes} דק'`;
    if (t.elapsedMinutes > 120) {
      slaClass = 'overdue';
      slaText = `לפני ${Math.floor(t.elapsedMinutes / 60)} שעות`;
    } else if (t.elapsedMinutes > 30) {
      slaClass = 'warning';
      slaText = `לפני ${t.elapsedMinutes} דק'`;
    }

    let statusPill = `<span class="status-pill ${t.statusClass}">${t.statusText}</span>`;

    return `
      <tr class="ticket-row" onclick="openTicketDetails('${t.id}')">
        <td>
          <div style="font-family: monospace; font-weight: 800; color: var(--primary-700); font-size: 0.78rem;">${t.id}</div>
          <div style="font-weight: 700; color: var(--slate-900); font-size: 0.88rem;">${t.tenantName}</div>
        </td>
        <td>
          <div style="font-size: 0.82rem; font-weight: 600; color: var(--slate-800);">${t.street} ${t.houseNum}, ${t.city}</div>
          <div style="font-size: 0.74rem; color: var(--slate-500);">${t.actionType}</div>
        </td>
        <td>
          <span class="sla-badge ${slaClass}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${slaText}
          </span>
        </td>
        <td>${statusPill}</td>
        <td style="text-align: center;">
          <button class="btn btn-outline-primary btn-sm" onclick="event.stopPropagation(); openTicketDetails('${t.id}')" style="font-size: 0.76rem; padding: 0.25rem 0.6rem;">
            פתח תיק ←
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openTicketDetails(ticketId) {
  const ticket = appState.backoffice.tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  appState.backoffice.selectedCaseId = ticketId;

  // Switch Sub-views
  const inboxView = document.getElementById('repInboxView');
  const detailView = document.getElementById('repDetailView');
  if (inboxView) inboxView.style.display = 'none';
  if (detailView) detailView.style.display = 'block';

  // Header
  const headerTitle = document.getElementById('detailTicketHeaderTitle');
  const headerSub = document.getElementById('detailTicketSubTitle');
  const statusSelect = document.getElementById('detailStatusSelect');
  if (headerTitle) headerTitle.textContent = `תיק פנייה: ${ticket.id} • ${ticket.tenantName}`;
  if (headerSub) headerSub.textContent = `התקבלה בשעה ${ticket.receivedTime} (לפני ${ticket.elapsedMinutes} דק') • עמידה ביעד SLA: ${ticket.slaStatus === 'overdue' ? 'חריגת SLA' : 'תקין'}`;
  if (statusSelect) statusSelect.value = ticket.status;

  // Overview info
  const tenantName = document.getElementById('detailTenantName');
  const tenantId = document.getElementById('detailTenantId');
  const tenantContact = document.getElementById('detailTenantContact');
  if (tenantName) tenantName.textContent = ticket.tenantName;
  if (tenantId) tenantId.textContent = `ת.ז: ${ticket.tenantId}`;
  if (tenantContact) tenantContact.textContent = `טל': ${ticket.tenantPhone} | ${ticket.tenantEmail}`;

  const propAddr = document.getElementById('detailPropertyAddress');
  const ownerInfo = document.getElementById('detailOwnerInfo');
  const ownerPhone = document.getElementById('detailOwnerPhone');
  if (propAddr) propAddr.textContent = `${ticket.street} ${ticket.houseNum}, דירה ${ticket.aptNum}, ${ticket.city}`;
  if (ownerInfo) ownerInfo.textContent = `משכיר: ${ticket.ownerName} (ת.ז: ${ticket.ownerId})`;
  if (ownerPhone) ownerPhone.textContent = `טל' משכיר: ${ticket.ownerPhone}`;

  const meterSum = document.getElementById('detailMeterSummary');
  const readingSum = document.getElementById('detailReadingSummary');
  const dateSum = document.getElementById('detailDateSummary');
  if (meterSum) meterSum.textContent = `מונה מים מס': ${ticket.meterNum}`;
  if (readingSum) readingSum.textContent = `קריאת מונה שהוזנה: ${ticket.meterReading} מ"ק`;
  if (dateSum) dateSum.textContent = `תאריך כניסה לתוקף: ${ticket.effectiveDate}`;

  // Data Comparison Matrix
  const compTbody = document.getElementById('detailComparisonTableBody');
  if (compTbody) {
    compTbody.innerHTML = (ticket.comparison || []).map(row => {
      const isMatch = row.status === 'match';
      const badgeStyle = isMatch 
        ? 'background: #dcfce7; color: #15803d; border: 1px solid #86efac;'
        : 'background: #fef9c3; color: #854d0e; border: 1px solid #fde047;';
      return `
        <tr>
          <th style="font-size: 0.8rem; font-weight: 700; white-space: nowrap;">${row.field}</th>
          <td style="font-weight: 600; color: var(--slate-900);">${row.userInput}</td>
          <td style="color: var(--primary-800); font-weight: 600;">${row.ocrInput}</td>
          <td style="color: var(--slate-700);">${row.dbInput}</td>
          <td style="text-align: center; white-space: nowrap;">
            <span class="status-pill ${isMatch ? 'success' : 'warning'}" style="white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px; ${badgeStyle}">
              ${row.statusText}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Attached Documents Gallery
  const docsGrid = document.getElementById('detailDocsGrid');
  if (docsGrid) {
    docsGrid.innerHTML = (ticket.docs || []).map(doc => `
      <div class="doc-thumb-card" onclick="openDocLightbox('${doc.title}', '${doc.img}', '${doc.desc}')">
        <div class="doc-thumb-img-box">
          <img src="${doc.img}" alt="${doc.title}">
          <div class="doc-thumb-overlay">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            הגדל מסמך
          </div>
        </div>
        <div class="doc-thumb-footer">
          <span>${doc.title}</span>
          <span style="font-size: 0.68rem; padding: 0.1rem 0.35rem; background: var(--slate-100); border-radius: 4px; color: var(--slate-600);">${doc.type}</span>
        </div>
      </div>
    `).join('');
  }

  // Audit Timeline
  const timeline = document.getElementById('backofficeTimeline');
  if (timeline) {
    timeline.innerHTML = (ticket.logs || []).map(log => `
      <div class="timeline-step">
        <div class="timeline-bullet">${log.time}</div>
        <div>
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--slate-800);">${log.user}</div>
          <div style="font-size: 0.82rem; color: var(--slate-600);">${log.text}</div>
        </div>
      </div>
    `).join('');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeTicketDetails() {
  const inboxView = document.getElementById('repInboxView');
  const detailView = document.getElementById('repDetailView');
  if (inboxView) inboxView.style.display = 'block';
  if (detailView) detailView.style.display = 'none';
  renderBackoffice();
}

function openDocLightbox(title, imgUrl, desc) {
  const modal = document.getElementById('docLightboxModal');
  const titleEl = document.getElementById('lightboxDocTitle');
  const imgEl = document.getElementById('lightboxDocImg');
  const descEl = document.getElementById('lightboxDocDesc');

  if (titleEl) titleEl.textContent = title;
  if (imgEl) imgEl.src = imgUrl;
  if (descEl) descEl.textContent = desc || '';
  if (modal) modal.classList.add('show');
}

let backofficeEventsInitialized = false;
function initBackofficeEvents() {
  if (backofficeEventsInitialized) return;
  backofficeEventsInitialized = true;

  // Filter Tabs Click
  const filterTabs = document.querySelectorAll('#repFilterTabs .rep-tab-btn');
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.backoffice.activeFilter = btn.getAttribute('data-filter') || 'all';
      renderRepTicketsTable();
    });
  });

  // Search Input
  const searchInput = document.getElementById('repSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.backoffice.searchQuery = e.target.value;
      renderRepTicketsTable();
    });
  }

  // Back to Inbox Button
  const backBtn = document.getElementById('backToInboxBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => closeTicketDetails());
  }

  // Status Change Dropdown inside Ticket Detail
  const statusSelect = document.getElementById('detailStatusSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId);
      if (ticket) {
        ticket.status = newStatus;
        if (newStatus === 'completed') {
          ticket.statusText = 'אושר ונסגר בהצלחה';
          ticket.statusClass = 'success';
        } else if (newStatus === 'escalated') {
          ticket.statusText = 'בטיפול מנהל';
          ticket.statusClass = 'info';
        } else if (newStatus === 'pending_customer') {
          ticket.statusText = 'ממתין להשלמת לקוח';
          ticket.statusClass = 'warning';
        } else {
          ticket.statusText = 'ממתין לבדיקת נציג';
          ticket.statusClass = 'warning';
        }
        ticket.logs.unshift({
          time: 'עכשיו',
          user: 'נציג שירות (דנה)',
          text: `סטטוס הפנייה עודכן ל-${ticket.statusText}.`
        });
        openTicketDetails(ticket.id);
      }
    });
  }

  // Representative Action 1: Send Customer SMS / Message
  const btnSendCust = document.getElementById('btnActionSendCustomer');
  const smsModal = document.getElementById('smsPreviewModal');
  const smsTemplateSelect = document.getElementById('smsTemplateSelect');
  const smsCustomText = document.getElementById('smsCustomText');
  const confirmSendSmsBtn = document.getElementById('confirmSendSmsBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (btnSendCust && smsModal) {
    btnSendCust.addEventListener('click', () => {
      smsModal.classList.add('show');
    });
  }

  if (closeModalBtn && smsModal) {
    closeModalBtn.addEventListener('click', () => smsModal.classList.remove('show'));
  }

  if (smsTemplateSelect && smsCustomText) {
    smsTemplateSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId) || {};
      const name = ticket.tenantName || 'תושב/ת';
      const address = `${ticket.street || 'ביאליק'} ${ticket.houseNum || '42'}`;
      const caseId = ticket.id || 'RG-2026-8841';

      if (val === 'meter') {
        smsCustomText.value = `שלום ${name}, בתהליך החלפת המשלמים בדירה ברחוב ${address}, צילום המונה לא היה קריא. אנא לחצו על הקישור להעלאת צילום ברור נוסף: https://rgwater.org.il/fix/${caseId}`;
      } else if (val === 'contract') {
        smsCustomText.value = `שלום ${name}, בחוזה השכירות שהועלה עבור הדירה ברחוב ${address} חסר עמוד חתימות הצדדים. אנא היכנסו לקישור להשלמת המסמך: https://rgwater.org.il/fix/${caseId}`;
      } else if (val === 'id') {
        smsCustomText.value = `שלום ${name}, לקבלת הנחת מים והשלמת הפנייה בכתובת ${address}, נדרש צילום ספח ת.ז פתוח. לחצו לעדכון: https://rgwater.org.il/fix/${caseId}`;
      } else {
        smsCustomText.value = `שלום ${name}, בהמשך לפנייתך להחלפת משלמים בכתובת ${address}, נשמח לבירור קצר בנושא הבקשה.`;
      }
    });
  }

  if (confirmSendSmsBtn && smsModal) {
    confirmSendSmsBtn.addEventListener('click', () => {
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId);
      if (ticket) {
        ticket.status = 'pending_customer';
        ticket.statusText = 'ממתין להשלמת לקוח';
        ticket.statusClass = 'warning';
        ticket.logs.unshift({
          time: 'עכשיו',
          user: 'נציג שירות (דנה)',
          text: `נשלחה הודעת השלמה ללקוח/ה: "${smsCustomText.value.substring(0, 50)}..."`
        });
        smsModal.classList.remove('show');
        openTicketDetails(ticket.id);
        alert(`ההודעה נשלחה בהצלחה ל-${ticket.tenantName} (${ticket.tenantPhone})!`);
      }
    });
  }

  // Representative Action 2: Escalate to Manager
  const btnEscalate = document.getElementById('btnActionEscalateManager');
  const escalateModal = document.getElementById('escalateModal');
  const confirmEscalateBtn = document.getElementById('confirmEscalateBtn');

  if (btnEscalate && escalateModal) {
    btnEscalate.addEventListener('click', () => {
      escalateModal.classList.add('show');
    });
  }

  if (confirmEscalateBtn && escalateModal) {
    confirmEscalateBtn.addEventListener('click', () => {
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId);
      const reasonSelect = document.getElementById('escalateReasonSelect');
      const notes = document.getElementById('escalateNotes');
      const reasonText = reasonSelect ? reasonSelect.options[reasonSelect.selectedIndex].text : 'בדיקת מנהל';

      if (ticket) {
        ticket.status = 'escalated';
        ticket.statusText = 'בטיפול מנהל';
        ticket.statusClass = 'info';
        ticket.logs.unshift({
          time: 'עכשיו',
          user: 'נציג שירות (דנה)',
          text: `הפנייה הועברה לאישור מנהל תפעול. סיבה: ${reasonText}. הערות: ${notes ? notes.value : ''}`
        });

        appState.dashboard.auditLogs.unshift({
          time: 'עכשיו',
          user: 'דנה (נציגה)',
          action: `העברת פנייה לאישור מנהל: ${reasonText}`,
          caseId: ticket.id
        });

        escalateModal.classList.remove('show');
        openTicketDetails(ticket.id);
        alert(`הפנייה ${ticket.id} הועברה בהצלחה לבדיקת מנהל תפעול!`);
      }
    });
  }

  // Representative Action 3: Edit Ticket Details
  const btnEdit = document.getElementById('btnActionEditDetails');
  const editModal = document.getElementById('editTicketModal');
  const confirmEditBtn = document.getElementById('confirmEditTicketBtn');

  if (btnEdit && editModal) {
    btnEdit.addEventListener('click', () => {
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId);
      if (ticket) {
        const readingInput = document.getElementById('editMeterReading');
        const dateInput = document.getElementById('editEffectiveDate');
        if (readingInput) readingInput.value = ticket.meterReading;
        if (dateInput) dateInput.value = ticket.effectiveDate;
        editModal.classList.add('show');
      }
    });
  }

  if (confirmEditBtn && editModal) {
    confirmEditBtn.addEventListener('click', () => {
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId);
      const readingInput = document.getElementById('editMeterReading');
      const dateInput = document.getElementById('editEffectiveDate');
      const reasonInput = document.getElementById('editChangeReason');

      if (ticket) {
        if (readingInput) ticket.meterReading = readingInput.value;
        if (dateInput) ticket.effectiveDate = dateInput.value;
        const reason = reasonInput ? reasonInput.value : 'עודכנו פרטים ע"י נציג';

        ticket.logs.unshift({
          time: 'עכשיו',
          user: 'נציג שירות (דנה)',
          text: `נתוני הבקשה תוקנו: קריאת מונה ${ticket.meterReading} מ"ק, תאריך ${ticket.effectiveDate}. (${reason})`
        });

        // Update comparison row
        const meterComp = ticket.comparison.find(c => c.field.includes('קריאת מונה'));
        if (meterComp) {
          meterComp.userInput = `${ticket.meterReading} מ"ק`;
          meterComp.status = 'match';
          meterComp.statusText = '✓ עודכן ואושר ע"י נציג';
        }

        editModal.classList.remove('show');
        openTicketDetails(ticket.id);
        alert('נתוני הבקשה עודכנו בהצלחה בתיק!');
      }
    });
  }

  // Representative Action 4: Approve Ticket
  const btnApprove = document.getElementById('btnActionApproveTicket');
  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      const ticket = appState.backoffice.tickets.find(t => t.id === appState.backoffice.selectedCaseId);
      if (ticket) {
        if (confirm(`האם לאשר סופית את החלפת המשלמים בתיק ${ticket.id} עבור ${ticket.tenantName}?`)) {
          ticket.status = 'completed';
          ticket.statusText = 'אושר ונסגר בהצלחה';
          ticket.statusClass = 'success';
          ticket.logs.unshift({
            time: 'עכשיו',
            user: 'נציג שירות (דנה)',
            text: `החלפת המשלמים אושרה סופית במערכת. הונפקה תעודת אישור ונשלחה הודעת סיכום לתושב/ת.`
          });

          appState.dashboard.auditLogs.unshift({
            time: 'עכשיו',
            user: 'דנה (נציגה)',
            action: `אישור סופי - החלפת משלמים הושלמה בהצלחה`,
            caseId: ticket.id
          });

          openTicketDetails(ticket.id);
          alert(`מזל טוב! תיק ${ticket.id} אושר בהצלחה והחלפת המשלמים הושלמה במערכת התאגיד.`);
        }
      }
    });
  }
}

// Manager Quick Approve Action
function mgrQuickApprove(caseId) {
  const itemRow = document.getElementById(`mgrItem-${caseId}`);
  
  // Find in tickets and update status
  const ticket = appState.backoffice.tickets.find(t => t.id === caseId);
  if (ticket) {
    ticket.status = 'completed';
    ticket.statusText = 'אושר ע"י מנהל תפעול';
    ticket.statusClass = 'success';
    ticket.logs.unshift({
      time: 'עכשיו',
      user: 'מנהל תפעול',
      text: 'אושר סופית בהחלטת מנהל מהירה.'
    });
  }

  // Add audit log
  appState.dashboard.auditLogs.unshift({
    time: 'עכשיו',
    user: 'מנהל תפעול',
    action: `אישור מנהל מהיר - תיק ${caseId} (${ticket ? ticket.tenantName : 'החלפת משלמים'})`,
    caseId: caseId
  });

  // Visual feedback on card
  if (itemRow) {
    itemRow.style.transition = 'all 0.35s ease';
    itemRow.style.background = '#f0fdf4';
    itemRow.style.borderColor = '#86efac';
    itemRow.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.2rem 0;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #166534; font-weight: 700; font-size: 0.86rem;">
          <span style="font-size: 1.15rem;">✅</span>
          <span>פנייה <strong>${caseId}</strong> אושרה בהצלחה ע"י מנהל ונסגרה!</span>
        </div>
        <span class="status-pill success" style="font-size: 0.72rem;">הושלם</span>
      </div>
    `;
    setTimeout(() => {
      itemRow.style.opacity = '0';
      itemRow.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        itemRow.remove();
        updateMgrPendingCounter();
      }, 300);
    }, 1500);
  }

  // Update counts
  const successEl = document.getElementById('mgrKpiSuccess');
  if (successEl) {
    const cur = parseInt(successEl.textContent, 10) || 42;
    successEl.textContent = cur + 1;
  }
  const pendingMgrEl = document.getElementById('mgrKpiAwaitingManager');
  if (pendingMgrEl) {
    const cur = parseInt(pendingMgrEl.textContent, 10) || 2;
    pendingMgrEl.textContent = Math.max(0, cur - 1);
  }

  renderDashboardFeed();
}

function updateMgrPendingCounter() {
  const pendingList = document.getElementById('mgrPendingActionList');
  if (pendingList && pendingList.children.length === 0) {
    pendingList.innerHTML = `
      <div style="padding: 0.85rem; text-align: center; color: #166534; background: #f0fdf4; border: 1px dashed #86efac; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.85rem;">
        🎉 כל הכבוד! כל הפניות הדורשות אישור מנהל טופלו.
      </div>
    `;
    const pendingCountBadge = document.querySelector('#view-dashboard .status-pill.info');
    if (pendingCountBadge) {
      pendingCountBadge.textContent = '0 פניות לטיפול';
      pendingCountBadge.className = 'status-pill success';
    }
  }
}

function renderDashboardFeed() {
  const feedContainer = document.getElementById('mgrActivityFeed');
  if (!feedContainer) return;

  feedContainer.innerHTML = appState.dashboard.auditLogs.slice(0, 5).map(log => `
    <div class="mgr-feed-item">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 0.95rem;">${log.action.includes('אישור') ? '✅' : (log.action.includes('שליחת') ? '📱' : '⚙️')}</span>
        <div>
          <div style="font-weight: 700; color: var(--slate-800); font-size: 0.82rem;">${log.action}</div>
          <div style="font-size: 0.73rem; color: var(--slate-500); margin-top: 0.1rem;">
            בוצע ע"י: <strong>${log.user}</strong> ${log.caseId && log.caseId !== '-' ? `• תיק: <span style="font-family: monospace; color: var(--primary-700);">${log.caseId}</span>` : ''}
          </div>
        </div>
      </div>
      <span style="font-size: 0.74rem; font-family: monospace; color: var(--slate-500); background: #f8fafc; padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid var(--slate-200); white-space: nowrap;">${log.time}</span>
    </div>
  `).join('');
}

// Dashboard Render
function renderDashboard() {
  renderDashboardFeed();

  const permToggle = document.getElementById('permissionsToggle');
  if (permToggle && !permToggle.dataset.initialized) {
    permToggle.dataset.initialized = 'true';
    permToggle.addEventListener('change', (e) => {
      appState.dashboard.permissionsGranted = e.target.checked;
      appState.dashboard.auditLogs.unshift({
        time: 'עכשיו',
        user: 'מנהל תפעול',
        action: e.target.checked ? 'הופעלה הרשאת צפייה במסמכי זיהוי רגישים לנציגים' : 'בוטלה הרשאת צפייה במסמכי זיהוי לנציגים',
        caseId: '-'
      });
      renderDashboardFeed();
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
  appState.formData.hasMeterPhoto = false;
  appState.formData.hasContract = false;
  appState.formData.hasOwnerId = false;
  appState.formData.hasTenantId = false;
  appState.formData.additionalSefachFiles = [];
  appState.formData.hasSignature = false;
  appState.formData.termsAccepted = false;

  const inputs = ['inputFirstName', 'inputLastName', 'inputIdNumber', 'inputPhone', 'inputEmail'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      el.classList.remove('is-valid', 'is-invalid');
    }
  });

  const canvas = document.getElementById('signatureCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.querySelectorAll('.field-error-msg').forEach(el => el.style.display = 'none');
  resetUploadCardsUI();
  switchView('noa-wizard');
  goToStep(0);
}

function handleInactiveActionCard(e, cardEl) {
  if (e) e.stopPropagation();
  if (cardEl && typeof window.selectActionCard === 'function') {
    window.selectActionCard(cardEl);
  }
  alert('מסלול זה (קנייה / מכירה של דירה בבעלות) נמצא כעת בפיתוח ויהיה זמין בקרוב 🚧');
}

// Global window mappings
window.goToStep = goToStep;
window.updateWizardUI = updateWizardUI;
window.switchView = switchView;
window.resetSimulation = resetSimulation;
window.resetUploadCardsUI = resetUploadCardsUI;
window.handleSmartStep3Next = handleSmartStep3Next;
window.handleSmartStep4Next = handleSmartStep4Next;
window.handleSmartStep5Submit = handleSmartStep5Submit;
window.syncSummaryData = syncSummaryData;
window.addSefachFile = addSefachFile;
window.removeSefachFile = removeSefachFile;
window.renderBackoffice = renderBackoffice;
window.openTicketDetails = openTicketDetails;
window.closeTicketDetails = closeTicketDetails;
window.openDocLightbox = openDocLightbox;
window.mgrQuickApprove = mgrQuickApprove;
window.renderDashboard = renderDashboard;
window.handleInactiveActionCard = handleInactiveActionCard;


