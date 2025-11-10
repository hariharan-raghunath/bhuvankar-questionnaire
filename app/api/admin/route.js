import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/encryption';

const prisma = new PrismaClient();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET(request) {
  try {
    // Check password
    const authHeader = request.headers.get('authorization');
    const password = authHeader?.replace('Bearer ', '');

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all submissions
    const submissions = await prisma.clientSubmission.findMany({
      orderBy: { submittedAt: 'desc' },
      take: 100 // Limit to last 100 submissions
    });

    // Decrypt sensitive fields
    const decryptedSubmissions = submissions.map(sub => ({
      id: sub.id,
      submittedAt: sub.submittedAt,
      version: sub.version,  
      lastUpdated: sub.updatedAt,
      firstSubmitted: sub.createdAt,

      // Decrypt personal details
      fullName: sub.fullName,
      dateOfBirth: sub.dateOfBirth,
      panNumber: decrypt(sub.panNumber, sub.panNumberIv, sub.panNumberAuthTag),
      nameAsPerPan: sub.nameAsPerPan,
      mobile: decrypt(sub.mobile, sub.mobileIv, sub.mobileAuthTag),
      email: decrypt(sub.email, sub.emailIv, sub.emailAuthTag),
      aadharNumber: decrypt(sub.aadharNumber, sub.aadharNumberIv, sub.aadharNumberAuthTag),

      // Address
      address1: sub.address1,
      address2: sub.address2,
      address3: sub.address3,
      city: sub.city,
      country: sub.country,
      pinCode: sub.pinCode,

      // Financial
      annualIncome: decrypt(sub.annualIncome, sub.annualIncomeIv, sub.annualIncomeAuthTag),
      isPoliticallyExposed: sub.isPoliticallyExposed,

      // Marital
      maritalStatus: sub.maritalStatus,
      spouseName: sub.spouseName,
      spouseDob: sub.spouseDob,
      spousePan: sub.spousePan,
      spouseMobile: sub.spouseMobile,
      spouseEmail: sub.spouseEmail,
      placeOfBirth: sub.placeOfBirth,

      // Children
      hasChildren: sub.hasChildren,
      numberOfChildren: sub.numberOfChildren,
      children: sub.childrenData,

      // Investment
      employmentStatus: sub.employmentStatus,
      monthlyExpenses: sub.monthlyExpenses,
      currentSavings: sub.currentSavings,
      hasInvestments: sub.hasInvestments,
      investmentTypes: sub.investmentTypes,
      financialGoals: sub.financialGoals,
      riskTolerance: sub.riskTolerance,
      timeHorizon: sub.timeHorizon,
      additionalNotes: sub.additionalNotes,

      // Metadata
      ipAddress: sub.ipAddress,
      userAgent: sub.userAgent
    }));

    return NextResponse.json({
      success: true,
      count: decryptedSubmissions.length,
      submissions: decryptedSubmissions
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}