//step 1: Build auth token
// const username = 'coalition';
// const password = 'skills-test';
// const authToken = btoa(username + ':' + password);


//step 2:  fetch all patients 
// async function getAllPatients(){
//   try{

//     const response =  await fetch(
//       'https://fedskillstest.coalitiontechnologies.workers.dev',
//       {

//         method : 'GET',
//         headers : {
//           'Authorization' : 'Basic ' + authToken
//         }
//       }
//     );

//     //step 3: convert to json
//     const patients = await response.json();

//     //step 4: display patients in console
//     console.log('total patients :',patients.length);
//     console.log('All Patients', patients);
//     return patients;

//   }
//   catch(error)
//   {
//     console.error('Error fetching patients:', error);
//   }
// }

//getAllPatients();



// ─────────────────────────────────
// STEP 1: AUTH TOKEN
// ─────────────────────────────────
const username  = 'coalition';
const password  = 'skills-test';
const authToken = btoa(username + ':' + password);


// ─────────────────────────────────
// STEP 2: FETCH DATA
// ─────────────────────────────────
async function getPatientData() {
  try {
    const response = await fetch(
      'https://fedskillstest.coalitiontechnologies.workers.dev',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + authToken
        }
      }
    );

    const patients = await response.json();

    // Find Jessica
    const jessica = patients.find(p => p.name === 'Jessica Taylor');

    console.log('Jessica found:', jessica);

    // Call all sections in order
    populatePatientList(patients);
    populateProfile(jessica);
    populateVitals(jessica);
    populateDiagnostics(jessica);
    populateLabResults(jessica);
    buildBPChart(jessica);

  } catch (error) {
    console.error('Error fetching patients:', error);
  }
}


// ─────────────────────────────────
// FUNCTION A: LEFT PANEL
// Patient List
// ─────────────────────────────────
function populatePatientList(patients) {
  const container = document.getElementById('patient-list');
  container.innerHTML = '';

  patients.forEach(patient => {
    const div = document.createElement('div');
    div.classList.add('patient-item');

    // Highlight Jessica as active
    if (patient.name === 'Jessica Taylor') {
      div.classList.add('active');
    }

    div.innerHTML = `
      <img 
        src="${patient.profile_picture}" 
        alt="${patient.name}"
        class="patient-thumb"
      />
      <div class="patient-info-text">
        <p class="patient-name">${patient.name}</p>
        <p class="patient-meta">${patient.gender}, ${patient.age} yrs</p>
      </div>
      <span class="more-icon">
      <img src="/assets/more_horiz_FILL0_wght300_GRAD0_opsz24.svg" alt="more-icon" />
      </span>
    `;

    container.appendChild(div);
  });

  console.log('✅ Patient list populated');
}


// ─────────────────────────────────
// FUNCTION B: RIGHT PANEL
// Jessica Profile
// ─────────────────────────────────
function populateProfile(jessica) {

  // ── These IDs match YOUR HTML exactly ──
  document.getElementById('profile-img').src            = jessica.profile_picture;
  document.getElementById('profile-name').textContent   = jessica.name;
  document.getElementById('dob').textContent            = jessica.date_of_birth;
  document.getElementById('gender').textContent         = jessica.gender;
  document.getElementById('phone').textContent          = jessica.phone_number;
  document.getElementById('emergency-contact').textContent = jessica.emergency_contact;
  document.getElementById('insurance-provider').textContent = jessica.insurance_type;

  console.log('✅ Profile populated');
}


// ─────────────────────────────────
// FUNCTION C: CENTER PANEL
// Vitals Cards
// ─────────────────────────────────
function populateVitals(jessica) {
  // Get the most recent month
  const latest = jessica.diagnosis_history.at(-1);

  console.log('Latest vitals:', latest);

  // Heart Rate
  document.getElementById('heart-rate').textContent
    = latest.heart_rate.value;
  document.getElementById('heart-rate-level').textContent
    = latest.heart_rate.levels;

  // Temperature
  document.getElementById('temperature').textContent
    = latest.temperature.value;
  document.getElementById('temperature-level').textContent
    = latest.temperature.levels;

  // Respiratory Rate
  document.getElementById('respiratory-rate').textContent
    = latest.respiratory_rate.value;
  document.getElementById('respiratory-level').textContent
    = latest.respiratory_rate.levels;

  // Blood Pressure values below chart
  const sys = latest.blood_pressure.systolic;
  const dia = latest.blood_pressure.diastolic;

  document.getElementById('sys-value').textContent = sys.value;

document.getElementById('sys-level').innerHTML =
  `<img src="/assets/ArrowUp.svg" alt="arrow-up" /> ${sys.levels}`;

document.getElementById('dia-value').textContent = dia.value;

document.getElementById('dia-level').innerHTML =
  `<img src="/assets/ArrowDown.svg" alt="arrow-down" /> ${dia.levels}`;
  console.log('✅ Vitals populated');
}


// ─────────────────────────────────
// FUNCTION D: CENTER PANEL
// Diagnostic Table
// ─────────────────────────────────
function populateDiagnostics(jessica) {
  const tbody = document.getElementById('diagnostic-tbody');
  tbody.innerHTML = '';

  jessica.diagnostic_list.forEach(diag => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${diag.name}</td>
      <td>${diag.description}</td>
      <td>
        <span class="status-badge">${diag.status}</span>
      </td>
    `;

    tbody.appendChild(row);
  });

  console.log('✅ Diagnostics populated');
}


// ─────────────────────────────────
// FUNCTION E: RIGHT PANEL
// Lab Results
// ─────────────────────────────────
function populateLabResults(jessica) {
  const list = document.getElementById('lab-list');
  list.innerHTML = '';

  jessica.lab_results.forEach(result => {
    const li = document.createElement('li');
    li.classList.add('lab-item');

    li.innerHTML = `
      <span>${result}</span>
      <span class="download-icon">
      <img src="/assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg" alt="download-icon" />
      </span>
    `;

    list.appendChild(li);
  });

  console.log('✅ Lab results populated');
}


// ─────────────────────────────────
// FUNCTION F: CENTER PANEL
// Blood Pressure Chart
// ─────────────────────────────────
function buildBPChart(jessica) {
  const last6 = jessica.diagnosis_history.slice(-6);

  const labels        = last6.map(r => `${r.month}, ${r.year}`);
  const systolicData  = last6.map(r => r.blood_pressure.systolic.value);
  const diastolicData = last6.map(r => r.blood_pressure.diastolic.value);

  const canvas = document.getElementById('bpChart');

  if (!canvas) {
    console.error('❌ Canvas #bpChart not found');
    return;
  }

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolicData,
          borderColor: '#FF6200',
          backgroundColor: 'rgba(255,98,0,0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: '#FF6200',
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Diastolic',
          data: diastolicData,
          borderColor: '#705AAA',
          backgroundColor: 'rgba(112,90,170,0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: '#705AAA',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 60,
          max: 180,
          grid: { color: '#F6F6F6' },
          ticks: {
            font: { family: 'Manrope', size: 12 },
            color: '#707070'
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { family: 'Manrope', size: 12 },
            color: '#707070'
          }
        }
      }
    }
  });

  console.log('✅ BP Chart built');
}


// ─────────────────────────────────
// START
// ─────────────────────────────────
getPatientData();