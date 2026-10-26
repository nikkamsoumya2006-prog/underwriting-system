// Sample application data stored in JavaScript (as specified in guidelines)
let applications = [
    {
        id: 1,
        application_number: "APP-2026-001",
        applicant_name: "John Smith",
        policy_type: "Life Insurance",
        coverage_amount: 500000,
        risk_score: 65,
        status: "under-review",
        submitted_date: "2026-06-20"
    },
    {
        id: 2,
        application_number: "APP-2026-002",
        applicant_name: "Sarah Johnson",
        policy_type: "Health Insurance",
        coverage_amount: 200000,
        risk_score: 40,
        status: "submitted",
        submitted_date: "2026-06-22"
    },
    {
        id: 3,
        application_number: "APP-2026-003",
        applicant_name: "Michael Brown",
        policy_type: "Auto Insurance",
        coverage_amount: 50000,
        risk_score: 15,
        status: "Approved",
        submitted_date: "2026-06-24"
    }
];

let riskAssessments = [
    { id: 1, application_id: 1, risk_factors: "Mild Smoker", risk_score: 65, risk_level: "High Risk", assessment_date: "2026-06-21" },
    { id: 2, application_id: 2, risk_factors: "None", risk_score: 40, risk_level: "Medium Risk", assessment_date: "2026-06-23" }
];

let decisions = [
    { id: 1, application_id: 3, decision: "Approved", reason: "Clean record and low risk score", decision_date: "2026-06-25", decision_maker: "Underwriter Admin" }
];

let guidelines = [
    { id: "R-101", category: "Age Factor", criteria: "Applicant Age > 60", action: "Add +20 Risk Score" },
    { id: "R-102", category: "Coverage Limit", criteria: "Coverage > $1,000,000", action: "Requires Senior Underwriter Approval" },
    { id: "R-103", category: "Auto Approval", criteria: "Risk Score < 30", action: "Automatic Approval Recommendation" }
];

let documents = [
    { id: 1, application_id: 1, document_name: "Medical_Report.pdf", file_type: "PDF", upload_date: "2026-06-21" }
];

// Navigation Handler
document.querySelectorAll('.sidebar .nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        
        this.classList.add('active');
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).classList.add('active');
        document.getElementById('page-heading').innerText = this.innerText.trim();
    });
});

// Dark Mode Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Render Dashboard Data & Analytics
function renderDashboard() {
    document.getElementById('stat-total').innerText = applications.length;
    document.getElementById('stat-approved').innerText = applications.filter(a => a.status === 'Approved').length;
    document.getElementById('stat-review').innerText = applications.filter(a => a.status === 'under-review' || a.status === 'submitted').length;
    document.getElementById('stat-declined').innerText = applications.filter(a => a.status === 'Declined').length;

    // Analytics Calculation
    const total = applications.length || 1;
    const lowCount = applications.filter(a => a.risk_score < 30).length;
    const medCount = applications.filter(a => a.risk_score >= 30 && a.risk_score < 60).length;
    const highCount = applications.filter(a => a.risk_score >= 60 && a.risk_score < 80).length;
    const critCount = applications.filter(a => a.risk_score >= 80).length;

    document.getElementById('bar-low').style.width = `${(lowCount / total) * 100}%`;
    document.getElementById('bar-med').style.width = `${(medCount / total) * 100}%`;
    document.getElementById('bar-high').style.width = `${(highCount / total) * 100}%`;
    document.getElementById('bar-critical').style.width = `${(critCount / total) * 100}%`;
}

// Render Applications Table
function renderApplications() {
    const tbody = document.getElementById('applications-tbody');
    const search = document.getElementById('app-search').value.toLowerCase();
    const filter = document.getElementById('app-status-filter').value;

    tbody.innerHTML = '';
    applications.filter(app => {
        const matchesSearch = app.applicant_name.toLowerCase().includes(search) || app.application_number.toLowerCase().includes(search);
        const matchesStatus = filter === 'ALL' || app.status === filter;
        return matchesSearch && matchesStatus;
    }).forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${app.application_number}</strong></td>
            <td>${app.applicant_name}</td>
            <td>${app.policy_type}</td>
            <td>$${app.coverage_amount.toLocaleString()}</td>
            <td><span class="badge ${getRiskBadgeClass(app.risk_score)}">${app.risk_score}</span></td>
            <td>${app.status}</td>
            <td>${app.submitted_date}</td>
        `;
        tbody.appendChild(row);
    });
}

function getRiskBadgeClass(score) {
    if (score < 30) return 'badge-low';
    if (score < 60) return 'badge-medium';
    if (score < 80) return 'badge-high';
    return 'badge-critical';
}

// Populate Dynamic Select Dropdowns
function populateDropdowns() {
    const selects = [document.getElementById('decision-app-select'), document.getElementById('doc-app-select')];
    selects.forEach(select => {
        select.innerHTML = '';
        applications.forEach(app => {
            const opt = document.createElement('option');
            opt.value = app.id;
            opt.innerText = `${app.application_number} - ${app.applicant_name}`;
            select.appendChild(opt);
        });
    });

    const issueSelect = document.getElementById('issuance-app-select');
    issueSelect.innerHTML = '';
    applications.filter(a => a.status === 'Approved').forEach(app => {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.innerText = `${app.application_number} - ${app.applicant_name}`;
        issueSelect.appendChild(opt);
    });
}

// Risk Assessment Form Handling
document.getElementById('risk-calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('calc-name').value;
    const age = parseInt(document.getElementById('calc-age').value);
    const policy = document.getElementById('calc-policy').value;
    const coverage = parseInt(document.getElementById('calc-coverage').value);
    const factorScore = parseInt(document.getElementById('calc-factors').value);

    // Calculate score logic
    let calculatedScore = factorScore;
    if (age > 50) calculatedScore += 25;
    else if (age > 35) calculatedScore += 10;
    if (coverage > 300000) calculatedScore += 15;

    let recommendation = "Approve";
    let level = "Low Risk";
    if (calculatedScore >= 75) { recommendation = "Decline"; level = "Critical Risk"; }
    else if (calculatedScore >= 50) { recommendation = "Refer to Senior"; level = "High Risk"; }
    else if (calculatedScore >= 30) { recommendation = "Request More Info"; level = "Medium Risk"; }

    // Create & add new Application
    const newId = applications.length + 1;
    const newApp = {
        id: newId,
        application_number: `APP-2026-00${newId}`,
        applicant_name: name,
        policy_type: policy,
        coverage_amount: coverage,
        risk_score: calculatedScore,
        status: recommendation === "Approve" ? "Approved" : "under-review",
        submitted_date: new Date().toISOString().split('T')[0]
    };
    applications.push(newApp);

    // Display result box
    document.getElementById('res-score').innerText = calculatedScore;
    document.getElementById('res-level-badge').innerText = level;
    document.getElementById('res-recommendation').innerText = recommendation;
    document.getElementById('risk-result-card').classList.remove('hidden');

    renderDashboard();
    renderApplications();
    populateDropdowns();
});

// Decision Form Submission & Timeline update
document.getElementById('decision-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const appId = parseInt(document.getElementById('decision-app-select').value);
    const action = document.getElementById('decision-action').value;
    const notes = document.getElementById('decision-notes').value;

    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
        targetApp.status = action;
        decisions.push({
            id: decisions.length + 1,
            application_id: appId,
            decision: action,
            reason: notes,
            decision_date: new Date().toISOString().split('T')[0],
            decision_maker: "Underwriter Admin"
        });

        renderTimeline(targetApp);
        renderDashboard();
        renderApplications();
        populateDropdowns();
        alert(`Application ${targetApp.application_number} updated to: ${action}`);
    }
});

function renderTimeline(app) {
    const container = document.getElementById('timeline-container');
    container.innerHTML = `
        <div class="timeline-item">
            <strong>Application Submitted:</strong> ${app.submitted_date}
        </div>
        <div class="timeline-item">
            <strong>Risk Score Evaluated:</strong> Score ${app.risk_score}
        </div>
        <div class="timeline-item">
            <strong>Latest Decision Status:</strong> ${app.status}
        </div>
    `;
}

// Render Guidelines Table
function renderGuidelines() {
    const tbody = document.getElementById('guidelines-tbody');
    tbody.innerHTML = '';
    guidelines.forEach(g => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${g.id}</strong></td>
                <td>${g.category}</td>
                <td>${g.criteria}</td>
                <td>${g.action}</td>
            </tr>
        `;
    });
}

// Policy Generation
document.getElementById('btn-generate-policy').addEventListener('click', () => {
    const appId = parseInt(document.getElementById('issuance-app-select').value);
    const app = applications.find(a => a.id === appId);
    if (app) {
        document.getElementById('pol-num').innerText = `POL-${app.application_number}`;
        document.getElementById('pol-name').innerText = app.applicant_name;
        document.getElementById('pol-type').innerText = app.policy_type;
        document.getElementById('pol-amount').innerText = app.coverage_amount.toLocaleString();
        document.getElementById('policy-preview').classList.remove('hidden');
    } else {
        alert("Please select an approved application to generate a policy.");
    }
});

// Document Upload Form
document.getElementById('doc-upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const appId = parseInt(document.getElementById('doc-app-select').value);
    const name = document.getElementById('doc-name').value;
    const type = document.getElementById('doc-type').value;

    documents.push({
        id: documents.length + 1,
        application_id: appId,
        document_name: name,
        file_type: type,
        upload_date: new Date().toISOString().split('T')[0]
    });
    renderDocuments();
    this.reset();
});

function renderDocuments() {
    const tbody = document.getElementById('docs-tbody');
    tbody.innerHTML = '';
    documents.forEach(d => {
        const app = applications.find(a => a.id === d.application_id);
        tbody.innerHTML += `
            <tr>
                <td>${d.id}</td>
                <td>${app ? app.application_number : d.application_id}</td>
                <td>${d.document_name}</td>
                <td>${d.file_type}</td>
                <td>${d.upload_date}</td>
            </tr>
        `;
    });
}

// Reports & Export Functions
document.getElementById('export-csv').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,APP_NO,NAME,POLICY,COVERAGE,RISK_SCORE,STATUS,DATE\n";
    applications.forEach(a => {
        csvContent += `${a.id},${a.application_number},${a.applicant_name},${a.policy_type},${a.coverage_amount},${a.risk_score},${a.status},${a.submitted_date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "underwriting_applications_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('export-pdf').addEventListener('click', () => {
    window.print();
});

// Search & Filter event listeners
document.getElementById('app-search').addEventListener('input', renderApplications);
document.getElementById('app-status-filter').addEventListener('change', renderApplications);

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    renderApplications();
    renderGuidelines();
    renderDocuments();
    populateDropdowns();
});