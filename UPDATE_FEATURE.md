# 📚 Hướng dẫn triển khai Learning Progress Tracking

## 🎯 Mục tiêu

Triển khai hệ thống theo dõi tiến độ học tập để làm cho trang web giống Udemy hơn, bao gồm:
- Theo dõi % hoàn thành từng course
- Theo dõi trạng thái từng video (đã xem/chưa xem)
- Thống kê cá nhân hóa: số course đã mua, số course đã hoàn thành, số giờ học

## 📋 Tổng quan kiến trúc

### 1. Backend API cần có

#### 1.1. Video Progress Tracking
- **Endpoint**: `POST /api/learning/video-progress`
  - Body: `{ course_id, video_id, watched_duration, total_duration, is_completed }`
  - Lưu tiến độ xem video của user

- **Endpoint**: `GET /api/learning/video-progress/:course_id`
  - Trả về danh sách video và trạng thái đã xem của user trong course đó

#### 1.2. Course Progress
- **Endpoint**: `GET /api/learning/course-progress`
  - Trả về danh sách course đã mua với % hoàn thành của mỗi course
  - Response: `[{ course_id, course_title, progress_percentage, last_watched_video_id, last_watched_at }]`

#### 1.3. Learning Statistics
- **Endpoint**: `GET /api/learning/statistics`
  - Trả về thống kê:
    - `total_courses_purchased`: Tổng số course đã mua
    - `total_courses_completed`: Tổng số course đã hoàn thành (100%)
    - `total_learning_hours`: Tổng số giờ đã học (tính từ tổng thời lượng video đã xem)
    - `courses_in_progress`: Số course đang học (0% < progress < 100%)
    - `recently_watched`: Danh sách course xem gần đây

## 🏗️ Frontend Implementation

### 2. Tạo Composable: `useLearningProgress.js`

**Location**: `src/composables/useLearningProgress.js`

**Chức năng**:
- `saveVideoProgress(courseId, videoId, watchedDuration, totalDuration, isCompleted)`: Lưu tiến độ xem video
- `getCourseProgress(courseId)`: Lấy tiến độ của một course
- `getAllCourseProgress()`: Lấy tiến độ tất cả courses
- `getLearningStatistics()`: Lấy thống kê học tập
- `markVideoAsWatched(courseId, videoId)`: Đánh dấu video đã xem hoàn toàn

**Lưu ý**:
- Sử dụng `useAPI` composable có sẵn
- Debounce khi save progress (mỗi 5-10 giây mới save 1 lần để tránh spam API)
- Cache progress trong localStorage để tối ưu performance

### 3. Tạo My Learning Dashboard Page

**Location**: `src/pages/my-learning/index.vue`

**Layout**:
- **Header Section**: 
  - Title: "My Learning"
  - Subtitle: "Tiếp tục học tập của bạn"
  
- **Statistics Cards** (Grid 4 cột):
  - Card 1: Tổng số course đã mua
  - Card 2: Số course đã hoàn thành
  - Card 3: Tổng số giờ đã học
  - Card 4: Số course đang học

- **Continue Learning Section**:
  - Hiển thị các course đang học (progress > 0% và < 100%)
  - Mỗi card hiển thị:
    - Course thumbnail
    - Course title
    - Progress bar với %
    - "Continue Learning" button
    - Last watched video info

- **Recently Viewed Section**:
  - Danh sách course đã xem gần đây (limit 6-8 courses)
  - Grid layout giống course cards

- **All My Courses Section**:
  - Tất cả courses đã mua với progress bar
  - Filter: All / In Progress / Completed
  - Sort: Recently Watched / Progress / Title

**Styling**: 
- Follow Udemy style (clean, simple)
- Use existing `ItemCourse` component nhưng thêm progress bar
- Colors: `#6d28d2` (accent), `#1c1d1f` (text), `#6a6f73` (secondary)

### 4. Update Video Player: `playCourse/[idCourse].vue`

**Các thay đổi cần thiết**:

#### 4.1. Track Video Progress
- Khi video đang phát, mỗi 5-10 giây gọi `saveVideoProgress()`
- Lưu `watched_duration` và `total_duration`
- Khi video kết thúc (hoặc user xem > 90%), đánh dấu `is_completed = true`

#### 4.2. Hiển thị Video Status
- Trong sidebar list videos:
  - Icon checkmark (✓) cho video đã xem hoàn toàn
  - Progress indicator cho video đang xem dở
  - Highlight video hiện tại đang phát

#### 4.3. Auto-resume
- Khi vào course, tự động load video cuối cùng đã xem (nếu có)
- Hoặc video đầu tiên chưa xem

**Implementation**:
- Sử dụng Vimeo Player API events (nếu có) hoặc iframe postMessage
- Hoặc track bằng cách: khi iframe load xong, set interval để check progress
- Lưu progress vào localStorage trước, sau đó sync lên server

### 5. Update Course Card Component

**File**: `src/components/course/ItemCourse.vue` hoặc tạo `ItemCourseWithProgress.vue`

**Thay đổi**:
- Thêm prop `progress` (0-100)
- Hiển thị progress bar phía dưới thumbnail (nếu progress > 0)
- Hiển thị badge "Completed" nếu progress = 100%
- Hiển thị "Continue Learning" text nếu 0% < progress < 100%

**Styling**:
- Progress bar: height 4px, color `#6d28d2`
- Badge: background `#10b981`, text white, rounded

### 6. Update Profile Page

**File**: `src/pages/profile/index.vue`

**Thay đổi**:
- Thêm menu item "My Learning" vào sidebar navigation
- Hoặc thêm link trong user dropdown menu ở TopNavbar

### 7. Update Router

**File**: `src/router/index.js`

**Thêm route**:
```javascript
{
  path: '/my-learning',
  name: 'my-learning',
  component: () => import('@/pages/my-learning/index.vue'),
  meta: {
    requiresAuth: true,
  }
}
```

### 8. Update TopNavbar

**File**: `src/components/dashboard/TopNavbar.vue`

**Thay đổi**:
- Thêm link "My Learning" vào user dropdown menu (sau "Profile", "History")

## 📊 Data Structure

### Video Progress (LocalStorage)
```javascript
{
  [courseId]: {
    [videoId]: {
      watched_duration: 120, // seconds
      total_duration: 600, // seconds
      is_completed: false,
      last_watched_at: "2024-01-15T10:30:00Z"
    }
  }
}
```

### Course Progress (API Response)
```javascript
{
  course_id: 123,
  course_title: "Fitness Basics",
  progress_percentage: 45,
  total_videos: 20,
  watched_videos: 9,
  last_watched_video_id: 456,
  last_watched_at: "2024-01-15T10:30:00Z",
  total_duration: 3600, // seconds
  watched_duration: 1620 // seconds
}
```

### Learning Statistics (API Response)
```javascript
{
  total_courses_purchased: 15,
  total_courses_completed: 3,
  total_learning_hours: 24.5,
  courses_in_progress: 8,
  recently_watched: [
    { course_id: 123, course_title: "...", last_watched_at: "..." },
    ...
  ]
}
```

## 🔄 Flow hoạt động

### Flow 1: User xem video
1. User vào `/playCourse/:idCourse`
2. Load course detail và video progress từ API
3. Auto-play video cuối cùng đã xem (hoặc video đầu tiên)
4. Khi video phát, mỗi 10 giây:
   - Lấy current time từ video player
   - Save vào localStorage
   - Debounce và sync lên server
5. Khi video kết thúc hoặc user xem > 90%:
   - Mark video as completed
   - Update course progress
   - Refresh UI

### Flow 2: User vào My Learning
1. Load learning statistics
2. Load all course progress
3. Hiển thị Continue Learning section (courses có progress > 0% và < 100%)
4. Hiển thị Recently Viewed
5. Hiển thị All My Courses với filter/sort

### Flow 3: User click "Continue Learning"
1. Navigate đến `/playCourse/:idCourse`
2. Auto-load và play video cuối cùng đã xem
3. Resume từ thời điểm đã xem (nếu API hỗ trợ)

## 🎨 UI/UX Guidelines

### Progress Bar Design
- Height: 4px
- Background: `#f3f4f5`
- Progress fill: `#6d28d2`
- Border radius: 2px
- Smooth animation khi update

### Status Icons
- Completed: Checkmark icon màu xanh `#10b981`
- In Progress: Circle với progress fill
- Not Started: Empty circle

### Statistics Cards
- Background: White
- Border: `1px solid #e0e0e0`
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Number: Large, bold, màu `#6d28d2`
- Label: Small, màu `#6a6f73`

## ⚡ Performance Optimization

1. **Debounce API calls**: Không save progress mỗi giây, mà mỗi 5-10 giây
2. **LocalStorage cache**: Cache progress trong localStorage, sync lên server sau
3. **Lazy loading**: Load course progress khi cần, không load tất cả cùng lúc
4. **Pagination**: Phân trang cho "All My Courses" nếu có nhiều courses

## 🧪 Testing Checklist

- [ ] Video progress được lưu đúng khi xem video
- [ ] Course progress được tính đúng (% hoàn thành)
- [ ] Statistics hiển thị đúng số liệu
- [ ] Continue Learning hiển thị đúng courses đang học
- [ ] Auto-resume video cuối cùng khi vào course
- [ ] Progress bar hiển thị đúng trên course cards
- [ ] Responsive trên mobile
- [ ] Performance tốt (không lag khi save progress)

## 📝 Notes

- Nếu backend chưa có API, có thể mock data trong frontend trước
- Có thể dùng localStorage để lưu progress tạm thời nếu backend chưa sẵn sàng
- Tính số giờ học: tổng `watched_duration` của tất cả videos đã xem, chia 3600
- Course hoàn thành: khi tất cả videos trong course đã `is_completed = true`