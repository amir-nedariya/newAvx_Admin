import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Heart,
    Eye,
    X,
} from "lucide-react";

const DUMMY_USER = {
    id: "USR-10231",
    name: "Arjun Mehta",
};

const DUMMY_SAVED_VEHICLES = [
    {
        id: "VEH-1001",
        name: "Hyundai Creta 2023",
        price: "₹14.5L",
        location: "Ahmedabad",
        savedDate: "12 Apr 2026",
        consultant: "Rajesh Motors",
        image: "🚗",
    },
    {
        id: "VEH-1002",
        name: "Tata Nexon EV",
        price: "₹16.2L",
        location: "Surat",
        savedDate: "10 Apr 2026",
        consultant: "City Cars",
        image: "🚙",
    },
    {
        id: "VEH-1003",
        name: "Maruti Swift 2022",
        price: "₹7.8L",
        location: "Vadodara",
        savedDate: "08 Apr 2026",
        consultant: "Auto Hub",
        image: "🚗",
    },
    {
        id: "VEH-1004",
        name: "Honda City 2023",
        price: "₹12.5L",
        location: "Ahmedabad",
        savedDate: "05 Apr 2026",
        consultant: "Premium Motors",
        image: "🚘",
    },
    {
        id: "VEH-1005",
        name: "Mahindra XUV700",
        price: "₹18.9L",
        location: "Rajkot",
        savedDate: "03 Apr 2026",
        consultant: "Elite Cars",
        image: "🚙",
    },
];

const BuyerSavedVehicles = () => {
    const navigate = useNavigate();
    const user = DUMMY_USER;

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin/buyers/profile")}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Saved Vehicles</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    {user.name} • {user.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Saved Vehicles Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {DUMMY_SAVED_VEHICLES.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-5 p-6">
                                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center text-5xl shrink-0">
                                        {vehicle.image}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-[13px] font-mono font-semibold text-slate-500">
                                                    {vehicle.id}
                                                </div>
                                                <div className="mt-1 text-[17px] font-bold text-slate-900">
                                                    {vehicle.name}
                                                </div>
                                                <div className="mt-1 text-[14px] text-slate-600">
                                                    {vehicle.consultant}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[20px] font-bold text-emerald-700">
                                                    {vehicle.price}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-4 text-[13px] text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    {vehicle.location}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Heart size={14} className="fill-rose-500 text-rose-500" />
                                                    Saved {vehicle.savedDate}
                                                </span>
                                            </div>

                                            <button className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-[12px] font-semibold text-sky-700 hover:bg-sky-100 transition-colors">
                                                <Eye size={14} />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerSavedVehicles;
