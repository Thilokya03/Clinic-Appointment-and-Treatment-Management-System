# Quick API Reference - New Features

## 🎯 Overview

Three new feature sets have been implemented:
1. **Insurance Claim Management** - Submit and manage insurance claims
2. **Patient Balance Search** - Search patients and see outstanding amounts
3. **Patient Balance Details** - View complete payment history for a patient

---

## 🔐 Authentication

All endpoints require authentication token in header:
```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

Token is stored in localStorage as `catms_token`.

---

## 📋 Insurance Claim APIs

### 1. Submit Insurance Claim

**Endpoint:** `POST /api/claim`

**Access:** Staff (Admin, Branch Manager, Nurse)

**Request Body:**
```json
{
  "claim_id": "CL001",
  "insurance_id": "IN001",
  "percentage": 30,
  "payment_id": "PM001"
}
```

**Response:**
```json
{
  "message": "Insurance claim added successfully",
  "claim_id": "CL001",
  "claim_amount": 1050.00,
  "percentage": 30
}
```

**What Happens:**
1. System calculates: claim_amount = (payment.total_amount × percentage) / 100
2. Inserts record into insurance_claim table
3. Updates payment.insurance_paid_amount += claim_amount
4. Invoice trigger fires → creates/updates invoice

**Example:**
```javascript
const token = localStorage.getItem('catms_token');

const submitClaim = async () => {
  const response = await axios.post('http://localhost:3000/api/claim', {
    claim_id: 'CL001',
    insurance_id: 'IN001',
    percentage: 30,
    payment_id: 'PM001'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  console.log(response.data);
  // { claim_amount: 1050.00, ... }
};
```

---

### 2. Get All Claims

**Endpoint:** `GET /api/claim/all`

**Access:** Staff (Admin, Branch Manager, Nurse, Doctor)

**Response:**
```json
[
  {
    "claim_id": "CL001",
    "insurance_id": "IN001",
    "company_name": "ABC Insurance",
    "percentage": 30,
    "payment_id": "PM001",
    "total_amount": "3500.00",
    "claim_amount": 1050.00,
    "patient_id": "P0001",
    "patient_name": "John Doe"
  }
]
```

**Example:**
```javascript
const getAllClaims = async () => {
  const response = await axios.get('http://localhost:3000/api/claim/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return response.data;
};
```

---

### 3. Get Claims by Payment

**Endpoint:** `GET /api/claim/payment/:payment_id`

**Access:** Staff

**Example:** `GET /api/claim/payment/PM001`

**Response:**
```json
[
  {
    "claim_id": "CL001",
    "insurance_id": "IN001",
    "company_name": "ABC Insurance",
    "percentage": 30,
    "claim_amount": 1050.00
  }
]
```

---

### 4. Update Claim

**Endpoint:** `PUT /api/claim/:claim_id`

**Access:** Staff (Admin, Branch Manager)

**Request Body:**
```json
{
  "percentage": 40
}
```

**Response:**
```json
{
  "message": "Claim updated successfully",
  "old_amount": 1050.00,
  "new_amount": 1400.00,
  "difference": 350.00
}
```

**What Happens:**
1. Calculates new claim amount
2. Updates insurance_claim.percentage
3. Adjusts payment.insurance_paid_amount by difference
4. Invoice trigger fires → updates invoice

---

### 5. Delete Claim

**Endpoint:** `DELETE /api/claim/:claim_id`

**Access:** Staff (Admin, Branch Manager)

**Response:**
```json
{
  "message": "Claim deleted successfully",
  "refunded_amount": 1050.00
}
```

**What Happens:**
1. Deletes claim record
2. Reduces payment.insurance_paid_amount by claim_amount
3. Invoice trigger may fire if amounts decrease

---

## 👥 Patient Balance APIs

### 1. Search Patients with Balance

**Endpoint:** `GET /api/patient/search`

**Access:** Authenticated (Staff or Patient)

**Query Parameters:**
- `search` (optional): Search term (patient ID, name, phone, NIC)

**Examples:**
- `GET /api/patient/search` - Get all patients with balance
- `GET /api/patient/search?search=John` - Search for "John"
- `GET /api/patient/search?search=P0001` - Search by patient ID
- `GET /api/patient/search?search=077` - Search by phone

**Response:**
```json
[
  {
    "patient_id": "P0001",
    "username": "john_doe",
    "name": "John Doe",
    "phone_no": "0771234567",
    "gender": "Male",
    "age": 35,
    "nic": "199012345678",
    "email": "john@example.com",
    "total_billed": "3500.00",
    "total_paid": "600.00",
    "total_outstanding": "2900.00"
  }
]
```

**Frontend Example:**
```javascript
const PatientSearch = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchPatients = async () => {
    const token = localStorage.getItem('catms_token');
    const response = await axios.get(
      `http://localhost:3000/api/patient/search?search=${searchTerm}`,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    setPatients(response.data);
  };
  
  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by ID, name, phone..."
      />
      <button onClick={searchPatients}>Search</button>
      
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Total Billed</th>
            <th>Total Paid</th>
            <th>Outstanding</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td>{p.name}</td>
              <td>{p.phone_no}</td>
              <td>LKR {p.total_billed}</td>
              <td>LKR {p.total_paid}</td>
              <td style={{color: p.total_outstanding > 0 ? 'red' : 'green'}}>
                LKR {p.total_outstanding}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

### 2. Get Patient Balance Details

**Endpoint:** `GET /api/patient/balance/:patient_id`

**Access:** Authenticated

**Example:** `GET /api/patient/balance/P0001`

**Response:**
```json
{
  "patient": {
    "patient_id": "P0001",
    "username": "john_doe",
    "name": "John Doe",
    "phone_no": "0771234567",
    "email": "john@example.com"
  },
  "payments": [
    {
      "payment_id": "PM001",
      "appointment_id": "A0729",
      "appointment_date": "2025-10-20",
      "total_amount": "3500.00",
      "insurance_paid_amount": "100.00",
      "patient_paid_amount": "500.00",
      "discount_amount": "200.00",
      "Due_payment": "2700.00",
      "status": "Partial",
      "invoice_id": "INV01",
      "invoice_amount": "600.00"
    }
  ],
  "summary": {
    "total_billed": "3500.00",
    "total_paid": "600.00",
    "total_outstanding": "2700.00",
    "number_of_payments": 1
  }
}
```

**Frontend Example:**
```javascript
const PatientBalanceDetails = ({ patientId }) => {
  const [balanceData, setBalanceData] = useState(null);
  
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get(
        `http://localhost:3000/api/patient/balance/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setBalanceData(response.data);
    };
    
    fetchBalance();
  }, [patientId]);
  
  if (!balanceData) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{balanceData.patient.name}</h2>
      <p>Phone: {balanceData.patient.phone_no}</p>
      
      <div className="summary">
        <h3>Summary</h3>
        <p>Total Billed: LKR {balanceData.summary.total_billed}</p>
        <p>Total Paid: LKR {balanceData.summary.total_paid}</p>
        <p>Outstanding: LKR {balanceData.summary.total_outstanding}</p>
      </div>
      
      <h3>Payment History</h3>
      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Insurance</th>
            <th>Patient</th>
            <th>Discount</th>
            <th>Due</th>
            <th>Status</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {balanceData.payments.map(pay => (
            <tr key={pay.payment_id}>
              <td>{pay.payment_id}</td>
              <td>{pay.appointment_date}</td>
              <td>{pay.total_amount}</td>
              <td>{pay.insurance_paid_amount}</td>
              <td>{pay.patient_paid_amount}</td>
              <td>{pay.discount_amount}</td>
              <td>{pay.Due_payment}</td>
              <td>{pay.status}</td>
              <td>{pay.invoice_id || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 🔄 Complete Workflow Example

### Scenario: Patient with Insurance

**1. Create Appointment**
```javascript
// Automatically creates payment via trigger
POST /api/appointment
{
  appointment_id: 'A0729',
  patient_id: 'P0001',
  appointment_fee: 1500
}
// Result: Payment PM001 created with total=1500
```

**2. Add Treatment**
```javascript
// Automatically adds to payment via trigger
POST /api/treatment
{
  treatment_id: 'T001',
  appointment_id: 'A0729',
  catalog_id: 'TC001' // Root Canal - LKR 2000
}
// Result: Payment PM001 updated to total=3500
```

**3. Submit Insurance Claim**
```javascript
// Insurance covers 30%
POST /api/claim
{
  claim_id: 'CL001',
  insurance_id: 'IN001',
  percentage: 30,
  payment_id: 'PM001'
}
// Result: 
// - Claim amount: 1050 (30% of 3500)
// - Payment insurance_paid: 1050
// - Invoice INV01 created: 1050
```

**4. Search Patient Balance**
```javascript
GET /api/patient/search?search=P0001

Response:
{
  patient_id: 'P0001',
  name: 'John Doe',
  total_billed: '3500.00',
  total_paid: '1050.00',      // From insurance
  total_outstanding: '2450.00' // Patient still owes
}
```

**5. Patient Pays with Discount**
```javascript
PUT /api/payment/PM001
{
  patient_paid_amount: 2250,
  discount_amount: 200
}
// Result:
// - Payment updated: patient_paid=2250, discount=200
// - Due: 3500 - 1050 - 2250 - 200 = 0
// - Status: Paid
// - Invoice updated: 3300 (1050 + 2250)
```

**6. Final Balance Check**
```javascript
GET /api/patient/balance/P0001

Response:
{
  summary: {
    total_billed: '3500.00',
    total_paid: '3300.00',    // 1050 insurance + 2250 patient
    total_outstanding: '0.00'  // Fully paid!
  }
}
```

---

## 🧪 Testing with curl

### Test Insurance Claim
```bash
curl -X POST http://localhost:3000/api/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "claim_id": "CL001",
    "insurance_id": "IN001",
    "percentage": 30,
    "payment_id": "PM001"
  }'
```

### Test Patient Search
```bash
curl -X GET "http://localhost:3000/api/patient/search?search=P0001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Patient Balance
```bash
curl -X GET http://localhost:3000/api/patient/balance/P0001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Status Codes

- **200** - Success (GET, PUT, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (missing fields)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

---

## 📝 Notes

1. **Claim Percentage:** Must be between 0 and 100
2. **Payment Updates:** Always trigger invoice creation if amounts increase
3. **Outstanding Balance:** Automatically calculated as: `total - insurance - patient - discount`
4. **Status Auto-Update:** 
   - Pending: No payment
   - Partial: Some payment
   - Paid: Fully paid (Due = 0)
   - Voided: Cancelled

---

**Created:** October 21, 2025
**Backend:** Running on http://localhost:3000
**Frontend:** Running on http://localhost:5173
