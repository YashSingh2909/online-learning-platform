import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test results tracking
const testResults = {
  passed: [],
  failed: [],
  total: 0
};

async function testAPI(name, testFn) {
  testResults.total++;
  try {
    console.log(`\n🧪 Testing: ${name}`);
    const result = await testFn();
    console.log(`✅ PASSED: ${name}`);
    testResults.passed.push(name);
    return result;
  } catch (error) {
    console.log(`❌ FAILED: ${name}`);
    console.log(`   Error: ${error.message}`);
    testResults.failed.push({ name, error: error.message });
    return null;
  }
}

// Test credentials
const testUser = {
  email: 'john@example.com',
  password: 'password123'
};

let authToken = null;
let userId = '';
let courseId = '';

async function runTests() {
  console.log('🚀 Starting Comprehensive Feature Testing\n');
  console.log('=' .repeat(50));

  // Test 1: User Login
  const loginResult = await testAPI('User Login', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, testUser);
    console.log(`   Response structure:`, JSON.stringify(response.data, null, 2));
    if (response.data.success && response.data.user) {
      authToken = response.data.accessToken || response.data.token;
      userId = response.data.user.id || response.data.user._id;
      console.log(`   User ID: ${userId}`);
      console.log(`   Token: ${authToken ? authToken.substring(0, 20) + '...' : 'No token'}`);
      return response.data;
    }
    throw new Error('Login failed - invalid response structure');
  });

  const getAuthHeaders = () => {
    if (!authToken) {
      return { headers: { 'Content-Type': 'application/json' } };
    }
    return {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Test 2: Get All Courses
  const coursesResult = await testAPI('Get All Courses', async () => {
    const response = await axios.get(`${API_URL}/courses`);
    if (response.data.success && response.data.data.length > 0) {
      courseId = response.data.data[0]._id;
      console.log(`   Found ${response.data.data.length} courses`);
      console.log(`   Using course ID: ${courseId}`);
      return response.data;
    }
    throw new Error('No courses found');
  });

  // Test 3: Get Course by ID
  await testAPI('Get Course by ID', async () => {
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    if (response.data.success) {
      console.log(`   Course: ${response.data.data.title}`);
      return response.data;
    }
    throw new Error('Failed to get course');
  });

  // Test 4: Enroll in Course
  const enrollmentResult = await testAPI('Enroll in Course', async () => {
    const response = await axios.post(`${API_URL}/enrollments/enroll`, 
      { courseId }, getAuthHeaders());
    if (response.data.success) {
      console.log(`   Enrollment ID: ${response.data.data._id}`);
      return response.data;
    }
    throw new Error('Enrollment failed');
  });

  // Test 5: Get User Enrollments
  await testAPI('Get User Enrollments', async () => {
    const response = await axios.get(`${API_URL}/enrollments/my-enrollments`, getAuthHeaders());
    if (response.data.success) {
      console.log(`   Found ${response.data.data.length} enrollments`);
      return response.data;
    }
    throw new Error('Failed to get enrollments');
  });

  // Test 6: Live Classes - Get Live Classes
  await testAPI('Get Live Classes', async () => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/live-classes`, getAuthHeaders());
    console.log(`   Found ${response.data.data.length} live classes`);
    return response.data;
  });

  // Test 7: Chat - Get Course Messages
  await testAPI('Get Course Chat Messages', async () => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/chat`, getAuthHeaders());
    console.log(`   Found ${response.data.data.length} messages`);
    return response.data;
  });

  // Test 8: Discussion - Get Discussions
  await testAPI('Get Course Discussions', async () => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/discussions`, getAuthHeaders());
    console.log(`   Found ${response.data.data.length} discussions`);
    return response.data;
  });

  // Test 9: Discussion - Create Discussion
  const discussionResult = await testAPI('Create Discussion', async () => {
    const response = await axios.post(`${API_URL}/courses/${courseId}/discussions`, 
      { title: 'Test Discussion', content: 'This is a test discussion' }, getAuthHeaders());
    if (response.data.success) {
      console.log(`   Discussion ID: ${response.data.data._id}`);
      return response.data;
    }
    throw new Error('Failed to create discussion');
  });

  // Test 10: Quizzes - Get Course Quizzes
  await testAPI('Get Course Quizzes', async () => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/quizzes`, getAuthHeaders());
    console.log(`   Found ${response.data.data.length} quizzes`);
    return response.data;
  });

  // Test 11: Assignments - Get Course Assignments
  await testAPI('Get Course Assignments', async () => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/assignments`, getAuthHeaders());
    console.log(`   Found ${response.data.data.length} assignments`);
    return response.data;
  });

  // Test 12: Payment - Create Payment Order
  await testAPI('Create Payment Order', async () => {
    const response = await axios.post(`${API_URL}/payments/create-order`, 
      { courseId }, getAuthHeaders());
    console.log(`   Payment order created`);
    return response.data;
  });

  // Test 13: AI RAG - Chat with Course
  await testAPI('AI RAG Chat', async () => {
    const response = await axios.post(`${API_URL}/rag/chat`, 
      { courseId, message: 'What is this course about?' });
    if (response.data.success) {
      console.log(`   AI Response: ${response.data.reply.substring(0, 50)}...`);
      return response.data;
    }
    throw new Error('AI RAG failed');
  });

  // Test 14: Complete Lesson
  await testAPI('Complete Lesson', async () => {
    const response = await axios.put(`${API_URL}/enrollments/complete-lesson`, 
      { courseId, lessonId: 0 }, getAuthHeaders());
    if (response.data.success) {
      console.log(`   Lesson completed`);
      return response.data;
    }
    throw new Error('Failed to complete lesson');
  });

  // Test 15: Get User Profile
  await testAPI('Get User Profile', async () => {
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeaders());
    if (response.data.success) {
      console.log(`   User: ${response.data.data.name}`);
      return response.data;
    }
    throw new Error('Failed to get user profile');
  });

  // Test 16: Notifications
  await testAPI('Get Notifications', async () => {
    const response = await axios.get(`${API_URL}/notifications`, getAuthHeaders());
    console.log(`   Found ${response.data.data.length} notifications`);
    return response.data;
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log(`Success Rate: ${((testResults.passed.length / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.failed.forEach(failure => {
      console.log(`   - ${failure.name}: ${failure.error}`);
    });
  }

  console.log('\n✅ Testing Complete!');
}

runTests().catch(console.error);