const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 STARTING RESOLUTION STEP 3 EVENTS CMS VERIFICATION SUITE\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate as Super Admin
    console.log('1. Authenticating Super Admin (curator_admin)...');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.ok && adminLoginData.token, 'Super Admin login successful and JWT received');
    const adminToken = adminLoginData.token;

    // 2. Authenticate as Content Editor
    console.log('\n2. Authenticating Content Editor (editor_resolution)...');
    const editorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
    });
    const editorLoginData = await editorLoginRes.json();
    assert(editorLoginRes.ok && editorLoginData.token, 'Content Editor login successful and JWT received');
    const editorToken = editorLoginData.token;

    // 3. Unauthorized access check (401)
    console.log('\n3. Testing 401 Unauthorized protection on /api/admin/events...');
    const unauthRes = await fetch(`${BASE_URL}/api/admin/events`);
    assert(unauthRes.status === 401, 'Unauthenticated request to /api/admin/events returns 401');

    // 4. List Events as Admin
    console.log('\n4. Listing Events via Admin API...');
    const listRes = await fetch(`${BASE_URL}/api/admin/events`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const listData = await listRes.json();
    assert(listRes.ok && listData.success && Array.isArray(listData.data), 'Admin Events List returned structured payload');
    assert(listData.metrics && listData.metrics.all >= 0, 'Admin Events metrics summary calculated');

    // 5. Test Image Uploads (Cover and Gallery)
    console.log('\n5. Testing Image Upload Engine (Single & Gallery)...');
    
    // Test Single Upload with Blob/FormData
    const formSingle = new FormData();
    const fakeBlob = new Blob(['fake image data bytes for test'], { type: 'image/png' });
    formSingle.append('file', fakeBlob, 'test_poster.png');
    
    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formSingle
    });
    const uploadData = await uploadRes.json();
    assert(uploadRes.ok && uploadData.url, `Single upload successful: ${uploadData.url}`);
    const coverUrl = uploadData.url;

    // Test Gallery Upload
    const formGallery = new FormData();
    const fakeJpeg1 = new Blob(['fake jpeg 1 bytes'], { type: 'image/jpeg' });
    const fakeJpeg2 = new Blob(['fake jpeg 2 bytes'], { type: 'image/jpeg' });
    formGallery.append('images', fakeJpeg1, 'gallery1.jpg');
    formGallery.append('images', fakeJpeg2, 'gallery2.jpg');

    const uploadGalleryRes = await fetch(`${BASE_URL}/api/upload-gallery`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formGallery
    });
    const uploadGalleryData = await uploadGalleryRes.json();
    assert(uploadGalleryRes.ok && Array.isArray(uploadGalleryData.files) && uploadGalleryData.files.length === 2, 'Gallery multi-upload returned array of uploaded files');

    // 6. Create a New Event
    console.log('\n6. Creating a new Event with limited capacity (Capacity = 2)...');
    const newEventPayload = {
      title: 'Experimental 16mm Reversal Color Lab',
      category: 'workshops',
      shortDescription: 'Hands-on chemical cross-processing and optical printing masterclass.',
      description: 'An intensive masterclass in 16mm reversal film stocks, split-toning chemistries, and custom mechanical projector modifications.',
      date: '2026-11-20',
      time: '14:00 IST',
      endTime: '19:00 IST',
      location: 'Basement Darkroom // Bay 03',
      dateDisplay: 'NOVEMBER 20, 2026',
      totalCapacity: 2, // intentionally low to test capacity locking
      flagship: true,
      status: 'active',
      coverImage: coverUrl,
      gallery: uploadGalleryData.files.map((f, i) => ({ url: f.url, caption: `Process step ${i + 1}`, order: i })),
      seatsRemainingBadge: 'SEATS OPEN // LIMITED ACCESS'
    };

    const createRes = await fetch(`${BASE_URL}/api/admin/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify(newEventPayload)
    });
    const createData = await createRes.json();
    assert(createRes.ok && createData.success && createData.data._id, `Event created with ID: ${createData.data._id}`);
    const createdEventId = createData.data._id;

    // 7. Verify Public Event Visibility & Sync
    console.log('\n7. Verifying Event presence on public /api/events...');
    const publicEventsRes = await fetch(`${BASE_URL}/api/events`);
    const publicEventsData = await publicEventsRes.json();
    const foundPublic = publicEventsData.data.find(e => (e._id === createdEventId || e.id === createdEventId));
    assert(Boolean(foundPublic), 'Newly created event is dynamically rendered in public /api/events');
    assert(foundPublic && foundPublic.seatsRemaining === 2, `Public seatsRemaining initialized to 2 (got ${foundPublic?.seatsRemaining})`);

    // 8. Public Event Detail Endpoint
    console.log('\n8. Testing Public GET /api/events/:id detail endpoint...');
    const detailRes = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
    const detailData = await detailRes.json();
    assert(detailRes.ok && detailData.data && detailData.data.title === newEventPayload.title, 'Public detail endpoint returned accurate event specifications');

    // 9. RSVP & Real-time Atomic Capacity Validation
    console.log('\n9. Testing RSVP System & Atomic Capacity Enforcement...');
    // Seat 1
    const rsvp1Res = await fetch(`${BASE_URL}/api/events/${createdEventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Devika Menon', email: 'devika@resolution.edu' })
    });
    const rsvp1Data = await rsvp1Res.json();
    assert(rsvp1Res.ok && rsvp1Data.success && rsvp1Data.data.passId, `Seat 1 claimed with Pass ID: ${rsvp1Data.data?.passId}`);

    // Seat 2 (Should reach capacity)
    const rsvp2Res = await fetch(`${BASE_URL}/api/events/${createdEventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Arjun Varman', email: 'arjun@resolution.edu' })
    });
    const rsvp2Data = await rsvp2Res.json();
    assert(rsvp2Res.ok && rsvp2Data.success, 'Seat 2 claimed successfully (Capacity reached)');

    // Seat 3 (Should be rejected with 400 Bad Request)
    const rsvp3Res = await fetch(`${BASE_URL}/api/events/${createdEventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Overbook Attempt', email: 'overbook@resolution.edu' })
    });
    const rsvp3Data = await rsvp3Res.json();
    assert(rsvp3Res.status === 400 && !rsvp3Data.success, `Overbook rejected with 400: "${rsvp3Data.message}"`);

    // Verify public seatsRemaining is now 0
    const publicCheckRes = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
    const publicCheckData = await publicCheckRes.json();
    assert(publicCheckData.data.seatsRemaining === 0 && publicCheckData.data.isSoldOut, 'Event state accurately marked as Sold Out (0 seats remaining)');

    // 10. Update / Edit Event via Admin API
    console.log('\n10. Testing PUT /api/admin/events/:id (Expanding capacity to 5)...');
    const updateRes = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        ...newEventPayload,
        title: 'Experimental 16mm Reversal Color Lab (Extended Session)',
        totalCapacity: 5
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.ok && updateData.success && updateData.data.totalCapacity === 5, 'Event capacity updated to 5');

    // Verify seats remaining is now 3
    const publicCheck2Res = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
    const publicCheck2Data = await publicCheck2Res.json();
    assert(publicCheck2Data.data.seatsRemaining === 3 && !publicCheck2Data.data.isSoldOut, `Seats remaining updated to 3 after expansion (got ${publicCheck2Data.data.seatsRemaining})`);

    // 11. Archive Event
    console.log('\n11. Testing PATCH /api/admin/events/:id/archive...');
    const archiveRes = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}/archive`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ isArchived: true })
    });
    const archiveData = await archiveRes.json();
    assert(archiveRes.ok && archiveData.data.isArchived === true, 'Event marked as archived in admin');

    // Verify archived event is hidden from public /api/events
    const publicArchivedRes = await fetch(`${BASE_URL}/api/events`);
    const publicArchivedData = await publicArchivedRes.json();
    const foundArchived = publicArchivedData.data.find(e => (e._id === createdEventId || e.id === createdEventId));
    assert(!foundArchived, 'Archived event is completely omitted from public /api/events');

    // 12. Role Permissions: Editor cannot delete (403), Super Admin can delete (200)
    console.log('\n12. Testing Role-Based Delete Permissions...');
    
    // Editor Delete Attempt
    const editorDeleteRes = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${editorToken}` }
    });
    assert(editorDeleteRes.status === 403, 'Content Editor is forbidden (403) from deleting events');

    // Super Admin Delete
    const adminDeleteRes = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminDeleteData = await adminDeleteRes.json();
    assert(adminDeleteRes.ok && adminDeleteData.success, 'Super Admin successfully deleted event (200)');

    // Verify Event is gone from admin
    const verifyDeleteRes = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(verifyDeleteRes.status === 404, 'Deleted event is no longer found (404)');

    // 13. Search, Filter, & Sorting Tests
    console.log('\n13. Testing Search, Category Filter, and Sorting query params on /api/admin/events...');
    const searchRes = await fetch(`${BASE_URL}/api/admin/events?q=Darkroom&category=workshops&sort=date_asc`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const searchData = await searchRes.json();
    assert(searchRes.ok && searchData.success, 'Search/filter query executed cleanly without error');

    console.log(`\n======================================================`);
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`======================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error('Unhandled error during test run:', err);
    process.exit(1);
  }
}

runTests();
