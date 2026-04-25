const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema({
  program: { type: String, default: '' },
  qualification: { type: String, default: '' },
  marks: { type: String, default: '' },
  ageLimit: { type: String, default: '' }
}, { _id: false });

const departmentSchema = new mongoose.Schema({
  dept: { type: String, default: '' },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  admissionsOpen: { type: Boolean, default: true },
  lastDateAdmission: { type: String, default: 'May 31, 2026' },
  principalName: { type: String, default: 'Prof. Dr. Farzana Ashfaq' },
  principalMessage: { type: String, default: 'Welcome to Government Associate College, Data Nagar.' },
  phone: { type: String, default: '04237602172' },
  email: { type: String, default: 'datanagargacw@gmail.com' },
  address: { type: String, default: 'Ilahi Bakhsh Road Data Nagar, Lahore' },
  tickerText: { type: String, default: 'Admissions Open 2026-27 | Last Date: May 31, 2026' },
  eligibilityCriteria: { type: [eligibilitySchema], default: [
    { program: 'FSc Pre-Medical/Engineering', qualification: 'Matric (Science)', marks: '60%', ageLimit: 'Under 20 years' },
    { program: 'ICS', qualification: 'Matric (Science)', marks: '55%', ageLimit: 'Under 20 years' },
    { program: 'FA', qualification: 'Matric (Any group)', marks: '50%', ageLimit: 'Under 20 years' },
    { program: 'I.Com', qualification: 'Matric (Any group)', marks: '50%', ageLimit: 'Under 20 years' },
    { program: 'ADP Science', qualification: 'FSc/ICS', marks: '45%', ageLimit: 'Under 23 years' },
    { program: 'ADP Arts', qualification: 'FA/FSc/ICS', marks: '45%', ageLimit: 'Under 23 years' },
    { program: 'ADP Commerce', qualification: 'I.Com/FSc/FA', marks: '45%', ageLimit: 'Under 23 years' }
  ]},
  officeHours: { type: String, default: 'Monday - Friday\n8:00 AM - 4:00 PM\nSaturday: 8:00 AM - 1:00 PM' },
  departments: { type: [departmentSchema], default: [
    { dept: "Principal Office", name: "Prof. Dr. Farzana Ashfaq", phone: "042-1234568", email: "principal@gacdatanagar.edu.pk" },
    { dept: "Admissions Office", name: "Mr. Usman Farooq", phone: "042-1234569", email: "admissions@gacdatanagar.edu.pk" },
    { dept: "Examination Section", name: "Ms. Nida Khan", phone: "042-1234570", email: "exams@gacdatanagar.edu.pk" },
    { dept: "Accounts Office", name: "Mr. Hassan Raza", phone: "042-1234571", email: "accounts@gacdatanagar.edu.pk" },
    { dept: "Library", name: "Mr. Khalid Javed", phone: "042-1234572", email: "library@gacdatanagar.edu.pk" },
    { dept: "IT Department", name: "Professor Komal", phone: "042-1234573", email: "it@gacdatanagar.edu.pk" }
  ]},
  campusLife: {
    sportsGala: {
      year: { type: String, default: "2026" },
      highlights: { type: [{ title: String, details: [String] }], default: [] }
    },
    annualFunction: {
      year: { type: String, default: "2026" },
      chiefGuest: { name: { type: String, default: "" }, title: { type: String, default: "" } },
      highlights: { type: [String], default: [] },
      awards: { type: [{ category: String, value: String }], default: [] }
    },
    studentSocieties: { type: [{ name: String, desc: String, activities: [String] }], default: [] },
    culturalEvents: { type: [{ event: String, date: String, desc: String }], default: [] },
    studentCouncil: {
      year: String,
      members: [{ position: String, name: String, program: String }]
    }
  },
  requiredDocuments: { type: [String], default: [] },
  academicCalendar: {
    firstYear: [{ event: String, date: String }],
    secondYear: [{ event: String, date: String }]
  },
  libraryStats: {
    totalBooks: { type: String, default: "15,000+" },
    journals: { type: String, default: "50+" },
    newspapers: { type: String, default: "8" },
    digitalResources: { type: String, default: "Available" },
    seatingCapacity: { type: String, default: "200" }
  },
  libraryInfo: {
    timing: { type: [String], default: ["Monday - Friday: 8:00 AM - 4:00 PM", "Saturday: 8:00 AM - 1:00 PM"] },
    facilities: { type: [String], default: ["High-speed Wi-Fi Access", "Computer Workstations", "Quiet Study Zones", "Photocopier Services"] },
    rules: { type: [String], default: ["College ID card is mandatory for entry and borrowing books.", "Strict silence must be observed inside the library premises.", "Books can be issued for a maximum of 14 days.", "Use of mobile phones for calls is strictly prohibited."] }
  },

  // About Page fields
  aboutHistory: { type: [{ year: String, title: String, description: String }], default: [
    { year: "1981", title: "Foundation", description: "Government Associate College, Data Nagar was established by the Government of Punjab to provide quality intermediate education to the youth of the region." },
    { year: "1995", title: "Expansion", description: "Introduction of Associate Degree Programs (ADP) in multiple disciplines, expanding educational opportunities for students." },
    { year: "2010", title: "Modernization", description: "Comprehensive upgrade of laboratory facilities and introduction of modern computer labs with latest technology." },
    { year: "2026", title: "Present Day", description: "Today, GAC Data Nagar stands as a leading public-sector college with over 3,500 students and a legacy of academic excellence spanning 45 years." }
  ]},
  aboutVision: { type: String, default: "To be a center of academic excellence that empowers students with knowledge, skills, and ethical values, preparing them to become responsible citizens and future leaders who contribute meaningfully to the nation's development and progress." },
  aboutMission: { type: [String], default: [
    "Provide quality education accessible to all segments of society",
    "Foster critical thinking and innovation among students",
    "Develop character and ethical values alongside academics",
    "Promote research and scholarly activities"
  ]},
  principalTitle: { type: String, default: "Ph.D. in Education Management" },
  principalExperience: { type: String, default: "30+ Years in Academia" },
  principalFullMessage: { type: String, default: "Dear Students, Parents, and Well-wishers,\n\nIt gives me immense pleasure to welcome you to Government Associate College, Data Nagar. As we complete 45 years of service to education, I am proud to lead an institution that has consistently maintained the highest standards of academic excellence and moral values.\n\nEducation is not merely about acquiring knowledge from textbooks; it is about character building, developing critical thinking, and preparing young minds to face the challenges of the modern world. At GAC Data Nagar, we are committed to nurturing well-rounded individuals who excel not only academically but also in extracurricular activities and community service.\n\nOur dedicated faculty members, modern infrastructure, and comprehensive curriculum ensure that every student receives individual attention and the best possible education. We take pride in our state-of-the-art laboratories, extensive library, and sports facilities that provide students with opportunities for holistic development.\n\nI encourage all our students to make the most of the opportunities available to them, maintain discipline, work hard, and aspire to become responsible citizens of Pakistan. Together, we can build a brighter future for our nation.\n\nWith best wishes for your success,\nProf. Dr. Farzana Ashfaq\nPrincipal" },
  achievements: { type: [{ title: String, description: String }], default: [
    { title: "98% Success Rate", description: "Consistent excellent results in board examinations" },
    { title: "50+ Position Holders", description: "Students securing top positions in BISE annually" },
    { title: "National Champions", description: "Multiple sports championships at provincial level" },
    { title: "Research Excellence", description: "Published research papers by faculty members" },
    { title: "Community Service", description: "Active participation in social welfare programs" },
    { title: "HEC Recognition", description: "Recognized by Higher Education Commission" }
  ]},
  infrastructureCampus: { type: [String], default: [
    "15 acres campus area",
    "45 well-equipped classrooms",
    "4 specialized science laboratories",
    "Modern computer lab with 60 systems",
    "Library with 15,000+ books"
  ]},
  infrastructureSupport: { type: [String], default: [
    "Air-conditioned seminar hall (capacity 500)",
    "Sports complex with indoor/outdoor facilities",
    "Spacious parking area",
    "Canteen with hygienic food options",
    "24/7 security and CCTV surveillance"
  ]},

  // Footer fields
  totalVisitors: { type: Number, default: 125847 },
  collegeName: { type: String, default: "Govt. Associate College" },
  collegeLocation: { type: String, default: "Data Nagar, Lahore" },
  collegeEstYear: { type: String, default: "1981" },
  collegeShortHistory: { type: String, default: "Established in 1981, GAC Data Nagar has been a beacon of quality education and academic excellence in Punjab for over four decades." },

  // Home Page fields
  homeStats: { type: [{ icon: String, value: String, label: String }], default: [
    { icon: "Users", value: "3,500+", label: "Enrolled Students" },
    { icon: "BookOpen", value: "8", label: "Programs Offered" },
    { icon: "GraduationCap", value: "120+", label: "Qualified Faculty" },
    { icon: "Award", value: "45+", label: "Years of Excellence" }
  ]},
  homeFeatures: { type: [{ icon: String, title: String, desc: String }], default: [
    { icon: "GraduationCap", title: "Expert Faculty", desc: "Highly qualified professors with decades of teaching experience." },
    { icon: "BookOpen", title: "Modern Labs", desc: "State-of-the-art science, computer, and language laboratories." },
    { icon: "Users", title: "Sports Facilities", desc: "Cricket, football, volleyball, and indoor games courts." },
    { icon: "Award", title: "Scholarships", desc: "Merit-based and need-based financial assistance programs." },
    { icon: "Shield", title: "Safe Campus", desc: "Secure, monitored campus with female-only sections." },
    { icon: "Clock", title: "Regular Classes", desc: "Consistent academic schedule with tutorial & extra coaching." }
  ]}
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
