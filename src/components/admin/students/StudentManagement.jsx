//Working code
// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Filter,
//   ArrowUpDown,
//   Download,
//   Users,
//   IndianRupee,
// } from "lucide-react";
// import api from "../../../lib/api";
// import LoadingSpinner from "../../shared/LoadingSpinner";
// import { cn } from "../../../lib/utils";
// import toast from "react-hot-toast";
// import { formatCurrency } from "../../../lib/utils";
// import * as XLSX from "xlsx";

// const NATURE_OF_ACTIVITIES = [
//   "CEA/NSS/National Initiatives (OLD)",
//   "Sports & Games",
//   "Cultural Activities",
//   "Women's forum activities",
//   "Hobby clubs Activities",
//   "Professional society Activities",
//   "Dept. Students Association Activities",
//   "Technical Club Activities",
//   "Innovation and Incubation Cell Activities",
//   "Professional Self Initiatives",
//   "Others",
// ];

// export default function StudentManagement() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [events, setEvents] = useState([]);
//   const [subevents, setSubevents] = useState([]);
//   const [filters, setFilters] = useState({
//     name: "",
//     rollNumber: "",
//     year: "",
//     semester: "",
//     college: "",
//     branch: "",
//     event: "",
//     subevent: "",
//     natureOfActivity: "",
//     attendance: "",
//     certificateStatus: "",
//     participationType: "",
//   });

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "asc",
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     if (filters.event) {
//       fetchSubevents(filters.event);
//     }
//   }, [filters.event]);

//   const fetchEvents = async () => {
//     try {
//       const response = await api.get("/events");
//       setEvents(response.data.rows || []);
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//     }
//   };

//   const fetchSubevents = async (eventName) => {
//     try {
//       // Find the event ID from the events list
//       const event = events.find((e) => e.event_name === eventName);
//       if (!event) return;

//       const response = await api.get(`/subevents/${event.id}`);
//       setSubevents(response.data.subevents || []);
//     } catch (error) {
//       console.error("Failed to fetch subevents:", error);
//       toast.error("Failed to fetch subevents");
//     }
//   };

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/admin/students");
//       setStudents(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch student data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortData = (data) => {
//     if (!sortConfig.key) return data;

//     return [...data].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });
//   };

//   const filterData = (data) => {
//     return data.filter((student) => {
//       const searchFields = [
//         student.name,
//         student.email,
//         student.roll_number,
//         student.mobile_number,
//         student.college_name,
//         student.stream,
//         student.event_name,
//         student.subevent_name,
//         student.razorpay_payment_id,
//         student.certificate_id,
//       ].map((field) => field?.toLowerCase());

//       const matchesSearch = searchFields.some((field) =>
//         field?.includes(searchTerm.toLowerCase())
//       );

//       const matchesFilters =
//         (!filters.name ||
//           student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
//         (!filters.rollNumber ||
//           student.roll_number
//             ?.toLowerCase()
//             .includes(filters.rollNumber.toLowerCase())) &&
//         (!filters.year || student.year?.toString() === filters.year) &&
//         (!filters.semester ||
//           student.semester?.toString() === filters.semester) &&
//         (!filters.college ||
//           student.college_name
//             ?.toLowerCase()
//             .includes(filters.college.toLowerCase())) &&
//         (!filters.branch ||
//           student.stream
//             ?.toLowerCase()
//             .includes(filters.branch.toLowerCase())) &&
//         (!filters.event || student.event_name === filters.event) &&
//         (!filters.subevent || student.subevent_name === filters.subevent) &&
//         (!filters.natureOfActivity ||
//           student.nature_of_activity === filters.natureOfActivity) &&
//         (!filters.attendance ||
//           student.attendance.toString() === filters.attendance) &&
//         (!filters.certificateStatus ||
//           (filters.certificateStatus === "yes"
//             ? student.certificate_id !== null &&
//               student.certificate_id !== "N/A"
//             : student.certificate_id === "N/A")) &&
//         (!filters.participationType ||
//           student.participation_type === filters.participationType);
//       return matchesSearch && matchesFilters;
//     });
//   };
//   const filteredStudents = filterData(sortData(students)).filter(
//     (student) => student.razorpay_payment_id !== "N/A"
//   );  
//   const totalAmount = filteredStudents.reduce((sum, student) => {
//     const amount = parseFloat(student.amount);
//     return sum + (isNaN(amount) ? 0 : amount);
//   }, 0);
//   const exportToXLSX = () => {
//     const headers = [
//       "Name",
//       "Roll Number",
//       "Email",
//       "Mobile",
//       "Year",
//       "Semester",
//       "College",
//       "Branch",
//       "Event",
//       "Sub Event",
//       "Nature of Activity",
//       "Payment ID",
//       "Certificate ID",
//       "Attendance",
//       "Participation Type",
//       "Amount",
//     ];

//     const csvData = filteredStudents.map((student) => [
//       student.name,
//       student.roll_number,
//       student.email,
//       student.mobile_number,
//       student.year,
//       student.semester,
//       student.college_name,
//       student.stream,
//       student.event_name,
//       student.subevent_name,
//       student.nature_of_activity,
//       student.razorpay_payment_id,
//       student.certificate_id || "N/A",
//       student.attendance ? "Present" : "Absent",
//       student.participation_type,
//       formatCurrency(student.amount),
//     ]);
//     const totalAmountRow = [
//       "Total Amount",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       formatCurrency(totalAmount),
//     ];

//     // Prepare data for XLSX
//     const sheetData = [
//       headers,
//       ...csvData,
//       totalAmountRow, // Add the total amount row
//     ];
//     const sheetName = searchTerm ? `student_data_${searchTerm}` : "student_data";
//     const ws = XLSX.utils.aoa_to_sheet(sheetData); // Create worksheet
//     const wb = XLSX.utils.book_new(); // Create a new workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Student Data"); // Append worksheet to workbook

//     // Export to .xlsx
//     XLSX.writeFile(wb, `${sheetName}.xlsx`);
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold flex items-center">
//           <Users className="h-6 w-6 mr-2" />
//           Student Management
//         </h1>
//         <button onClick={exportToXLSX} className="btn btn-secondary">
//           <Download className="h-4 w-4 mr-2" />
//           Export to XLSX
//         </button>
//       </div>

//       <div className="glass-card space-y-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search students..."
//               className="input pl-10 w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => document.getElementById("filterDrawer").showModal()}
//             className="btn btn-secondary"
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             Filters
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 {[
//                   { key: "name", label: "Name" },
//                   { key: "roll_number", label: "Roll Number" },
//                   { key: "email", label: "Email" },
//                   { key: "mobile_number", label: "Mobile" },
//                   { key: "year", label: "Year" },
//                   { key: "semester", label: "Semester" },
//                   { key: "college_name", label: "College" },
//                   { key: "stream", label: "Branch" },
//                   { key: "event_name", label: "Event" },
//                   { key: "subevent_name", label: "Sub Event" },
//                   { key: "nature_of_activity", label: "Nature of Activity" },
//                   { key: "certificate_id", label: "Certificate ID" },
//                   { key: "attendance", label: "Attendance" },
//                   { key: "participation_type", label: "Participation/Merit" },
//                   { key: "razorpay_payment_id", label: "Payment ID" },
//                   { key: "amount", label: "Amount" },
//                 ].map(({ key, label }) => (
//                   <th
//                     key={key}
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                     onClick={() => handleSort(key)}
//                   >
//                     <div className="flex items-center space-x-1">
//                       <span>{label}</span>
//                       <ArrowUpDown
//                         className={cn(
//                           "h-4 w-4",
//                           sortConfig.key === key
//                             ? "text-primary"
//                             : "text-gray-400"
//                         )}
//                       />
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredStudents.map((student, index) => (
//                 <tr
//                   key={index}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-800"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.roll_number || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.mobile_number}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.year}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.semester}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.college_name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.stream}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.event_name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.subevent_name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.nature_of_activity}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.certificate_id || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={cn(
//                         "px-2 py-1 text-xs rounded-full",
//                         student.attendance
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       )}
//                     >
//                       {student.attendance ? "Present" : "Absent"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={cn(
//                         "px-2 py-1 text-xs rounded-full",
//                         student.participation_type === "Merit"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-blue-100 text-blue-800"
//                       )}
//                     >
//                       {student.participation_type}{" "}
//                       {student.participation_type === "Merit" &&
//                         student.rank &&
//                         ` - Rank ${student.rank}`}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {student.razorpay_payment_id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap font-medium">
//                     {formatCurrency(student.amount)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <td colSpan="15" className="px-6 py-4 text-right font-bold">
//                   Total Amount:
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap font-bold text-primary">
//                   <div className="flex items-center space-x-1">
//                     <span>{formatCurrency(totalAmount)}</span>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>

//       <dialog id="filterDrawer" className="modal">
//         <div className="modal-box max-w-4xl">
//           <h3 className="font-bold text-lg mb-4">Filter Options</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Student Name
//               </label>
//               <input
//                 type="text"
//                 className="input w-full"
//                 value={filters.name}
//                 onChange={(e) =>
//                   setFilters({ ...filters, name: e.target.value })
//                 }
//                 placeholder="Filter by name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Roll Number
//               </label>
//               <input
//                 type="text"
//                 className="input w-full"
//                 value={filters.rollNumber}
//                 onChange={(e) =>
//                   setFilters({ ...filters, rollNumber: e.target.value })
//                 }
//                 placeholder="Filter by roll number"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Event</label>
//               <select
//                 className="input w-full"
//                 value={filters.event}
//                 onChange={(e) => {
//                   setFilters({
//                     ...filters,
//                     event: e.target.value,
//                     subevent: "",
//                   });
//                   fetchSubevents(e.target.value);
//                 }}
//               >
//                 <option value="">All Events</option>
//                 {events.map((event) => (
//                   <option key={event.id} value={event.event_name}>
//                     {event.event_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Sub Event
//               </label>
//               <select
//                 className="input w-full"
//                 value={filters.subevent}
//                 onChange={(e) =>
//                   setFilters({ ...filters, subevent: e.target.value })
//                 }
//                 disabled={!filters.event}
//               >
//                 <option value="">All Sub Events</option>
//                 {subevents.map((subevent) => (
//                   <option key={subevent.id} value={subevent.title}>
//                     {subevent.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Year</label>
//               <select
//                 className="input w-full"
//                 value={filters.year}
//                 onChange={(e) =>
//                   setFilters({ ...filters, year: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 {[1, 2, 3, 4].map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Semester</label>
//               <select
//                 className="input w-full"
//                 value={filters.semester}
//                 onChange={(e) =>
//                   setFilters({ ...filters, semester: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 {[1, 2].map((sem) => (
//                   <option key={sem} value={sem}>
//                     {sem}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">College</label>
//               <input
//                 type="text"
//                 className="input w-full"
//                 value={filters.college}
//                 onChange={(e) =>
//                   setFilters({ ...filters, college: e.target.value })
//                 }
//                 placeholder="Filter by college name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Branch</label>
//               <input
//                 type="text"
//                 className="input w-full"
//                 value={filters.branch}
//                 onChange={(e) =>
//                   setFilters({ ...filters, branch: e.target.value })
//                 }
//                 placeholder="Filter by branch"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Nature of Activity
//               </label>
//               <select
//                 className="input w-full"
//                 value={filters.natureOfActivity}
//                 onChange={(e) =>
//                   setFilters({ ...filters, natureOfActivity: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 {NATURE_OF_ACTIVITIES.map((activity) => (
//                   <option key={activity} value={activity}>
//                     {activity}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Attendance
//               </label>
//               <select
//                 className="input w-full"
//                 value={filters.attendance}
//                 onChange={(e) =>
//                   setFilters({ ...filters, attendance: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="true">Present</option>
//                 <option value="false">Absent</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Certificate Status
//               </label>
//               <select
//                 className="input w-full"
//                 value={filters.certificateStatus}
//                 onChange={(e) =>
//                   setFilters({ ...filters, certificateStatus: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="yes">Has Certificate</option>
//                 <option value="no">No Certificate</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Participation Type
//               </label>
//               <select
//                 className="input w-full"
//                 value={filters.participationType}
//                 onChange={(e) =>
//                   setFilters({ ...filters, participationType: e.target.value })
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="Merit">Merit</option>
//                 <option value="Participation">Participation</option>
//               </select>
//             </div>
//           </div>

//           <div className="modal-action">
//             <button
//               onClick={() => {
//                 setFilters({
//                   name: "",
//                   year: "",
//                   semester: "",
//                   college: "",
//                   branch: "",
//                   event: "",
//                   subevent: "",
//                   natureOfActivity: "",
//                   attendance: "",
//                   certificateStatus: "",
//                   participationType: "",
//                 });
//               }}
//               className="btn btn-ghost"
//             >
//               Reset Filters
//             </button>
//             <form method="dialog">
//               <button className="btn btn-primary">Close</button>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// }
//Updated
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Users,
  IndianRupee,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../../../lib/api";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { cn } from "../../../lib/utils";
import toast from "react-hot-toast";
import { formatCurrency } from "../../../lib/utils";
import * as XLSX from "xlsx";

const NATURE_OF_ACTIVITIES = [
  "CEA/NSS/National Initiatives (OLD)",
  "Sports & Games",
  "Cultural Activities",
  "Women's forum activities",
  "Hobby clubs Activities",
  "Professional society Activities",
  "Dept. Students Association Activities",
  "Technical Club Activities",
  "Innovation and Incubation Cell Activities",
  "Professional Self Initiatives",
  "Others",
];

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [allFilteredStudents, setAllFilteredStudents] = useState([]); // Store all filtered data
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [subevents, setSubevents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0); // Store total amount of all entries
  const [filters, setFilters] = useState({
    name: "",
    rollNumber: "",
    year: "",
    semester: "",
    college: "",
    branch: "",
    event: "",
    subevent: "",
    natureOfActivity: "",
    attendance: "",
    certificateStatus: "",
    participationType: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (filters.event) {
      fetchSubevents(filters.event);
    }
  }, [filters.event]);

  // Update pagination when page or entries per page changes
  useEffect(() => {
    if (hasSearched && allFilteredStudents.length > 0) {
      updatePaginatedData();
    }
  }, [currentPage, entriesPerPage, allFilteredStudents]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.rows || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchSubevents = async (eventName) => {
    try {
      const event = events.find((e) => e.event_name === eventName);
      if (!event) return;

      const response = await api.get(`/subevents/${event.id}`);
      setSubevents(response.data.subevents || []);
    } catch (error) {
      console.error("Failed to fetch subevents:", error);
      toast.error("Failed to fetch subevents");
    }
  };

  const fetchStudents = async () => {
    // Check if at least one filter is applied
    if (!hasFiltersApplied()) {
      toast.error("Please apply at least one filter before searching");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/admin/students");
      const allStudents = response.data;

      // Apply filters
      const filteredData = filterData(allStudents);

      // Apply sorting
      const sortedData = sortData(filteredData);

      // Filter out entries without payment ID
      const validData = sortedData.filter(
        (student) => student.razorpay_payment_id
      );

      // Store all filtered data
      setAllFilteredStudents(validData);
      setTotalEntries(validData.length);

      // Calculate total amount for ALL filtered entries
      const calculatedTotalAmount = validData.reduce((sum, student) => {
        const amount = parseFloat(student.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      setTotalAmount(calculatedTotalAmount);

      // Reset to first page
      setCurrentPage(1);
      setHasSearched(true);

      if (validData.length === 0) {
        toast.info("No records found matching the applied filters");
      } else {
        toast.success(
          `Found ${
            validData.length
          } record(s) with total amount: ${formatCurrency(
            calculatedTotalAmount
          )}`
        );
      }
    } catch (error) {
      console.error("Failed to fetch student data:", error);
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const updatePaginatedData = () => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedData = allFilteredStudents.slice(startIndex, endIndex);
    setStudents(paginatedData);
  };

  const hasFiltersApplied = () => {
    return (
      Object.values(filters).some((value) => value !== "") || searchTerm !== ""
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Re-sort the filtered data
    if (hasSearched && allFilteredStudents.length > 0) {
      const sortedData = sortData([...allFilteredStudents]);
      setAllFilteredStudents(sortedData);
    }
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle different data types
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filterData = (data) => {
    return data.filter((student) => {
      const searchFields = [
        student.name,
        student.email,
        student.roll_number,
        student.mobile_number,
        student.college_name,
        student.stream,
        student.event_name,
        student.subevent_name,
        student.razorpay_payment_id,
        student.certificate_id,
      ].map((field) => field?.toLowerCase() || "");

      const matchesSearch =
        searchTerm === "" ||
        searchFields.some((field) => field.includes(searchTerm.toLowerCase()));

      const matchesFilters =
        (!filters.name ||
          student.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.rollNumber ||
          student.roll_number
            ?.toLowerCase()
            .includes(filters.rollNumber.toLowerCase())) &&
        (!filters.year || student.year?.toString() === filters.year) &&
        (!filters.semester ||
          student.semester?.toString() === filters.semester) &&
        (!filters.college ||
          student.college_name
            ?.toLowerCase()
            .includes(filters.college.toLowerCase())) &&
        (!filters.branch ||
          student.stream
            ?.toLowerCase()
            .includes(filters.branch.toLowerCase())) &&
        (!filters.event || student.event_name === filters.event) &&
        (!filters.subevent || student.subevent_name === filters.subevent) &&
        (!filters.natureOfActivity ||
          student.nature_of_activity === filters.natureOfActivity) &&
        (!filters.attendance ||
          student.attendance.toString() === filters.attendance) &&
        (!filters.certificateStatus ||
          (filters.certificateStatus === "yes"
            ? student.certificate_id !== null &&
              student.certificate_id !== "N/A"
            : student.certificate_id === "N/A")) &&
        (!filters.participationType ||
          student.participation_type === filters.participationType);

      return matchesSearch && matchesFilters;
    });
  };

  // Calculate amount for current page display
  const currentPageAmount = students.reduce((sum, student) => {
    const amount = parseFloat(student.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const exportToXLSX = () => {
    if (allFilteredStudents.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Name",
      "Roll Number",
      "Email",
      "Mobile",
      "Year",
      "Semester",
      "College",
      "Branch",
      "Event",
      "Sub Event",
      "Nature of Activity",
      "Paid/Free",
      "Payment ID",
      "Certificate ID",
      "Attendance",
      "Participation Type",
      "Amount",
    ];

    // Export ALL filtered data, not just current page
    const csvData = allFilteredStudents.map((student) => [
      student.name,
      student.roll_number,
      student.email,
      student.mobile_number,
      student.year,
      student.semester,
      student.college_name,
      student.stream,
      student.event_name,
      student.subevent_name,
      student.nature_of_activity,
      student.razorpay_payment_id,
      student.certificate_id || "N/A",
      student.attendance ? "Present" : "Absent",
      student.participation_type,
      formatCurrency(student.amount),
    ]);

    const totalAmountRow = [
      "Total Amount",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      formatCurrency(totalAmount),
    ];

    const sheetData = [headers, ...csvData, totalAmountRow];
    const sheetName = searchTerm
      ? `student_data_${searchTerm}`
      : "student_data";
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Data");

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
    toast.success(
      `Data exported successfully - ${allFilteredStudents.length} records`
    );
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      rollNumber: "",
      year: "",
      semester: "",
      college: "",
      branch: "",
      event: "",
      subevent: "",
      natureOfActivity: "",
      attendance: "",
      certificateStatus: "",
      participationType: "",
    });
    setSearchTerm("");
    setStudents([]);
    setAllFilteredStudents([]);
    setHasSearched(false);
    setCurrentPage(1);
    setTotalEntries(0);
    setTotalAmount(0);
    setSubevents([]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Data will be updated by useEffect
  };

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(parseInt(newEntriesPerPage));
    setCurrentPage(1);
    // Data will be updated by useEffect
  };

  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Student Management
        </h1>
        {hasSearched && (
          <button onClick={exportToXLSX} className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export to XLSX ({allFilteredStudents.length} records)
          </button>
        )}
      </div>

      {/* Disclaimer Message */}
      {!hasSearched && !hasFiltersApplied() && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                Search Required
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                Please apply at least one filter or enter a search term before
                searching for student records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="glass-card space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => document.getElementById("filterDrawer").showModal()}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters{" "}
            {hasFiltersApplied() &&
              Object.values(filters).filter((v) => v !== "").length > 0 && (
                <span className="ml-1 bg-primary  text-black text-xs rounded-full px-2 py-0.5">
                  {Object.values(filters).filter((v) => v !== "").length}
                </span>
              )}
          </button>
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </button>
          <button
            onClick={resetFilters}
            className="btn btn-ghost"
            disabled={!hasFiltersApplied() && !hasSearched}
          >
            Reset
          </button>
        </div>

        {/* Show applied filters summary */}
        {hasFiltersApplied() && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            {Object.entries(filters).map(([key, value]) => {
              if (value) {
                const displayNames = {
                  name: "Name",
                  rollNumber: "Roll Number",
                  year: "Year",
                  semester: "Semester",
                  college: "College",
                  branch: "Branch",
                  event: "Event",
                  subevent: "Sub Event",
                  natureOfActivity: "Nature of Activity",
                  attendance: "Attendance",
                  certificateStatus: "Certificate Status",
                  participationType: "Participation Type",
                };
                return (
                  <span
                    key={key}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                  >
                    {displayNames[key]}:{" "}
                    {value === "true"
                      ? "Present"
                      : value === "false"
                      ? "Absent"
                      : value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Show total amount summary when data is loaded */}
        {hasSearched && totalEntries > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  Total Records: {totalEntries} | Total Amount:{" "}
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                {Math.min(currentPage * entriesPerPage, totalEntries)} of{" "}
                {totalEntries} entries
              </span>
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesPerPageChange(e.target.value)}
                className="input w-auto"
              >
                <option value={10}>10 entries</option>
                <option value={25}>25 entries</option>
                <option value={50}>50 entries</option>
                <option value={100}>100 entries</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-ghost btn-sm"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "btn btn-sm",
                          currentPage === pageNum ? "btn-primary" : "btn-ghost"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-ghost btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : students.length > 0 ? (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {[
                        { key: "name", label: "Name" },
                        { key: "roll_number", label: "Roll Number" },
                        { key: "email", label: "Email" },
                        { key: "mobile_number", label: "Mobile" },
                        { key: "year", label: "Year" },
                        { key: "semester", label: "Semester" },
                        { key: "college_name", label: "College" },
                        { key: "stream", label: "Branch" },
                        { key: "event_name", label: "Event" },
                        { key: "subevent_name", label: "Sub Event" },
                        {
                          key: "nature_of_activity",
                          label: "Nature of Activity",
                        },
                        { key: "certificate_id", label: "Certificate ID" },
                        { key: "attendance", label: "Attendance" },
                        {
                          key: "participation_type",
                          label: "Participation/Merit",
                        },
                        { key: "razorpay_payment_id", label: "Paid/Free" },
                        { key: "razorpay_payment_id", label: "Payment ID" },
                        { key: "amount", label: "Amount" },
                      ].map(({ key, label }) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSort(key)}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{label}</span>
                            <ArrowUpDown
                              className={cn(
                                "h-4 w-4",
                                sortConfig.key === key
                                  ? "text-primary"
                                  : "text-gray-400"
                              )}
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {students.map((student, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.roll_number || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.mobile_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.college_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.stream}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.event_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.subevent_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.nature_of_activity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.certificate_id || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              student.attendance
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {student.attendance ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              student.participation_type === "Merit"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            )}
                          >
                            {student.participation_type}{" "}
                            {student.participation_type === "Merit" &&
                              student.rank &&
                              ` - Rank ${student.rank}`}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {student.razorpay_payment_id &&
                          student.razorpay_payment_id !== "N/A" ? (
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                              Paid
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                              Free
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2 text-sm">
                          {student.razorpay_payment_id &&
                          student.razorpay_payment_id !== "N/A" ? (
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                              {student.razorpay_payment_id}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                              Free
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {formatCurrency(student.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td
                        colSpan="15"
                        className="px-6 py-4 text-right font-bold"
                      >
                        Current Page Total: {formatCurrency(currentPageAmount)}{" "}
                        | All Entries Total: {formatCurrency(totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-primary">
                        <div className="flex items-center space-x-1">
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Records Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No student records found matching your search criteria. Try
                adjusting your filters.
              </p>
            </div>
          )}
        </>
      )}

      {/* Filter Modal */}
      <dialog id="filterDrawer" className="modal">
        <div className="modal-box max-w-4xl p-6 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-lg bg-white/20">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-white/40 pb-3">
            <h3 className="font-bold text-xl text-black">Filter Options</h3>
            <button
              className="p-2 rounded-full hover:bg-red-500/30 transition-colors"
              onClick={() => document.getElementById("filterDrawer").close()}
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Student Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
                placeholder="Filter by student name"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Roll Number
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.rollNumber}
                onChange={(e) =>
                  setFilters({ ...filters, rollNumber: e.target.value })
                }
                placeholder="Filter by roll number"
              />
            </div>

            {/* Event */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Event
              </label>
              <select
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.event}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    event: e.target.value,
                    subevent: "",
                  })
                }
              >
                <option value="">All</option>
                {events.map((event) => (
                  <option key={event.id} value={event.event_name}>
                    {event.event_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Semester
              </label>
              <select
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.semester}
                onChange={(e) =>
                  setFilters({ ...filters, semester: e.target.value })
                }
              >
                <option value="">All</option>
                {[1, 2].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                College
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.college}
                onChange={(e) =>
                  setFilters({ ...filters, college: e.target.value })
                }
                placeholder="Filter by college name"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Branch
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black placeholder-black/50 focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.branch}
                onChange={(e) =>
                  setFilters({ ...filters, branch: e.target.value })
                }
                placeholder="Filter by branch"
              />
            </div>

            {/* Nature of Activity */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Nature of Activity
              </label>
              <select
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.natureOfActivity}
                onChange={(e) =>
                  setFilters({ ...filters, natureOfActivity: e.target.value })
                }
              >
                <option value="">All</option>
                {NATURE_OF_ACTIVITIES.map((activity) => (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Attendance
              </label>
              <select
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.attendance}
                onChange={(e) =>
                  setFilters({ ...filters, attendance: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="true">Present</option>
                <option value="false">Absent</option>
              </select>
            </div>

            {/* Certificate Status */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Certificate Status
              </label>
              <select
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.certificateStatus}
                onChange={(e) =>
                  setFilters({ ...filters, certificateStatus: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="yes">Has Certificate</option>
                <option value="no">No Certificate</option>
              </select>
            </div>

            {/* Participation Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black/80">
                Participation Type
              </label>
              <select
                className="w-full rounded-lg border border-black/40 bg-white/50 text-black focus:border-blue-400 focus:outline-none px-3 py-2"
                value={filters.participationType}
                onChange={(e) =>
                  setFilters({ ...filters, participationType: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="Merit">Merit</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-action mt-8 flex justify-end gap-4">
            <button
              onClick={() => {
                resetFilters();
                document.getElementById("filterDrawer").close();
              }}
              className="px-5 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-black transition-all"
            >
              Reset All Filters
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-black transition-all"
              onClick={() => {
                fetchStudents();
                document.getElementById("filterDrawer").close();
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
