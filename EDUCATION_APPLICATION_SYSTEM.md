# Education Application System - Ta'lim Ariza Tizimi

## Umumiy ma'lumot
Education sahifasiga professional ariza berish tizimi qo'shildi. Bu tizim 3 ta asosiy kursdan birini tanlab, REAL BACKEND API ga ariza yuborish imkonini beradi.

## 🎯 Qo'shilgan funksiyalar

### 1. **3 ta Statik Kurs Tanlovi**
- **Organic Фермерчилик** - `organic-farming-basics` slug (Бошланғич, 3 oy, 2,500,000 so'm)
- **Бизнес бошқаруви** - `organic-business-management` slug (Ўрта, 2 oy, 3,000,000 so'm)  
- **Мутахассис даражаси** - `advanced-organic-technologies` slug (Юқори, 4 oy, 4,500,000 so'm)

### 2. **Real Backend API Integration**
- **Base URL**: `https://api.organicgreen.uz/api/course/`
- **Endpoint**: `POST /applications/`
- **API Documentation Format**: API dokumentatsiyasiga to'liq mos

### 3. **API Request Format (Backend Format)**
```json
{
  "course": "organic-farming-basics",
  "full_name": "John Doe", 
  "phone": "+998901234567",
  "email": "john@example.com",
  "city": "Tashkent",
  "referral_source": "website",
  "message": "Additional message"
}
```

### 4. **3 Bosqichli Modal**
1. **Kurs tanlash** - 3 ta statik kursdan birini tanlash
2. **Ariza to'ldirish** - Backend API format bo'yicha ma'lumot kiritish
3. **Muvaffaqiyat** - Real API response dan kelgan tasdiq

## 📁 Yaratilgan/Yangilangan fayllar

### **API Files**
- `/src/api/education.ts` - Real backend API integration
- `/src/api/client.ts` - Base URL: `https://api.organicgreen.uz/api/course/`

### **Components**
- `/src/components/EducationApplicationModal.tsx` - Real API bilan ishlash

### **Pages**
- `/src/app/education/page.tsx` - Modal tugmalari qo'shildi

## 🚀 Real API Xususiyatlari

### **Backend Endpoint**
```
POST https://api.organicgreen.uz/api/course/applications/
```

### **Request Body (API Documentation Format)**
```typescript
interface EducationApplicationRequest {
  course: string; // course slug (backend kutadi)
  full_name: string; // 2-100 characters
  phone: string; // E.164 format (+998xxxxxxxxx)
  email?: string; // optional, valid email
  city: string; // 2-50 characters  
  referral_source?: 'website' | 'instagram' | 'telegram' | 'friend' | 'other' | 'social_media';
  message?: string; // max 1000 characters
}
```

### **Response (Backend Format)**
```typescript
interface EducationApplicationResponse {
  id: string;
  course: string;
  full_name: string;
  phone: string;
  email?: string;
  city: string;
  created_at: string;
}
```

### **Validation Rules (Backend)**
- **Duplicate Prevention**: Same phone number cannot apply for same course within 14 days
- **Seat Availability**: Cannot apply if course is full
- **Phone Format**: Must be E.164 format
- **Course Slug**: Must match existing course slugs

## 💡 **Static Kurslar va API**

### **Kurslar ro'yxati**
Backend API dan olinmaydi - statik ma'lumotlar ishlatiladi:

```typescript
const courses = [
  {
    slug: 'organic-farming-basics',
    title: 'Organic Фермерчилик',
    level: 'Бошланғич'
  },
  {
    slug: 'organic-business-management', 
    title: 'Бизнес бошқаруви',
    level: 'Ўрта'
  },
  {
    slug: 'advanced-organic-technologies',
    title: 'Мутахассис даражаси', 
    level: 'Юқори'
  }
];
```

### **Faqat ariza yuborish**
- Kurslar ro'yxati: **Statik** 📋
- Ariza yuborish: **Real Backend API** 🌐

## 📱 Foydalanish

### **User Journey:**
1. Education sahifasiga boring
2. "Рўйхатдан ўтиш" yoki "Консультация олиш" tugmasini bosing
3. 3 ta statik kursdan birini tanlang
4. Backend API format bo'yicha ma'lumot kiriting
5. "Ариза юбориш" - real backend API ga yuboriladi
6. Backend response asosida success/error ko'rsatiladi

### **Developer Usage:**
```typescript
// Real backend API call
const response = await educationAPI.submitApplication({
  course: 'organic-farming-basics', // slug kerak
  full_name: 'John Doe',
  phone: '+998901234567',
  city: 'Tashkent',
  referral_source: 'website'
});
```

## ✅ **Yakuniy holatи**

### **COMPLETED ✅**
1. **✅ 3 ta statik kurs tanlovi**
2. **✅ Real backend API integration**  
3. **✅ API dokumentatsiyasiga to'liq mos format**
4. **✅ Form validation (E.164 phone, email, etc.)**
5. **✅ Error handling va success states**
6. **✅ Professional UX/UI dizayn**
7. **✅ Backend endpoint: `POST /applications/`**
8. **✅ Course slugs: API format bo'yicha**

### **API Status: PRODUCTION READY �**
- Base URL: `https://api.organicgreen.uz/api/course/`
- Endpoint: `POST /applications/`
- Request format: API documentation format
- Response handling: Real backend response
- Error handling: Backend error format

Sizning education sahifangiz endi **REAL BACKEND API** bilan ishlaydi!

**Kurslar**: Statik (frontend) 📋  
**Arizalar**: Real API (backend) 🌐
