# TODO

## Frontend LMS workflow (next phase)
- [ ] Add instructor dashboard routes/pages in `frontend/src/App.jsx`
  - [ ] Course Publish/Unpublish UI (Draft/Published) -> `/api/courses/:id/publish`
  - [ ] Lessons Manager UI -> `/api/courses/:id/lessons`
  - [ ] Quizzes Manager UI -> `/api/quizzes`
  - [ ] Assignments Manager UI -> `/api/assignments`
- [ ] Implement instructor pages/components:
  - [ ] InstructorCourseModules page layout
  - [ ] InstructorLessonsManager page
  - [ ] InstructorQuizzesManager page
  - [ ] InstructorAssignmentsManager page
- [ ] Student experience:
  - [ ] Locked content UX (handle 403 from backend on course/quiz/assignment fetch)
  - [ ] Free preview rendering
  - [ ] Enrollment prompt buttons
- [ ] API integration + error/loading states in all new pages
- [ ] Validation for lesson/quiz/assignment create forms

## Backend access control already completed
- [x] Thumbnail upload -> upload URL usage in `CreateCourse`
- [x] Course/Quiz/Assignment publish/free-preview enforcement on backend

