# Document Upload API Endpoints

This document describes the API endpoints for document upload and processing in the Le Loi application system.

## Upload and Process Document

Uploads a document file and extracts data from it.

### Request

```
POST /api/v1/registration/document-upload
```

**Headers:**
- `Content-Type: multipart/form-data`

**Form Data Parameters:**
- `file`: The document file to upload (Required)
- `type`: The type of document being uploaded (Required)
- `applicationId`: The ID of the application this document belongs to (Required)

### Response

```json
{
  "success": true,
  "data": {
    "document": {
      "id": 123,
      "type": "identity",
      "filename": "example.pdf",
      "url": "https://example.com/path/to/file.pdf",
      "uploadedAt": "2025-04-25T10:30:00Z"
    },
    "extractedData": {
      "id": 456,
      "fields": {
        // Document-specific extracted data
      },
      "isVerified": false
    }
  }
}
```

## Get Application Documents

Retrieves all documents associated with a specific application.

### Request

```
GET /api/v1/registration/application/{applicationId}/documents
```

**URL Parameters:**
- `applicationId`: The ID of the application to get documents for (Required)

### Response

```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": 123,
        "type": "identity",
        "filename": "example.pdf",
        "url": "https://example.com/path/to/file.pdf",
        "uploadedAt": "2025-04-25T10:30:00Z"
      },
      // Other documents
    ]
  }
}
```

## Get Extracted Data

Retrieves the extracted data for a specific document.

### Request

```
GET /api/v1/registration/document-upload/{documentId}/extracted-data
```

**URL Parameters:**
- `documentId`: The ID of the document to get extracted data for (Required)

### Response

```json
{
  "success": true,
  "data": {
    "extractedData": {
      "id": 456,
      "fields": {
        // Document-specific extracted data
      },
      "isVerified": false
    }
  }
}
```

## Verify Extracted Data

Updates the verification status for extracted data.

### Request

```
PATCH /api/v1/registration/document-upload/extracted-data/{extractedDataId}
```

**URL Parameters:**
- `extractedDataId`: The ID of the extracted data to update (Required)

**Request Body:**
```json
{
  "isVerified": true
}
```

### Response

```json
{
  "success": true,
  "data": {
    "extractedData": {
      "id": 456,
      "fields": {
        // Document-specific extracted data
      },
      "isVerified": true
    }
  }
}
```

## Client Implementation Examples

### Uploading a Birth Certificate

```typescript
const uploadBirthCertificate = async (applicationId: number, file: File) => {
  try {
    const response = await uploadAndProcessDocument(applicationId, file, 'birth-certificate');
    
    if (response.extractedData) {
      // Use the extracted data to pre-fill forms
      console.log('Extracted data:', response.extractedData);
    }
    
    return response.document;
  } catch (error) {
    console.error('Error uploading birth certificate:', error);
    throw error;
  }
};
```

### Uploading Academic Certificates

```typescript
const uploadAcademicCertificate = async (applicationId: number, file: File) => {
  try {
    const response = await uploadAndProcessDocument(applicationId, file, 'academic-certificate');
    
    if (response.extractedData) {
      // Process academic achievements
      const { grades, achievements, schoolName, issueDate } = response.extractedData.fields;
      console.log('Academic data extracted:', grades, achievements);
      
      // Update the application with academic information
      // ...additional processing logic
    }
    
    return response.document;
  } catch (error) {
    console.error('Error uploading academic certificate:', error);
    throw error;
  }
};
```

## Document Types

The API supports various document types including but not limited to:

- `identity` - Identity cards or passports
- `birth-certificate` - Birth certificates
- `residence-proof` - Proof of residence documents
- `academic-certificate` - Academic certificates and awards
- `academic-transcript` - Grade reports and academic transcripts
- `competition-certificate` - Certificates from academic competitions
- `medical-record` - Medical records or certificates

### Academic Certificate Specifics

Academic certificates in the Le Loi application system refer to official documents that verify a student's academic achievements, qualifications, or completion of educational programs. These may include:

1. **Primary school completion certificates**
2. **Academic achievement awards**
3. **Competition certificates** (Math, Science, Literature, etc.)
4. **Special talent recognition documents**
5. **Language proficiency certificates**

When uploading academic certificates, the system will extract relevant data such as:

- Grade information
- Issuing institution
- Date of issuance
- Achievement level or score
- Subject area and competency level

This extracted data is used to validate student qualifications and may contribute to the application evaluation process for admission to Le Loi school.

Each academic certificate type may have specific extracted data fields relevant to that certificate type.