export const layoutStyles = `
/* Shared layout for both roles */
html, body {
  height: 100%;
  background: #ffffff;
}
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.dashboard-container, .asesor-container, .documents-container, .notifications-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: #ffffff;
}
.main-content {
  flex: 1;
  min-height: 100vh;
  margin-left: 280px; /* space for sidebar */
  display: flex;
  flex-direction: column;
  background: #ffffff;
  transition: margin-left 0.3s ease;
}
/* Sticky full-width header flush to top and spanning remaining width */
.main-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 110; /* above student sidebar (z 50) */
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}
.main-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
/* Optional inner width wrapper (use class inner if you want max width) */
.inner {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}
.content-section {
  padding: 24px 24px 40px;
  flex: 1;
  box-sizing: border-box;
}
@media (max-width: 1024px) {
  .main-content { margin-left: 260px; }
}
@media (max-width: 768px) {
  .main-content { margin-left: 0; }
  .main-header { padding: 10px 16px; }
}
`;