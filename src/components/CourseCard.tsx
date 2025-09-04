import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import type { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onApply: (course: Course) => void;
}

export function CourseCard({ course, onApply }: CourseCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get format color
  const getFormatColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'online':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'offline':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hybrid':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Course Image */}
        <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-black/20"
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
            }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Course badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={getLevelColor(course.level)}>
              {t(`courses.levels.${course.level.toLowerCase()}` as `courses.levels.${string}`)}
            </Badge>
            <Badge className={getFormatColor(course.format)}>
              {t(`courses.formats.${course.format.toLowerCase()}` as `courses.formats.${string}`)}
            </Badge>
          </div>

          {/* Price badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-white text-gray-900 font-semibold">
              {formatPrice(course.price)}
            </Badge>
          </div>

          {/* Course icon */}
          <div className="absolute bottom-4 left-4">
            <motion.div
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {course.shortDescription}
          </p>

          {/* Course stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration || t('courses.card.duration.default')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.studentsCount || 0} {t('courses.card.students')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating || '5.0'}</span>
            </div>
          </div>

          {/* Apply button */}
          <motion.div
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onApply(course)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {t('courses.card.applyButton')}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
