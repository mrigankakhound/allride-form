const RentalAgreement = require('../models/RentalAgreement');
const ExcelJS = require('exceljs');

// ─── Helper: extract Cloudinary URL from multer file object ──────────────────
const getFileUrl = (files, fieldName) => {
  if (files && files[fieldName] && files[fieldName][0]) {
    return files[fieldName][0].path; // Cloudinary URL
  }
  return '';
};

// ─── Helper: validate required text fields ────────────────────────────────────
const validateBody = (body) => {
  const required = [
    'firstName', 'lastName', 'contactNumber', 'homeAddress', 'localAddress',
    'city', 'state', 'zipCode', 'country',
    'licenseNumber', 'licenseExpiry',
    'rentalPurpose', 'vehicleType', 'registrationNumber', 'vehicleModel', 'rentalDuration', 'destination',
    'idProofNumber', 'documentType',
  ];

  const missing = required.filter((field) => !body[field] || String(body[field]).trim() === '');
  return missing;
};

// ─── POST /api/rental-agreements ─────────────────────────────────────────────
const createAgreement = async (req, res) => {
  try {
    // Validate required text fields
    const missing = validateBody(req.body);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    // Validate vehicle type enum
    const validVehicleTypes = ['MCWOG', 'MCWG', 'LMV'];
    if (!validVehicleTypes.includes(req.body.vehicleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicleType. Must be one of: MCWOG, MCWG, LMV',
      });
    }

    // Validate rental duration
    // req.body.rentalDuration is always a string from FormData (e.g. "7")
    // Use Number() first — more reliable than parseInt for plain numeric strings
    const rawDuration = req.body.rentalDuration;
    const duration = Number.isFinite(Number(rawDuration))
      ? Math.trunc(Number(rawDuration))
      : parseInt(rawDuration, 10);

    console.log(`[rentalDuration] received="${rawDuration}" parsed=${duration}`);

    if (isNaN(duration) || duration < 1 || duration > 365) {
      return res.status(400).json({
        success: false,
        message: 'rentalDuration must be a number between 1 and 365.',
      });
    }

    // Extract Cloudinary URLs from uploaded files
    const customerPhotoUrl       = getFileUrl(req.files, 'customerPhoto');
    const drivingLicensePhotoUrl = getFileUrl(req.files, 'drivingLicensePhoto');
    const idProofPhotoUrl        = getFileUrl(req.files, 'idProofPhoto');
    const signatureUrl           = getFileUrl(req.files, 'signatureImage');

    // Build the agreement document
    const agreement = new RentalAgreement({
      // Personal
      firstName:    req.body.firstName.trim(),
      lastName:     req.body.lastName.trim(),
      contactNumber: req.body.contactNumber.trim(),
      homeAddress:  req.body.homeAddress.trim(),
      localAddress: req.body.localAddress.trim(),
      city:         req.body.city.trim(),
      state:        req.body.state.trim(),
      zipCode:      req.body.zipCode.trim(),
      country:      req.body.country.trim(),

      // Driver
      licenseNumber: req.body.licenseNumber.trim().toUpperCase(),
      licenseExpiry: req.body.licenseExpiry.trim(),

      // Rental
      rentalPurpose:      req.body.rentalPurpose.trim(),
      vehicleType:        req.body.vehicleType.trim(),
      registrationNumber: req.body.registrationNumber.trim().toUpperCase(),
      vehicleModel:       req.body.vehicleModel.trim(),
      rentalDuration:     duration,
      destination:        req.body.destination.trim(),

      // Identity
      idProofNumber: req.body.idProofNumber.trim().toUpperCase(),
      documentType:  req.body.documentType.trim(),

      // Agreement
      agreedToTerms: req.body.agreedToTerms === 'true' || req.body.agreedToTerms === true,

      // Cloudinary URLs
      customerPhotoUrl,
      drivingLicensePhotoUrl,
      idProofPhotoUrl,
      signatureUrl,

      submittedAt: new Date(),
    });

    const saved = await agreement.save();

    return res.status(201).json({
      success: true,
      message: 'Rental agreement submitted successfully.',
      data: saved,
    });
  } catch (error) {
    console.error('❌ createAgreement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message,
    });
  }
};

// ─── GET /api/rental-agreements ──────────────────────────────────────────────
const getAgreements = async (req, res) => {
  try {
    const agreements = await RentalAgreement.find()
      .sort({ submittedAt: -1 })
      .select(
        'firstName lastName vehicleType registrationNumber rentalDuration submittedAt'
      );

    return res.status(200).json({
      success: true,
      count: agreements.length,
      data: agreements,
    });
  } catch (error) {
    console.error('❌ getAgreements error:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// ─── GET /api/rental-agreements/:id ──────────────────────────────────────────
const getAgreementById = async (req, res) => {
  try {
    const { id } = req.params;

    // Basic ObjectId validation
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid agreement ID.' });
    }

    const agreement = await RentalAgreement.findById(id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found.' });
    }

    return res.status(200).json({ success: true, data: agreement });
  } catch (error) {
    console.error('❌ getAgreementById error:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// ─── GET /api/rental-agreements/export/excel ─────────────────────────────────
const exportAgreementsExcel = async (req, res) => {
  try {
    // Retrieve ALL records — no select() limit, no pagination
    const agreements = await RentalAgreement.find().sort({ submittedAt: -1 });

    // Build workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ALL RIDE Rentals Admin';
    const sheet = workbook.addWorksheet('Rental Records');

    // Define the 6 required columns
    sheet.columns = [
      { header: 'Name',             key: 'name',            width: 28 },
      { header: 'Phone Number',     key: 'phoneNumber',     width: 18 },
      { header: 'Address',          key: 'address',         width: 40 },
      { header: 'Vehicle Type',     key: 'vehicleType',     width: 18 },
      { header: 'Rental Duration',  key: 'rentalDuration',  width: 20 },
      { header: 'Purpose',          key: 'purpose',         width: 30 },
    ];

    // Style the header row — bold, accent background
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A5F' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    // Map each record to a data row
    agreements.forEach((a) => {
      // Combine address parts — use whatever is available, gracefully skip blanks
      const addressParts = [
        a.homeAddress,
        a.localAddress,
        a.city,
        a.state,
        a.zipCode,
        a.country,
      ].filter(Boolean);
      const fullAddress = addressParts.join(', ');

      // Rental duration formatted as "N day(s)"
      const duration =
        a.rentalDuration != null
          ? `${a.rentalDuration} day${a.rentalDuration !== 1 ? 's' : ''}`
          : '';

      sheet.addRow({
        name:           [a.firstName, a.lastName].filter(Boolean).join(' ') || '',
        phoneNumber:    a.contactNumber || '',
        address:        fullAddress,
        vehicleType:    a.vehicleType   || '',
        rentalDuration: duration,
        purpose:        a.rentalPurpose || '',
      });
    });

    // Alternate row shading for readability
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowNumber % 2 === 0 ? 'FFF0F4FA' : 'FFFFFFFF' },
      };
      row.alignment = { vertical: 'middle' };
    });

    // Send the file as a downloadable response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ALL_RIDE_Rental_Records.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('❌ exportAgreementsExcel error:', error);
    // Only send error JSON if headers have not been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate Excel export.',
        error: error.message,
      });
    }
  }
};

module.exports = { createAgreement, getAgreements, getAgreementById, exportAgreementsExcel };
