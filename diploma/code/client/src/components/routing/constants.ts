export enum Routes {
  any = "*",
  default = "/",
  notFound = "/not-found",
  home = "/home",
  auth = "/auth",
  signIn = "/auth/sign-in",
  signUp = "/auth/sign-up",
  signOut = "/auth/sign-out",
  profile = "/profile",
  diary = "/patient/diary",
  goals = "/patient/goals",
  statistics = "/statistics",
  dialogs = "/dialogs",
  thematicMaterials = "/thematic-materials",
  patientsStatistics = "/doctor/patients-statistics",
  employees = "/admin/employees",
  relative = "/relative",
}

export const RoutesTitles: {
  [key in Routes]: string;
} = {
  [Routes.any]: "",
  [Routes.default]: "",
  [Routes.notFound]: "Не найдено",
  [Routes.home]: "Главная",
  [Routes.auth]: "Авторизация",
  [Routes.signIn]: "Вход",
  [Routes.signUp]: "Регистрация",
  [Routes.signOut]: "Выход",
  [Routes.profile]: "Профиль",
  [Routes.diary]: "Дневник",
  [Routes.goals]: "Цели",
  [Routes.statistics]: "Статистика",
  [Routes.dialogs]: "Диалоги",
  [Routes.thematicMaterials]: "Тематические материалы",
  [Routes.patientsStatistics]: "Статистика пациентов",
  [Routes.employees]: "Работники",
  [Routes.relative]: "Родственник",
};
