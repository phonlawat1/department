import axios from 'axios';

interface Hair {
  color: string;
}

interface Address {
  postalCode: string;
}

interface Company {
  department: string;
}

interface User {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair: Hair;
  address: Address;
  company: Company;
}

interface GroupedData {
  [department: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: { [color: string]: number };
    addressUser: { [key: string]: string };
  };
}

async function dataService(): Promise<GroupedData> {
  try {
    const response = await axios.get('https://dummyjson.com/users');
    const users: User[] = response.data.users;

    if (!users || users.length === 0) {
      console.error("ไม่พบข้อมูลผู้ใช้จาก API");
      return {};
    }

    const groupedData = users.reduce<GroupedData>((acc, user) => { 
      const department = user.company.department;
      if (!department) return acc;

      // หาก department ยังไม่มีข้อมูล ให้กำหนดค่าเริ่มต้น
      if (!acc[department]) {
        acc[department] = {
          male: 0,
          female: 0,
          ageRange: '',
          hair: {},
          addressUser: {}
        };
      }

      const group = acc[department];

      // เพิ่มจำนวน male/female ตาม gender
      user.gender === 'male' ? group.male++ : group.female++;

      // อัปเดตช่วงอายุ
      if (!group.ageRange) {
        group.ageRange = `${user.age}-${user.age}`;
      } else {
        const [min, max] = group.ageRange.split('-').map(Number);
        group.ageRange = `${Math.min(min, user.age)}-${Math.max(max, user.age)}`;
      }

      // อัปเดตจำนวน hair color
      const hairColor = user.hair.color;
      group.hair[hairColor] = (group.hair[hairColor] || 0) + 1;

      // จัดการ addressUser
      const userKey = `${user.firstName}${user.lastName}`;
      group.addressUser[userKey] = user.address.postalCode;

      return acc;
    }, {});

    /* console.log("ข้อมูลที่จัดกลุ่ม:", JSON.stringify(groupedData, null, 2)); */
    return groupedData;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดขณะดึงข้อมูลจาก API:", error);
    return {};
  }
}

export default dataService;
