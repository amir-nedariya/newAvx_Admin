import { Outlet } from "react-router-dom"
import Sidebar from "../common/Sidebar"

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* <main className="flex-1 bg-gray-100 p-6"> */}
        <main className="flex-1 min-h-screen bg-[#0B0F1A]">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
