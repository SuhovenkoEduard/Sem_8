export enum Route {
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
  relativeStatistics = "/statistics/relative",
  dialogs = "/dialogs",
  thematicMaterials = "/thematic-materials",
  thematicMaterial = "/thematic-materials/:id",
  patientsStatistics = "/doctor/patients-statistics",
  employees = "/admin/employees",
  relative = "/relative",
  doctor = "/doctor",
  reviews = "/reviews",
  healthStates = "/health-states",
  notifications = "/notifications",
  recommendations = "/recommendations",
}

export const RouteTitles: {
  [key in Route]: string;
} = {
  [Route.any]: "",
  [Route.default]: "",
  [Route.notFound]: "Не найдено",
  [Route.home]: "Главная",
  [Route.auth]: "Авторизация",
  [Route.signIn]: "Вход",
  [Route.signUp]: "Регистрация",
  [Route.signOut]: "Выход",
  [Route.profile]: "Профиль",
  [Route.diary]: "Дневник",
  [Route.goals]: "Цели",
  [Route.statistics]: "Статистика",
  [Route.relativeStatistics]: "Статистика родственника",
  [Route.dialogs]: "Диалоги",
  [Route.thematicMaterials]: "Тематические материалы",
  [Route.thematicMaterial]: "Тематический материал",
  [Route.patientsStatistics]: "Статистика пациентов",
  [Route.employees]: "Работники",
  [Route.relative]: "Родственник",
  [Route.doctor]: "Доктор",
  [Route.reviews]: "Отзывы",
  [Route.healthStates]: "Готовые рекомендации",
  [Route.notifications]: "Уведомления",
  [Route.recommendations]: "Рекомендации",
};
