import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption function
function encrypt(text) {
  if (!text) return { encrypted: '', iv: '', authTag: '' };
  
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Encrypt sensitive fields
    const encryptedPan = encrypt(data.panNumber);
    const encryptedMobile = encrypt(data.mobile);
    const encryptedEmail = encrypt(data.email);
    const encryptedAadhar = encrypt(data.aadharNumber);
    const encryptedIncome = encrypt(data.annualIncome);
    
    // Save to database
    const submission = await prisma.clientSubmission.create({
      data: {
        // Personal Details
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        panNumber: encryptedPan.encrypted,
        panNumberIv: encryptedPan.iv,
        panNumberAuthTag: encryptedPan.authTag,
        nameAsPerPan: data.nameAsPerPan,
        mobile: encryptedMobile.encrypted,
        mobileIv: encryptedMobile.iv,
        mobileAuthTag: encryptedMobile.authTag,
        email: encryptedEmail.encrypted,
        emailIv: encryptedEmail.iv,
        emailAuthTag: encryptedEmail.authTag,
        address1: data.address1,
        address2: data.address2 || null,
        address3: data.address3 || null,
        city: data.city,
        country: data.country,
        pinCode: data.pinCode,
        aadharNumber: encryptedAadhar.encrypted,
        aadharNumberIv: encryptedAadhar.iv,
        aadharNumberAuthTag: encryptedAadhar.authTag,
        
        // Financial Details
        annualIncome: encryptedIncome.encrypted,
        annualIncomeIv: encryptedIncome.iv,
        annualIncomeAuthTag: encryptedIncome.authTag,
        isPoliticallyExposed: data.isPoliticallyExposed === 'yes',
        
        // Marital Status
        maritalStatus: data.maritalStatus,
        spouseName: data.spouseName || null,
        spouseDob: data.spouseDob ? new Date(data.spouseDob) : null,
        spousePan: data.spousePan || null,
        spouseMobile: data.spouseMobile || null,
        spouseEmail: data.spouseEmail || null,
        spouseAddressSame: data.spouseAddressSame || null,
        spouseAddress1: data.spouseAddress1 || null,
        spouseAddress2: data.spouseAddress2 || null,
        spouseAddress3: data.spouseAddress3 || null,
        spouseCity: data.spouseCity || null,
        spouseCountry: data.spouseCountry || null,
        spousePinCode: data.spousePinCode || null,
        placeOfBirth: data.placeOfBirth || null,
        
        // Children
        hasChildren: data.hasChildren === 'yes',
        numberOfChildren: data.numberOfChildren ? parseInt(data.numberOfChildren) : null,
        childrenData: data.children || null,
        
        // Investment Info
        employmentStatus: data.employmentStatus,
        monthlyExpenses: data.monthlyExpenses,
        currentSavings: data.currentSavings || null,
        hasInvestments: data.hasInvestments === 'yes',
        investmentTypes: data.investmentTypes || [],
        financialGoals: data.financialGoals || [],
        riskTolerance: data.riskTolerance,
        timeHorizon: data.timeHorizon,
        additionalNotes: data.additionalNotes || null,
        
        // Metadata
        submittedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      submissionId: submission.id 
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit form',
        details: error.message 
      },
      { status: 500 }
    );
  }
}