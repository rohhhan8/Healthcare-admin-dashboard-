/**
 * Robust Mock Data Generator for Healthcare Dashboard (FINAL FIXED VERSION)
 * * fixes:
 * - Weekly/Monthly comparisons now align dates correctly.
 * - Zero-filling logic ensures charts don't break on empty days.
 * - "Current Week" is defined strictly as the last 7 days vs previous 7 days.
 */

// ==========================================
// 1. INTERFACES
// ==========================================

export interface Clinic {
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    address: string;
    status: 'Active' | 'Inactive';
    rating: number;
    doctorCount: number;
    staffCount: number;
    createdAt: string;
}

export interface Doctor {
    id: string;
    clinicId: string;
    name: string;
    phone: string;
    email: string;
    specialization: string;
    experience: number;
    status: 'Available' | 'On Leave' | 'Busy';
}

export interface Patient {
    id: string;
    clinicId: string;
    clinicName: string;
    name: string;
    phone: string;
    email: string;
    age: number;
    gender: 'Male' | 'Female';
    condition: 'Critical' | 'Chronic' | 'Acute' | 'Flu' | 'Routine';
    admissionDate: string;
    totalSpent: number;
    bloodGroup: string;
}

export interface Appointment {
    id: string;
    clinicId: string;
    clinicName: string;
    patientId: string;
    doctorId: string;
    patientName: string;
    doctorName: string;
    type: 'Scheduled' | 'Walk-in';
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    date: string; // ISO YYYY-MM-DD
    time: string;
}

export interface MockData {
    clinics: Clinic[];
    doctors: Doctor[];
    patients: Patient[];
    appointments: Appointment[];
}

// Stats Interfaces
export interface DashboardStats {
    totalPatients: number;
    totalDoctors: number;
    totalStaff: number;
    totalAppointments: number;
    avgRating: number;
}

export interface ComparisonStats {
    value: number;
    previousValue: number;
    percentageChange: number; // e.g., +12.5 or -5.0
    trend: 'up' | 'down' | 'neutral';
}

export interface ChartData {
    labels: string[];
    current: number[];
    previous: number[];
}

// ==========================================
// 2. CONSTANTS & GENERATORS
// ==========================================

const CLINIC_NAMES = [
    'City General Hospital', 'Sunrise Medical Center', 'Wellness Care Clinic',
    'HealthFirst Hospital', 'Metro Health Hub', 'Premier Medical Institute',
    'Community Health Center', 'Advanced Care Hospital', 'Unity Health Clinic',
    'Central Medical Plaza',
];

const LOCATIONS = [
    { city: 'New York', state: 'NY' }, { city: 'Los Angeles', state: 'CA' },
    { city: 'Chicago', state: 'IL' }, { city: 'Houston', state: 'TX' },
    { city: 'Phoenix', state: 'AZ' }, { city: 'Philadelphia', state: 'PA' },
    { city: 'San Antonio', state: 'TX' }, { city: 'San Diego', state: 'CA' },
    { city: 'Dallas', state: 'TX' }, { city: 'Austin', state: 'TX' },
];

const NAMES_FIRST = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
const NAMES_LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const CONDITIONS = ['Critical', 'Chronic', 'Acute', 'Flu', 'Routine'] as const;
const APPT_TYPES = ['Scheduled', 'Walk-in'] as const;
const APPT_STATUS = ['Scheduled', 'Completed', 'Cancelled'] as const;

// Utils
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const formatDate = (d: Date) => d.toISOString().split('T')[0];

// ==========================================
// 3. MAIN GENERATOR FUNCTION
// ==========================================

export function generateMockData(): MockData {
    const clinics: Clinic[] = [];
    const doctors: Doctor[] = [];
    const patients: Patient[] = [];
    const appointments: Appointment[] = [];

    const NOW = new Date(); // Anchor date

    // --- A. Generate 10 Clinics ---
    for (let i = 0; i < 10; i++) {
        const cId = `c_${i + 1}`;
        const loc = LOCATIONS[i];

        const clinic: Clinic = {
            id: cId,
            name: CLINIC_NAMES[i],
            phone: `+1-555-010${i}`,
            email: `contact@${CLINIC_NAMES[i].split(' ')[0].toLowerCase()}.com`,
            location: `${loc.city}, ${loc.state}`,
            address: `${randomInt(100, 999)} Health Blvd, ${loc.city}`,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // 3.5 to 5.0
            doctorCount: randomInt(4, 12),
            staffCount: randomInt(8, 20),
            createdAt: new Date(NOW.getFullYear() - 2, 0, 1).toISOString(),
        };
        clinics.push(clinic);

        // --- B. Generate Doctors for this Clinic ---
        for (let d = 0; d < clinic.doctorCount; d++) {
            doctors.push({
                id: `d_${cId}_${d}`,
                clinicId: cId,
                name: `Dr. ${randomPick(NAMES_FIRST)} ${randomPick(NAMES_LAST)}`,
                phone: `+1-555-020${d}`,
                email: `dr.${d}@${clinic.name.split(' ')[0].toLowerCase()}.com`,
                specialization: randomPick(['Cardiology', 'Pediatrics', 'Neurology', 'General', 'Dermatology']),
                experience: randomInt(2, 25),
                status: randomPick(['Available', 'Available', 'Busy', 'On Leave']),
            });
        }
    }

    // --- C. Generate Data Over 24 Months (Growth Simulation) ---
    // We iterate day by day or month by month to simulate organic growth

    let totalPatientsGenerated = 0;
    let totalApptsGenerated = 0;

    // Loop backwards from 24 months ago to Today
    for (let m = 24; m >= 0; m--) {
        const currentMonthDate = new Date(NOW);
        currentMonthDate.setMonth(NOW.getMonth() - m);

        const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();

        // **Growth Logic**: More activity in recent months
        // Month 24 (oldest) = 0.2 factor. Month 0 (now) = 1.0 factor.
        const growthFactor = 0.2 + (0.8 * ((24 - m) / 24));

        // 1. Generate New Patients for this month
        const monthlyNewPatients = Math.floor(randomInt(200, 500) * growthFactor); // 10-150 per month global

        for (let p = 0; p < monthlyNewPatients; p++) {
            totalPatientsGenerated++;
            const assignedClinic = randomPick(clinics);
            const age = randomInt(5, 65);

            // Random admission day within this month
            const admissionDay = randomInt(1, daysInMonth);
            const admissionDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), admissionDay);

            const patient: Patient = {
                id: `p_${totalPatientsGenerated}`,
                clinicId: assignedClinic.id,
                clinicName: assignedClinic.name,
                name: `${randomPick(NAMES_FIRST)} ${randomPick(NAMES_LAST)}`,
                phone: `+1-555-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
                email: `patient${totalPatientsGenerated}@email.com`,
                age: age,
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                condition: randomPick(CONDITIONS),
                admissionDate: formatDate(admissionDate),
                totalSpent: (age * 15) + 500 + randomInt(0, 500), // Base cost logic
                bloodGroup: randomPick(['A+', 'O+', 'B+', 'AB+', 'O-']),
            };
            patients.push(patient);
        }

        // 2. Generate Appointments for this month (using existing patients)
        // Only patients admitted BEFORE or ON this month can have appointments
        const activePatients = patients.filter(p => new Date(p.admissionDate) <= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0));

        if (activePatients.length === 0) continue;

        const monthlyAppts = Math.floor(randomInt(100, 300) * growthFactor);

        for (let a = 0; a < monthlyAppts; a++) {
            totalApptsGenerated++;
            const patient = randomPick(activePatients);
            const clinic = clinics.find(c => c.id === patient.clinicId)!;
            const clinicDoctors = doctors.filter(d => d.clinicId === clinic.id);
            const doctor = clinicDoctors.length > 0 ? randomPick(clinicDoctors) : { id: 'd_temp', name: 'Dr. TBD' } as Doctor;

            // Random date in this month
            const apptDay = randomInt(1, daysInMonth);
            let apptDateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), apptDay);

            // LOGIC FIX: Ensure Appt Date >= Patient Admission Date
            const admDateObj = new Date(patient.admissionDate);
            if (apptDateObj < admDateObj) {
                apptDateObj = admDateObj; // Move appt to admission day (Walk-in logic)
            }

            // If date is in future (relative to "Now"), skip or cap it
            if (apptDateObj > NOW) continue;

            appointments.push({
                id: `appt_${totalApptsGenerated}`,
                clinicId: clinic.id,
                clinicName: clinic.name,
                patientId: patient.id,
                patientName: patient.name,
                doctorId: doctor.id,
                doctorName: doctor.name,
                type: (apptDateObj.getTime() === admDateObj.getTime()) ? 'Walk-in' : randomPick(APPT_TYPES),
                status: randomPick(APPT_STATUS),
                date: formatDate(apptDateObj),
                time: `${randomInt(9, 16)}:${randomPick(['00', '30'])}`,
            });
        }
    }

    // Sort appointments by date (Newest first)
    appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { clinics, doctors, patients, appointments };
}


// ==========================================
// 4. ROBUST CALCULATOR FUNCTIONS (The Fixes)
// ==========================================

export const mockData = generateMockData();

// Date range type
export type DateRange = 'this-week' | 'this-month' | 'this-year';

/**
 * Get date filter start string based on range
 */
function getDateRangeStart(dateRange?: DateRange): string | null {
    if (!dateRange) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate: Date;

    switch (dateRange) {
        case 'this-week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            break;
        case 'this-month':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            break;
        case 'this-year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            break;
    }

    return formatDate(startDate);
}

/**
 * Calculates generic totals for the top cards
 * Now supports date range filtering
 */
export const calculateDashboardStats = (clinicId?: string | null, dateRange?: DateRange): DashboardStats => {
    const { clinics, appointments, patients } = mockData;

    // Filter by clinic
    const targetClinics = clinicId ? clinics.filter(c => c.id === clinicId) : clinics;
    let targetAppts = clinicId ? appointments.filter(a => a.clinicId === clinicId) : appointments;
    let targetPatients = clinicId ? patients.filter(p => p.clinicId === clinicId) : patients;

    // Filter by date range
    const startStr = getDateRangeStart(dateRange);
    if (startStr) {
        targetAppts = targetAppts.filter(a => a.date >= startStr);
        targetPatients = targetPatients.filter(p => p.admissionDate >= startStr);
    }

    const totalDoctors = targetClinics.reduce((sum, c) => sum + c.doctorCount, 0);
    const totalStaff = targetClinics.reduce((sum, c) => sum + c.staffCount, 0);
    const avgRating = targetClinics.reduce((sum, c) => sum + c.rating, 0) / (targetClinics.length || 1);

    return {
        totalPatients: targetPatients.length,
        totalAppointments: targetAppts.length,
        totalDoctors,
        totalStaff,
        avgRating: parseFloat(avgRating.toFixed(1)),
    };
};

/**
 * FIX: Weekly Comparison logic that correctly handles 0-values days
 * Comparison: "Last 7 days" vs "The 7 days before that"
 */
export const calculateWeeklyChartData = (clinicId?: string | null): ChartData & ComparisonStats => {
    const allAppts = clinicId
        ? mockData.appointments.filter(a => a.clinicId === clinicId)
        : mockData.appointments;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels: string[] = [];
    const current: number[] = [];
    const previous: number[] = [];

    let currentTotal = 0;
    let previousTotal = 0;

    // Loop back 7 days (0 to 6)
    for (let i = 6; i >= 0; i--) {
        const dCurrent = new Date(today);
        dCurrent.setDate(today.getDate() - i);
        const dateStrCurrent = formatDate(dCurrent);

        const dPrev = new Date(today);
        dPrev.setDate(today.getDate() - i - 7); // Shift back 7 more days
        const dateStrPrev = formatDate(dPrev);

        // Get Counts
        const countCurr = allAppts.filter(a => a.date === dateStrCurrent).length;
        const countPrev = allAppts.filter(a => a.date === dateStrPrev).length;

        labels.push(dCurrent.toLocaleDateString('en-US', { weekday: 'short' })); // "Mon", "Tue"
        current.push(countCurr);
        previous.push(countPrev);

        currentTotal += countCurr;
        previousTotal += countPrev;
    }

    // Calculate Percent Change
    const diff = currentTotal - previousTotal;
    const percentage = previousTotal === 0 ? 100 : (diff / previousTotal) * 100;

    return {
        labels,
        current,
        previous,
        value: currentTotal,
        previousValue: previousTotal,
        percentageChange: parseFloat(percentage.toFixed(1)),
        trend: diff >= 0 ? 'up' : 'down'
    };
};

/**
 * FIX: Monthly Comparison logic
 * Comparison: "This Year (Month by Month)" vs "Last Year"
 */
export const calculateMonthlyChartData = (clinicId?: string | null): ChartData => {
    const allAppts = clinicId
        ? mockData.appointments.filter(a => a.clinicId === clinicId)
        : mockData.appointments;

    const today = new Date();
    const currentYear = today.getFullYear();
    const lastYear = currentYear - 1;

    const labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const current: number[] = new Array(12).fill(0);
    const previous: number[] = new Array(12).fill(0);

    allAppts.forEach(appt => {
        const d = new Date(appt.date);
        const month = d.getMonth(); // 0-11
        const year = d.getFullYear();

        if (year === currentYear) {
            current[month]++;
        } else if (year === lastYear) {
            previous[month]++;
        }
    });

    // Optional: Cut off future months for current year if preferred
    // const currentMonthIndex = today.getMonth();
    // for(let i = currentMonthIndex + 1; i < 12; i++) current[i] = 0;

    return { labels, current, previous };
};

/**
 * Helper for Disease/Condition Chart - synced with dateRange
 */
export const calculateDiseaseData = (clinicId?: string | null, dateRange?: DateRange) => {
    let patients = clinicId
        ? mockData.patients.filter(p => p.clinicId === clinicId)
        : mockData.patients;

    // Filter by date range
    const startStr = getDateRangeStart(dateRange);
    if (startStr) {
        patients = patients.filter(p => p.admissionDate >= startStr);
    }

    const counts: Record<string, number> = {};
    patients.forEach(p => {
        counts[p.condition] = (counts[p.condition] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

/**
 * Age Cost Data Interface
 */
export interface AgeCostData {
    ageGroup: string;
    avgCost: number;
    patientCount: number;
    color: string;
}

// Age groups with theme-consistent color palette
const AGE_GROUPS = [
    { label: '0-18', min: 0, max: 18, color: '#112D4E' },     // Navy
    { label: '18-30', min: 18, max: 30, color: '#3F72AF' },   // Primary Blue
    { label: '30-45', min: 30, max: 45, color: '#2AB7A6' },   // Teal
    { label: '45-60', min: 45, max: 60, color: '#5A7A9A' },   // Slate Blue
    { label: '60+', min: 60, max: 100, color: '#4A9E8F' },    // Muted Teal
];

/**
 * Calculate age-based cost data - synced with dateRange (INR)
 */
export const calculateAgeCostData = (clinicId?: string | null, dateRange?: DateRange): AgeCostData[] => {
    let patients = clinicId
        ? mockData.patients.filter(p => p.clinicId === clinicId)
        : mockData.patients;

    // Filter by date range
    const startStr = getDateRangeStart(dateRange);
    if (startStr) {
        patients = patients.filter(p => p.admissionDate >= startStr);
    }

    return AGE_GROUPS.map(group => {
        const groupPatients = patients.filter(p => p.age >= group.min && p.age < group.max);
        const totalSpent = groupPatients.reduce((sum, p) => sum + p.totalSpent, 0);
        // Convert to INR (multiply by 83 approx)
        const avgCostINR = groupPatients.length > 0
            ? Math.round((totalSpent / groupPatients.length) * 83)
            : 0;
        return {
            ageGroup: group.label,
            avgCost: avgCostINR,
            patientCount: groupPatients.length,
            color: group.color,
        };
    });
};

/**
 * UNIFIED: Get chart data based on dateRange
 * Counts PATIENTS (not appointments) by admission date
 * - this-week: 7-day comparison (current week vs previous week)
 * - this-month: 30-day comparison (last 4 weeks vs previous 4 weeks)
 * - this-year: 12-month comparison (this year vs last year)
 */
export const getChartDataByRange = (
    clinicId?: string | null,
    dateRange: DateRange = 'this-week'
): ChartData & ComparisonStats => {
    // Use PATIENTS, not appointments
    const allPatients = clinicId
        ? mockData.patients.filter(p => p.clinicId === clinicId)
        : mockData.patients;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels: string[] = [];
    const current: number[] = [];
    const previous: number[] = [];

    let currentTotal = 0;
    let previousTotal = 0;

    if (dateRange === 'this-week') {
        // Weekly: Last 7 days vs previous 7 days
        for (let i = 6; i >= 0; i--) {
            const dCurrent = new Date(today);
            dCurrent.setDate(today.getDate() - i);
            const dateStrCurrent = formatDate(dCurrent);

            const dPrev = new Date(today);
            dPrev.setDate(today.getDate() - i - 7);
            const dateStrPrev = formatDate(dPrev);

            // Count patients by admission date
            const countCurr = allPatients.filter(p => p.admissionDate === dateStrCurrent).length;
            const countPrev = allPatients.filter(p => p.admissionDate === dateStrPrev).length;

            labels.push(dCurrent.toLocaleDateString('en-US', { weekday: 'short' }));
            current.push(countCurr);
            previous.push(countPrev);

            currentTotal += countCurr;
            previousTotal += countPrev;
        }
    } else if (dateRange === 'this-month') {
        // Monthly: Last 4 weeks vs previous 4 weeks (by week)
        for (let week = 3; week >= 0; week--) {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - (week * 7) - 6);
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() - (week * 7));

            const prevWeekStart = new Date(weekStart);
            prevWeekStart.setDate(prevWeekStart.getDate() - 28);
            const prevWeekEnd = new Date(weekEnd);
            prevWeekEnd.setDate(prevWeekEnd.getDate() - 28);

            // Count patients by admission date
            const countCurr = allPatients.filter(p => {
                const d = new Date(p.admissionDate);
                return d >= weekStart && d <= weekEnd;
            }).length;

            const countPrev = allPatients.filter(p => {
                const d = new Date(p.admissionDate);
                return d >= prevWeekStart && d <= prevWeekEnd;
            }).length;

            labels.push(`Week ${4 - week}`);
            current.push(countCurr);
            previous.push(countPrev);

            currentTotal += countCurr;
            previousTotal += countPrev;
        }
    } else {
        // Yearly: Last 12 months vs Previous 12 months (rolling, not calendar year)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 11; i >= 0; i--) {
            // Current period: months going back from now
            const currentMonth = new Date(today);
            currentMonth.setMonth(today.getMonth() - i);
            const currMonthIdx = currentMonth.getMonth();
            const currYear = currentMonth.getFullYear();

            // Previous period: 12 months before that
            const prevMonth = new Date(currentMonth);
            prevMonth.setFullYear(prevMonth.getFullYear() - 1);
            const prevMonthIdx = prevMonth.getMonth();
            const prevYear = prevMonth.getFullYear();

            // Count patients by admission date
            const countCurr = allPatients.filter(p => {
                const d = new Date(p.admissionDate);
                return d.getMonth() === currMonthIdx && d.getFullYear() === currYear;
            }).length;

            const countPrev = allPatients.filter(p => {
                const d = new Date(p.admissionDate);
                return d.getMonth() === prevMonthIdx && d.getFullYear() === prevYear;
            }).length;

            labels.push(monthNames[currMonthIdx]);
            current.push(countCurr);
            previous.push(countPrev);

            currentTotal += countCurr;
            previousTotal += countPrev;
        }
    }

    const diff = currentTotal - previousTotal;
    const percentage = previousTotal === 0 ? (currentTotal > 0 ? 100 : 0) : (diff / previousTotal) * 100;

    return {
        labels,
        current,
        previous,
        value: currentTotal,
        previousValue: previousTotal,
        percentageChange: parseFloat(percentage.toFixed(1)),
        trend: diff >= 0 ? 'up' : 'down'
    };
};