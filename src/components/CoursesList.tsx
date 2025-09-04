import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { ApplyModal } from '@/components/ApplyModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { staticCourses } from '@/data/staticCourses';
import type { Course } from '@/types/course';

interface CoursesListProps {
  className?: string;
}

export function CoursesList({ className }: CoursesListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter static courses based on search and filters
  const filteredCourses = useMemo(() => {
    return staticCourses.filter(course => {
      const matchesSearch = !searchQuery || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      const matchesFormat = !selectedFormat || course.format === selectedFormat;
      
      return matchesSearch && matchesLevel && matchesFormat;
    });
  }, [searchQuery, selectedLevel, selectedFormat]);

  const handleApply = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('');
    setSelectedFormat('');
  };

  const hasActiveFilters = searchQuery || selectedLevel || selectedFormat;

  return (
    <div className={className}>
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('courses.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {t('courses.filters.label')}:
            </span>
          </div>

          {/* Level Filters */}
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <Badge
              key={level}
              className={`cursor-pointer transition-all ${
                selectedLevel === level
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedLevel(selectedLevel === level ? '' : level)}
            >
              {t(`courses.levels.${level}` as `courses.levels.${string}`)}
            </Badge>
          ))}

          {/* Format Filters */}
          {['online', 'offline', 'hybrid'].map((format) => (
            <Badge
              key={format}
              className={`cursor-pointer transition-all ${
                selectedFormat === format
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedFormat(selectedFormat === format ? '' : format)}
            >
              {t(`courses.formats.${format}` as `courses.formats.${string}`)}
            </Badge>
          ))}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              {t('courses.filters.clear')}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <p className="text-sm text-gray-600">
          {filteredCourses.length} {t('courses.results.found')}
        </p>
      </motion.div>

      {/* Courses Grid */}
      <AnimatePresence mode="wait">
        {filteredCourses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('courses.empty.title')}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? t('courses.empty.withFilters')
                : t('courses.empty.noCourses')
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                {t('courses.filters.clear')}
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="courses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CourseCard course={course} onApply={handleApply} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
}
