import Course from '../models/Course.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';

const normalizeLevel = (level) => {
  const value = String(level || 'Beginner').toLowerCase();
  if (value === 'intermediate') return 'Intermediate';
  if (value === 'advanced') return 'Advanced';
  return 'Beginner';
};

const publishFields = (body) => {
  if (body.status) {
    return { status: body.status, isPublished: body.status === 'published' };
  }
  if (body.isPublished !== undefined) {
    return { isPublished: !!body.isPublished, status: body.isPublished ? 'published' : 'draft' };
  }
  return { isPublished: true, status: 'published' };
};

const canOwnCourse = (course, user) => user?.role === 'admin' || course?.instructor?.toString() === user?.id;

const findOwnedCourse = async (courseId, user, res) => {
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404).json({ success: false, message: 'Course not found' });
    return null;
  }
  if (!canOwnCourse(course, user)) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return null;
  }
  return course;
};

export const getAllCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filters = [{ isPublished: true }];
    if (category) filters.push({ category });
    if (search) {
      filters.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const courses = await Course.find(filters.length > 1 ? { $and: filters } : filters[0])
      .sort({ createdAt: -1 })
      .populate('instructor', 'name email profileImage');

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { instructor: req.user.id };
    const courses = await Course.find(query).sort({ createdAt: -1 }).populate('instructor', 'name email profileImage');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email profileImage');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const isOwner = canOwnCourse(course, req.user);
    if (!isOwner && !course.isPublished) {
      return res.status(403).json({ success: false, message: 'Course is not published' });
    }

    if (!isOwner) {
      const data = course.toObject();
      data.lessons = (data.lessons || []).filter((lesson) => lesson.isFreePreview || lesson.isFree);
      return res.status(200).json({ success: true, data });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail, duration, lessons } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and category' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level: normalizeLevel(req.body.level),
      price: Number(price) || 0,
      thumbnail: thumbnail || 'https://placehold.co/600x360?text=Course',
      duration: duration || '0 hours',
      lessons: Array.isArray(lessons) ? lessons : [],
      instructor: req.user.id,
      ...publishFields(req.body),
    });

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { createdCourses: course._id } });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.id, req.user, res);
    if (!course) return;

    const allowed = ['title', 'description', 'category', 'price', 'thumbnail', 'duration'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) course[field] = req.body[field];
    });
    if (req.body.level !== undefined) course.level = normalizeLevel(req.body.level);
    Object.assign(course, publishFields(req.body));
    course.updatedAt = new Date();

    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.id, req.user, res);
    if (!course) return;

    await Promise.all([
      Course.findByIdAndDelete(course._id),
      Quiz.deleteMany({ course: course._id }),
      Assignment.deleteMany({ course: course._id }),
      User.findByIdAndUpdate(course.instructor, { $pull: { createdCourses: course._id } }),
    ]);

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const isOwner = canOwnCourse(course, req.user);
    if (!isOwner && !course.isPublished) return res.status(403).json({ success: false, message: 'Course is not published' });

    const lessons = [...(course.lessons || [])]
      .filter((lesson) => isOwner || lesson.isFreePreview || lesson.isFree)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const addLesson = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.id, req.user, res);
    if (!course) return;

    const lesson = {
      title: req.body.title,
      description: req.body.description || '',
      videoUrl: req.body.videoUrl || '',
      duration: req.body.duration || '',
      order: Number(req.body.order) || course.lessons.length + 1,
      module: req.body.module || 'Module 1',
      isFreePreview: !!(req.body.isFreePreview || req.body.isFree),
    };

    if (!lesson.title) return res.status(400).json({ success: false, message: 'Lesson title is required' });

    course.lessons.push(lesson);
    course.updatedAt = new Date();
    await course.save();
    res.status(201).json({ success: true, data: course.lessons[course.lessons.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.courseId, req.user, res);
    if (!course) return;

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    ['title', 'description', 'videoUrl', 'duration', 'module'].forEach((field) => {
      if (req.body[field] !== undefined) lesson[field] = req.body[field];
    });
    if (req.body.order !== undefined) lesson.order = Number(req.body.order);
    if (req.body.isFreePreview !== undefined || req.body.isFree !== undefined) {
      lesson.isFreePreview = !!(req.body.isFreePreview || req.body.isFree);
    }

    course.updatedAt = new Date();
    await course.save();
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.courseId, req.user, res);
    if (!course) return;

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    lesson.deleteOne();
    course.lessons.forEach((item, index) => {
      item.order = index + 1;
    });
    course.updatedAt = new Date();
    await course.save();
    res.status(200).json({ success: true, data: course.lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const reorderLessons = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.courseId, req.user, res);
    if (!course) return;

    const { orderedLessonIds } = req.body;
    if (!Array.isArray(orderedLessonIds)) {
      return res.status(400).json({ success: false, message: 'orderedLessonIds must be an array' });
    }

    orderedLessonIds.forEach((lessonId, index) => {
      const lesson = course.lessons.id(lessonId);
      if (lesson) lesson.order = index + 1;
    });
    course.updatedAt = new Date();
    await course.save();
    res.status(200).json({ success: true, data: course.lessons.sort((a, b) => (a.order || 0) - (b.order || 0)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const publishCourse = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.id, req.user, res);
    if (!course) return;
    course.isPublished = true;
    course.status = 'published';
    course.updatedAt = new Date();
    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const unpublishCourse = async (req, res) => {
  try {
    const course = await findOwnedCourse(req.params.id, req.user, res);
    if (!course) return;
    course.isPublished = false;
    course.status = 'draft';
    course.updatedAt = new Date();
    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.isFeatured = !course.isFeatured;
    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isFeatured: true, isPublished: true })
      .sort({ createdAt: -1 })
      .populate('instructor', 'name email profileImage');
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
