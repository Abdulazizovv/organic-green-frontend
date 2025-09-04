import apiClient from '@/api/client';

interface EducationApplicationRequest {
  course_name: string; // course name (kurs nomi)
  full_name: string;
  phone_number: string; // backend phone_number kutadi
  email?: string;
  city: string;
  message?: string;
}

interface EducationApplicationResponse {
  id: string;
  course_name: string;
  full_name: string;
  phone_number: string;
  email?: string;
  city: string;
  message?: string;
  created_at: string;
}

export const educationAPI = {
  // Submit education course application to real backend
  submitApplication: async (data: EducationApplicationRequest): Promise<EducationApplicationResponse> => {
    try {
      console.log('🚀 Education API Request Started');
      console.log('🌐 Base URL:', 'https://api.organicgreen.uz/api/course/');
      console.log('📍 Endpoint:', '/applications/');
      console.log('🔗 Full URL:', 'https://api.organicgreen.uz/api/course/applications/');
      console.log('📤 Method:', 'POST');
      console.log('📦 Request Data:', JSON.stringify(data, null, 2));
      console.log('📊 Data Size:', JSON.stringify(data).length, 'bytes');
      console.log('⏰ Timestamp:', new Date().toISOString());

      const response = await apiClient.post<EducationApplicationResponse>('/applications/', data);
      
      console.log('✅ Education API Success Response:');
      console.log('📈 Status:', response.status);
      console.log('📋 Status Text:', response.statusText);
      console.log('📄 Response Headers:', response.headers);
      console.log('💾 Response Data:', JSON.stringify(response.data, null, 2));
      console.log('⏰ Response Time:', new Date().toISOString());

      return response.data;
    } catch (error: unknown) {
      console.error('❌ Education API Error Details:');
      console.error('🔥 Full Error Object:', error);
      
      // Axios error ma'lumotlarini olish
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown } }).response;
        console.error('📊 Error Response Status:', response?.status);
        console.error('📝 Error Response Status Text:', response?.statusText);
        console.error('📑 Error Response Headers:', response?.headers);
        console.error('📄 Error Response Data (Raw):', response?.data);
        console.error('📄 Error Response Data (JSON):', JSON.stringify(response?.data, null, 2));
        
        // Request ma'lumotlarini ham ko'rsatish
        if ('config' in error) {
          const config = (error as { config?: { url?: string; method?: string; data?: unknown } }).config;
          console.error('📤 Failed Request URL:', config?.url);
          console.error('📤 Failed Request Method:', config?.method);
          console.error('📤 Failed Request Data:', JSON.stringify(config?.data, null, 2));
        }
      } else {
        console.error('🚫 Non-Axios Error:', error);
      }
      
      throw error;
    }
  }
};

export type { EducationApplicationRequest, EducationApplicationResponse };
