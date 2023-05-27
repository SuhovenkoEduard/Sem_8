import { Role } from "../types/collections.types";

export const USERS_AUTH_DATA = [
  {
    firstName: "Алексей",
    lastName: "Сайко",
    email: "sukhovenkoedik+patient_alex@gmail.com",
    uid: "4SjKsrZJdMdMOXHB3vzrlx7Y0Dj1",
    role: Role.PATIENT,
    imageUrl:
      "https://kmap.arizona.edu/_next/image?url=%2Fapi%2Fphotos%2Fdrusso01&w=640&q=75",
  },
  {
    firstName: "Игорь",
    lastName: "Пивоварчик",
    email: "sukhovenkoedik+patient_igor@gmail.com",
    uid: "jsvFTA0FUvYi7rBzIpKboW9iOap1",
    role: Role.PATIENT,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTJ4yVPmnM4ys647XeFovhvyQmjgRMfpWmtA&usqp=CAU",
  },
  {
    firstName: "Валентина",
    lastName: "Измайлова",
    email: "sukhovenkoedik+patient_valentina@gmail.com",
    uid: "gteQhTSOkaQm52QeW8t968jnfxs2",
    role: Role.PATIENT,
    imageUrl:
      "https://images.hindustantimes.com/rf/image_size_640x362/HT/p2/2015/12/28/Pictures/_41d88026-ad19-11e5-9032-83a4d7c37095.jpg",
  },
  {
    firstName: "Гордей",
    lastName: "Лавров",
    email: "sukhovenkoedik+patient_gordei@gmail.com",
    uid: "5Y7WdOYCeTXmGrTMRaq3CQkRHqS2",
    role: Role.PATIENT,
    imageUrl: "https://sm.imgix.net/12/47/mike-magee-la-galaxy.jpg",
  },
  {
    firstName: "Алла",
    lastName: "Воронина",
    email: "sukhovenkoedik+patient_alla@gmail.com",
    uid: "YZWRSpLxChM6vZIJvQAlUteaJgj2",
    role: Role.PATIENT,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv0mctRpWfD-fTFDULOA9_WpMHhnaXfthNCQ&usqp=CAU",
  },
  {
    firstName: "Рита",
    lastName: "Туркова",
    email: "sukhovenkoedik+relative@gmail.com",
    uid: "1Nsuwpw16ONs5wBbCZz9N3dlOBh1",
    role: Role.RELATIVE,
    imageUrl:
      "https://www.humnutrition.com/blog/wp-content/uploads/2018/05/4-Essential-Nutrients-for-Glowing-Skin-Wellnest-Feature-640x480.webp",
  },
  {
    firstName: "Ксения",
    lastName: "Пидлипная",
    email: "sukhovenkoedik+doctor_ksenia@gmail.com",
    uid: "V9crQpaitTfkOmjrgjRarB2kMhc2",
    role: Role.DOCTOR,
    imageUrl:
      "https://media.istockphoto.com/id/1330046035/photo/headshot-portrait-of-smiling-female-doctor-in-hospital.jpg?s=612x612&w=0&k=20&c=fsNQPbmFIxoKA-PXl3G745zj7Cvr_cFIGsYknSbz_Tg=",
  },
  {
    firstName: "Михаил",
    lastName: "Кириллов",
    email: "sukhovenkoedik+doctor_michail@gmail.com",
    uid: "DytsPV83oKhZvmu3E9G4Iu3J7S53",
    role: Role.DOCTOR,
    imageUrl:
      "https://lakeforestgroup.com/wp-content/uploads/2014/11/doctor-profile-02.jpg",
  },
  {
    firstName: "Мирослав",
    lastName: "Лебедев",
    email: "sukhovenkoedik+doctor_miroslav@gmail.com",
    uid: "AaZtVCAFedbxLRsShieEG3qnpLs2",
    role: Role.DOCTOR,
    imageUrl:
      "https://yt3.googleusercontent.com/ytc/AGIKgqPmK1ByzeeLa49q6DJoTKm0_2kTHVXaIpaV25FSYw=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    firstName: "Федор",
    lastName: "Авдеев",
    email: "sukhovenkoedik+doctor_fedor@gmail.com",
    uid: "WMpsaVSOGLQFO5PEjToPm9FzbbJ3",
    role: Role.DOCTOR,
    imageUrl:
      "https://slavic.illinois.edu/sites/default/files/styles/directory_profile/public/profile-photos/eavrutin.jpg?itok=kygB9cys",
  },
  {
    firstName: "Александр",
    lastName: "Крючков",
    email: "sukhovenkoedik+doctor_admin@gmail.com",
    uid: "Ph0RnmF77cduOdfNg16CVYYDjVc2",
    role: Role.ADMIN,
    imageUrl:
      "https://www.wilsoncenter.org/sites/default/files/styles/large/public/media/images/person/james-person-1.jpg",
  },
];

export type UsersAuthData = typeof USERS_AUTH_DATA;
