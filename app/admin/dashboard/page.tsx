import React from 'react';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Widget A</div>
        <div className="p-4 bg-white rounded shadow">Widget B</div>
        <div className="p-4 bg-white rounded shadow">Widget C</div>
      </div>
    </div>
  );
}
