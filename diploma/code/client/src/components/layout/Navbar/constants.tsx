import React from "react";
import { Role } from "firestore/types/collections.types";
import { Route } from "components/routing/constants";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AlarmIcon from "@mui/icons-material/Alarm";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChatIcon from "@mui/icons-material/Chat";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import InsightsIcon from "@mui/icons-material/Insights";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

export type NavBarItem = {
  id: number;
  icon: React.ReactNode;
  label: string;
  route: Route;
  roles: Role[];
};

export const topNavbarItems: NavBarItem[] = [
  {
    id: 0,
    icon: <PersonIcon />,
    label: "Профиль",
    route: Route.profile,
    roles: [...Object.values(Role)],
  },
];

export const navbarItemsData: Omit<NavBarItem, "id">[] = [
  {
    icon: <SummarizeIcon />,
    label: "Дневник",
    route: Route.diary,
    roles: [Role.PATIENT],
  },
  {
    icon: <AlarmIcon />,
    label: "Цели",
    route: Route.goals,
    roles: [],
  },
  {
    icon: <TrendingUpIcon />,
    label: "Статистика",
    route: Route.statistics,
    roles: [Role.PATIENT],
  },
  {
    icon: <ChatIcon />,
    label: "Диалоги",
    route: Route.dialogs,
    roles: [Role.PATIENT, Role.DOCTOR],
  },
  {
    icon: <FamilyRestroomIcon />,
    label: "Родственник",
    route: Route.relative,
    roles: [Role.PATIENT, Role.RELATIVE],
  },
  {
    icon: <InsightsIcon />,
    label: "Статистика родственника-пациента",
    route: Route.relativeStatistics,
    roles: [Role.RELATIVE],
  },
  {
    icon: <QueryStatsIcon />,
    label: "Статистика пациентов",
    route: Route.patientsStatistics,
    roles: [Role.DOCTOR],
  },
  {
    icon: <WysiwygIcon />,
    label: "Тематические материалы",
    route: Route.thematicMaterials,
    roles: [
      Role.PATIENT,
      Role.RELATIVE,
      Role.DOCTOR,
      Role.CONTENT_MAKER,
      Role.MODERATOR,
    ],
  },
  {
    icon: <PeopleIcon />,
    label: "Работники",
    route: Route.employees,
    roles: [Role.ADMIN],
  },
];

export const bottomNavBarItems: NavBarItem[] = [
  {
    id: 0,
    icon: <LogoutIcon />,
    label: "Выход",
    route: Route.signOut,
    roles: [...Object.values(Role)],
  },
];

export const navBarItems: NavBarItem[] = [
  ...topNavbarItems,
  ...navbarItemsData,
  ...bottomNavBarItems,
].map((data, index) => ({
  ...data,
  id: index,
}));
