"use client"
import { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

export default function ClientQuestionnaire() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dateOfBirth: '',
    panNumber: '',
    nameAsPerPan: '',
    mobile: '',
    email: '',
    address1: '',
    address2: '',
    address3: '',
    city: '',
    country: 'India',
    pinCode: '',
    aadharNumber: '',
    
    // Financial Details
    annualIncome: '',
    isPoliticallyExposed: '',
    
    // Marital Details
    maritalStatus: '',
    spouseName: '',
    spouseDob: '',
    spousePan: '',
    spouseMobile: '',
    spouseEmail: '',
    spouseAddressSame: '',
    spouseAddress1: '',
    spouseAddress2: '',
    spouseAddress3: '',
    spouseCity: '',
    spouseCountry: 'India',
    spousePinCode: '',
    placeOfBirth: '',
    
    // Children Details
    hasChildren: '',
    numberOfChildren: '',
    children: [],
    
    // Investment Goals
    employmentStatus: '',
    monthlyExpenses: '',
    currentSavings: '',
    hasInvestments: '',
    investmentTypes: [],
    financialGoals: [],
    riskTolerance: '',
    timeHorizon: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'numberOfChildren') {
        const num = parseInt(value) || 0;
        updated.children = Array(num).fill(null).map((_, i) => 
          prev.children[i] || { name: '', dob: '' }
        );
      }
      
      if (field === 'spouseAddressSame' && value === 'same') {
        updated.spouseAddress1 = '';
        updated.spouseAddress2 = '';
        updated.spouseAddress3 = '';
        updated.spouseCity = '';
        updated.spouseCountry = 'India';
        updated.spousePinCode = '';
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateChildField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
      if (!formData.nameAsPerPan.trim()) newErrors.nameAsPerPan = 'Name as per PAN is required';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN code is required';
      if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
    }
    
    if (stepNum === 2) {
      if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
      if (!formData.isPoliticallyExposed) newErrors.isPoliticallyExposed = 'This field is required';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
      
      if (formData.maritalStatus === 'married') {
        if (!formData.spouseName.trim()) newErrors.spouseName = 'Spouse name is required';
        if (!formData.spouseDob) newErrors.spouseDob = 'Spouse date of birth is required';
        if (!formData.spouseAddressSame) newErrors.spouseAddressSame = 'Please select address option';
        
        if (formData.spouseAddressSame === 'different') {
          if (!formData.spouseAddress1.trim()) newErrors.spouseAddress1 = 'Spouse address is required';
          if (!formData.spouseCity.trim()) newErrors.spouseCity = 'Spouse city is required';
          if (!formData.spousePinCode.trim()) newErrors.spousePinCode = 'Spouse PIN code is required';
        }
      }
      
      if (formData.maritalStatus === 'married' || formData.maritalStatus === 'others') {
        if (!formData.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of birth is required';
        if (!formData.hasChildren) newErrors.hasChildren = 'Please specify if you have children';
        
        if (formData.hasChildren === 'yes') {
          if (!formData.numberOfChildren || formData.numberOfChildren < 1) {
            newErrors.numberOfChildren = 'Number of children is required';
          } else {
            formData.children.forEach((child, i) => {
              if (!child.name?.trim()) newErrors[`child${i}Name`] = `Child ${i + 1} name is required`;
              if (!child.dob) newErrors[`child${i}Dob`] = `Child ${i + 1} date of birth is required`;
            });
          }
        }
      }
    }
    
    if (stepNum === 3) {
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!formData.monthlyExpenses) newErrors.monthlyExpenses = 'Monthly expenses are required';
      if (formData.financialGoals.length === 0) newErrors.financialGoals = 'Select at least one goal';
      if (!formData.riskTolerance) newErrors.riskTolerance = 'Risk tolerance is required';
      if (!formData.timeHorizon) newErrors.timeHorizon = 'Time horizon is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    if (loading) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
      } else {
        alert('Submission failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">Thank You!</h2>
          <p className="text-black mb-6">
            Your financial questionnaire has been submitted successfully. 
            Our team will review your information and contact you within 2-3 business days.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Lock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">
              Your data is encrypted and securely stored
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Financial Questionnaire</h1>
            <p className="text-blue-100">Help us understand your financial situation</p>
          </div>

          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map(num => (
                <div key={num} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Date of Birth (DD/MM/YYYY) *</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">PAN No. *</label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => updateField('panNumber', e.target.value.toUpperCase())}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.panNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ABCDE1234F"
                      maxLength="10"
                    />
                    {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Name as per PAN *</label>
                    <input
                      type="text"
                      value={formData.nameAsPerPan}
                      onChange={(e) => updateField('nameAsPerPan', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.nameAsPerPan ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="As per PAN card"
                    />
                    {errors.nameAsPerPan && <p className="text-red-500 text-sm mt-1">{errors.nameAsPerPan}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => updateField('mobile', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black  ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    <p className="text-xs text-black mt-1">Number mapped with bank account & existing investments</p>
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Personal Email ID *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    <p className="text-xs text-black mt-1">Email mapped with bank account & existing investments</p>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Address 1 *</label>
                  <input
                    type="text"
                    value={formData.address1}
                    onChange={(e) => updateField('address1', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.address1 ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="House/Flat No., Building Name"
                  />
                  {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Address 2</label>
                  <input
                    type="text"
                    value={formData.address2}
                    onChange={(e) => updateField('address2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Street, Area, Locality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Address 3</label>
                  <input
                    type="text"
                    value={formData.address3}
                    onChange={(e) => updateField('address3', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Landmark"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">City / Town *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mumbai"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Country *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="India"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">PIN / ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => updateField('pinCode', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.pinCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="400001"
                      maxLength="6"
                    />
                    {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Aadhar / Identity No. *</label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => updateField('aadharNumber', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012"
                    maxLength="12"
                  />
                  {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black mb-4">Financial & Family Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Annual Income (in lakhs) *</label>
                  <select
                    value={formData.annualIncome}
                    onChange={(e) => updateField('annualIncome', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.annualIncome ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select range</option>
                    <option value="0-5">₹0 - ₹5 Lakhs</option>
                    <option value="5-10">₹5 - ₹10 Lakhs</option>
                    <option value="10-20">₹10 - ₹20 Lakhs</option>
                    <option value="20-50">₹20 - ₹50 Lakhs</option>
                    <option value="50+">₹50 Lakhs+</option>
                  </select>
                  {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Are you a politically exposed person? *</label>
                  <p className="text-xs text-black mb-2">PEP is an individual who has held or currently holds a prominent public function, either in India or a foreign country</p>
                  <div className="space-y-2">
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.isPoliticallyExposed === 'yes'}
                        onChange={(e) => updateField('isPoliticallyExposed', e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.isPoliticallyExposed === 'no'}
                        onChange={(e) => updateField('isPoliticallyExposed', e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                  {errors.isPoliticallyExposed && <p className="text-red-500 text-sm mt-1">{errors.isPoliticallyExposed}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Marital Status *</label>
                  <div className="space-y-2">
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="married"
                        checked={formData.maritalStatus === 'married'}
                        onChange={(e) => updateField('maritalStatus', e.target.value)}
                        className="mr-2"
                      />
                      Married
                    </label>
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="unmarried"
                        checked={formData.maritalStatus === 'unmarried'}
                        onChange={(e) => updateField('maritalStatus', e.target.value)}
                        className="mr-2"
                      />
                      Unmarried
                    </label>
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="others"
                        checked={formData.maritalStatus === 'others'}
                        onChange={(e) => updateField('maritalStatus', e.target.value)}
                        className="mr-2"
                      />
                      Others
                    </label>
                  </div>
                  {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                </div>

                {formData.maritalStatus === 'married' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-black">Spouse Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Name of the Spouse *</label>
                        <input
                          type="text"
                          value={formData.spouseName}
                          onChange={(e) => updateField('spouseName', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                            errors.spouseName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Spouse name"
                        />
                        {errors.spouseName && <p className="text-red-500 text-sm mt-1">{errors.spouseName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">DoB of Spouse *</label>
                        <input
                          type="date"
                          value={formData.spouseDob}
                          onChange={(e) => updateField('spouseDob', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                            errors.spouseDob ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.spouseDob && <p className="text-red-500 text-sm mt-1">{errors.spouseDob}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">PAN</label>
                        <input
                          type="text"
                          value={formData.spousePan}
                          onChange={(e) => updateField('spousePan', e.target.value.toUpperCase())}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder="ABCDE1234F"
                          maxLength="10"
                        />
                        <p className="text-xs text-black mt-1">Mandatory if spouse is nominee</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          value={formData.spouseMobile}
                          onChange={(e) => updateField('spouseMobile', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder="+91 98765 43210"
                        />
                        <p className="text-xs text-black mt-1">Mandatory if spouse is nominee</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Email ID</label>
                      <input
                        type="email"
                        value={formData.spouseEmail}
                        onChange={(e) => updateField('spouseEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="spouse@example.com"
                      />
                      <p className="text-xs text-black mt-1">Mandatory if spouse is nominee</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Address *</label>
                      <div className="space-y-2">
                        <label className="flex items-center text-black">
                          <input
                            type="radio"
                            value="same"
                            checked={formData.spouseAddressSame === 'same'}
                            onChange={(e) => updateField('spouseAddressSame', e.target.value)}
                            className="mr-2"
                          />
                          Same as Mine
                        </label>
                        <label className="flex items-center text-black">
                          <input
                            type="radio"
                            value="different"
                            checked={formData.spouseAddressSame === 'different'}
                            onChange={(e) => updateField('spouseAddressSame', e.target.value)}
                            className="mr-2"
                          />
                          Different Address
                        </label>
                      </div>
                      {errors.spouseAddressSame && <p className="text-red-500 text-sm mt-1">{errors.spouseAddressSame}</p>}
                    </div>

                    {formData.spouseAddressSame === 'different' && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">Address 1 *</label>
                          <input
                            type="text"
                            value={formData.spouseAddress1}
                            onChange={(e) => updateField('spouseAddress1', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                              errors.spouseAddress1 ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="House/Flat No., Building Name"
                          />
                          {errors.spouseAddress1 && <p className="text-red-500 text-sm mt-1">{errors.spouseAddress1}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">Address 2</label>
                          <input
                            type="text"
                            value={formData.spouseAddress2}
                            onChange={(e) => updateField('spouseAddress2', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            placeholder="Street, Area, Locality"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">Address 3</label>
                          <input
                            type="text"
                            value={formData.spouseAddress3}
                            onChange={(e) => updateField('spouseAddress3', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            placeholder="Landmark"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">City / Town *</label>
                            <input
                              type="text"
                              value={formData.spouseCity}
                              onChange={(e) => updateField('spouseCity', e.target.value)}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                                errors.spouseCity ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Mumbai"
                            />
                            {errors.spouseCity && <p className="text-red-500 text-sm mt-1">{errors.spouseCity}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-black mb-1">Country</label>
                            <input
                              type="text"
                              value={formData.spouseCountry}
                              onChange={(e) => updateField('spouseCountry', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                              placeholder="India"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-black mb-1">PIN / ZIP Code *</label>
                            <input
                              type="text"
                              value={formData.spousePinCode}
                              onChange={(e) => updateField('spousePinCode', e.target.value)}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                                errors.spousePinCode ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="400001"
                              maxLength="6"
                            />
                            {errors.spousePinCode && <p className="text-red-500 text-sm mt-1">{errors.spousePinCode}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(formData.maritalStatus === 'married' || formData.maritalStatus === 'others') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Place of Birth *</label>
                      <input
                        type="text"
                        value={formData.placeOfBirth}
                        onChange={(e) => updateField('placeOfBirth', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                          errors.placeOfBirth ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="City of birth"
                      />
                      {errors.placeOfBirth && <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Do you have children? *</label>
                      <div className="space-y-2">
                        <label className="flex items-center text-black">
                          <input
                            type="radio"
                            value="yes"
                            checked={formData.hasChildren === 'yes'}
                            onChange={(e) => updateField('hasChildren', e.target.value)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-black">
                          <input
                            type="radio"
                            value="no"
                            checked={formData.hasChildren === 'no'}
                            onChange={(e) => updateField('hasChildren', e.target.value)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                      {errors.hasChildren && <p className="text-red-500 text-sm mt-1">{errors.hasChildren}</p>}
                    </div>

                    {formData.hasChildren === 'yes' && (
                      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">How many children? *</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.numberOfChildren}
                            onChange={(e) => updateField('numberOfChildren', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                              errors.numberOfChildren ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Number of children"
                          />
                          {errors.numberOfChildren && <p className="text-red-500 text-sm mt-1">{errors.numberOfChildren}</p>}
                        </div>

                        {formData.children.map((child, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg space-y-3">
                            <h4 className="font-semibold text-black">Child {index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-black mb-1">Name *</label>
                                <input
                                  type="text"
                                  value={child.name || ''}
                                  onChange={(e) => updateChildField(index, 'name', e.target.value)}
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                                    errors[`child${index}Name`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="Child's name"
                                />
                                {errors[`child${index}Name`] && <p className="text-red-500 text-sm mt-1">{errors[`child${index}Name`]}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-black mb-1">Date of Birth *</label>
                                <input
                                  type="date"
                                  value={child.dob || ''}
                                  onChange={(e) => updateChildField(index, 'dob', e.target.value)}
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                                    errors[`child${index}Dob`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                                {errors[`child${index}Dob`] && <p className="text-red-500 text-sm mt-1">{errors[`child${index}Dob`]}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black mb-4">Investment Goals & Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Employment Status *</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => updateField('employmentStatus', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select status</option>
                    <option value="employed">Employed Full-time</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="part-time">Employed Part-time</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                  {errors.employmentStatus && <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Monthly Expenses *</label>
                  <select
                    value={formData.monthlyExpenses}
                    onChange={(e) => updateField('monthlyExpenses', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.monthlyExpenses ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select range</option>
                    <option value="0-25k">₹0 - ₹25,000</option>
                    <option value="25k-50k">₹25,000 - ₹50,000</option>
                    <option value="50k-1L">₹50,000 - ₹1 Lakh</option>
                    <option value="1L-2L">₹1 - ₹2 Lakhs</option>
                    <option value="2L+">₹2 Lakhs+</option>
                  </select>
                  {errors.monthlyExpenses && <p className="text-red-500 text-sm mt-1">{errors.monthlyExpenses}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Current Savings</label>
                  <select
                    value={formData.currentSavings}
                    onChange={(e) => updateField('currentSavings', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="">Select range</option>
                    <option value="0-1L">₹0 - ₹1 Lakh</option>
                    <option value="1L-5L">₹1 - ₹5 Lakhs</option>
                    <option value="5L-10L">₹5 - ₹10 Lakhs</option>
                    <option value="10L-50L">₹10 - ₹50 Lakhs</option>
                    <option value="50L+">₹50 Lakhs+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Do you have existing investments?</label>
                  <div className="space-y-2">
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.hasInvestments === 'yes'}
                        onChange={(e) => updateField('hasInvestments', e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center text-black">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.hasInvestments === 'no'}
                        onChange={(e) => updateField('hasInvestments', e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {formData.hasInvestments === 'yes' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Investment Types (select all that apply)</label>
                    <div className="space-y-2">
                      {['Stocks', 'Mutual Funds', 'Fixed Deposits', 'Real Estate', 'Gold', 'PPF/EPF', 'Cryptocurrency', 'Other'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.investmentTypes.includes(type)}
                            onChange={() => toggleArrayField('investmentTypes', type)}
                            className="mr-2"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Financial Goals * (select all that apply)</label>
                  <div className="space-y-2">
                    {[
                      'Retirement Planning',
                      'Wealth Accumulation',
                      'Tax Optimization',
                      'Education Funding',
                      'Emergency Fund',
                      'Debt Management',
                      'Estate Planning',
                      'Home Purchase'
                    ].map(goal => (
                      <label key={goal} className="flex items-center text-black">
                        <input
                          type="checkbox"
                          checked={formData.financialGoals.includes(goal)}
                          onChange={() => toggleArrayField('financialGoals', goal)}
                          className="mr-2"
                        />
                        {goal}
                      </label>
                    ))}
                  </div>
                  {errors.financialGoals && <p className="text-red-500 text-sm mt-1">{errors.financialGoals}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Risk Tolerance *</label>
                  <select
                    value={formData.riskTolerance}
                    onChange={(e) => updateField('riskTolerance', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.riskTolerance ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select risk tolerance</option>
                    <option value="conservative">Conservative - Prefer stability and minimal risk</option>
                    <option value="moderate">Moderate - Balanced approach to risk and return</option>
                    <option value="aggressive">Aggressive - Comfortable with high risk for higher returns</option>
                  </select>
                  {errors.riskTolerance && <p className="text-red-500 text-sm mt-1">{errors.riskTolerance}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Investment Time Horizon *</label>
                  <select
                    value={formData.timeHorizon}
                    onChange={(e) => updateField('timeHorizon', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.timeHorizon ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select time horizon</option>
                    <option value="short">Short-term (1-3 years)</option>
                    <option value="medium">Medium-term (3-7 years)</option>
                    <option value="long">Long-term (7+ years)</option>
                  </select>
                  {errors.timeHorizon && <p className="text-red-500 text-sm mt-1">{errors.timeHorizon}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Additional Notes or Comments</label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => updateField('additionalNotes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    rows="4"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-auto"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-auto"
                >
                  Submit
                  <CheckCircle className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-4 flex items-center">
          <Lock className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-black">
            Your information is encrypted and securely transmitted. We use industry-standard security measures to protect your data.
          </p>
        </div>
      </div>
    </div>
  );
}