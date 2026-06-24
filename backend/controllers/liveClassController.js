import LiveClass from '../models/LiveClass.js';
import Course from '../models/Course.js';

export const getLiveClasses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const classes = await LiveClass.find({ course: courseId }).populate('instructor', 'name email profileImage').sort({ startTime: 1 });
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLiveClass = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topic, startTime, duration, meetingLink } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Ensure user is instructor
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
       return res.status(403).json({ success: false, message: 'Not authorized to create live class for this course' });
    }

    const liveClass = await LiveClass.create({
      course: courseId,
      instructor: req.user.id,
      topic,
      startTime,
      duration,
      meetingLink
    });

    res.status(201).json({ success: true, data: liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLiveClassStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }
    
    if (liveClass.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    liveClass.status = status;
    await liveClass.save();
    
    res.status(200).json({ success: true, data: liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
