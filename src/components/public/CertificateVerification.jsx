// Working
//import React, { useState } from 'react';
// import {
//   Search,
//   Download,
//   FileText,
//   User,
//   Mail,
//   Calendar,
//   Award,
//   Building,
// } from 'lucide-react';
// import api from '../../lib/api';
// import toast from 'react-hot-toast';
// import * as XLSX from 'xlsx';
// import { formatDate } from '../../lib/utils';
// import LoadingSpinner from '../shared/LoadingSpinner';
// import { cn } from '../../lib/utils';

// export default function CertificateVerification() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       toast.error('Please enter a roll number or certificate ID');
//       return;
//     }

//     try {
//       setLoading(true);
//       setHasSearched(true);

//       // Fetch all student data (same as admin student management)
//       const response = await api.get('/public/students');
//       const allStudents = response.data;

//       // Filter by roll number or certificate ID (case-insensitive)
//       const filteredResults = allStudents.filter((student) =>
//         (student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           student.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase()))
//       );

//       setSearchResults(filteredResults);

//       if (filteredResults.length === 0) {
//         toast.info('No records found for the given search term');
//       } else {
//         toast.success(`Found ${filteredResults.length} record(s)`);
//       }
//     } catch (error) {
//       console.error('Search error:', error);
//       toast.error('Failed to search records');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToXLSX = () => {
//     if (searchResults.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const headers = [
//       'Name',
//       'Roll Number',
//       'Email',
//       'Mobile',
//       'Year',
//       'Semester',
//       'College',
//       'Branch',
//       'Event',
//       'Sub Event',
//       'Nature of Activity',
//       'Certificate ID',
//       'Attendance',
//       'Participation Type',
//       'Registration Date',
//     ];

//     const csvData = searchResults.map((student) => [
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
//       student.certificate_id || 'N/A',
//       student.attendance ? 'Present' : 'Absent',
//       student.participation_type,
//       formatDate(student.registration_date),
//     ]);

//     const sheetData = [headers, ...csvData];
//     const sheetName = searchTerm ? `verification_${searchTerm}` : 'verification_data';
//     const ws = XLSX.utils.aoa_to_sheet(sheetData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Verification Data');

//     XLSX.writeFile(wb, `${sheetName}.xlsx`);
//     toast.success('Data exported successfully');
//   };

//   // Group students by roll_number or email to aggregate their events
//   const getStudentGroups = () => {
//     return searchResults.reduce((acc, record) => {
//       const key = record.roll_number || record.email;
//       if (!acc[key]) {
//         acc[key] = {
//           student: {
//             name: record.name,
//             roll_number: record.roll_number,
//             email: record.email,
//             mobile_number: record.mobile_number,
//             year: record.year,
//             semester: record.semester,
//             college_name: record.college_name,
//             stream: record.stream,
//           },
//           events: [],
//         };
//       }
//       acc[key].events.push(record);
//       return acc;
//     }, {});
//   };

//   const studentGroups = getStudentGroups();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto space-y-8">
//           {/* Header */}
//           <div className="text-center space-y-4">
//             <div className="flex justify-center mb-6">
//               <div className="glass-icon-container p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
//                 <FileText className="h-12 w-12 text-primary" />
//               </div>
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Certificate Verification
//             </h1>
//             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//               Verify student certificates and view participation records by searching with roll number or certificate ID
//             </p>
//           </div>

//           {/* Search Form */}
//           <div className="glass-card max-w-2xl mx-auto">
//             <form onSubmit={handleSearch} className="space-y-6">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Enter roll number or certificate ID..."
//                   className="w-full pl-12 pr-4 py-4 rounded-xl glass-input text-lg"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   required
//                   aria-label="Search by roll number or certificate ID"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 px-6 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                     <span>Searching...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center space-x-2">
//                     <Search className="h-5 w-5" />
//                     <span>Search Records</span>
//                   </div>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Search Results */}
//           {hasSearched && (
//             <div className="space-y-6">
//               {searchResults.length > 0 && (
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold">
//                     Search Results ({searchResults.length} found)
//                   </h2>
//                   <button onClick={exportToXLSX} className="btn btn-secondary flex items-center">
//                     <Download className="h-4 w-4 mr-2" />
//                     Export to XLSX
//                   </button>
//                 </div>
//               )}

//               {searchResults.length > 0 ? (
//                 <div className="space-y-8">
//                   {Object.values(studentGroups).map((group, groupIndex) => (
//                     <div key={groupIndex} className="glass-card">
//                       {/* Student Details Card */}
//                       <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
//                         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
//                           <User className="h-5 w-5 mr-2 text-primary" />
//                           Student Information
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.name}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <span className="font-medium text-gray-700 dark:text-gray-300">Roll Number:</span>
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.roll_number}</span>
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <Mail className="h-4 w-4 text-primary" />
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.email}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <span className="font-medium text-gray-700 dark:text-gray-300">Mobile:</span>
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.mobile_number}</span>
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <span className="font-medium text-gray-700 dark:text-gray-300">Year:</span>
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.year}</span>
//                               <span className="font-medium text-gray-700 dark:text-gray-300 ml-4">Semester:</span>
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.semester}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Building className="h-4 w-4 text-primary" />
//                               <span className="text-sm text-gray-900 dark:text-gray-100">{group.student.college_name}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <span className="font-medium text-gray-700 dark:text-gray-300">Branch:</span>
//                               <span className="text-gray-900 dark:text-gray-100">{group.student.stream}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Events Table */}
//                       <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
//                         <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//                           <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                             Event Participation History
//                           </h4>
//                         </div>
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                             <thead className="bg-gray-50 dark:bg-gray-800">
//                               <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Event Name
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Sub Event
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Activity Type
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Registration Date
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Attendance
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Certificate Status
//                                 </th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                   Certificate ID
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//                               {group.events.map((event, eventIndex) => (
//                                 <tr key={eventIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="font-medium text-gray-900 dark:text-gray-100">{event.event_name}</div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-gray-900 dark:text-gray-100">{event.subevent_name}</div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-600 dark:text-gray-400">{event.nature_of_activity}</div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="flex items-center space-x-2">
//                                       <Calendar className="h-4 w-4 text-primary" />
//                                       <span className="text-sm text-gray-900 dark:text-gray-100">
//                                         {formatDate(event.registration_date)}
//                                       </span>
//                                     </div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <span
//                                       className={cn(
//                                         'px-3 py-1 text-sm rounded-full font-medium',
//                                         event.attendance
//                                           ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
//                                           : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
//                                       )}
//                                     >
//                                       {event.attendance ? 'Present' : 'Absent'}
//                                     </span>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <span
//                                       className={cn(
//                                         'px-3 py-1 text-sm rounded-full font-medium',
//                                         event.participation_type === 'Merit'
//                                           ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
//                                           : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
//                                       )}
//                                     >
//                                       {event.participation_type}
//                                       {event.participation_type === 'Merit' && event.rank && ` - Rank ${event.rank}`}
//                                     </span>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
//                                       {event.certificate_id || 'Not Generated'}
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="glass-card text-center py-12">
//                   <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                     No Records Found
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     No student records found for "{searchTerm}". Please check the roll number or certificate ID and try again.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Information Section */}
//           <div className="glass-card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
//             <div className="flex items-start space-x-4">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
//                 <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
//                   How to Use Certificate Verification
//                 </h3>
//                 <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
//                   <li>• Enter a student's roll number or certificate ID in the search box</li>
//                   <li>• View detailed information about their event participation</li>
//                   <li>• Download the search results in Excel format for record keeping</li>
//                   <li>• All certificate IDs are unique and can be used for verification</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import {
  Search,
  Download,
  FileText,
  User,
  Mail,
  Calendar,
  Award,
  Building,
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../shared/LoadingSpinner';
import { cn } from '../../lib/utils';

export default function CertificateVerification() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination states
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a roll number or certificate ID');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      setCurrentPage(1); // reset to first page on new search

      const response = await api.get('/public/students');
      const allStudents = response.data;

      const filteredResults = allStudents.filter((student) =>
        (student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setSearchResults(filteredResults);

      if (filteredResults.length === 0) {
        toast.info('No records found for the given search term');
      } else {
        toast.success(`Found ${filteredResults.length} record(s)`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search records');
    } finally {
      setLoading(false);
    }
  };

  const exportToXLSX = () => {
    if (searchResults.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Name',
      'Roll Number',
      'Email',
      'Mobile',
      'Year',
      'Semester',
      'College',
      'Branch',
      'Event',
      'Sub Event',
      'Nature of Activity',
      'Certificate ID',
      'Attendance',
      'Participation Type',
      'Registration Date',
    ];

    const csvData = searchResults.map((student) => [
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
      student.certificate_id || 'N/A',
      student.attendance ? 'Present' : 'Absent',
      student.participation_type,
      formatDate(student.registration_date),
    ]);

    const sheetData = [headers, ...csvData];
    const sheetName = searchTerm ? `verification_${searchTerm}` : 'verification_data';
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Verification Data');

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
    toast.success('Data exported successfully');
  };

  // Pagination calculations
  const totalPages = Math.ceil(searchResults.length / entriesPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Group students by roll_number or email from paginatedResults
  const getStudentGroups = () => {
    return paginatedResults.reduce((acc, record) => {
      const key = record.roll_number || record.email;
      if (!acc[key]) {
        acc[key] = {
          student: {
            name: record.name,
            roll_number: record.roll_number,
            email: record.email,
            mobile_number: record.mobile_number,
            year: record.year,
            semester: record.semester,
            college_name: record.college_name,
            stream: record.stream,
          },
          events: [],
        };
      }
      acc[key].events.push(record);
      return acc;
    }, {});
  };

  const studentGroups = getStudentGroups();

  // Pagination Controls Component
  const PaginationControls = () => (
    <div className="flex items-center justify-between mt-4">
      <div>
        <label htmlFor="entries" className="mr-2 font-medium text-gray-700 dark:text-gray-300">
          Entries per page:
        </label>
        <select
          id="entries"
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="rounded border border-gray-300 px-2 py-1"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="space-x-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages).keys()]
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )
          .map((pageIndex) => {
            const pageNum = pageIndex + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  pageNum === currentPage
                    ? 'bg-primary text-white border-primary'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="glass-icon-container p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Certificate Verification
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Verify student certificates and view participation records by searching with roll number or certificate ID
            </p>
          </div>

          {/* Search Form */}
          <div className="glass-card max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter roll number or certificate ID..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl glass-input text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                  aria-label="Search by roll number or certificate ID"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Search Records</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              {searchResults.length > 0 && (
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Search Results ({searchResults.length} found)
                  </h2>
                  <button
                    onClick={exportToXLSX}
                    className="btn btn-secondary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to XLSX
                  </button>
                </div>
              )}

              {searchResults.length > 0 ? (
                <>
                  <PaginationControls />

                  <div className="space-y-8 mt-4">
                    {Object.values(studentGroups).map((group, groupIndex) => (
                      <div key={groupIndex} className="glass-card">
                        {/* Student Details Card */}
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary" />
                            Student Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                <span className="text-gray-900 dark:text-gray-100">{group.student.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Roll Number:</span>
                                <span className="text-gray-900 dark:text-gray-100">{group.student.roll_number}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-gray-900 dark:text-gray-100">{group.student.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Mobile:</span>
                                <span className="text-gray-900 dark:text-gray-100">{group.student.mobile_number}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Year:</span>
                                <span className="text-gray-900 dark:text-gray-100">{group.student.year}</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300 ml-4">Semester:</span>
                                <span className="text-gray-900 dark:text-gray-100">{group.student.semester}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4 text-primary" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">{group.student.college_name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Branch:</span>
                                <span className="text-gray-900 dark:text-gray-100">{group.student.stream}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Events Table */}
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              Event Participation History
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Event Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Sub Event
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Activity Type
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Registration Date
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Attendance
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Certificate Status
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Certificate ID
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {group.events.map((event, eventIndex) => (
                                  <tr
                                    key={eventIndex}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {event.event_name}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-gray-900 dark:text-gray-100">{event.subevent_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-600 dark:text-gray-400">{event.nature_of_activity}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                          {formatDate(event.registration_date)}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={cn(
                                          'px-3 py-1 text-sm rounded-full font-medium',
                                          event.attendance
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        )}
                                      >
                                        {event.attendance ? 'Present' : 'Absent'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={cn(
                                          'px-3 py-1 text-sm rounded-full font-medium',
                                          event.participation_type === 'Merit'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                        )}
                                      >
                                        {event.participation_type}
                                        {event.participation_type === 'Merit' && event.rank && ` - Rank ${event.rank}`}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                        {event.certificate_id || 'Not Generated'}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <PaginationControls />
                </>
              ) : (
                <div className="glass-card text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Records Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No student records found for "{searchTerm}". Please check the roll number or certificate ID and try again.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Information Section (unchanged) */}
          <div className="glass-card max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              How to Verify
            </h2>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              Enter the student's roll number or certificate ID in the search box above and click "Search Records." You will see a list of matching student certificates and event participation records.
            </p>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              You can export all found records to Excel using the "Export to XLSX" button.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              If no results are found, please double-check the roll number or certificate ID entered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
