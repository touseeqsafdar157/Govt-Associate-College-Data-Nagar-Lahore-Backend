const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await new Settings().save();
    }
    let updated = false;
    if (!settings.officeHours) {
      settings.officeHours = 'Monday - Friday\n8:00 AM - 4:00 PM\nSaturday: 8:00 AM - 1:00 PM';
      updated = true;
    }
    if (!settings.departments || settings.departments.length === 0) {
      settings.departments = [
        { dept: "Principal Office", name: "Prof. Dr. Farzana Ashfaq", phone: "042-1234568", email: "principal@gacdatanagar.edu.pk" },
        { dept: "Admissions Office", name: "Mr. Usman Farooq", phone: "042-1234569", email: "admissions@gacdatanagar.edu.pk" },
        { dept: "Examination Section", name: "Ms. Nida Khan", phone: "042-1234570", email: "exams@gacdatanagar.edu.pk" },
        { dept: "Accounts Office", name: "Mr. Hassan Raza", phone: "042-1234571", email: "accounts@gacdatanagar.edu.pk" },
        { dept: "Library", name: "Mr. Khalid Javed", phone: "042-1234572", email: "library@gacdatanagar.edu.pk" },
        { dept: "IT Department", name: "Professor Komal", phone: "042-1234573", email: "it@gacdatanagar.edu.pk" }
      ];
      updated = true;
    }
    
    if (!settings.campusLife || !settings.campusLife.sportsGala || settings.campusLife.sportsGala.highlights.length === 0) {
      settings.campusLife = {
        sportsGala: {
          year: "2026",
          highlights: [
            { title: "Cricket Championship", details: ["Winners: FSc Pre-Engineering Team A", "Best Player: Muhammad Hamza (50 runs, 3 wickets)"] },
            { title: "Football Tournament", details: ["Winners: ADP Science Team", "Best Player: Ahmed Raza (4 goals)"] },
            { title: "Athletics Events", details: ["100m Sprint: Ali Akbar (11.2 seconds)", "Long Jump: Sara Khan (5.2 meters)"] },
            { title: "Volleyball Championship", details: ["Winners: I.Com Department Team"] }
          ]
        },
        annualFunction: {
          year: "2026",
          chiefGuest: { name: "Prof. Dr. Khalid Manzoor Butt", title: "Vice Chancellor, University of Engineering & Technology, Lahore" },
          highlights: ["Recitation of Holy Quran", "National Anthem", "Principal's Annual Report", "Chief Guest's Address", "Prize Distribution to Position Holders", "Cultural Performances", "Vote of Thanks"],
          awards: [
            { category: "Position Holders", value: "52 students" },
            { category: "Sports Excellence", value: "28 students" },
            { category: "Best Debater", value: "3 students" },
            { category: "Literary Achievements", value: "15 students" },
            { category: "Community Service", value: "10 students" }
          ]
        },
        studentSocieties: [
          { name: "Literary Society", desc: "Organizes debates, poetry competitions, essay writing contests, and book reading sessions. Active participation in inter-college literary events.", activities: ["Monthly Mushaira", "English Debates", "Book Club", "Magazine Publication"] },
          { name: "Science Society", desc: "Promotes scientific thinking through experiments, science fairs, exhibitions, and guest lectures by renowned scientists.", activities: ["Annual Science Fair", "Lab Demonstrations", "Research Projects", "Quiz Competitions"] },
          { name: "Debating Club", desc: "Develops public speaking and critical thinking skills through regular debate sessions on current affairs and social issues.", activities: ["Weekly Debates", "MUN Participation", "Public Speaking Workshops", "Inter-College Competitions"] },
          { name: "Sports Club", desc: "Coordinates sports activities, training sessions, and represents college in inter-college tournaments across Punjab.", activities: ["Daily Practice Sessions", "Tournament Participation", "Sports Training Camps", "Fitness Programs"] },
          { name: "Community Service Society", desc: "Engages students in social welfare activities, charity drives, and community development initiatives.", activities: ["Blood Donation Camps", "Tree Plantation Drives", "Charity Collections", "Orphanage Visits"] },
          { name: "Islamic Society", desc: "Organizes religious activities, Quranic studies, lectures on Islamic history and values, and Ramadan programs.", activities: ["Quran Classes", "Islamic Lectures", "Ramadan Activities", "Naat Competitions"] }
        ],
        culturalEvents: [
          { event: "Pakistan Day Celebration", date: "March 23", desc: "Flag hoisting, speeches, and cultural performances celebrating Pakistan's history" },
          { event: "Independence Day", date: "August 14", desc: "Patriotic celebrations with flag ceremony, tableaux, and national songs" },
          { event: "Iqbal Day", date: "November 9", desc: "Poetry recitations, speeches on Allama Iqbal's philosophy and vision" },
          { event: "Kashmir Solidarity Day", date: "February 5", desc: "Awareness sessions and solidarity rallies supporting Kashmir cause" },
          { event: "Defence Day", date: "September 6", desc: "Tribute to armed forces with speeches and documentary screenings" },
          { event: "Quaid-e-Azam Day", date: "December 25", desc: "Celebrating founder's birthday with speeches and essay competitions" }
        ],
        studentCouncil: {
          year: "2026",
          members: [
            { position: "President", name: "Ali Hassan", program: "FSc Pre-Engineering" },
            { position: "Vice President", name: "Ayesha Malik", program: "FSc Pre-Medical" },
            { position: "General Secretary", name: "Usman Tariq", program: "ICS" },
            { position: "Sports Secretary", name: "Ahmed Raza", program: "ADP Science" }
          ]
        }
      };
      updated = true;
    }
    
    if (!settings.requiredDocuments || settings.requiredDocuments.length === 0) {
      settings.requiredDocuments = [
        "Matric/Intermediate Certificate & Mark Sheets (Original + 2 Copies)",
        "CNIC or B-Form (Original + 2 Copies)",
        "Domicile Certificate",
        "4 Recent Passport-size Photographs",
        "Character Certificate from Previous Institution",
        "Migration Certificate (if from another board)"
      ];
      updated = true;
    }

    if (!settings.academicCalendar) {
      settings.academicCalendar = {
        firstYear: [
          { event: "Admissions Open", date: "July 1 - August 15" },
          { event: "Classes Begin", date: "September 1" },
          { event: "Mid-Term Exams", date: "November 15-30" },
          { event: "Winter Break", date: "December 20 - January 5" },
          { event: "Final Exams", date: "March 1-20" },
          { event: "Summer Vacation", date: "June 15 - August 31" }
        ],
        secondYear: [
          { event: "Classes Resume", date: "September 1" },
          { event: "Pre-Board Exams", date: "January 15 - February 5" },
          { event: "Annual Exams (BISE)", date: "April 20 - May 20" },
          { event: "Result Declaration", date: "August 15" },
          { event: "Convocation", date: "September 15" }
        ]
      };
      updated = true;
    }

    if (!settings.libraryStats) {
      settings.libraryStats = {
        totalBooks: "15,000+",
        journals: "50+",
        newspapers: "8",
        digitalResources: "Available",
        seatingCapacity: "200"
      };
      updated = true;
    }

    if (!settings.aboutHistory || settings.aboutHistory.length === 0) {
      settings.aboutHistory = [
        { year: "1981", title: "Foundation", description: "Government Associate College, Data Nagar was established by the Government of Punjab to provide quality intermediate education to the youth of the region." },
        { year: "1995", title: "Expansion", description: "Introduction of Associate Degree Programs (ADP) in multiple disciplines, expanding educational opportunities for students." },
        { year: "2010", title: "Modernization", description: "Comprehensive upgrade of laboratory facilities and introduction of modern computer labs with latest technology." },
        { year: "2026", title: "Present Day", description: "Today, GAC Data Nagar stands as a leading public-sector college with over 3,500 students and a legacy of academic excellence spanning 45 years." }
      ];
      updated = true;
    }
    if (!settings.aboutVision) {
      settings.aboutVision = "To be a center of academic excellence that empowers students with knowledge, skills, and ethical values, preparing them to become responsible citizens and future leaders who contribute meaningfully to the nation's development and progress.";
      updated = true;
    }
    if (!settings.aboutMission || settings.aboutMission.length === 0) {
      settings.aboutMission = [
        "Provide quality education accessible to all segments of society",
        "Foster critical thinking and innovation among students",
        "Develop character and ethical values alongside academics",
        "Promote research and scholarly activities"
      ];
      updated = true;
    }
    if (!settings.principalTitle) { settings.principalTitle = "Ph.D. in Education Management"; updated = true; }
    if (!settings.principalExperience) { settings.principalExperience = "30+ Years in Academia"; updated = true; }
    if (!settings.principalFullMessage) {
      settings.principalFullMessage = "Dear Students, Parents, and Well-wishers,\n\nIt gives me immense pleasure to welcome you to Government Associate College, Data Nagar. As we complete 45 years of service to education, I am proud to lead an institution that has consistently maintained the highest standards of academic excellence and moral values.\n\nEducation is not merely about acquiring knowledge from textbooks; it is about character building, developing critical thinking, and preparing young minds to face the challenges of the modern world. At GAC Data Nagar, we are committed to nurturing well-rounded individuals who excel not only academically but also in extracurricular activities and community service.\n\nOur dedicated faculty members, modern infrastructure, and comprehensive curriculum ensure that every student receives individual attention and the best possible education. We take pride in our state-of-the-art laboratories, extensive library, and sports facilities that provide students with opportunities for holistic development.\n\nI encourage all our students to make the most of the opportunities available to them, maintain discipline, work hard, and aspire to become responsible citizens of Pakistan. Together, we can build a brighter future for our nation.\n\nWith best wishes for your success,\nProf. Dr. Farzana Ashfaq\nPrincipal";
      updated = true;
    }
    if (!settings.achievements || settings.achievements.length === 0) {
      settings.achievements = [
        { title: "98% Success Rate", description: "Consistent excellent results in board examinations" },
        { title: "50+ Position Holders", description: "Students securing top positions in BISE annually" },
        { title: "National Champions", description: "Multiple sports championships at provincial level" },
        { title: "Research Excellence", description: "Published research papers by faculty members" },
        { title: "Community Service", description: "Active participation in social welfare programs" },
        { title: "HEC Recognition", description: "Recognized by Higher Education Commission" }
      ];
      updated = true;
    }
    if (!settings.infrastructureCampus || settings.infrastructureCampus.length === 0) {
      settings.infrastructureCampus = ["15 acres campus area", "45 well-equipped classrooms", "4 specialized science laboratories", "Modern computer lab with 60 systems", "Library with 15,000+ books"];
      updated = true;
    }
    if (!settings.infrastructureSupport || settings.infrastructureSupport.length === 0) {
      settings.infrastructureSupport = ["Air-conditioned seminar hall (capacity 500)", "Sports complex with indoor/outdoor facilities", "Spacious parking area", "Canteen with hygienic food options", "24/7 security and CCTV surveillance"];
      updated = true;
    }
    if (!settings.totalVisitors) { settings.totalVisitors = 125847; updated = true; }
    if (!settings.collegeName) { settings.collegeName = "Govt. Associate College"; updated = true; }
    if (!settings.collegeLocation) { settings.collegeLocation = "Data Nagar, Lahore"; updated = true; }
    if (!settings.collegeEstYear) { settings.collegeEstYear = "1981"; updated = true; }
    if (!settings.collegeShortHistory) { settings.collegeShortHistory = "Established in 1981, GAC Data Nagar has been a beacon of quality education and academic excellence in Punjab for over four decades."; updated = true; }
    if (!settings.homeStats || settings.homeStats.length === 0) {
      settings.homeStats = [
        { icon: "Users", value: "3,500+", label: "Enrolled Students" },
        { icon: "BookOpen", value: "8", label: "Programs Offered" },
        { icon: "GraduationCap", value: "120+", label: "Qualified Faculty" },
        { icon: "Award", value: "45+", label: "Years of Excellence" }
      ];
      updated = true;
    }
    if (!settings.homeFeatures || settings.homeFeatures.length === 0) {
      settings.homeFeatures = [
        { icon: "GraduationCap", title: "Expert Faculty", desc: "Highly qualified professors with decades of teaching experience." },
        { icon: "BookOpen", title: "Modern Labs", desc: "State-of-the-art science, computer, and language laboratories." },
        { icon: "Users", title: "Sports Facilities", desc: "Cricket, football, volleyball, and indoor games courts." },
        { icon: "Award", title: "Scholarships", desc: "Merit-based and need-based financial assistance programs." },
        { icon: "Shield", title: "Safe Campus", desc: "Secure, monitored campus with female-only sections." },
        { icon: "Clock", title: "Regular Classes", desc: "Consistent academic schedule with tutorial & extra coaching." }
      ];
      updated = true;
    }

    if (updated) await settings.save();

    res.json({...settings.toObject(), id: settings._id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment visitor counter
router.post('/visit', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await new Settings().save();
    }
    settings.totalVisitors = (settings.totalVisitors || 0) + 1;
    await settings.save();
    res.json({ totalVisitors: settings.totalVisitors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
      await settings.save();
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({...settings.toObject(), id: settings._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
