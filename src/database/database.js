import Dexie from "dexie";

const db = new Dexie("Parking_Booking");

// Define schema
db.version(1).stores({
    staff_details: "&usr,pwd",
    admin_details: "&usr,pwd",
    user_details: "&usr,email,pwd",
    slot_details: "&id,status",
    booking_details: '++id,usr,status,vno,slot,entry,exit,date',
    login: "++id,usr,role,entry,exit,status",
})

//booking_details:

// Generate initial parking slot data
function generateParkingSlots() {
    const parkingSlots = [];
    for (let letter = 'A'.charCodeAt(0); letter <= 'E'.charCodeAt(0); letter++) {
        for (let number = 1; number <= 7; number++) {
            const slotName = String.fromCharCode(letter) + number;
            parkingSlots.push({
                id: slotName,
                status: 'available'
            });
        }
    }
    return parkingSlots;
}

// Using Dexie populate hook
// This is used to prepopulate the tables on database creation
db.on('populate', function () {
    console.log('Database created, adding initial data...');
    const initialSlots = generateParkingSlots();
    const admindetails = { usr: "admin", pwd: "adminpass" }
    const staffdetails = [{ usr: "staff01", pwd: "pass123" },
    { usr: "staff02", pwd: "pass123" },
    { usr: "staff03", pwd: "pass123" },
    { usr: "staff04", pwd: "pass123" }]
    db.admin_details.add(admindetails);
    db.staff_details.bulkAdd(staffdetails);
    db.slot_details.bulkAdd(initialSlots).then(() => {
        console.log('Initial parking slots added successfully');
    });
});

export { db };