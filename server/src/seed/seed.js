require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const PointOfInterest = require("../models/PointOfInterest");
const BusRoute = require("../models/BusRoute");
const Event = require("../models/Event");
const QueryLog = require("../models/QueryLog");

async function seed() {
  await connectDB();

  await Promise.all([
    Department.deleteMany({}),
    Faculty.deleteMany({}),
    PointOfInterest.deleteMany({}),
    BusRoute.deleteMany({}),
    Event.deleteMany({}),
    QueryLog.deleteMany({}),
  ]);

  const departments = await Department.insertMany([
    {
      name: "Computer Science & Engineering",
      code: "CSE",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      hod: "Dr. Tirukoti Sudha Rani",
      labs: [
        "Database Management Systems Lab",
        "Computer Networks Lab",
        "Software Engineering Lab",
        "Operating Systems Lab",
      ],
      contactEmail: "cse@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Information Technology",
      code: "IT",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      hod: "Dr. Makineedi Raja Babu",
      labs: ["Web Technologies Lab", "Cloud Computing Lab", "Data Structures Lab"],
      contactEmail: "it@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Artificial Intelligence & Machine Learning",
      code: "AIML",
      block: "James Watt Bhavan",
      floor: "Ground Floor",
      hod: "Dr. Kovvuri N Bhargavi",
      labs: ["AI Lab", "Machine Learning Lab", "Deep Learning Lab"],
      contactEmail: "aiml@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Artificial Intelligence & Data Science",
      code: "AI&DS",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      hod: "Dr. K. Sridevi",
      labs: ["Data Science Lab", "Big Data Analytics Lab", "AI & Robotics Lab"],
      contactEmail: "aids@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Electronics & Communication Engineering",
      code: "ECE",
      block: "Visvesvaraya Bhavan",
      floor: "Ground Floor",
      hod: "Dr. A Vanathi",
      labs: ["VLSI Design Lab", "Embedded Systems Lab", "Signals & Systems Lab", "RF & Microwave Lab"],
      contactEmail: "ece@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Electrical & Electronics Engineering",
      code: "EEE",
      block: "C.V. Raman Bhavan",
      floor: "1st Floor",
      hod: "Dr. S. H. V. S. Prasad",
      labs: ["Electrical Machines Lab", "Power Systems Lab", "Control Systems Lab"],
      contactEmail: "eee@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Mechanical Engineering",
      code: "ME",
      block: "C.V. Raman Bhavan",
      floor: "Ground Floor",
      hod: "Dr. G. Sanjeev Rao",
      labs: ["Thermal Engineering Lab", "CAD/CAM Lab", "Fluid Mechanics Lab", "Workshop"],
      contactEmail: "me@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Civil Engineering",
      code: "CE",
      block: "C.V. Raman Bhavan",
      floor: "2nd Floor",
      hod: "Dr. P. N. V. L. Prasad",
      labs: ["Concrete Tech Lab", "Surveying Lab", "Geotech Lab", "Environmental Lab"],
      contactEmail: "ce@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Mining Engineering",
      code: "MIN",
      block: "Cotton Bhavan",
      floor: "Ground Floor",
      hod: "Dr. B. Ravi Kumar",
      labs: ["Mine Surveying Lab", "Mining Machinery Lab", "Rock Mechanics Lab"],
      contactEmail: "mining@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Petroleum Technology",
      code: "PET",
      block: "Ratan Tata Bhavan",
      floor: "1st Floor",
      hod: "Dr. M. V. Rao",
      labs: ["Drilling Fluids Lab", "Petroleum Reservoir Lab", "Production Operations Lab"],
      contactEmail: "petroleum@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Agricultural Engineering",
      code: "AG",
      block: "Cotton Bhavan",
      floor: "1st Floor",
      hod: "Dr. Bellum Ramamohan Reddy",
      labs: ["Soil Science Lab", "Farm Machinery Lab", "Irrigation Engineering Lab"],
      contactEmail: "agri@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Computer Applications (BCA)",
      code: "BCA",
      block: "Bill Gates Bhavan",
      floor: "Ground Floor",
      hod: "Dr. P. Bala Krishna",
      labs: ["Programming Lab", "Web Development Lab"],
      contactEmail: "bca@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Computer Applications (MCA)",
      code: "MCA",
      block: "Aditya Degree & PG College",
      floor: "Ground Floor",
      hod: "Dr. M. Venkateswara Rajesh",
      labs: ["Programming Lab", "Placement Practice Lab"],
      contactEmail: "mca@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "Business Administration",
      code: "MBA",
      block: "Aditya Degree & PG College",
      floor: "1st Floor",
      hod: "Dr. Sowjanya Bagadi",
      labs: ["Business Analytics Lab", "Case Study Room"],
      contactEmail: "mba@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "School of Sciences",
      code: "SCI",
      block: "Aditya Degree & PG College",
      floor: "2nd Floor",
      hod: "Mr. V. Anil Chavan",
      labs: ["Forensic Science Lab", "Cyber Security Lab", "Life Sciences Lab"],
      contactEmail: "sciences@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
    {
      name: "School of Pharmacy",
      code: "PHA",
      block: "Aditya Pharmacy College",
      floor: "Ground Floor",
      hod: "Dr. D. Sathis Kumar",
      labs: ["Pharmaceutical Chemistry Lab", "Pharmacognosy Lab", "Pharmacology Lab"],
      contactEmail: "pharmacy@adityauniversity.in",
      officeHours: "9:00 AM - 6:00 PM",
    },
  ]);

  const ENRICHED_FACULTY = [
    // ── CSE (Ramanujan Bhavan) ──────────────────────────────────────────────
    {
      name: "Dr. Sripada Rama Sree",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Pro Vice-Chancellor (Academics)",
      cabin: "R101",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "sripadaramasree@adityauniversity.in",
      subjects: ["Computer Architecture", "Advanced Algorithms"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM"],
    },
    {
      name: "Dr. Vinjamuri Venkata Kamesh",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Professor",
      cabin: "R201",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "vkvkamesh@adityauniversity.in",
      subjects: ["Data Structures", "Operating Systems"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM", "3:00-4:00 PM"],
    },
    {
      name: "Dr. Regella Venkata Satya Lalitha",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Professor",
      cabin: "R203",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "rvsalalitha@adityauniversity.in",
      subjects: ["Database Management Systems", "Data Mining"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Dr. Tirukoti Sudha Rani",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor & HOD, CSE",
      cabin: "R205",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "tirukotisudharani@adityauniversity.in",
      subjects: ["Compiler Design", "Formal Languages"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM", "4:00-5:00 PM"],
    },
    {
      name: "Dr. Tatapudi Prabhakara Rao",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Associate Professor",
      cabin: "R207",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "tpabhakararao@adityauniversity.in",
      subjects: ["Software Engineering", "Web Technologies"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM", "2:00-3:00 PM"],
    },
    {
      name: "Dr. Subba Rao Polamuri",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Associate Professor",
      cabin: "R209",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "subbarao@adityauniversity.in",
      subjects: ["Computer Networks", "Network Security"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Dr. Phani Sridhar Addepalli",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor & HOD",
      cabin: "R211",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "phanisridhar@adityauniversity.in",
      subjects: ["Machine Learning", "Artificial Intelligence"],
      onLeave: false,
      availableSlots: ["9:00-10:00 AM", "3:00-4:00 PM"],
    },
    {
      name: "Dr. Chandra Sekhar Kolli",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Associate Professor",
      cabin: "R213",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "chandrasekharkolli@adityauniversity.in",
      subjects: ["Cloud Computing", "Virtualization"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Dr. M V B Murali Krishna M",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R215",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "muralikrishna@adityauniversity.in",
      subjects: ["Computer Organization", "Embedded Systems"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM", "2:00-3:00 PM"],
    },
    {
      name: "Dr. Pennada Siva Satya Prasad",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R217",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "pennadasivasatya@adityauniversity.in",
      subjects: ["Blockchain Technology", "Cryptography"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Mr. Gandhikota Umamahesh",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R219",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "gandikotaumamahesh@adityauniversity.in",
      subjects: ["Operating Systems", "Linux Administration"],
      onLeave: false,
      availableSlots: ["9:00-10:00 AM", "3:00-4:00 PM"],
    },
    {
      name: "Mr. Ramesh Kothapalli",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R221",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "rameshkothapalli@adityauniversity.in",
      subjects: ["Data Structures", "Algorithm Design"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Ms. Kasichainula Vydehi",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R223",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "kasichainulavydehi@adityauniversity.in",
      subjects: ["Database Management Systems", "Python Programming"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Ms. Rananki Padma Sri",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R225",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "ranankipadmasri@adityauniversity.in",
      subjects: ["Computer Networks", "Network Programming"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM"],
    },
    {
      name: "Dr. N Visalakshi",
      departmentId: departments[0]._id,
      departmentName: "CSE",
      designation: "Assistant Professor",
      cabin: "R227",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      email: "visalakshi@adityauniversity.in",
      subjects: ["Machine Learning", "Data Analytics"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    // ── IT (Newton Bhavan) ────────────────────────────────────────────────────
    {
      name: "Dr. Makineedi Raja Babu",
      departmentId: departments[1]._id,
      departmentName: "IT",
      designation: "Associate Professor & HOD, IT",
      cabin: "NW301",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      email: "makineedirajababu@adityauniversity.in",
      subjects: ["Cloud Computing", "Software Architecture"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM", "3:00-4:00 PM"],
    },
    {
      name: "Dr. Itha Veeranjaneyulu",
      departmentId: departments[1]._id,
      departmentName: "IT",
      designation: "Associate Professor",
      cabin: "NW303",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      email: "ivaranjaneyulu@adityauniversity.in",
      subjects: ["Data Science", "Big Data Analytics"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Dr. Annemneedi Lakshmana Rao",
      departmentId: departments[1]._id,
      departmentName: "IT",
      designation: "Associate Professor",
      cabin: "NW305",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      email: "annemneedilakshmanarao@adityauniversity.in",
      subjects: ["Web Technologies", "Internet of Things"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Mr. Antharaju K Chakravarthy",
      departmentId: departments[1]._id,
      departmentName: "IT",
      designation: "Assistant Professor",
      cabin: "NW307",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      email: "antharajuchakravarthy@adityauniversity.in",
      subjects: ["Cyber Security", "Network Administration"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM"],
    },
    {
      name: "Ms. Pediredla Srilatha",
      departmentId: departments[1]._id,
      departmentName: "IT",
      designation: "Assistant Professor",
      cabin: "NW309",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      email: "pediredlasrilatha@adityauniversity.in",
      subjects: ["Cloud Computing", "DevOps"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Mr. Soloman Raju Cherukuri",
      departmentId: departments[1]._id,
      departmentName: "IT",
      designation: "Assistant Professor",
      cabin: "NW311",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      email: "solomanrajucherukuri@adityauniversity.in",
      subjects: ["Data Structures", "Java Programming"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    // ── AIML (James Watt Bhavan) ─────────────────────────────────────────────
    {
      name: "Dr. Kovvuri N Bhargavi",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Associate Professor & HOD, AIML",
      cabin: "JW301",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "kovvuribhargavi@adityauniversity.in",
      subjects: ["Deep Learning", "Natural Language Processing"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM", "4:00-5:00 PM"],
    },
    {
      name: "Dr. Mangalapalli Vamsikrishna",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Professor",
      cabin: "JW303",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "mangalapallivamsikrishna@adityauniversity.in",
      subjects: ["Artificial Intelligence", "Expert Systems"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Dr. Maganti Venkatesh",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Associate Professor",
      cabin: "JW305",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "magantivenkatesh@adityauniversity.in",
      subjects: ["Machine Learning", "Reinforcement Learning"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM", "2:00-3:00 PM"],
    },
    {
      name: "Dr. Bollu Manikyala Rao",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Associate Professor",
      cabin: "JW307",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "bollumanikyalarao@adityauniversity.in",
      subjects: ["Computer Vision", "Image Processing"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Dr. Kaladi Govindaraju",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Assistant Professor",
      cabin: "JW309",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "kaladigovindaraju@adityauniversity.in",
      subjects: ["Data Mining", "Statistical Learning"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Dr. Suneetha Racharla",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Assistant Professor",
      cabin: "JW311",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "suneetharacharla@adityauniversity.in",
      subjects: ["Deep Learning", "Generative AI"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM"],
    },
    {
      name: "Dr. Raviteja Vinjamuri",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Assistant Professor",
      cabin: "JW313",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "ravitejavinjamuri@adityauniversity.in",
      subjects: ["Machine Learning", "Pattern Recognition"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM", "3:00-4:00 PM"],
    },
    {
      name: "Ms. Nalla Akhila",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Assistant Professor",
      cabin: "JW315",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "nallaakhila@adityauniversity.in",
      subjects: ["Natural Language Processing", "Computer Vision"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Ms. Alamanda Sophia",
      departmentId: departments[2]._id,
      departmentName: "AIML",
      designation: "Assistant Professor",
      cabin: "JW317",
      block: "James Watt Bhavan",
      floor: "1st Floor",
      email: "alamandasophia@adityauniversity.in",
      subjects: ["Data Science", "R Programming"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    // ── ECE (Visvesvaraya Bhavan) ────────────────────────────────────────────
    {
      name: "Dr. A Vanathi",
      departmentId: departments[4]._id,
      departmentName: "ECE",
      designation: "Associate Professor & Associate Dean, Freshman Engineering",
      cabin: "V102",
      block: "Visvesvaraya Bhavan",
      floor: "Ground Floor",
      email: "avanathi@adityauniversity.in",
      subjects: ["Basic Electronics", "Digital Signal Processing"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM"],
    },
    // ── CE (Civil Engineering) ──────────────────────────────────────────────
    {
      name: "Dr. Bellum Ramamohan Reddy",
      departmentId: departments[10]._id,
      departmentName: "AG",
      designation: "Assistant Professor & HOD, Agricultural Engineering",
      cabin: "CT201",
      block: "Cotton Bhavan",
      floor: "1st Floor",
      email: "bellumramamohanreddy@adityauniversity.in",
      subjects: ["Farm Machinery", "Soil Science"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Dr. S Govindarajan",
      departmentId: departments[10]._id,
      departmentName: "AG",
      designation: "Associate Professor",
      cabin: "CT203",
      block: "Cotton Bhavan",
      floor: "1st Floor",
      email: "sgovindarajan@adityauniversity.in",
      subjects: ["Irrigation Engineering", "Water Resources"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    {
      name: "Dr. Pasupuleti Laxmi Narayana",
      departmentId: departments[7]._id,
      departmentName: "CE",
      designation: "Assistant Professor",
      cabin: "KLR101",
      block: "K.L. Rao Bhavan",
      floor: "Proposed",
      email: "pasupuletiraxminarayana@adityauniversity.in",
      subjects: ["Structural Analysis", "Concrete Technology"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
    {
      name: "Dr. Talapareddy Suman Kumar",
      departmentId: departments[7]._id,
      departmentName: "CE",
      designation: "Assistant Professor",
      cabin: "KLR103",
      block: "K.L. Rao Bhavan",
      floor: "Proposed",
      email: "talapareddysumankumar@adityauniversity.in",
      subjects: ["Surveying", "Transportation Engineering"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM"],
    },
    {
      name: "Dr. Ch Naga Dheeraj Kumar Reddy",
      departmentId: departments[7]._id,
      departmentName: "CE",
      designation: "Assistant Professor",
      cabin: "KLR105",
      block: "K.L. Rao Bhavan",
      floor: "Proposed",
      email: "chnagadheeraj@adityauniversity.in",
      subjects: ["Geotechnical Engineering", "Foundation Design"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    // ── MCA (Aditya Degree & PG College) ────────────────────────────────────
    {
      name: "Dr. M. Venkata Rajesh",
      departmentId: departments[12]._id,
      departmentName: "MCA",
      designation: "Associate Professor & Associate Dean, School of Computing",
      cabin: "DGC101",
      block: "Aditya Degree & PG College",
      floor: "Ground Floor",
      email: "mvankatarajesh@adityauniversity.in",
      subjects: ["Data Structures", "Algorithms"],
      onLeave: false,
      availableSlots: ["11:00 AM-12:00 PM"],
    },
    // ── SCI (School of Sciences) ─────────────────────────────────────────────
    {
      name: "Mr. Vilas Anil Chavan",
      departmentId: departments[14]._id,
      departmentName: "SCI",
      designation: "Associate Professor & Associate Dean, School of Sciences",
      cabin: "DGC302",
      block: "Aditya Degree & PG College",
      floor: "2nd Floor",
      email: "vilasanilchavan@adityauniversity.in",
      subjects: ["Cyber Security", "Forensic Science"],
      onLeave: false,
      availableSlots: ["10:00-11:00 AM"],
    },
  ];

  // ── Master faculty table (Aditya Surampalem) ──────────────────────────────
  // The full 243-record roster from the college's master table. Enriched records
  // above (with cabins, blocks, floors, subjects) are overlaid on top by name.
  const FACULTY_MASTER = require("./facultyMasterData");

  // Master-table departments map onto the seeded departments where a clean match
  // exists. Groupings ("School of Engineering", etc.) and admin units stay as-is.
  const MASTER_DEPT_INDEX = {
    "Civil Engineering": 7, // CE
    "Mechanical Engineering": 6, // ME
    "Computer Science & Engineering": 0, // CSE
    "Artificial Intelligence & Machine Learning": 2, // AIML
    "Agricultural Engineering": 10, // AG
  };
  const MASTER_ADMIN = new Set([
    "University Administration",
    "Examinations",
    "Research & Consultancy",
    "International Relations",
    "Student Welfare",
    "IQAC",
    "Academics",
    "Student Affairs",
    "Campus Life Management",
    "Admissions",
    "Career Development",
    "Aditya University",
  ]);

  const enrichedByName = new Map(
    ENRICHED_FACULTY.map((f) => [f.name.trim().toLowerCase(), f])
  );

  // Alias the pre-existing "Dr. M. Venkata Rajesh" to its master ID row (F171).
  const NAME_ALIASES = {
    "dr. m. venkata rajesh": "Dr. Masina Venkata Rajesh",
  };

  const usedEmails = new Set(
    ENRICHED_FACULTY.map((f) => f.email).filter(Boolean).map((e) => e.toLowerCase())
  );

  const slugFor = (name) =>
    name
      .replace(/\b(Dr|Mr|Ms|Mrs|Smt|Sri|Prof|Dr\.?\.?)\b\.?/gi, "")
      .replace(/[^A-Za-z ]+/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  const buildEmail = (name) => {
    let slug = slugFor(name) || "faculty";
    let email = `${slug}@adityauniversity.in`;
    let n = 2;
    while (usedEmails.has(email.toLowerCase())) {
      email = `${slug}${n}@adityauniversity.in`;
      n += 1;
    }
    usedEmails.add(email.toLowerCase());
    return email;
  };

  const facultyRows = FACULTY_MASTER.map((m) => {
    const key = m.name.trim().toLowerCase();
    const aliasKey = Object.keys(NAME_ALIASES).find((k) => {
      const target = NAME_ALIASES[k].trim().toLowerCase();
      return key === k || key === target;
    });
    const enriched = enrichedByName.get(aliasKey || key);

    let departmentId;
    let departmentName;
    if (MASTER_ADMIN.has(m.department)) {
      departmentId = null;
      departmentName = "University Administration";
    } else if (MASTER_DEPT_INDEX[m.department] !== undefined) {
      departmentId = departments[MASTER_DEPT_INDEX[m.department]]._id;
      departmentName = departments[MASTER_DEPT_INDEX[m.department]].code; // e.g. "CSE"
    } else {
      departmentId = null;
      departmentName = m.department; // grouping like "School of Engineering"
    }

    const row = {
      name: m.name,
      departmentId,
      departmentName,
      designation: m.role,
      onLeave: false,
      availableSlots: [],
    };

    if (enriched) {
      // Keep the richer details (cabin, block, floor, email, subjects, timetable
      // hooks) while preserving the master table's department/designation.
      Object.assign(row, enriched);
      if (enriched.email) usedEmails.add(enriched.email.toLowerCase());
    } else {
      row.email = buildEmail(m.name);
    }
    return row;
  });

  // Any enriched record that is not represented in the master table stays as-is.
  const masterKeys = new Set(
    FACULTY_MASTER.map((m) => m.name.trim().toLowerCase())
  );
  for (const name in NAME_ALIASES) masterKeys.add(name);
  for (const f of ENRICHED_FACULTY) {
    const k = f.name.trim().toLowerCase();
    if (!masterKeys.has(k)) facultyRows.push(f);
  }

  await Faculty.insertMany(facultyRows);

  // Faculty self-service login: every seeded faculty logs in with their email
  // and this shared demo password. Some also get a timetable so the free-time
  // detection has real data to derive from.
  const FAC_PASSWORD = "faculty123";

  const sampleTimetables = {
    "tirukotisudharani@adityauniversity.in": {
      Monday: [
        { start: "09:00", end: "10:00", subject: "Compiler Design", room: "R201" },
        { start: "10:00", end: "11:00", subject: "Formal Languages", room: "R203" },
      ],
      Tuesday: [
        { start: "09:00", end: "10:00", subject: "Compiler Design", room: "R205" },
        { start: "11:00", end: "12:00", subject: "Compiler Design Lab", room: "CSE Lab" },
      ],
      Wednesday: [{ start: "09:00", end: "10:00", subject: "Formal Languages", room: "R201" }],
      Thursday: [{ start: "10:00", end: "11:00", subject: "Compiler Design", room: "R205" }],
      Friday: [{ start: "09:00", end: "10:00", subject: "Formal Languages", room: "R203" }],
    },
    "makineedirajababu@adityauniversity.in": {
      Monday: [
        { start: "10:00", end: "11:00", subject: "Cloud Computing", room: "NW201" },
        { start: "11:00", end: "12:00", subject: "Cloud Lab", room: "Cloud Lab" },
      ],
      Tuesday: [{ start: "09:00", end: "10:00", subject: "Software Architecture", room: "NW203" }],
      Wednesday: [{ start: "10:00", end: "11:00", subject: "Cloud Computing", room: "NW201" }],
      Thursday: [{ start: "11:00", end: "12:00", subject: "Software Architecture", room: "NW203" }],
      Friday: [{ start: "10:00", end: "11:00", subject: "Cloud Computing", room: "NW201" }],
    },
    "kovvuribhargavi@adityauniversity.in": {
      Monday: [
        { start: "09:00", end: "10:00", subject: "Deep Learning", room: "JW101" },
        { start: "10:00", end: "11:00", subject: "NLP", room: "JW103" },
      ],
      Tuesday: [
        { start: "09:00", end: "10:00", subject: "Deep Learning", room: "JW201" },
        { start: "14:00", end: "15:00", subject: "DL Lab", room: "AIML Lab" },
      ],
      Wednesday: [{ start: "10:00", end: "11:00", subject: "NLP", room: "JW101" }],
      Thursday: [{ start: "11:00", end: "12:00", subject: "Deep Learning Lab", room: "AIML Lab" }],
      Friday: [{ start: "09:00", end: "10:00", subject: "Deep Learning", room: "JW101" }],
    },
    "vkvkamesh@adityauniversity.in": {
      Monday: [
        { start: "09:00", end: "10:00", subject: "Data Structures", room: "R101" },
        { start: "10:00", end: "11:00", subject: "Operating Systems", room: "R103" },
      ],
      Tuesday: [{ start: "09:00", end: "10:00", subject: "Data Structures", room: "R105" }],
      Wednesday: [{ start: "10:00", end: "11:00", subject: "Operating Systems", room: "R103" }],
      Thursday: [{ start: "11:00", end: "12:00", subject: "OS Lab", room: "OS Lab" }],
      Friday: [{ start: "09:00", end: "10:00", subject: "Data Structures", room: "R101" }],
    },
  };

  const facultyDocs = await Faculty.find({});
  for (const f of facultyDocs) {
    f.passwordHash = bcrypt.hashSync(FAC_PASSWORD, 10);
    const tt = sampleTimetables[f.email];
    if (tt) f.timetable = tt;
    f.refreshAvailability();
    await f.save();
  }

  await PointOfInterest.insertMany([
    {
      type: "block",
      name: "Visvesvaraya Bhavan",
      block: "Visvesvaraya Bhavan",
      floor: "Ground Floor",
      latitude: 17.0895,
      longitude: 82.0668,
      openHours: "9:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "ACET (Aditya College of Engineering & Technology) administrative building housing the B.Tech ECE department along with college administration, examination cell, admissions and transport office. Allocation: Verified department building.",
      allocation: {
        institution: "ACET",
        branches: ["B.Tech ECE", "Administration", "Examination", "Admissions", "Transport Office"],
        years: "B.Tech 1st-4th",
        status: "Verified department building",
      },
    },
    {
      type: "block",
      name: "Ramanujan Bhavan",
      block: "Ramanujan Bhavan",
      floor: "1st Floor",
      latitude: 17.0898,
      longitude: 82.0670,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "ACET academic building hosting B.Tech Computer Science & Engineering (1st - 4th year) with classrooms and programming labs. Allocation: Verified.",
      allocation: {
        institution: "ACET",
        branches: ["B.Tech CSE"],
        years: "B.Tech 1st-4th",
        status: "Verified",
      },
    },
    {
      type: "block",
      name: "Newton Bhavan",
      block: "Newton Bhavan",
      floor: "2nd Floor",
      latitude: 17.0897,
      longitude: 82.0671,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "ACET academic building hosting B.Tech Information Technology (1st - 4th year) with web, cloud and data structures labs. Allocation: Verified.",
      allocation: {
        institution: "ACET",
        branches: ["B.Tech IT"],
        years: "B.Tech 1st-4th",
        status: "Verified",
      },
    },
    {
      type: "block",
      name: "James Watt Bhavan",
      block: "James Watt Bhavan",
      floor: "Ground + 1st Floor",
      latitude: 17.0900,
      longitude: 82.0672,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "ACET academic building hosting B.Tech Artificial Intelligence & Machine Learning, B.Tech Data Science and IoT-related programs with AI, ML and data science labs. Allocation: Verified grouping.",
      allocation: {
        institution: "ACET",
        branches: ["B.Tech AI & ML", "B.Tech Data Science", "IoT programs"],
        years: "B.Tech 1st-4th",
        status: "Verified grouping",
      },
    },
    {
      type: "block",
      name: "C.V. Raman Bhavan",
      block: "C.V. Raman Bhavan",
      floor: "Ground - 2nd Floor",
      latitude: 17.0894,
      longitude: 82.0674,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "ACET department building hosting B.Tech Electrical & Electronics Engineering, Mechanical Engineering and Civil Engineering (1st - 4th year) with workshop, CAD, concrete and power systems labs. Allocation: Verified department building.",
      allocation: {
        institution: "ACET",
        branches: ["B.Tech EEE", "B.Tech Mechanical", "B.Tech Civil"],
        years: "B.Tech 1st-4th",
        status: "Verified department building",
      },
    },
    {
      type: "block",
      name: "Cotton Bhavan",
      block: "Cotton Bhavan",
      floor: "Ground + 1st Floor",
      latitude: 17.0889,
      longitude: 82.0675,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Aditya University academic building planned for B.Tech Agricultural Engineering and B.Tech Mining Engineering (1st - 4th year). Allocation: Proposed.",
      allocation: {
        institution: "Aditya University",
        branches: ["B.Tech Agricultural Engineering", "B.Tech Mining Engineering"],
        years: "B.Tech 1st-4th",
        status: "Proposed",
      },
    },
    {
      type: "block",
      name: "Ratan Tata Bhavan",
      block: "Ratan Tata Bhavan",
      floor: "Ground + 1st Floor",
      latitude: 17.0891,
      longitude: 82.0672,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Aditya University academic building housing the first-year students of all departments. Allocation: Proposed.",
      allocation: {
        institution: "Aditya University",
        branches: ["First-year of all departments"],
        years: "1st Year",
        status: "Proposed",
      },
    },
    {
      type: "block",
      name: "Bill Gates Bhavan",
      block: "Bill Gates Bhavan",
      floor: "Ground Floor",
      latitude: 17.0899,
      longitude: 82.0662,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Aditya University academic building hosting the B.Tech Computer Science & Engineering department. Allocation: Proposed.",
      allocation: {
        institution: "Aditya University",
        branches: ["B.Tech CSE"],
        years: "B.Tech 1st-4th",
        status: "Proposed",
      },
    },
    {
      type: "block",
      name: "K.L. Rao Bhavan",
      block: "K.L. Rao Bhavan",
      floor: "Proposed",
      latitude: 17.0893,
      longitude: 82.0662,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Aditya University academic building planned for B.Tech Civil Engineering, M.Tech Structural Engineering and M.Sc Real Estate Valuation. Allocation: Proposed.",
      allocation: {
        institution: "Aditya University",
        branches: ["B.Tech Civil", "M.Tech Structural", "M.Sc Real Estate Valuation"],
        years: "B.Tech 1st-4th; PG 1st-2nd",
        status: "Proposed",
      },
    },
    {
      type: "block",
      name: "Bhaskara Bhavan",
      block: "Bhaskara Bhavan",
      floor: "UG 2nd - 4th Year",
      latitude: 17.0890,
      longitude: 82.0670,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Aditya University academic building housing the AIML department for 2nd to 4th year students. Allocation: Proposed.",
      allocation: {
        institution: "Aditya University",
        branches: ["B.Tech AI & ML"],
        years: "2nd-4th Year",
        status: "Proposed",
      },
    },
    {
      type: "block",
      name: "Aditya Degree & PG College",
      block: "Aditya Degree & PG College",
      floor: "Ground - 2nd Floor",
      latitude: 17.0899,
      longitude: 82.0666,
      openHours: "9:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Aditya Degree College, Surampalem campus hosting BBA, BBA Digital Marketing, B.Sc Forensic Science, B.Sc Animation, B.Sc Artificial Intelligence & Robotics, B.Sc Data Science and B.Sc Cyber Forensics along with MCA and MBA. Programs verified; exact room allocation is dynamic.",
      allocation: {
        institution: "Aditya Degree College, Surampalem",
        branches: ["BBA", "BBA Digital Marketing", "B.Sc Forensic Science", "B.Sc Animation", "B.Sc AI & Robotics", "B.Sc Data Science", "B.Sc Cyber Forensics", "MCA", "MBA"],
        years: "Degree 1st-3rd",
        status: "Programs verified; rooms dynamic",
      },
    },
    {
      type: "block",
      name: "Aditya Pharmacy College",
      block: "Aditya Pharmacy College",
      floor: "Ground Floor",
      latitude: 17.0901,
      longitude: 82.0665,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Pharmacy academic zone of Aditya University for B.Pharm (1st - 4th year) and Pharm.D (1st - 6th year) with chemistry, pharmacognosy and pharmacology labs. Program verified; building allocation proposed.",
      allocation: {
        institution: "Aditya University · Pharmacy zone",
        branches: ["B.Pharm", "Pharm.D"],
        years: "B.Pharm 1st-4th; Pharm.D 1st-6th",
        status: "Program verified; building proposed",
      },
    },
    {
      type: "block",
      name: "Aditya College of Pharmacy",
      block: "Aditya College of Pharmacy",
      floor: "1st - 2nd Year",
      latitude: 17.0902,
      longitude: 82.0663,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Postgraduate pharmacy college of Aditya University for M.Pharm Pharmaceutics and M.Pharm Pharmaceutical Analysis with advanced pharmacy labs and research activity. Program verified; building allocation proposed.",
      allocation: {
        institution: "Aditya University · Pharmacy zone",
        branches: ["M.Pharm Pharmaceutics", "M.Pharm Pharmaceutical Analysis"],
        years: "M.Pharm 1st-2nd; research",
        status: "Program verified; building proposed",
      },
    },
    {
      type: "block",
      name: "Abdul Kalam Bhavan",
      block: "Abdul Kalam Bhavan",
      floor: "Diploma 1st Year",
      latitude: 17.0902,
      longitude: 82.0671,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Aditya Polytechnic College building for polytechnic administration, examination cell and common first-year diploma classes. Allocation: Verified.",
      allocation: {
        institution: "Aditya Polytechnic College",
        branches: ["Polytechnic Administration", "Examination Cell", "Common 1st-year Diploma"],
        years: "Diploma 1st Year",
        status: "Verified",
      },
    },
    {
      type: "block",
      name: "Einstein Bhavan",
      block: "Einstein Bhavan",
      floor: "Diploma 2nd - 3rd Year",
      latitude: 17.0903,
      longitude: 82.0674,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Aditya Polytechnic College department building for Diploma Civil Engineering, Diploma Electrical / EEE, Diploma Computer Engineering / CSE and Diploma Communication & Computer Networking. Allocation: Verified departments.",
      allocation: {
        institution: "Aditya Polytechnic College",
        branches: ["Diploma Civil", "Diploma EEE", "Diploma CSE", "Diploma CCN"],
        years: "Diploma 2nd-3rd Year",
        status: "Verified departments",
      },
    },
    {
      type: "block",
      name: "Edison Bhavan",
      block: "Edison Bhavan",
      floor: "Diploma 2nd - 3rd Year",
      latitude: 17.0902,
      longitude: 82.0677,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Aditya Polytechnic College department building for Diploma Mechanical Engineering and Diploma ECE. Allocation: Verified.",
      allocation: {
        institution: "Aditya Polytechnic College",
        branches: ["Diploma Mechanical", "Diploma ECE"],
        years: "Diploma 2nd-3rd Year",
        status: "Verified",
      },
    },
    {
      type: "block",
      name: "Aditya Polytechnic College (Shared)",
      block: "Aditya Polytechnic College",
      floor: "Diploma 1st - 3rd Year",
      latitude: 17.0903,
      longitude: 82.0672,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Shared polytechnic facilities, laboratories, workshops and overflow classes for the diploma programs. Allocation: Proposed as shared facility.",
      allocation: {
        institution: "Aditya Polytechnic College",
        branches: ["Shared labs", "Workshops", "Overflow classes"],
        years: "Diploma 1st-3rd",
        status: "Proposed as shared facility",
      },
    },
    {
      type: "block",
      name: "Main Auditorium",
      block: "Visvesvaraya Bhavan",
      floor: "1st Floor",
      latitude: 17.0896,
      longitude: 82.0672,
      openHours: "Event hours",
      isOpenNow: false,
      description: "Conference hall for seminars, technical fests and cultural programs.",
    },
    {
      type: "library",
      name: "Knowledge Resource Centre (Central Library)",
      block: "Library Block",
      floor: "Ground + 1st Floor",
      latitude: 17.0897,
      longitude: 82.0668,
      openHours: "8:00 AM - 8:00 PM",
      isOpenNow: true,
      description:
        "Central library with reading rooms, reference section, e-journal access, and digital library. Open throughout the day for faculty and students.",
    },
    {
      type: "service",
      name: "Bank & ATM",
      block: "Visvesvaraya Bhavan",
      floor: "Ground Floor",
      latitude: 17.0894,
      longitude: 82.0667,
      openHours: "24 hours (ATM)",
      isOpenNow: true,
      description: "On-campus bank branch and 24x7 ATM for hostel students and staff.",
    },
    {
      type: "service",
      name: "Medical Centre",
      block: "Near K.L. Rao Bhavan",
      latitude: 17.0893,
      longitude: 82.0667,
      openHours: "24 hours",
      isOpenNow: true,
      description:
        "Round-the-clock medical centre with resident doctor, first aid and emergency ambulance facility.",
    },
    {
      type: "ground",
      name: "Sports Complex & Grounds",
      block: "East of C.V. Raman Bhavan",
      latitude: 17.0892,
      longitude: 82.0679,
      openHours: "6:00 AM - 8:00 PM",
      isOpenNow: true,
      description:
        "Cricket and football grounds, volleyball and basketball courts, indoor games room and gymnasium.",
      accessPolicy: {
        allowedRoles: ["student", "faculty"],
        restrictedRoles: [],
        startTime: "06:00",
        endTime: "20:00",
        note: "Sports facilities open to students and faculty from 6:00 AM to 8:00 PM; closed for booking by departments during events.",
      },
    },
    {
      type: "ground",
      name: "Transport Hub (Bus Bay)",
      block: "Main Gate",
      latitude: 17.0896,
      longitude: 82.0678,
      openHours: "5:00 AM - 9:00 PM",
      isOpenNow: true,
      description:
        "College bus boarding point. Buses connect Surampalem campus to Kakinada, Samalkot, Peddapuram and surrounding mandals.",
    },
    {
      type: "office",
      name: "Career Development Centre",
      block: "Visvesvaraya Bhavan",
      floor: "1st Floor",
      latitude: 17.0896,
      longitude: 82.0669,
      openHours: "9:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Placement training, aptitude coaching, internships, and on-campus recruitment cell.",
    },
    {
      type: "office",
      name: "Aditya Genesis Business Incubator (AGBI)",
      block: "Near Cotton Bhavan",
      latitude: 17.0891,
      longitude: 82.0677,
      openHours: "9:00 AM - 6:00 PM",
      isOpenNow: true,
      description:
        "Campus innovation facility for startup incubation, interdisciplinary projects, entrepreneurship programs and hackathons. Facility, not a single branch - open to students from all years and programs.",
    },
    {
      type: "office",
      name: "Centre for Technical Training",
      block: "Ramanujan Bhavan",
      floor: "2nd Floor",
      latitude: 17.0898,
      longitude: 82.0671,
      openHours: "10:00 AM - 5:00 PM",
      isOpenNow: true,
      description:
        "Skill development programmes, coding clubs and industry-oriented technical training (IGNITE, campus to corporate).",
    },
    {
      type: "hostel",
      name: "Boys Hostel",
      block: "Hostel Block A",
      latitude: 17.0900,
      longitude: 82.0680,
      openHours: "24 hours",
      isOpenNow: true,
      hostelType: "boys",
      warden: "Mr. V. V. S. Murthy",
      contact: "+91 98490 00121",
      totalRooms: 220,
      vacantRooms: 14,
    },
    {
      type: "hostel",
      name: "Girls Hostel",
      block: "Hostel Block B",
      latitude: 17.0902,
      longitude: 82.0678,
      openHours: "24 hours",
      isOpenNow: true,
      hostelType: "girls",
      warden: "Mrs. N. Padmavathi",
      contact: "+91 98490 00122",
      totalRooms: 260,
      vacantRooms: 9,
      accessPolicy: {
        allowedRoles: ["student", "faculty"],
        restrictedRoles: ["external"],
        startTime: "05:00",
        endTime: "22:00",
        note: "Girls hostel access for visitors is limited to 5:00 AM - 10:00 PM; hostellers have 24x7 access.",
      },
    },
  ]);

  // ── Food & campus shops (29 outlets from the master list) ─────────────────
  const FOOD_SHOPS = require("./foodAndShopsData");
  const AREA_ANCHORS = {
    "Main Campus": { lat: 17.0897, lng: 82.0672 },
    "Girls Hostel": { lat: 17.0901, lng: 82.0677 },
    "Boys Hostel": { lat: 17.0899, lng: 82.0680 },
    "Faculty Block": { lat: 17.0894, lng: 82.0669 },
  };
  const shopRows = FOOD_SHOPS.map((s, i) => {
    const anchor = AREA_ANCHORS[s.area] || { lat: 17.0897, lng: 82.0672 };
    const jitter = ((i % 3) - 1) * 0.00006;
    return {
      type: "shop",
      name: s.name,
      area: s.area,
      areaGroup: s.group || undefined,
      latitude: anchor.lat + jitter,
      longitude: anchor.lng + jitter,
      openHours: "8:00 AM - 9:00 PM",
      isOpenNow: true,
      items: s.items.map((it) => ({
        name: it.name,
        price: it.price,
        available: true,
      })),
    };
  });
  await PointOfInterest.insertMany(shopRows);

  const ENRICHED_BUS_ROUTES = [
    {
      routeNumber: "K-1",
      routeDescription: "Surampalem Campus -> Kakinada (via Chidambaranagar, Sarpavaram, Jagannaickpur)",
      stops: [
        { name: "Campus Gate", time: "6:45 AM" },
        { name: "Surampalem Junction", time: "6:50 AM" },
        { name: "Chidambaranagar", time: "7:05 AM" },
        { name: "Innespeta", time: "7:15 AM" },
        { name: "Sarpavaram", time: "7:25 AM" },
        { name: "Jagannaickpur", time: "7:35 AM" },
        { name: "Gandhinagar", time: "7:50 AM" },
      ],
      departureTime: "6:45 AM",
      returnTime: "5:30 PM",
      driverName: "Mr. P. Ramesh",
      driverContact: "+91 98490 00231",
      status: "On Route",
    },
    {
      routeNumber: "K-2",
      routeDescription: "Surampalem Campus -> Kakinada City (via Samalkot, Gollaprolu, Kondayyapalem)",
      stops: [
        { name: "Campus Gate", time: "7:00 AM" },
        { name: "Samalkot", time: "7:20 AM" },
        { name: "Gollaprolu", time: "7:35 AM" },
        { name: "Kondayyapalem", time: "7:50 AM" },
        { name: "Bhanugudi Junction", time: "8:00 AM" },
        { name: "Kakinada City", time: "8:10 AM" },
      ],
      departureTime: "7:00 AM",
      returnTime: "5:45 PM",
      driverName: "Mr. S. Krishna Murthy",
      driverContact: "+91 98490 00232",
      status: "Diesel Station",
    },
    {
      routeNumber: "P-3",
      routeDescription: "Surampalem Campus -> Peddapuram (via Rangampeta, Prathipadu)",
      stops: [
        { name: "Campus Gate", time: "7:10 AM" },
        { name: "Rangampeta", time: "7:30 AM" },
        { name: "Prathipadu", time: "7:45 AM" },
        { name: "Peddapuram", time: "8:05 AM" },
      ],
      departureTime: "7:10 AM",
      returnTime: "4:30 PM",
      driverName: "Mr. N. Suryanarayana",
      driverContact: "+91 98490 00233",
      status: "On Route",
    },
  ];

  // ── Bus master table (310 buses) ──────────────────────────────────────────
  // The college's full 310-bus roster. Hand-written demo routes above (with
  // stops & timings) are overlaid on top by matching routeNumber.
  const BUS_MASTER = require("./busDetailsData");
  const busByNumber = new Map(
    ENRICHED_BUS_ROUTES.map((b) => [b.routeNumber, b])
  );
  const busRows = BUS_MASTER.map((m) => {
    const row = {
      routeNumber: m.busNumber,
      routeDescription: m.route,
      driverName: m.driverName,
      driverContact: m.driverPhone,
      busType: m.busType,
      ground: m.ground,
      status: "On Route",
    };
    const enriched = busByNumber.get(m.busNumber);
    if (enriched) Object.assign(row, enriched);
    return row;
  });

  // Hand-written demo routes that don't exist in the master roster (they use
  // their own route numbers) stay in the list so stop/timing data is retained.
  for (const b of ENRICHED_BUS_ROUTES) {
    if (!BUS_MASTER.some((m) => m.busNumber === b.routeNumber)) busRows.push(b);
  }

  await BusRoute.insertMany(busRows);

  await Event.insertMany([
    {
      title: "IGNITE 2026 - Coder Dot. Connect",
      description:
        "The flagship technical skill-development program by the Centre for Technical Training. Daily coding challenges, hands-on sessions and mentor connect for all branches and years.",
      date: "2026-09-15",
      startTime: "10:00 AM",
      endTime: "4:00 PM",
      venue: "Centre for Technical Training, Ramanujan Bhavan",
      organizer: "Centre for Technical Training",
      department: "ALL",
      category: "Technical",
    },
    {
      title: "AP State-wide Quantum Awareness Program",
      description:
        "A state-wide awareness session on quantum computing and quantum technologies organised for engineering and computing students.",
      date: "2026-09-16",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      venue: "Main Auditorium",
      organizer: "School of Engineering & School of Computing",
      department: "ALL",
      category: "Technical",
    },
    {
      title: "Internal Hackathon for Smart India Hackathon 2026",
      description:
        "University-level internal hackathon to shortlist teams for Smart India Hackathon 2026, with problem statements across smart automation, healthcare, and sustainability.",
      date: "2026-09-18",
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      venue: "AGBI Innovation Hub",
      organizer: "IIC & Institution's Innovation Council",
      department: "ALL",
      category: "Technical",
    },
    {
      title: "MOU Exchange & Orientation - IDP Education",
      description:
        "Memorandum of understanding exchange and orientation session with IDP Education for IELTS preparation and international study opportunities (Australia, UK, Canada).",
      date: "2026-09-17",
      startTime: "11:00 AM",
      endTime: "1:00 PM",
      venue: "Seminar Hall, Visvesvaraya Bhavan",
      organizer: "School of Computing",
      department: "ALL",
      category: "Workshop",
    },
    {
      title: "Parents & Students Orientation - I B.Pharm & I Pharm.D",
      description:
        "Orientation for first-year pharmacy students and their parents covering curriculum, attendance, hostel and campus life.",
      date: "2026-09-23",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      venue: "Aditya Pharmacy College",
      organizer: "School of Pharmacy",
      department: "PHA",
      category: "Orientation",
    },
    {
      title: "Alumni Interaction - Careers in Civil Engineering",
      description:
        "Session with alumni working in construction, structural design and infrastructure to guide final-year Civil Engineering students on career paths.",
      date: "2026-09-24",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      venue: "Seminar Hall, C.V. Raman Bhavan",
      organizer: "Department of Civil Engineering",
      department: "CE",
      category: "Alumni",
    },
    {
      title: "Alumni Interaction - Smart Factories & Digital Manufacturing",
      description:
        "Alumni-led session on Industry 4.0, smart factories and digital manufacturing for Mechanical Engineering students.",
      date: "2026-09-25",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      venue: "Seminar Hall, C.V. Raman Bhavan",
      organizer: "Department of Mechanical Engineering",
      department: "ME",
      category: "Alumni",
    },
    {
      title: "Telugu Bhasha Dinotsavam 2026",
      description:
        "Celebration of Telugu Language Day with literary competitions, poetry recitals and classical music at the Knowledge Resource Centre.",
      date: "2026-09-30",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
      venue: "Knowledge Resource Centre",
      organizer: "Central Library (KRC)",
      department: "ALL",
      category: "Cultural",
    },
  ]);

  console.log("Seed data inserted successfully.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});