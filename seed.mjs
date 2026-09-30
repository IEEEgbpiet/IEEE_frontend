

const API_BASE = 'http://localhost:5000/api/v1';

async function seed() {
  try {
    console.log("Logging in...");
    // We will use native fetch if available
    const _fetch = typeof fetch !== 'undefined' ? fetch : (await import('node-fetch')).default;
    
    const loginRes = await _fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ieee@gbpiet.ac.in', password: 'AdminPassword123' })
    });
    
    if (!loginRes.ok) {
      console.log("Login failed. Make sure the backend server is running on port 5000.");
      return;
    }
    
    const { token } = await loginRes.json();
    console.log("Login successful! Seeding posts for all departments...");

    const departments = ["CSE", "AIML", "EE", "ECE", "BT"];

    for (const dept of departments) {
      const formData = new FormData();
      formData.append('title', `${dept} Inaugural Event`);
      formData.append('date', '2026-11-01');
      formData.append('time', '10:00 AM');
      formData.append('category', 'Technical Symposium');
      formData.append('venue', 'Main Auditorium');
      formData.append('organizedBy', `IEEE ${dept} Chapter`);
      formData.append('overview', `Welcome to the first official event for ${dept}.`);
      formData.append('description', `This is a sample generated post for the ${dept} department to verify API integration. Everything is wired up beautifully!`);
      formData.append('branch', dept);
      
      formData.append('keyDiscussion', JSON.stringify(["Introductions", "Future Plans"]));
      formData.append('studentsPresent', JSON.stringify([]));

      const createRes = await _fetch(`${API_BASE}/department/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });

      if (createRes.ok) {
        console.log(`✅ Successfully added sample post for ${dept}`);
      } else {
        console.log(`❌ Failed to add post for ${dept}:`, await createRes.text());
      }
    }
    
    console.log("\nAll done! You can now check the UI.");
    
  } catch (err) {
    console.error("Error during seeding:", err.message);
  }
}

seed();
