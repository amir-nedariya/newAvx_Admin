import { Outlet } from 'react-router-dom'

const cls = (...a) => a.filter(Boolean).join(" ");

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-full">
      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Analytics