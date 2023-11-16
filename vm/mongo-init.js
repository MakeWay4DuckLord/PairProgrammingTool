db.createUser(
    {
        user: "kuttalAdmin",
        pwd: "seniorDesign0012023",
        roles: [
            {
                role: "userAdminAnyDatabase", 
                db: "admin" 
            }
        ]
    }
);