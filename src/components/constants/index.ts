
export const SINDH_DISTRICTS = [
  { id: "karachi", name: "Karachi" },
  { id: "hyderabad", name: "Hyderabad" },
  { id: "sukkur", name: "Sukkur" },
  { id: "mirpurkhas", name: "Mirpurkhas" },
  { id: "larkana", name: "Larkana" },
  { id: "shaheed-benazirabad", name: "Shaheed Benazirabad" },
  { id: "tharparkar", name: "Tharparkar" },
  { id: "badin", name: "Badin" },
  { id: "thatta", name: "Thatta" },
  { id: "jacobabad", name: "Jacobabad" },
  { id: "khairpur", name: "Khairpur" },
  { id: "dadu", name: "Dadu" },
  { id: "jamshoro", name: "Jamshoro" },
];


export const COMPLAINT_STATUS = {
  INITIAL_COMPLAINT: "initial_complaint",
  PENDING: "pending",
  ASSIGNED: "assigned",
  FORWARDED: "forwarded",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  SCHEDULED: "scheduled",
  STERILIZED: "sterilized",
  REJECTED: "rejected"
};

export const USER_ROLES = {
  CITIZEN: "citizen",
  ADMIN: "admin",
  DIVISIONAL_HEAD: "divisional_head",
  DIRECTOR: "director",
  SUPER_ADMIN: "super_admin",
};



export const validAdminRoles = Object.values(USER_ROLES).filter(
  role => role !== USER_ROLES.CITIZEN && role !== USER_ROLES.SUPER_ADMIN
);
export const validDivisions = SINDH_DISTRICTS.map(division => division.id);
