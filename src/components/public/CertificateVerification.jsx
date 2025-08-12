import React, { useState } from 'react';
import { Search, Download, FileText, User, Mail, Calendar, Award, Building } from 'lucide-react';
import api from '../../lib/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { cn } from '../../lib/utils';
import { formatCurrency, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function CertificateVerification() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a roll number or certificate ID');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      // Fetch all student data (same as admin student management)
      const response = await api.get('/public/students');
      const allStudents = response.data;

      // Filter by roll number or certificate ID
      const filteredResults = allStudents.filter(student => 
        student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase())
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
      'Payment ID',
      'Certificate ID',
      'Attendance',
      'Participation Type',
      'Amount',
      'Registration Date'
    ];

    const csvData = searchResults.map(student => [
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
      student.certificate_id || 'N/A',
      student.attendance ? 'Present' : 'Absent',
      student.participation_type,
      formatCurrency(student.amount),
      formatDate(student.registration_date)
    ]);

    const totalAmount = searchResults.reduce((sum, student) => {
      const amount = parseFloat(student.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalAmountRow = [
      'Total Amount',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      formatCurrency(totalAmount),
      ''
    ];

    const sheetData = [headers, ...csvData, totalAmountRow];
    const sheetName = searchTerm ? `verification_${searchTerm}` : 'verification_data';
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Verification Data');

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
    toast.success('Data exported successfully');
  };

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
                    className="btn btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to XLSX
                  </button>
                </div>
              )}

              {searchResults.length > 0 ? (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Student Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Academic Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Event Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Certificate & Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {searchResults.map((student, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{student.name}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Mail className="h-3 w-3" />
                                  <span>{student.email}</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Mobile: {student.mobile_number}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1 text-sm">
                                <div><strong>Roll:</strong> {student.roll_number}</div>
                                <div><strong>Year:</strong> {student.year}</div>
                                <div><strong>Semester:</strong> {student.semester}</div>
                                <div><strong>Branch:</strong> {student.stream}</div>
                                <div className="flex items-center space-x-1">
                                  <Building className="h-3 w-3 text-primary" />
                                  <span className="text-xs">{student.college_name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="font-medium">{student.event_name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {student.subevent_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {student.nature_of_activity}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-primary" />
                                  <span className="text-xs">
                                    {formatDate(student.registration_date)}
                                  </span>
                                </div>
                                <div className="font-medium text-primary">
                                  {formatCurrency(student.amount)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <strong>Certificate ID:</strong>
                                  <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                                    {student.certificate_id || 'N/A'}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <span className={cn(
                                    "px-2 py-1 text-xs rounded-full",
                                    student.attendance
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  )}>
                                    {student.attendance ? 'Present' : 'Absent'}
                                  </span>
                                  <span className={cn(
                                    "px-2 py-1 text-xs rounded-full",
                                    student.participation_type === 'Merit'
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  )}>
                                    {student.participation_type}
                                    {student.participation_type === 'Merit' && student.rank && 
                                      ` - Rank ${student.rank}`
                                    }
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Payment ID: {student.razorpay_payment_id}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : hasSearched && (
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

          {/* Information Section */}
          <div className="glass-card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  How to Use Certificate Verification
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Enter a student's roll number or certificate ID in the search box</li>
                  <li>• View detailed information about their event participation</li>
                  <li>• Download the search results in Excel format for record keeping</li>
                  <li>• All certificate IDs are unique and can be used for verification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}