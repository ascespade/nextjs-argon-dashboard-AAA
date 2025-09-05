import React from 'react';

export default function AdminProfilePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">Profile details and settings will appear here.</div>
        <div className="p-4 bg-white rounded shadow">Activity, recent logins, and preferences.</div>
      </div>
    </div>
  );
}
