import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/client';
import type { Course } from '@/types/course';

interface UseCoursesOptions {
  level?: string;
  format?: string;
  searchQuery?: string;
}

interface UseCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCourses(options: UseCoursesOptions = {}): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.level) params.append('level', options.level);
      if (options.format) params.append('format', options.format);
      if (options.searchQuery) params.append('search', options.searchQuery);

      const response = await apiClient.get<Course[]>(`/?${params.toString()}`);
      setCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [options.level, options.format, options.searchQuery]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const refetch = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    refetch,
  };
}
