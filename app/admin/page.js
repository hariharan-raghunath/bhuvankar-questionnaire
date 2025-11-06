'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleLogin = () => {
    if (password) {
      setIsAuthenticated(true);
      fetchSubmissions(password);
    }
  };

  const fetchSubmissions = async (pwd) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin', {
        headers: {
          'Authorization': `Bearer ${pwd || password}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      } else {
        alert('Invalid password or error fetching data');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsJSON = (submission) => {
    const dataStr = JSON.stringify(submission, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submission-${submission.fullName}-${new Date(submission.submittedAt).toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-black mb-6">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Client Submissions</h1>
            <button
              onClick={() => fetchSubmissions()}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <p className="text-gray-600 mt-2">Total submissions: {submissions.length}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{submission.fullName}</h2>
                  <p className="text-sm text-gray-500">Submitted: {formatDate(submission.submittedAt)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {selectedSubmission?.id === submission.id ? 'Hide' : 'View'}
                  </button>
                  <button
                    onClick={() => downloadAsJSON(submission)}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-black">{submission.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Mobile:</span>
                  <p className="font-medium text-black">{submission.mobile}</p>
                </div>
                <div>
                  <span className="text-gray-500">PAN:</span>
                  <p className="font-medium text-black">{submission.panNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Aadhar:</span>
                  <p className="font-medium text-black">{submission.aadharNumber}</p>
                </div>
              </div>

              {selectedSubmission?.id === submission.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-semibold text-gray-800">Date of Birth:</span> <span className="font-medium text-black">{new Date(submission.dateOfBirth).toLocaleDateString('en-IN')}</span></div>
                        <div><span className="font-semibold text-gray-800">Name as per PAN:</span> <span className="font-medium text-black">{submission.nameAsPerPan}</span></div>
                        <div><span className="font-semibold text-gray-800">Address:</span> <span className="font-medium text-black">{submission.address1}, {submission.address2 && submission.address2 + ', '}{submission.city}, {submission.pinCode}</span></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Financial Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-semibold text-gray-800">Annual Income:</span> <span className="font-medium text-black">{submission.annualIncome}</span></div>
                        <div><span className="font-semibold text-gray-800">Monthly Expenses:</span> <span className="font-medium text-black">{submission.monthlyExpenses}</span></div>
                        <div><span className="font-semibold text-gray-800">Current Savings:</span> <span className="font-medium text-black">{submission.currentSavings || 'N/A'}</span></div>
                        <div><span className="font-semibold text-gray-800">PEP:</span> <span className="font-medium text-black">{submission.isPoliticallyExposed ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Family Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-semibold text-gray-800">Marital Status:</span> <span className="font-medium capitalize text-black">{submission.maritalStatus}</span></div>
                        {submission.spouseName && (
                          <>
                            <div><span className="font-semibold text-gray-800">Spouse Name:</span> <span className="font-medium text-black">{submission.spouseName}</span></div>
                            <div><span className="font-semibold text-gray-800">Spouse DoB:</span> <span className="font-medium text-black">{submission.spouseDob ? new Date(submission.spouseDob).toLocaleDateString('en-IN') : 'N/A'}</span></div>
                          </>
                        )}
                        {submission.hasChildren && (
                          <div><span className="font-semibold text-gray-800">Children:</span> <span className="font-medium text-black">{submission.numberOfChildren}</span></div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Investment Profile</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-semibold text-gray-800">Employment:</span> <span className="font-medium capitalize text-black">{submission.employmentStatus}</span></div>
                        <div><span className="font-semibold text-gray-800">Risk Tolerance:</span> <span className="font-medium capitalize text-black">{submission.riskTolerance}</span></div>
                        <div><span className="font-semibold text-gray-800">Time Horizon:</span> <span className="font-medium capitalize text-black">{submission.timeHorizon}</span></div>
                        {submission.financialGoals.length > 0 && (
                          <div><span className="font-semibold text-gray-800">Goals:</span> <span className="font-medium text-black">{submission.financialGoals.join(', ')}</span></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {submission.additionalNotes && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Additional Notes</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded text-black">{submission.additionalNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {submissions.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-black">
            <p className="text-black">No submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}